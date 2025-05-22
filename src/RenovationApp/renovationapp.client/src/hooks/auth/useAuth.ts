import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';

export interface AuthHookReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  user: any | null;
  login: () => void;
  checkAuth: () => void;
}
export const useAuth = () => {
  const { instance } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<any | null>(null);

  const checkAuth = () => {
    const accounts = instance.getAllAccounts();
    return accounts.length > 0;
  };

  const login = () => {
    instance.loginRedirect()
      .catch(error => {
        setError(error);
        console.error('Login error:', error);
      });
  }

  useEffect(() => {
    setIsLoading(true);
    try {
      const authStatus = checkAuth();
      setIsAuthenticated(authStatus);
      if (authStatus) {
        setUser(instance.getAllAccounts()[0]);
      }
    } catch (error) {
      setError(error as Error);
      console.error('Error checking authentication:', error);
    } finally {
      setIsLoading(false);
    }
  }, [instance]);

  return { isAuthenticated, isLoading, error, user, login, checkAuth };
};