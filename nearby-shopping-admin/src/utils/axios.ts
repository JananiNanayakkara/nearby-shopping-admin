import axios from 'axios';
import { API_URL } from './constants';
import { cookies } from 'next/headers';

const getAxios = () => {
	const _axios = axios.create({
		baseURL: API_URL,
	});

	const token = cookies().get('token');
	_axios.interceptors.request.use(
		(config) => {
			if (config.headers) {
				config.headers['Content-Type'] = 'application/json';
				config.headers['Authorization'] = `Bearer ${token}`;
			}
			return config;
		},
		(error) => {
			console.log('🚀 ~ getAxios ~ error:', JSON.stringify(error));
			return Promise.reject(error);
		}
	);

	return _axios;
};

export default getAxios;
