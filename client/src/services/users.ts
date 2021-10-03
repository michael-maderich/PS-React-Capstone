import axios from 'axios';
import { USER_TYPE } from '../type-defs/typeDefs';
// const URL = String(process.env.REACT_APP_BASE_URL);
// const API_PATH = String(process.env.REACT_APP_API_BASE);
const BASE_URL: string =
	String(process.env.REACT_APP_API_HOST).concat(String(process.env.REACT_APP_API_BASE)).concat('/users')
	|| 'http://localhost:9999'.concat(String(process.env.REACT_APP_API_BASE)).concat('/users');

// code for these HTTP method calls is in /server/src/controllers/users.ts
const getAll = () => {
	return axios.get(BASE_URL);
};

const create = (newObject: USER_TYPE) => {
	return axios.post(BASE_URL, newObject);
};

const update = (id: string, newObject: USER_TYPE) => {
	return axios.put(`${BASE_URL}/${id}`, newObject);
};

const del = (id: string) => {
	return axios.delete(`${BASE_URL}/${id}`);
}

const usersService = {
	getAll, // = getAll: getAll,
	create,
	update,
	del
};

export default usersService;
