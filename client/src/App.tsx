//import './App.css'; // we import bootstrap.min.css and main.css in the head element instead. Could change up later
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from 'react-router-dom';
import dotenv from 'dotenv';
import productsService from './services/products';
import usersService from './services/users';
import loginService from './services/login';

// Source code imports
import { PRODUCT_TYPE, USER_TYPE, AUTH_OBJECT } from './type-defs/typeDefs';
// import ErrorNotification from './Components/ErrorNotification';
import Header from './Components/Header';
import SideNav from './Components/SideNav';
import HomePage from './Components/HomePage';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import ProductList from './Components/ProductList';

dotenv.config();


const App = () => {
	const userName = '';
	// create the react component state we'll use to store our data
	const [category, setCategory]:[{main:string,sub:string}, React.Dispatch<React.SetStateAction<{main:string,sub:string}>>] = useState({} as {main:string,sub:string});
	const [navMenuItems, setNavMenuItems]:[string[], React.Dispatch<React.SetStateAction<string[]>>] = useState([] as string[]);
	const [subnavMenuItems, setSubnavMenuItems]:[{}, React.Dispatch<React.SetStateAction<{}>>] = useState({});
//	const [areSubnavShown, setAreSubnavShown]:[boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
	const [newUser, setNewUser]:[USER_TYPE, React.Dispatch<React.SetStateAction<USER_TYPE>>] = useState({} as USER_TYPE);
	const [login, setLogin]:[{username:string,password:string}, React.Dispatch<React.SetStateAction<{username:string,password:string}>>] = useState({} as {username:string,password:string});
	const [authObject, setAuthObject]:[AUTH_OBJECT, React.Dispatch<React.SetStateAction<AUTH_OBJECT>>] = useState({} as AUTH_OBJECT);
	const [productList, setProductList]:[PRODUCT_TYPE[], React.Dispatch<React.SetStateAction<PRODUCT_TYPE[]>>] = useState([] as PRODUCT_TYPE[]);
	const [cartItems, setCartItems]:[{}, React.Dispatch<React.SetStateAction<{}>>] = useState({});
	const [errorMessage, setErrorMessage]:[any, any] = useState(null);
	const history = useHistory();


	// Get Product Categories and Subcategories from DB for sidebar nav menu options
	useEffect(() => {
		productsService
			.getAll()					// .getCategoryList()
			.then(response => {
				const { data } = response;
				console.log(data);
				const categoryList= data.reduce(	// Add unique categories and their unique subcategories to object
					(list: {}, item: PRODUCT_TYPE) => {
						// If it doesn't exist, add an empty string array to list with the key categoryMain
						if (!list.hasOwnProperty(item.categoryMain)) list[item.categoryMain] = [];
						if (!list[item.categoryMain].includes(item.categorySpecific))
							list[item.categoryMain].push(item.categorySpecific);	// Fill that string array with subcategories
						return list;
					}, {}
				);
				setNavMenuItems(Object.keys(categoryList).sort()); // keys of the categoryList object are mainCat strings
				// Use the mainCat keynames to iteratate through each category and sort the subcategory array
				Object.keys(categoryList).forEach( (mainCat) => categoryList[mainCat].sort());
				setSubnavMenuItems(categoryList);
			})
			.catch(error => {
				alert(JSON.stringify(error.message));
				setErrorMessage(
					`Error retrieving data from database: ${error.message}`
				);
				setTimeout(() => setErrorMessage(null), 5000);
			});
	}, []);

	// Expand category links to subcategory links on hover
	// const handleNavLinkOnHover = () => {
	// 	console.log('bllah');
	// }

	// Process user data when Sign Up form is submitted. Validate before sending to DB
	const handleSignUpFormChange: React.ChangeEventHandler<HTMLInputElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.currentTarget; //  Must pull these off event/target object here or will be null later. Not sure why
		console.log(name, ':', value);
		setNewUser( prev => ({
			...prev,
			[name]: value,
			dateAdded: new Date(Date.now()),
			isEnabled:true
		}) as USER_TYPE );
	};

	const handleSignUpFormSubmit: React.FormEventHandler<HTMLFormElement> = (event: React.FormEvent<HTMLFormElement>) => {
		function isFormValid() {
			let validForm = true;
			const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (re.test(String(newUser.email).toLowerCase())===false) {
				setErrorMessage(`Email must be in form 'johndoe@site.com'! Please correct.`);
				setTimeout(() => setErrorMessage(null), 5000);
//				alert("Email must be in form 'johndoe@site.com'! Please correct.");
				validForm = false;
			}
			if (newUser.password !== newUser.passwordConfirm) {
				setErrorMessage('Passwords do not match! Please try again...');
				setTimeout(() => setErrorMessage(null), 5000);
//				alert("Passwords do not match! Please correct.");
				validForm = false;
			}
			if (newUser.phone && (Number.isNaN(parseInt(newUser.phone)) || newUser.phone.length !== 10)) {
				setErrorMessage(`Invalid phone number entered (${newUser.phone})! Please correct.`);
				setTimeout(() => setErrorMessage(null), 5000);
//				alert(`Invalid phone number entered (${newUser.phone})! Please correct.`);
				validForm = false;
			}
			return validForm;
		}
		event.preventDefault();
		// Do nothing if required data not submitted. Won't happen since submit button is inactive until
		// required fields are added, but there must be a way to determine which fields are required in the schema
		if (!(isFormValid() && newUser.firstName && newUser.lastName)) return;

		console.log(JSON.stringify(newUser));
		// if (newUser.password !== newUser.passwordConfirm) {
		// 	setErrorMessage('Passwords do not match! Please try again...');
		// 	setTimeout(() => setErrorMessage(null), 5000);
		// 	return;
		// } 
//		Object.keys(newUser).forEach(key => {if (!newUser[key]) delete newUser[key]}); // Delete field if empty?
		delete newUser.passwordConfirm;
		usersService
			.create(newUser)
			.then(response => {
				// Handle successful response
				const data = response.data;
				console.log('Response.data: ', data);
				//setLoggedUser??(newUser);
				setNewUser({} as USER_TYPE);	// Only clear if successful
				setErrorMessage('Registration Successful');
				setTimeout(() => setErrorMessage(null), 5000);
				// <Redirect to='/' />				// Doesn't work
//				history.push('/');		// Go to home screen after successful signup -- doesn't work either
			})
			.catch(error => {
				alert(JSON.stringify(error.message));
				setErrorMessage(`Error registering new user to database...`);
				setTimeout(() => setErrorMessage(null), 5000);
				// Reset newUser here if desired (setnewUser)
			});
	};

	// Process user data when Sign Up form is submitted. Validate before sending to DB
	const handleLoginFormChange: React.ChangeEventHandler<HTMLInputElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.currentTarget; //  Must pull these off event/target object here or will be null later. Not sure why
		console.log(name, ':', value);
		setLogin( prev => ({
			...prev,
			[name]: value
		}) );
	};

	const handleLoginFormSubmit: React.FormEventHandler<HTMLFormElement> = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// Do nothing if required data not submitted. Won't happen since submit button is inactive until
		// required fields are added, but there must be a way to determine which fields are required in the schema
		if (!(login.username && login.password)) return;
		console.log('login sent:',JSON.stringify(login));

		loginService.submitCredentials(login)
		.then( (response) => {
			const authObject:AUTH_OBJECT = response.data;
			console.log('authObject:',JSON.stringify(authObject));
			setAuthObject(authObject);
		})
		.catch( error => {
//			alert(JSON.stringify(error.message));
			setErrorMessage(`Invalid login. Please try again.`);
			setTimeout(() => setErrorMessage(null), 5000);
			// Reset newUser here if desired (setnewUser)
		});
	};

	const handleProductListFormChange: React.ChangeEventHandler<HTMLInputElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.currentTarget; //  Must pull these off event/target object now or will be null later. Not sure why
		console.log(name, ':', value);
		const maxQty = productList[productList.findIndex(p => p.upc===Number(name))].stockQty;
		setCartItems(prev => ({
			...prev,
			[name]: Number(value) > maxQty ? maxQty : Number(value) < 0 ? 0 : Number(value)
		}));
	};

	const handleProductListAddToCart: React.FormEventHandler<HTMLFormElement> = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	}

	const handleProductListFormSubmit: React.FormEventHandler<HTMLFormElement> = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// if (!newItem.name) return;	// Do nothing if no data entered in text input
		// const formattedName = newItem.name.toLowerCase();
		// setNewItem({...newItem, name:formattedName});	// Format data -- DOESN'T WORK??? Set in onChange instead
		// console.log(JSON.stringify(newItem));
		// productsService
		// 	.create(newItem)
		// 	.then(response => {
		// 		// Handle successful response
		// 		const data = response.data;
		// 		console.log('Response.data: ', data);
		// 		setProductList((prev: PRODUCT_TYPE[]) => [...prev, newItem]); // only add to Items if added to DB
		// 		// setNewItem({
		// 		// 	type: newItem.type,
		// 		// 	checked: false
		// 		// } as PRODUCT_TYPE); // Only clear if successful
		// 	})
		// 	.catch(error => {
		// 		alert(JSON.stringify(error.message));
		// 		setErrorMessage(`Error adding new item to database...`);
		// 		setTimeout(() => setErrorMessage(null), 5000);
		// 		// Reset newItem here if desired (setNewItem)
		// 	});
	};
	
	const handleCheckboxToggle = (itemName:string) => {	// To check/uncheck available products
		// Go thru all items; change the desired one; return a new array which has our updated item and all the other items.
		setProductList( (prevState:any) => {
			return prevState.map( (item:PRODUCT_TYPE) => {
				console.log(item);

				// If it's the desired item, flip the value of `item.checked`
				if (itemName === item.name) {
					console.log('desired item ', item);
					// This could also be done as `return { ...item, checked: !item.checked }`
					const newItem = {
						...item,
//						checked: !item.checked
					};
					console.log('updated item ', newItem);
					return newItem;
				}
				// If it's not the desired item, return it unchanged
				return { ...item }; // IMPORTANT: Object destructuring like this creates a **new** object w/the same values
			});
		});
	};

//	console.log('App.state.items is ', items);



	if (!navMenuItems.length) return <div>Loading...</div>; // Data not yet retrieved from server
	return (
		<div>
			<Router>
				<Header userName={userName} />
				<div id='main-content'>
					<SideNav
						category={category}
						navMenuItems={navMenuItems}
						subnavMenuItems={subnavMenuItems}
					/>
					<Switch>
						<Route path='/products/:mainCategory/:subCategory?'>
							<ProductList
								category={category}
								setCategory={setCategory}
								productList={productList}
								setProductList={setProductList}
								cartItems={cartItems}
								setCartItems={setCartItems}
								handleProductListAddToCart={handleProductListAddToCart}
								handleProductListFormChange={handleProductListFormChange}
								handleProductListFormSubmit={handleProductListFormSubmit}
								errorMessage={errorMessage}
								setErrorMessage={setErrorMessage}
							/>
						</Route>
						<Route path='/signup'>
							<SignUp
								newUser={newUser}
								setNewUser={setNewUser}
								errorMessage={errorMessage}
								setErrorMessage={setErrorMessage}
								handleSignUpFormChange={handleSignUpFormChange}
								handleSignUpFormSubmit={handleSignUpFormSubmit}
							/>
						</Route>
						<Route path='/login'>
							<Login
								login={login}
								errorMessage={errorMessage}
								handleLoginFormChange={handleLoginFormChange}
								handleLoginFormSubmit={handleLoginFormSubmit}
							/>
						</Route>
						<Route path='/' exact>
							<HomePage setCategory={setCategory}/>
						</Route>
						{/* {
						isAuthenticated ?
						<>
						<Route path='somethingthatrequiresauthentication'>
							<authenticatedpage>
						</Route>
						</> : <Redirect to='login' />
						} */}
						<Route render={() => <h1>404: Page Not Found</h1>} />
					</Switch>
				{/* <ErrorNotification message={errorMessage} /> */}
				</div>
				<Footer />
			</Router>
		</div>
	);
}

const Footer = () => {
	const footerStyle = {
		color: 'green',
		fontStyle: 'italic',
		fontSize: 16
	};
	return (
		<footer>
			<div className="footer-container" style={footerStyle}>
				<span>
					&copy;{new Date().getFullYear()} <a href="https://github.com/michael-maderich" target="_blank" rel="noreferrer">Michael Maderich</a>
				</span>
			</div>
		</footer>
	);
};

export default App;