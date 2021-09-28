import PropTypes from "prop-types";
import { PRODUCT_TYPE } from "./type-defs/typeDefs";

function SelectedItems({ items, handleCheckboxToggle }:{items:PRODUCT_TYPE[], handleCheckboxToggle:any}) {
	const itemsSelected = items.filter( (item:PRODUCT_TYPE) => item.checked === true);
	let handleChange = () => {};
	return (
		<table>
			{itemsSelected.map((item: PRODUCT_TYPE, index) => {
				handleChange = () => handleCheckboxToggle(item.name);
				return (
				<tr>
					<td>
						<input
							type='checkbox'
							checked={item.checked}
							name={item.name}
							onChange={handleChange}
						/>
					</td>
					<td key={item.name}>Item Name: {item.name}</td>
				</tr>
				)
			})}
		</table>
	);
}

SelectedItems.propTypes = {
	items: PropTypes.array.isRequired
};

export default SelectedItems;