import axios from 'axios';
import { PRODUCT_TYPE } from '../type-defs/typeDefs';
const BASE_URL:string = process.env.REACT_APP_BASE_URL || /*'http://localhost:9999*/'/api/v1/grocery-items';

const getAll = () => {
	return axios.get(BASE_URL);
};

const create = (newObject:PRODUCT_TYPE) => {
	return axios.post(BASE_URL, newObject);
};

const update = (id:string, newObject:PRODUCT_TYPE) => {
	return axios.put(`${BASE_URL}/${id}`, newObject);
};

const groceriesService = {
	getAll,             // = getAll: getAll,
	create,
	update
};

export default groceriesService;
