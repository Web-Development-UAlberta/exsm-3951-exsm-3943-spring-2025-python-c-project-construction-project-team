import axios, { AxiosInstance } from 'axios';

// Use Vite environment variables
const apiEndpoint = import.meta.env.VITE_BACKEND_API_URL as string;

// Create a public client without authentication requirements
export const publicApiClient = (): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: apiEndpoint,
    headers: { 'accept': '*/*' },
    transitional: {}
  });
  
  return axiosInstance;
};

export default publicApiClient;