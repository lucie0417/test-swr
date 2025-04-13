import axios from "axios";

const apiClient = axios.create({
	baseURL: 'https://jsonplaceholder.typicode.com',
	timeout: 10000, // 毫秒
	headers: {
		'Content-Type': 'application/app',
	},
});

// 請求
apiClient.interceptors.request.use(function (config) {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
},
	function (error) {
		console.error('Request error:', error);
		return Promise.reject(error);
	});

// 回應
apiClient.interceptors.response.use(function (response) {
	if (response.status === 200 || response.status === 201) {
		return response.data;
	} else if (response.status === 204) {
		return '暫無資料';
	}
	return Promise.reject(new Error('非預期錯誤'));
}, function (error) {
	const status = error.reponse?.status;

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