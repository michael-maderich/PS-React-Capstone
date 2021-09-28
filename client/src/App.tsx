import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import dotenv from 'dotenv';
import ErrorNotification from './Components/ErrorNotification'; 
import groceriesService from './services/groceries.js';

// Source code imports
import { PRODUCT_TYPE } from './type-defs/typeDefs';
import ItemsList from './ItemsList';
import SelectedItems from './SelectedItems';

// Our raw data. In a real app we might get this via an API call instead of it being hardcoded.
const TYPE_NAMES = {
	fruits: 'fruit',
	vegetables: 'vegetable'
};

dotenv.config();

const App = () => {
	// create the react component state we'll use to store our data
	const [items, setItems]:[PRODUCT_TYPE[], React.Dispatch<React.SetStateAction<PRODUCT_TYPE[]>>] = useState([] as PRODUCT_TYPE[]);
	const [newItem, setNewItem]:[PRODUCT_TYPE, React.Dispatch<React.SetStateAction<PRODUCT_TYPE>>] = useState({type:TYPE_NAMES.fruits, checked:false} as PRODUCT_TYPE);
	const [errorMessage, setErrorMessage]:[any, any] = useState(null);

	useEffect(() => {
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

	const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
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

	// Data being retrieved from server
	if (!items.length) {
		return <div>Loading...</div>;
	} else {
		return (
		<div>
			<Router>
				<div className='App'>
					<h1>Grocery List App</h1>
					<div>
						<Link to='/'>Selected Items</Link>
					</div>
					<div>
						<Link to={`/${TYPE_NAMES.fruits}`}>Fruits</Link>
					</div>
					<div>
						<Link to={`/${TYPE_NAMES.vegetables}`}>Vegetables</Link>
					</div>
				</div>
				<ErrorNotification message={errorMessage} />
				<Switch>
					<Route path={`/${TYPE_NAMES.fruits}`}>
						{/* {setNewItem(prev => ({
							...prev,
							type: TYPE_NAMES.fruits
						}))} */}
						<ItemsList
							newItem={newItem}
							setNewItem={setNewItem}
							items={items}
							type={TYPE_NAMES.fruits}
							handleCheckboxToggle={handleCheckboxToggle}
							handleInputChange={handleInputChange}
							handleInputSubmit={handleInputSubmit}
						/>
					</Route>
					<Route path={`/${TYPE_NAMES.vegetables}`}>
						<ItemsList
							newItem={newItem}
							setNewItem={setNewItem}
							items={items}
							type={TYPE_NAMES.vegetables}
							handleCheckboxToggle={handleCheckboxToggle}
							handleInputChange={handleInputChange}
							handleInputSubmit={handleInputSubmit}
						/>
					</Route>
					<Route path='/'>
						<SelectedItems
							items={items}
							handleCheckboxToggle={handleCheckboxToggle}
						/>
					</Route>
				</Switch>
			</Router>
			<Footer />
		</div>
		);
	}


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