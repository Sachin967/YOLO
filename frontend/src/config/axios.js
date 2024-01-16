import axios from "axios";
import {
	ADMIN_SERVICE,
	MAPBOX,
	MESSAGE_SERVICE,
	NOTIFICATION_SERVICE,
	POST_SERVICE,
	USER_SERVICE
} from "../constants/constant.js";

function createAxiosInstance(baseURL, withCredentials = false) {
	return axios.create({
		baseURL,
		withCredentials
	});
}

const users = createAxiosInstance(USER_SERVICE, true);
const posts = createAxiosInstance(POST_SERVICE, true);
const notifications = createAxiosInstance(NOTIFICATION_SERVICE);
const messaging = createAxiosInstance(MESSAGE_SERVICE);
const admin = createAxiosInstance(ADMIN_SERVICE, true);
const mapbox = createAxiosInstance(MAPBOX);
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

[users, posts, notifications, messaging].forEach((axiosInstance) => {
	attachUserTokenInterceptor(axiosInstance);
});

attachAdminTokenInterceptor(admin);

export { users, posts, notifications, messaging, admin, mapbox };
