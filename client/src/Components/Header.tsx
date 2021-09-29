//import PropTypes from 'prop-types';

function HomePage({ userName }:{userName:string}) {
	return (
		<header>
 			{/* <nav>
				<i class='fas fa-bars'></i>
				Menu
			</nav> */}
			<nav>
				<input id='search' name='search' type='text' placeholder=' Search' />
			</nav>
 			<div id='action-icons'>
				<form id='logoutForm' method='POST' action='logout'>
					<span>{userName ? 'Logged in as: '.concat(userName) : 'Login/Sign Up ->'}</span>
				{userName ? <>
	    	        <input type='hidden' name='_csrf.parameterName' value='_csrf.token'/>
					<input type='submit' id='logoutbtn' name='logoutbtn' value='Sign Out' className='btn btn-sm btn-primary btn-block' />
				</> : null}
					<a href={userName ? '/account' : '/login'}>
						<i className='fas fa-user-alt' title={userName ? 'Account' : 'Sign Up/Login'}></i></a>
					<a href='/cart'><i className='fas fa-shopping-cart' title='Shopping Cart'></i></a>
				</form>				
			</div>
		</header>
	);
}

// HomePage.propTypes = {
// 	items: PropTypes.array.isRequired
// };

export default HomePage;