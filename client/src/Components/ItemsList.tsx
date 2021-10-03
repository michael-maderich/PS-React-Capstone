import PropTypes from "prop-types";
import { PRODUCT_TYPE } from "../type-defs/typeDefs";
import {useEffect} from "react";

// src imports
import Item from "./Item";
import React from "react";

function ItemsList({ newItem, setNewItem, items, type, handleCheckboxToggle, handleInputChange, handleInputSubmit }
					:{newItem:PRODUCT_TYPE, setNewItem:any, items:PRODUCT_TYPE[], type:string,
						handleCheckboxToggle:any, handleInputChange:any, handleInputSubmit:any}) {

	const categoryName = 'Household';
	const subCategoryName = 'Laundry';
	useEffect(() => {
		document.title = `The Little Store - ${categoryName}${subCategoryName != null? ' - '.concat(subCategoryName) : '' } Category`;
	}, []);

	// console.log(items);
	// console.log(`^Items filtered to type ${type}:`);
	const filteredItems = items.filter(item => item.type === type);
	// console.log(filteredItems);


	// Type needs to be set based on category type, since select
	// dropdown right now only gives one choice
	useEffect( () => {
		setNewItem((prev: PRODUCT_TYPE) => ({
			...prev,
			type: type
		}));
	}, [setNewItem, type] );

	return (
		<div>
			<form onSubmit={handleInputSubmit}>
				<input
					name='name' // Must match corresponding key
					placeholder='Product Name'
					value={newItem.name || ""}
					onChange={handleInputChange}
				/>
				{!newItem.name ? null : ( // Only display type dropdown if a product is entered
					<select
						name='type'
						//                    selected=
						value={type} //{newItem.type || type}
						onChange={handleInputChange}
					>
						{/* {props.categories.map((category: string) => {
							return ( */}
						<option value={type}>{type}</option>
						{/* );
						})} */}
					</select>
				)}
				<div>
					<button type='submit' disabled={!newItem.name}>
						Add New{" "}
						{type.charAt(0).toUpperCase().concat(type.slice(1))}
					</button>
				</div>
			</form>
			{type.charAt(0).toUpperCase().concat(type.slice(1))} List
			<ul>
				{filteredItems.map((item, index) => (
					<div key={type + "-" + index}>
						<Item
							item={item}
							handleCheckboxToggle={handleCheckboxToggle}
						/>
					</div>
				))}
			</ul>
		</div>
	);
}

ItemsList.propTypes = {
	items: PropTypes.array.isRequired,
	type: PropTypes.string.isRequired,
	handleCheckboxToggle: PropTypes.func.isRequired
};

export default ItemsList;

/*
	<jsp:param name="title" value="The Little Store - ${categoryName}${subCategoryName != null? ' - '.concat(subCategoryName).concat(' ') : '' }Category" />
	<jsp:param name="page" value="category" />
</jsp:include>
	</head>
	<body>
		<header>
<jsp:include page="basicHeader.jsp"></jsp:include>
		</header>
		<div id="main-content">
<jsp:include page="sideNav.jsp">
	<jsp:param name="categoryName" value="${categoryName}" />
	<jsp:param name="subCatName" value="${subCategoryName}" />
</jsp:include>
			<div id="center-content">
				<div id="product-panel">
					<h2>${categoryName}</h2>
					${subCategoryName != null? '<h4>'.concat(subCategoryName).concat('</h4>') : ''}
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
						<c:forEach items="${itemList}" var="item">
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
						</c:forEach>
						</tbody>
						<tfoot>
						</tfoot>
					</table>
				</div>
			</div>
		</div>
        <footer>
			<jsp:include page="basicFooter.jsp"></jsp:include>
        </footer>
	</body>
</html>
*/