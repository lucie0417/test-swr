import axios from "axios";

const apiClient = axios.create({
	baseURL: 'https://reqres.in',
	timeout: 10000, // 毫秒
	headers: {
		'Content-Type': 'application/json',
		'x-api-key': 'reqres-free-v1'
	},
});

// 請求
apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		console.error('Request error:', error);
		return Promise.reject(error);
	});

// 回應
apiClient.interceptors.response.use(
	(response) => {
		if (response.status === 200 || response.status === 201) {
			return response.data;
		} else if (response.status === 204) {
			return '暫無資料';
		}
		return Promise.reject(new Error('非預期錯誤'));
	},
	(error) => {
		const status = error.response?.status;

		switch (status) {
			case 400:
				console.warn('Bad Request');
				break;
			case 401:
				console.warn('Unauthorized');
				break;
			case 403:
				console.warn('Forbidden');
				break;
			default:
				console.error('非預期錯誤');
				break;
		}
		return Promise.reject(error);
	});

export default apiClient;