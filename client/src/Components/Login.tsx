import { useEffect } from 'react';
import { Link } from 'react-router-dom';
//import PropTypes from "prop-types";
import ErrorNotification from './ErrorNotification';
import './Login.css';

function Login({login, errorMessage, handleLoginFormChange, handleLoginFormSubmit}) {
	useEffect(() => {
		document.title = 'The Little Store - Log In';
	}, []);

	function viewPassword() {
		var passwordInput = document.getElementById('login-password') as HTMLInputElement;
		var passStatus = document.getElementById('pass-status');
		
		if (passwordInput.type === 'password') {
			passwordInput.type='text';
			passStatus.className='fa fa-eye-slash';
		}
		else {
			passwordInput.type='password';
			passStatus.className='fa fa-eye';
		}
	}

	return (
		<div id="center-content">
			<div id="login-panel">
				<h2>Log In</h2>
				<p>New User? Click <Link to="/signup">here</Link> to Sign Up</p>
				<form onSubmit={handleLoginFormSubmit} className="form-signin">
					<div className="form-group {errorMessage != null ? 'has-errorMessage' : ''}">
						{/* {message!=null || <div style={{color:"green", marginBottom:"0.5em"}}>{message}</div>} */}
						<br /><label htmlFor="email">
							<input id="email" name="username" value={login.username || ''} onChange={handleLoginFormChange} type="email" placeholder="Email Address" className="text-field" required autoFocus />
						</label>
						<br /><label htmlFor="password">
							<input id="login-password" name="password" value={login.password || ''} onChange={handleLoginFormChange} type="password" placeholder="Password" className="text-field" required />
							<i id="pass-status" className="fa fa-eye" aria-hidden="true" onClick={viewPassword} title="Show/Hide Password"></i>
						</label>
						{/* {errorMessage!=null || <div style={{color:"#cc0000", marginBottom:"0.5em"}}>{errorMessage}</div>} */}
						{/* <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/> */}
						<br /><label htmlFor="submit">
							<button id="submit" name="submit" type="submit" disabled={!(login.username&&login.password)}>Log In</button>
						</label>
					</div>
				</form>
				<ErrorNotification message={errorMessage} style={{position:"fixed"}}/>
			</div>
			<div id="bottom-img-content">
				<img src="https://azcdn.messenger.pgsitecore.com/en-us/-/media/Febreze/Images/Products/product_primary_images/One%20and%20Done%20Project/US_DT_PDP_WAX_AprilFresh.png" alt="Tide Detergent" width='200em' />
			</div>
		</div>
	);
}

// SignUp.propTypes = {
// 	items: PropTypes.array.isRequired
// };

export default Login;