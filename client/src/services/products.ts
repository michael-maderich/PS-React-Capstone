import axios, { AxiosResponse } from 'axios';
import { CATEGORY_OBJECT, PRODUCT_TYPE } from '../type-defs/typeDefs';

const BASE_URL: string =
	String(process.env.REACT_APP_API_HOST)
		.concat(String(process.env.REACT_APP_API_BASE))
		.concat('/products') ||
	'http://localhost:9999'
		.concat(String(process.env.REACT_APP_API_BASE))
		.concat('/products');

const getAll = () => {
	return axios.get<PRODUCT_TYPE[]>(BASE_URL);
};

// This doesn't work correctly. Needs to be async/await maybe
// But not sure how to get string from Promise
const getCategoryList = ():Promise<AxiosResponse<CATEGORY_OBJECT>> => {
	let categoryList:CATEGORY_OBJECT = {};
//	const request:Promise<AxiosResponse<PRODUCT_TYPE[]>> = getAll();
	return new Promise( (resolve, reject) => {
		getAll().then(response => {
			const { data } = response;
			console.log(data);
			// const categoryList:string[] = data.reduce(	// Add unique subcategories to array
			// 	(list: string[], item: PRODUCT_TYPE) => !list.includes(item.categoryMain) ? list.concat(item.categoryMain) : list
			// , []);
			categoryList = data.reduce(	// Add categorie and subcategories to object
				(list: CATEGORY_OBJECT, item: PRODUCT_TYPE) => {
					// If it doesn't exist, add an empty string array to list with the key categoryMain
					if (!list.hasOwnProperty(item.categoryMain)) list[item.categoryMain] = [];
					if (!list[item.categoryMain].includes(item.categorySpecific))
						list[item.categoryMain].push(item.categorySpecific);	// Fill that string array with subcategories
					return list;
				}, {} as CATEGORY_OBJECT
			);
	//		const res:Promise<AxiosResponse<any>> = response.status(200).json(categoryList);
			// const res:AxiosResponse<CATEGORY_OBJECT>;
			// res.data = categoryList;
			// return new Promise<AxiosResponse<CATEGORY_OBJECT>>(categoryList);
			// setNavMenuItems(categoryList.sort()); // Set react hooks
			// setSubnavMenuItems(subCategoryList);
		})
		return new Promise(resolve => (categoryList));
	})
	//	return categoryList;
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
