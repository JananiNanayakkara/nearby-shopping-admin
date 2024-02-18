import axios from 'axios';
import { API_URL } from './constants';

const setupAxios = (token) => {
	// Add a request interceptor
	axios.interceptors.request.use(
		function (config) {
			// Modify config, add headers, etc.
			config.headers.Authorization = `Bearer ${token}`;
			return config;
		},
		function (error) {
			// Handle request error
			return Promise.reject(error);
		}
	);

	axios.defaults.baseURL = API_URL;
	return axios;
};

export default setupAxios;
