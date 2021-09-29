import axios from 'axios';
import { USER_TYPE } from '../type-defs/typeDefs';
const BASE_URL: string =
	process.env.REACT_APP_BASE_URL+'/users' || 'api/v1/users';

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
