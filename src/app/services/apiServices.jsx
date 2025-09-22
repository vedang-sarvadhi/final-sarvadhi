import axios from "axios";

const baseURL = (
  import.meta.env.VITE_API_URL ??
  (typeof window !== "undefined" ? window.location.origin : "")
).replace(/\/+$/, ""); // strip trailing slashes

const api = axios.create({
  baseURL: baseURL,
});

const normalizeEndpoint = (endpoint) =>
  endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

const apiService = {
  get: (endpoint) => api.get(normalizeEndpoint(endpoint)).then((res) => res.data),
  post: (endpoint, data) => api.post(normalizeEndpoint(endpoint), data).then((res) => res.data),
  put: (endpoint, data) => api.put(normalizeEndpoint(endpoint), data).then((res) => res.data),
  delete: (endpoint) => api.delete(normalizeEndpoint(endpoint)).then((res) => res.data),
};

export default apiService;
