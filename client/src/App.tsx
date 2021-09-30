//import './App.css'; // we import bootstrap.min.css and main.css in the head element instead. Could change up later
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import dotenv from 'dotenv';
import groceriesService from './services/groceries.js';
import usersService from './services/users.js';

// Source code imports
import { PRODUCT_TYPE, USER_TYPE } from './type-defs/typeDefs';
import { InputElement } from './type-defs/typeDefs';
import ErrorNotification from './Components/ErrorNotification';
import Header from './Components/Header';
import HomePage from './Components/HomePage';
import SignUp from './Components/SignUp';
import ItemsList from './Components/ItemsList';

//Our raw data. In a real app we might get this via an API call instead of it being hardcoded.
const PRODUCT_CATEGORIES = {
	fruits: 'fruit',
	vegetables: 'vegetable'
};

dotenv.config();

const App = () => {
	const userName = '';
	// create the react component state we'll use to store our data
	const [navMenuItems, setNavMenuItems]:[string[], React.Dispatch<React.SetStateAction<string[]>>] = useState([] as string[]);
	const [newUser, setNewUser]:[USER_TYPE, React.Dispatch<React.SetStateAction<USER_TYPE>>] = useState({} as USER_TYPE);
	const [items, setItems]:[PRODUCT_TYPE[], React.Dispatch<React.SetStateAction<PRODUCT_TYPE[]>>] = useState([] as PRODUCT_TYPE[]);
	const [newItem, setNewItem]:[PRODUCT_TYPE, React.Dispatch<React.SetStateAction<PRODUCT_TYPE>>] = useState({type:PRODUCT_CATEGORIES.fruits, checked:false} as PRODUCT_TYPE);
	const [errorMessage, setErrorMessage]:[any, any] = useState(null);

	useEffect(() => {
		//productsService.getCategories()
		groceriesService.getAll()
			.then(response => {		// Handle successful response
				const {data} = response;	// Why map ok when data not array?
				console.log(data);
				const parsedData = data.map( (item:PRODUCT_TYPE) => ({
					...item,	// data items = {name:string, type:string}
					checked: false	// Need to add checked key to items
				}));

				// set our react state w/data from the server!
				setItems(parsedData);
			})
			.catch( error => {
				alert(JSON.stringify(error.message));
				setErrorMessage(`Error retrieving data from database: ${error.message}`);
				setTimeout( () => setErrorMessage(null), 5000);
			});
	}, []);

	// Process user data when Sign Up form is submitted. Validate before sending to DB
	const handleSignUpFormChange: React.ChangeEventHandler<InputElement> = (event: React.ChangeEvent<InputElement>) => {
		const { name, value } = event.currentTarget; //  Must pull these off event/target object here or will be null later. Not sure why
		console.log(name, ':', value);
		setNewUser(prev => ({
			...prev,
			[name]: value,
			dateAdded: Date.now(),
			isEnabled:true
		}));
	};

	const handleSignUpFormSubmit: React.FormEventHandler<HTMLFormElement> = (event: React.FormEvent<HTMLFormElement>) => {
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
//		Object.keys(newUser).forEach(key => {if (!key) delete newUser[key]});
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

	const handleInputChange: React.ChangeEventHandler<InputElement> = (event: React.ChangeEvent<InputElement>) => {
		const { name, value } = event.currentTarget; //  Must pull these off event/target object now or will be null later. Not sure why
		console.log(name, ':', value);
		setNewItem(prev => ({
			...prev,
			id: Date.now(),
			[name]: value.toLowerCase(),
			checked: false
		}));
	};

	const handleInputSubmit: React.FormEventHandler<HTMLFormElement> = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!newItem.name) return;	// Do nothing if no data entered in text input
		const formattedName = newItem.name.toLowerCase();
		setNewItem({...newItem, name:formattedName});	// Format data -- DOESN'T WORK??? Set in onChange instead
		console.log(JSON.stringify(newItem));
		groceriesService
			.create(newItem)
			.then(response => {
				// Handle successful response
				const data = response.data;
				console.log('Response.data: ', data);
				setItems((prev: PRODUCT_TYPE[]) => [...prev, newItem]); // only add to Items if added to DB
				setNewItem({
					type: newItem.type,
					checked: false
				} as PRODUCT_TYPE); // Only clear if successful
			})
			.catch(error => {
				alert(JSON.stringify(error.message));
				setErrorMessage(`Error adding new item to database...`);
				setTimeout(() => setErrorMessage(null), 5000);
				// Reset newItem here if desired (setNewItem)
			});
	};
	
	const handleCheckboxToggle = (itemName:string) => {	// To check/uncheck available products
		// Go thru all items; change the desired one; return a new array which has our updated item and all the other items.
		setItems( (prevState:any) => {
			return prevState.map( (item:PRODUCT_TYPE) => {
				console.log(item);

				// If it's the desired item, flip the value of `item.checked`
				if (itemName === item.name) {
					console.log('desired item ', item);
					// This could also be done as `return { ...item, checked: !item.checked }`
					const newItem = {
						...item,
						checked: !item.checked
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

	if (!items.length) return <div>Loading...</div>; // Data not yet retrieved from server
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
							<li className='nav-item'>
								<Link
									to='/products/laundry'
									className='nav-link'
								>
									Laundry
								</Link>
							</li>
							<li className='nav-item'>
								<Link
									to='/products/oralcare'
									className='nav-link'
								>
									Oral Care
								</Link>
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
						<Route path='/'>
							<HomePage items={items} />
						</Route>
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