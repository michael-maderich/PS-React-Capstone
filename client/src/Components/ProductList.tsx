import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
//import PropTypes from "prop-types";
import './bootstrap.min.css'
import './main.css'
import './ProductList.css';
import productsService from '../services/products';
import { PRODUCT_TYPE, USER_TYPE, AUTH_OBJECT } from '../type-defs/typeDefs';
import ErrorNotification from './ErrorNotification';

function ProductList({ category, setCategory, productList, setProductList, cartItems, setCartItems, handleProductListFormChange, handleProductListAddToCart, handleProductListFormSubmit, errorMessage, setErrorMessage } ) {
	/*https://stackoverflow.com/questions/35604617/react-router-with-optional-path-parameter#35604855
	Working syntax htmlFor multiple optional params:
	<Route path="/section/(page)?/:page?/(sort)?/:sort?" component={Section} />
	Now, url can be:
	/section
	/section/page/1
	/section/page/1/sort/asc
	[me:]Pretty sure /section/page will work too, though, which would not be wanted...*/
	const { mainCategory } = useParams<{ mainCategory: string }>();
	const { subCategory } = useParams<{ subCategory: string }>();

	// Update page Title based on current category and subcategory
	useEffect(() => {
		document.title = `The Little Store - ${mainCategory}${subCategory ? ' - '.concat(subCategory) : ''} Category`;
		setCategory({ main: mainCategory, sub: subCategory });
	}, [mainCategory, subCategory, setCategory]);

	// Get Products in viewed Category and Subcategory from DB
	useEffect(() => {
		productsService
			.getAll()					// .getCategoryList()
			.then(response => {
				const { data } = response;
				console.log(data);
				const filteredProductList:PRODUCT_TYPE[] = data.filter( (product) => {
					return (product.categoryMain === mainCategory) && (!subCategory || (product.categorySpecific === subCategory));
				});
//				console.log('filtered products:', filteredProductList);
				filteredProductList.sort( (a,b) => 
					a.categorySpecific.localeCompare(b.categorySpecific) ||
					a.name.localeCompare(b.name) ||
					a.options.localeCompare(b.options) ||
					a.size.localeCompare(b.size)
				);
				setProductList(filteredProductList);
			})
			.catch(error => {
				alert(JSON.stringify(error.message));
				setErrorMessage(
					`Error retrieving data from database: ${error.message}`
				);
				setTimeout(() => setErrorMessage(null), 5000);
			});
	}, [mainCategory, subCategory, setProductList, setErrorMessage]);

	return (
		<div id="center-content">
			<div id="product-panel">
				<h2>{mainCategory}</h2>
				{subCategory? <h4>{subCategory}</h4> : ''}
				{errorMessage && <ErrorNotification errorMessage={errorMessage}/>}
				<table id="product-table">
					<thead>
						<tr>
							<th></th>
							<th>Item</th>
							<th>Scent/Style</th>
							<th>Size</th>
							<th>Price</th>
							<th>Quantity<br />Available</th>
							<th>Qty<br />to Add</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
					{productList.map( (item:PRODUCT_TYPE) => { console.log(item); return (
					// <form onSubmit={handleProductListAddToCart}>
						<tr className={item.stockQty===0 ? 'inactive' : ''} key={item.upc}>
							<td className="product_image_panel"><a href={item.image} target="_blank" rel="noreferrer"><img src={item.image} alt={item.description} title={item.description} /></a></td>
							<td>{item.name}</td>
							<td>{item.options}</td>
							<td>{item.size}</td>
							<td>${(Math.round(item.currentPrice*100)/100).toFixed(2)}</td>
							<td>{item.stockQty}</td>
							<td className="customerQty">
								{/* <input type="hidden" id={`upc${item.upc}`} name="upc" value={item.upc} />*/
								<label htmlFor="itemQty">
									<input
										type='number'
										id={`itemQty${item.upc}`}
										name={item.upc.toString()}
										min='0'
										max={item.stockQty}
										step='1'
										value={cartItems[item.upc] || 0}
										disabled={item.stockQty === 0}
										onChange={handleProductListFormChange}
									/>
								</label>}
							</td>
							<td className="button_panel">
								<button
									id={item.upc.toString()}
									type='submit'
									className='btn btn-sm btn-primary btn-block'
									disabled={item.stockQty === 0}
									onClick={handleProductListAddToCart}
								>
									{item.stockQty === 0 ? 'Out of Stock' : 'Add to Cart'}
								</button>
							</td>
							{/* <span>
								{ addedUpc === item.upc ? '<span style="color:blue;">'
								.concat(addedItemQty).concat(' ').concat(item.name).concat(' ').concat(item.options)
								.concat(' ').concat(item.size).concat(' added to cart</span> ') : ''}
							</span> */}
						</tr>
					// </form>
					);})}
					</tbody>
					<tfoot>
					</tfoot>
				</table>
			</div>
		</div>
	);
}

// ProductList.propTypes = {
// 	items: PropTypes.array.isRequired
// };

export default ProductList;