import axios from "axios";
import API_URL from "./config";

const api = axios.create({
    baseURL: API_URL,
    // Optional: send cookies/auth headers if needed
    // withCredentials: true
});

export default api;