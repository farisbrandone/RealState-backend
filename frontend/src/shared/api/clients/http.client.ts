import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import * as qs from "qs"; // 1. Importe qs

export const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3002/api/v1";

const httpClient: AxiosInstance = axios.create({
  baseURL: API_GATEWAY_URL,
  timeout: 10000,
  // 2. Ajoute ce sérialiseur personnalisé ici :
  paramsSerializer: {
    serialize: (params) =>
      qs.stringify(params, { arrayFormat: "brackets", allowDots: true }),
  },
});

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  },
);

httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        console.log({ refreshToken });
        if (!refreshToken) throw new Error("No refresh token");
        const { data } = await axios.post(`${API_GATEWAY_URL}/auth/refresh`, {
          refreshToken,
        });
        console.log({ data });
        useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }
        return httpClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    console.log(error);
    return Promise.reject(error);
  },
);

export default httpClient;
