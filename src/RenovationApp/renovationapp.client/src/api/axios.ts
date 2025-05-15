import axios, { AxiosInstance } from 'axios';
import { IPublicClientApplication } from "@azure/msal-browser";

// Use Vite environment variables
const apiEndpoint = import.meta.env.VITE_BACKEND_API_URL as string;
const apiScopes = (import.meta.env.VITE_BACKEND_API_SCOPE as string)?.split(',').map(s => s.trim()).filter(Boolean);

export const apiClient = (msalInstance: IPublicClientApplication): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: apiEndpoint,
    headers: {},
    transitional: {}
  });

  // Add a request interceptor to handle authentication
  axiosInstance.interceptors.request.use(async (config) => {
    try {
      // Get active account (the currently signed in user)
      const activeAccount = msalInstance.getActiveAccount()
      
      if (!activeAccount) {
        throw new Error('No active account! Please sign in before making API calls.');
      }

      // Attempt to acquire token silently
      const response = await msalInstance.acquireTokenSilent({
        scopes: apiScopes,
        account: activeAccount
      });
      
      // Add the token to the Authorization header
      config.headers.Authorization = `Bearer ${response.accessToken}`;
      
      return config;
    } catch (error) {
        try{
            // Attempt to acquire token interactively if silent acquisition fails
            const response = await msalInstance.acquireTokenPopup({
                scopes: apiScopes,
                loginHint: msalInstance.getAllAccounts()[0].username // Use the first account's username for login hint
            });
            
            // Add the token to the Authorization header
            config.headers.Authorization = `Bearer ${response.accessToken}`;
            
            return config;
        }
        catch (popupError) {
            // Handle the error if both silent and interactive token acquisition fail
            console.error("Error acquiring token interactively:", popupError);
            throw new Error('Failed to acquire token. Please sign in again.');
        }
    }
  });
  return axiosInstance;
};

// Export a default function that creates the client
export default apiClient;

export const graphClient = (msalInstance: IPublicClientApplication): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: "https://graph.microsoft.com/v1.0",
    headers: {},
    transitional: {}
  });

  // Add a request interceptor to handle authentication
  axiosInstance.interceptors.request.use(async (config) => {
    try {
      // Get active account (the currently signed in user)
      const activeAccount = msalInstance.getActiveAccount()
      
      if (!activeAccount) {
        throw new Error('No active account! Please sign in before making API calls.');
      }

      // Attempt to acquire token silently
      const response = await msalInstance.acquireTokenSilent({
        scopes: ['user.read'],
        account: activeAccount
      });
      
      // Add the token to the Authorization header
      config.headers.Authorization = `Bearer ${response.accessToken}`;
      
      return config;
    } catch (error) {
        try{
            // Attempt to acquire token interactively if silent acquisition fails
            const response = await msalInstance.acquireTokenPopup({
                scopes: apiScopes,
                loginHint: msalInstance.getAllAccounts()[0].username // Use the first account's username for login hint
            });
            
            // Add the token to the Authorization header
            config.headers.Authorization = `Bearer ${response.accessToken}`;
            
            return config;
        }
        catch (popupError) {
            // Handle the error if both silent and interactive token acquisition fail
            console.error("Error acquiring token interactively:", popupError);
            throw new Error('Failed to acquire token. Please sign in again.');
        }
    }
  });
  return axiosInstance;
};
