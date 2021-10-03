import axios, { AxiosResponse } from 'axios';
import { PRODUCT_TYPE } from '../type-defs/typeDefs';
const BASE_URL: string =
	String(process.env.REACT_APP_API_HOST)
		.concat(String(process.env.REACT_APP_API_BASE))
		.concat('/users') ||
	'http://localhost:9999'
		.concat(String(process.env.REACT_APP_API_BASE))
		.concat('/users');

const getAll = () => {
	return axios.get(BASE_URL);
};

// This doesn't work correctly. Needs to be async/await maybe
// But not sure how to get string from Promise
const getCategoryList = () : string[] => {
	let categoryList:string[] = [];
	axios.get(BASE_URL).then( (response:AxiosResponse<any>) => {
		const {data} = response;
		console.log(JSON.stringify(response));
		categoryList = data.reduce( (list:string[], item:PRODUCT_TYPE) => {
			list.push(item.categoryMain);
			console.log('List:', list);
			return list;
		}, categoryList);
	});
	return categoryList;
};

const create = (newObject:PRODUCT_TYPE) => {
	return axios.post(BASE_URL, newObject);
};

const update = (id:string, newObject:PRODUCT_TYPE) => {
	return axios.put(`${BASE_URL}/${id}`, newObject);
};

const productsService = {
	getAll,             // = getAll: getAll,
	getCategoryList,
	create,
	update
};

export default productsService;
