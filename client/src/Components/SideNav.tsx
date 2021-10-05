//import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function SideNav({ category, navMenuItems, subnavMenuItems}) {
	return (
		<div id='side-nav'>
			<ul className='nav flex-column'>
				<li className='nav-item'>
					<Link to='/' className='nav-link'>
						Home
					</Link>
				</li>
				{navMenuItems.map( (mainCategory:string) => { return (
					<li className={`nav-item${category.main === mainCategory ? ' highlighted' : ''}`}
						// onMouseEnter={() => setAreSubnavShown(true)}
						// onMouseLeave={() => setAreSubnavShown(false)}
						key={mainCategory}
					>
						<Link to={`/products/${mainCategory}`} className='nav-link'>
							{mainCategory}
						</Link>
						{/* {areSubnavShown &&  ( <element></element> ) } */}
						{category.main === mainCategory ?
						<ul>
						{subnavMenuItems[mainCategory].map( (subCategory:string) => { return (
							<li className={`nav-item subNavItem${category.sub === subCategory ? ' highlighted' : ''}`} key={subCategory}>
								<Link to={`/products/${mainCategory}/${subCategory}`} className='nav-link subNavLink'>
									{subCategory}
								</Link>
							</li>
						) }) }
						</ul> : null
						}
					</li>
				);})}
			</ul>
		</div>
	);
}

// SideNav.propTypes = {
// 	items: PropTypes.array.isRequired
// };

export default SideNav;