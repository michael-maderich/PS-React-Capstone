import PropTypes from "prop-types";
import { PRODUCT_TYPE } from "../type-defs/typeDefs";
import {useEffect} from "react";

// src imports
import Item from "./Item";
import React from "react";

function ItemsList({ newItem, setNewItem, items, type, handleCheckboxToggle, handleInputChange, handleInputSubmit }
					:{newItem:PRODUCT_TYPE, setNewItem:any, items:PRODUCT_TYPE[], type:string,
						handleCheckboxToggle:any, handleInputChange:any, handleInputSubmit:any}) {
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