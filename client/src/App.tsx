//import './App.css'; // we import bootstrap.min.css and main.css in the head element instead. Could change up later
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from 'react-router-dom';
import dotenv from 'dotenv';
import productsService from './services/products.js';
import usersService from './services/users.js';

// Source code imports
import { PRODUCT_TYPE, USER_TYPE } from './type-defs/typeDefs';
import { InputElement } from './type-defs/typeDefs';
import ErrorNotification from './Components/ErrorNotification';
import Header from './Components/Header';
import HomePage from './Components/HomePage';
import Login from './Components/Login';
import SignUp from './Components/SignUp/SignUp';
//import ItemsList from './Components/ItemsList';

dotenv.config();


const App = () => {
	const userName = '';
	// create the react component state we'll use to store our data
	const [navMenuItems, setNavMenuItems]:[string[], React.Dispatch<React.SetStateAction<string[]>>] = useState([] as string[]);
	const [subnavMenuItems, setSubnavMenuItems]:[{}, React.Dispatch<React.SetStateAction<{}>>] = useState({});
//	const [areSubnavShown, setAreSubnavShown]:[boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
	const [newUser, setNewUser]:[USER_TYPE, React.Dispatch<React.SetStateAction<USER_TYPE>>] = useState({} as USER_TYPE);
//	const [items, setItems]:[PRODUCT_TYPE[], React.Dispatch<React.SetStateAction<PRODUCT_TYPE[]>>] = useState([] as PRODUCT_TYPE[]);
//	const [newItem, setNewItem]:[PRODUCT_TYPE, React.Dispatch<React.SetStateAction<PRODUCT_TYPE>>] = useState({type:PRODUCT_CATEGORIES.fruits, checked:false} as PRODUCT_TYPE);
	const [errorMessage, setErrorMessage]:[any, any] = useState(null);
	const history = useHistory();


	// Get Product Categories and Subcategories from DB for sidebar nav menu options
	useEffect(() => {
		// const categoryList = productsService.getCategoryList;
		// setNavMenuItems(categoryList);
		productsService
			.getAll()
			.then(response => {
				const { data } = response;
				console.log(data);
// 				const categoryObjects:CATEGORY_OBJECT = data.reduce(	// Add unique cats to array
// 					(list: CATEGORY_OBJECT, item: PRODUCT_TYPE) => {
// 					// If main cat not in list, push it to maincat string array and add an empty array to subcats
// 					// then add subcat to corresponding array if not in there already
// //					console.log(list);
// 						if ( !list.mainCategories.includes(item.categoryMain) ) {
// 							list.mainCategories.push(item.categoryMain);	// For corresponding subCat list
// 							list.subCategories.push([]);		// Push an empty array to subCats or subCat[matchingIndex] undefined
// 						}
// 						const matchingIndex = list.mainCategories.indexOf(item.categoryMain);
// 						if ( !list.subCategories[matchingIndex].includes(item.categorySpecific) ) {
// 							list.subCategories[matchingIndex].push(item.categorySpecific);
// 							list.subCategories[matchingIndex].sort();
// 						}
// 						// if (!list.subCats.includes(item.categorySpecific))
// 						// 	list.subCats.push(item.categorySpecific);
// 						console.log('List:', list);
// 						return list;
// 					}, {mainCategories:[],subCategories:[[]]} as CATEGORY_OBJECT
// 				);
				const categoryList:string[] = data.reduce(	// Add unique subcategories to array
					(list: string[], item: PRODUCT_TYPE) => {
						if (!list.includes(item.categoryMain)) list.push(item.categoryMain);
//						console.log('List:', list);
						return list;
					}, []
				);
				console.log('catlist:',categoryList);
				const subCategoryList= data.reduce(	// Add unique subcategories to array
					(list: {}, item: PRODUCT_TYPE) => {
						// If it doesn't exist, add an empty string array to list with the key categoryMain
						if (!list.hasOwnProperty(item.categoryMain)) list[item.categoryMain] = [];
						if (!list[item.categoryMain].includes(item.categorySpecific))
							list[item.categoryMain].push(item.categorySpecific);	// Fill that string array with subcategories
//						console.log('subList:', list);
						return list;
					}, {}
				);
//				console.log('subcat list:', JSON.stringify(subCategoryList));
//				categoryObjects.subCategories.pop();	// Remove terminal empty array
//				console.log('Final List:', categoryObjects);
//				const categoryList:string[] = categoryObjects.mainCategories.map(c => c);
//				categoryList.sort();
				setNavMenuItems(categoryList.sort()); // Set react hooks
				setSubnavMenuItems(subCategoryList);
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
		setNewUser( prev => ({
			...prev,
			[name]: value,
			dateAdded: new Date(Date.now()),
			isEnabled:true
		}) as USER_TYPE );
	};

	const handleLoginFormSubmit: React.FormEventHandler<HTMLFormElement> = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// Do nothing if required data not submitted. Won't happen since submit button is inactive until
		// required fields are added, but there must be a way to determine which fields are required in the schema
		if (!(newUser.email&&newUser.firstName&&newUser.lastName)) return;
		console.log(JSON.stringify(newUser));
		if (newUser.password !== newUser.passwordConfirm) {
			setErrorMessage('Passwords do not match! Please try again...');
			setTimeout(() => setErrorMessage(null), 5000);
			return;
		} 
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
			})
			.catch(error => {
				alert(JSON.stringify(error.message));
				setErrorMessage(`Error registering new user to database...`);
				setTimeout(() => setErrorMessage(null), 5000);
				// Reset newUser here if desired (setnewUser)
			});
	};

	// const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	const { name, value } = event.currentTarget; //  Must pull these off event/target object now or will be null later. Not sure why
	// 	console.log(name, ':', value);
	// 	setNewItem(prev => ({
	// 		...prev,
	// 		id: Date.now(),
	// 		[name]: value.toLowerCase(),
	// 		checked: false
	// 	}));
	// };

	// const handleInputSubmit: React.FormEventHandler<HTMLFormElement> = (event: React.FormEvent<HTMLFormElement>) => {
	// 	event.preventDefault();
	// 	if (!newItem.name) return;	// Do nothing if no data entered in text input
	// 	const formattedName = newItem.name.toLowerCase();
	// 	setNewItem({...newItem, name:formattedName});	// Format data -- DOESN'T WORK??? Set in onChange instead
	// 	console.log(JSON.stringify(newItem));
	// 	productsService
	// 		.create(newItem)
	// 		.then(response => {
	// 			// Handle successful response
	// 			const data = response.data;
	// 			console.log('Response.data: ', data);
	// 			setItems((prev: PRODUCT_TYPE[]) => [...prev, newItem]); // only add to Items if added to DB
	// 			setNewItem({
	// 				type: newItem.type,
	// 				checked: false
	// 			} as PRODUCT_TYPE); // Only clear if successful
	// 		})
	// 		.catch(error => {
	// 			alert(JSON.stringify(error.message));
	// 			setErrorMessage(`Error adding new item to database...`);
	// 			setTimeout(() => setErrorMessage(null), 5000);
	// 			// Reset newItem here if desired (setNewItem)
	// 		});
	// };
	
	// const handleCheckboxToggle = (itemName:string) => {	// To check/uncheck available products
	// 	// Go thru all items; change the desired one; return a new array which has our updated item and all the other items.
	// 	setItems( (prevState:any) => {
	// 		return prevState.map( (item:PRODUCT_TYPE) => {
	// 			console.log(item);

	// 			// If it's the desired item, flip the value of `item.checked`
	// 			if (itemName === item.name) {
	// 				console.log('desired item ', item);
	// 				// This could also be done as `return { ...item, checked: !item.checked }`
	// 				const newItem = {
	// 					...item,
	// 					checked: !item.checked
	// 				};
	// 				console.log('updated item ', newItem);
	// 				return newItem;
	// 			}
	// 			// If it's not the desired item, return it unchanged
	// 			return { ...item }; // IMPORTANT: Object destructuring like this creates a **new** object w/the same values
	// 		});
	// 	});
	// };

//	console.log('App.state.items is ', items);

	if (!navMenuItems.length) return <div>Loading...</div>; // Data not yet retrieved from server
	return (
		<div>
			<Header userName={userName} />
			<div id='main-content'>
				<Router>
					<div id='side-nav'>
						<ul className='nav flex-column'>
							<li className='nav-item'>
								<Link to='/' className='nav-link'>
									Home
								</Link>
							</li>
							{navMenuItems.map(mainCategory => {
								return (
									<li
										className='nav-item'
										// onMouseEnter={() => setAreSubnavShown(true)}
										// onMouseLeave={() => setAreSubnavShown(false)}
										key={mainCategory}
									>
										<Link
											to={`/products/:${mainCategory}`}
											className='nav-link'
										>
											{mainCategory}
										</Link>
										{/* {areSubnavShown &&  ( <element></element> ) }*/}
										{/* <ul>
								{subnavMenuItems[mainCategory]
								.map( (subCategory) => { return (
								<li className='nav-item subNavItem' key={subCategory}>
									<Link
										to={`/products/:${mainCategory}/:${subCategory}`}
										className='nav-link subNavLink'
									>{subCategory}</Link>
								</li>
								)})}
								</ul> */}
										{/* )} */}
									</li>
								);
							})}
							{/*'${navMenuItems}' var='mainCategory'>
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
						<Route path={`/products/:category`}>
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
						<Route path={`/products/:category/:subcategory`}>
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
								errorMessage={errorMessage}
								setErrorMessage={setErrorMessage}
								handleLoginFormChange={handleLoginFormChange}
								handleLoginFormSubmit={handleLoginFormSubmit}
							/>
						</Route>
						<Route path='/' exact>
							<HomePage />
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
				</Router>
				<ErrorNotification message={errorMessage} />
			</div>
			<Footer />
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
		<div style={footerStyle}>
			<br />
			<em>
				Grocery App, &copy; Michael Maderich 2021
			</em>
		</div>
	);
};

export default App;