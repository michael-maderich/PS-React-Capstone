import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
//import PropTypes from "prop-types";
import './ProductList.css';
import productsService from '../services/products';
import { PRODUCT_TYPE, USER_TYPE, AUTH_OBJECT } from '../type-defs/typeDefs';
import ErrorNotification from './ErrorNotification';

function ProductList({ category, setCategory, setErrorMessage, handleProductListFormChange, handleProductListFormSubmit } ) {
	/*https://stackoverflow.com/questions/35604617/react-router-with-optional-path-parameter#35604855
	Working syntax for multiple optional params:
	<Route path="/section/(page)?/:page?/(sort)?/:sort?" component={Section} />
	Now, url can be:
	/section
	/section/page/1
	/section/page/1/sort/asc
	[me:]Pretty sure /section/page will work too, though, which would not be wanted...*/
	const { mainCategory } = useParams<{ mainCategory: string }>();
	const { subCategory } = useParams<{ subCategory: string }>();

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
			})
			.catch(error => {
				alert(JSON.stringify(error.message));
				setErrorMessage(
					`Error retrieving data from database: ${error.message}`
				);
				setTimeout(() => setErrorMessage(null), 5000);
			});
	}, []);

	return (
		<div id="center-content">
			<div id="product-panel">
				<h2>${mainCategory}</h2>
				${subCategory? <h4>{subCategory}</h4> : ''}
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
					{/* <c:forEach items="${itemList}" var="item">
					<form action="/addToCart" method="GET">
						<tr ${item.stockQty==0 ? 'class="inactive"' : ''}>
							<td class="product_image_panel"><a href="${item.image}" target="_blank"><img src="${item.image}" alt="${item.description}" title="${item.description}" /></a></td>
							<td>${item.name}</td>
							<td>${item.options}</td>
							<td>${item.size}</td>
							<td><fmt:formatNumber value = "${item.currentPrice}" type = "currency" /></td>
							<td>${item.stockQty}</td>
							<td class="customerQty">
								<input type="hidden" id="upc${item.upc}" name="upc" value="${item.upc}" />
								<label for="itemQty">
									<input type="number" id="itemQty${item.upc}" name="itemQty" min="1" max="${item.stockQty}" step="1" value="0" ${item.stockQty==0 ? 'disabled' : ''} />
								</label>
							</td>
							<td class="button_panel">
								<button type="submit" class="btn btn-sm btn-primary btn-block" ${item.stockQty==0 ? 'disabled' : ''}>${item.stockQty==0 ? 'Out of Stock' : 'Add to Cart'}</button>
							</td>
							<span>
								${ addedUpc eq item.upc ? '<span style="color:blue;">'
								.concat(addedItemQty).concat(' ').concat(item.name).concat(' ').concat(item.options)
								.concat(' ').concat(item.size).concat(' added to cart</span> ') : ''}
							</span>
						</tr>
					</form>
					</c:forEach> */}
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