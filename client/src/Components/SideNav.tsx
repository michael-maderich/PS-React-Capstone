//import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import HomePage from './HomePage';
import ItemsList from './ItemsList';
import { PRODUCT_TYPE } from '../type-defs/typeDefs';

function SideNav({ items }:{items:PRODUCT_TYPE[]}) {
	return (
		// <Router>
		<div>
			<div id='side-nav'>
				<ul className='nav flex-column'>
					<li className='nav-item'>
						<Link to='/' className='nav-link'>
							Home
						</Link>
					</li>
					<li className='nav-item'>
						<Link to={`/products/laundry`}>Laundry</Link>
					</li>
					<li className='nav-item'>
						<Link to={`/products/oralcare`}>Oral Care</Link>
					</li>
					{/* <c:forEach items='${navMenuItems}' var='mainCategory'>
						<c:set var='subCatList' value='' />
					<li className='nav-item ${categoryName == mainCategory ? 'highlighted' : ''}'>
					<c:forEach items='${navSubMenuItems}' var='subCat'>
						<c:set var='subCatList' value='${subCatList}${empty subCatList ? '' : ', '}${subCat}' />
					</c:forEach>
						<a className='nav-link' href='/category/${mainCategory}'>${mainCategory}</a>	<%--  title='${subCatList}' --%>
					</li>
					<c:if test = '${mainCategory == param.categoryName}'>
					<c:forEach items='${navSubMenuItems}' var='subCategory'>
						<li className='nav-item subNavItem ${subCategoryName == subCategory ? 'highlighted' : ''}'>
							<a className='nav-link subNavLink' href='/category/${mainCategory}/${subCategory}'>${subCategory}</a>
						</li>
					</c:forEach>
					</c:if>
					</c:forEach> */}
				</ul>
			</div>
			<Switch>
				<Route path={`/products/laundry`}>
					{/* <ItemsList
						newItem={newItem}
						setNewItem={setNewItem}
						items={items}
						type={PRODUCT_CATEGORIES.fruits}
						handleCheckboxToggle={handleCheckboxToggle}
						handleInputChange={handleInputChange}
						handleInputSubmit={handleInputSubmit}
					/> */}
				</Route>
				<Route path={`/products/oralcare`}>
					{/* <ItemsList
						newItem={newItem}
						setNewItem={setNewItem}
						items={items}
						type={PRODUCT_CATEGORIES.vegetables}
						handleCheckboxToggle={handleCheckboxToggle}
						handleInputChange={handleInputChange}
						handleInputSubmit={handleInputSubmit}
					/> */}
				</Route>
				<Route path='/'>
					<HomePage
						items={items}
					/>
				</Route>
			</Switch>
		</div>
		// </Router>
	);
}

// SideNav.propTypes = {
// 	items: PropTypes.array.isRequired
// };

export default SideNav;

/*
				<ul className='nav flex-column'>
					<li className='nav-item'><a className='nav-link' href='/'>Home</a></li>
					<c:forEach items='${navMenuItems}' var='mainCategory'>
						<c:set var='subCatList' value='' />
					<li className='nav-item ${categoryName == mainCategory ? 'highlighted' : ''}'>
					<c:forEach items='${navSubMenuItems}' var='subCat'>
						<c:set var='subCatList' value='${subCatList}${empty subCatList ? '' : ', '}${subCat}' />
					</c:forEach>
						<a className='nav-link' href='/category/${mainCategory}'>${mainCategory}</a>	<%--  title='${subCatList}' --%>
					</li>
					<c:if test = '${mainCategory == param.categoryName}'>
					<c:forEach items='${navSubMenuItems}' var='subCategory'>
						<li className='nav-item subNavItem ${subCategoryName == subCategory ? 'highlighted' : ''}'>
							<a className='nav-link subNavLink' href='/category/${mainCategory}/${subCategory}'>${subCategory}</a>
						</li>
					</c:forEach>
					</c:if>
					</c:forEach>
				</ul>
*/