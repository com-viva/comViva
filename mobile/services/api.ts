import axios from "axios";
import { obterToken } from "./tokenService";

export const api = axios.create({
    baseURL: "http://{SEU_IP}:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
    const token = await obterToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
