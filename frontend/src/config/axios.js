import axios from "axios";

function createAxiosInstance(baseURL, withCredentials = false) {
	return axios.create({
		baseURL,
		withCredentials
	});
}

// Create Axios instances
const users = createAxiosInstance("http://localhost:7100", true);
const posts = createAxiosInstance("http://localhost:7000",true);
const notifications = createAxiosInstance("http://localhost:9000");
const messaging = createAxiosInstance("http://localhost:8000");
const admin = createAxiosInstance("http://localhost:7300", true);

// Function to get the token from the cookie
const getUserToken = () => {
	return document.cookie.replace(/(?:(?:^|.*;\s*)userJwt\s*=\s*([^;]*).*$)|^.*$/, "$1");
};
const getAdminToken = () => {
	return document.cookie.replace(/(?:(?:^|.*;\s*)adminJwt\s*=\s*([^;]*).*$)|^.*$/, "$1");
};
// Axios interceptor to attach the token to requests
const attachUserTokenInterceptor = (axiosInstance) => {
	axiosInstance.interceptors.request.use((config) => {
		const token = getUserToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	});
};

const attachAdminTokenInterceptor = (axiosInstance) => {
	axiosInstance.interceptors.request.use((config) => {
		const token = getAdminToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	});
};

// Attach the token interceptor to each Axios instance
[users, posts, notifications, messaging].forEach((axiosInstance) => {
	attachUserTokenInterceptor(axiosInstance);
});

attachAdminTokenInterceptor(admin);

export { users, posts, notifications, messaging, admin };
