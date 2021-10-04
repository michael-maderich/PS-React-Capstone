import axios from 'axios';
const LOGIN_URL: string =
	String(process.env.REACT_APP_API_HOST)
//		.concat(String(process.env.REACT_APP_API_BASE))
		.concat('/api/login') ||
	'http://localhost:9999'
//		.concat(String(process.env.REACT_APP_API_BASE))
		.concat('/api/login');

// code for these HTTP method calls is in /server/src/controllers/users.ts
const submitCredentials = (login: {username:string,password:string}) => {
	return axios.post(LOGIN_URL, login);
};

const loginService = {
	submitCredentials
};

export default loginService;
