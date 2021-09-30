import { useEffect } from 'react';
//import PropTypes from "prop-types";
import './HomePage.css';
import { PRODUCT_TYPE } from '../type-defs/typeDefs';

function HomePage({ items }: { items: PRODUCT_TYPE[] }) {
	useEffect( () => {
		document.title = 'The Little Store - Home';
	}, []);

	return (
		<div id='center-content'>
			<p id='page-title'>The Little Store</p>
			<img src='./static/images/Main_BG.jpg' alt='Stockpile' />
		</div>
	);
}

// HomePage.propTypes = {
// 	items: PropTypes.array.isRequired
// };

export default HomePage;
