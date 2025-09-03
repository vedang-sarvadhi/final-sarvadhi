import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:4000",
});

const apiService = {
	get: (endpoint) => api.get(endpoint).then((res) => res.data),
	post: (endpoint, data) => api.post(endpoint, data).then((res) => res.data),
	put: (endpoint, data) => api.put(endpoint, data).then((res) => res.data),
	delete: (endpoint) => api.delete(endpoint).then((res) => res.data),
};

export default apiService;
