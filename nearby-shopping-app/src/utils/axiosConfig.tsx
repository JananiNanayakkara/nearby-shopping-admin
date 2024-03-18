import axios from 'axios';

const getAxios = (token: string) => {
	axios.interceptors.request.use(
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

	axios.defaults.baseURL = 'https://nearby-shopping-be-express.fly.dev';
	return axios;
};

export default getAxios;
