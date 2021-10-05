import { useEffect } from 'react';
import { Link } from 'react-router-dom';
//import PropTypes from "prop-types";
import ErrorNotification from './ErrorNotification';
import './SignUp.css';
import { States } from '../type-defs/typeDefs';

function SignUp({ newUser, setNewUser, errorMessage, setErrorMessage, handleSignUpFormChange, handleSignUpFormSubmit } ) {
	useEffect(() => {
		document.title = 'The Little Store - Sign Up';
	}, []);

	return (
		<>
			<div id="left-img-content">
				<img src="https://azcdn.messenger.pgsitecore.com/en-us/-/media/Febreze/Images/Products/product_primary_images/November%202020%20Updates/PDP_DT_AE_GAIN_HoneyBerryHula.png" alt="Febreze Air Honey Berry Hula" />
			</div>
			<div id="center-content">
				<div id="registration-panel">
					<h2>New User Sign-Up</h2>
					<p>Already Registered? Click <Link to="/login">here</Link> to Log In</p>
					<form onSubmit={handleSignUpFormSubmit} className="form-signin">
						{/* {errorMessage ? <span>{errorMessage}<br /></span> : ''} */}
						<div className={`form-group ${errorMessage ? 'has-error' : ''}`}>
							<label htmlFor="firstName">
								<input name="firstName" id="firstName" type="text" placeholder=" First Name"
								value={newUser.firstName || ''}
								onChange={handleSignUpFormChange} className="text-field" required={true} autoFocus={true} />
							</label>
						</div>
						{/* {errorMessage ? <span>{errorMessage}<br /></span> : ''} */}
						<div className={errorMessage ? 'form-group has-error' : 'form-group'}>
							<label htmlFor="lastName">
								<input name="lastName" id="lastName" type="text" placeholder=" Last Name"
								value={newUser.lastName || ''}
								onChange={handleSignUpFormChange} className="text-field" required={true} />
							</label>
						</div>
						<div className={errorMessage ? 'form-group has-error' : 'form-group'}>
							<label htmlFor="email">
								<input name="email" id="email" type="email" placeholder=" Email"
								value={newUser.email || ''}
								onChange={handleSignUpFormChange} className="text-field" required={true} autoComplete="username" />
							</label>
						</div>
						<div className={errorMessage ? 'form-group has-error' : 'form-group'}>
							<label htmlFor="password">
								<input name="password" id="password" type="password" placeholder=" Password"
								value={newUser.password || ''}
								onChange={handleSignUpFormChange} className="text-field" required={true} autoComplete="new-password" />
							</label>
						</div>
						<div className={errorMessage ? 'form-group has-error' : 'form-group'}>
							<label htmlFor="passwordConfirm">
								<input name="passwordConfirm" id="passwordConfirm" type="password" placeholder=" Confirm Password"
								value={newUser.passwordConfirm || ''}
								onChange={handleSignUpFormChange} className="text-field" required={true} autoComplete="new-password" />
							</label>
						</div>
						<p>Meet-Up Address (Optional):</p>
						<label htmlFor="address">
							<input name="address" id="address" type="text" placeholder=" Street Address (optional)"
							value={newUser.address || ''}
							onChange={handleSignUpFormChange} className="text-field" />
						</label>
						<br /><label htmlFor="city">
							<input name="city" id="city" type="text" placeholder=" City (optional)"
							value={newUser.city || ''}
							onChange={handleSignUpFormChange} className="text-field" />
						</label>
						<label htmlFor="state">
							<select
								name='state'
								id='state'
								value={newUser.state || 'PA'}
								onChange={handleSignUpFormChange}
							>
								{ States.map((state) => { return (
								<option value={state}key={state}>
									{state}
								</option>
								); }) }
							</select>
						</label>
						<br /><label htmlFor="phone">
							<input name="phone" id="phone" type="text" placeholder=" Phone Number (optional)"
							value={newUser.phone || null} onChange={handleSignUpFormChange} className="text-field" />
						</label>
						<br /><label htmlFor="submit">
							<button id="submit" name="submit" type='submit'
								disabled={!(newUser.email && newUser.password && newUser.passwordConfirm
											&& newUser.firstName && newUser.lastName)}
							>Submit</button>
						</label>
					</form>
				</div>
				<ErrorNotification message={errorMessage} style={{position:"fixed"}}/>
			</div>
			<div id="right-img-content">
				<img src="https://azcdn.messenger.pgsitecore.com/en-us/-/media/Febreze/Images/Products/product_primary_images/February%202021%20Updates/US_DT_PDP_AIR_UNS_Fresh.png" alt="Febreze Air Unstopables Fresh Scent" />
			</div>
		</>
	);
}

// SignUp.propTypes = {
// 	items: PropTypes.array.isRequired
// };

export default SignUp;