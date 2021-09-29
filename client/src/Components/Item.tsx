import PropTypes from "prop-types";
import { PRODUCT_TYPE } from "../type-defs/typeDefs";

function Item({ item, handleCheckboxToggle }:{item:PRODUCT_TYPE, handleCheckboxToggle:any}) {
	const handleChange = () => handleCheckboxToggle(item.name);

	return (
		<div>
			<input
				type='checkbox'
				checked={item.checked}
				id={item.name}
				name={item.name}
				onChange={handleChange}
			/>
			<label htmlFor={item.name}>{item.name}</label>
		</div>
	);
}

Item.propTypes = {
	item: PropTypes.object.isRequired,
	handleCheckboxToggle: PropTypes.func.isRequired
};

export default Item;