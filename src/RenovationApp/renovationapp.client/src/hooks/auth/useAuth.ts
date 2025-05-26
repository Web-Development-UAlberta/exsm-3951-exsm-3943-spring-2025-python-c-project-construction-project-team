import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../config/authConfig';
import { AccountInfo } from '@azure/msal-browser';
import { getActiveUserInfo } from '../../api/identity/graph';

export interface AuthHookReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  user: AccountInfo | null;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => void;
}
export const useAuth = (): AuthHookReturn => {
  const { instance } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<AccountInfo | null>(null);

  const { data: userInfo } = getActiveUserInfo(instance);

  useEffect(() => {
    const handleRedirectPromise = async () => {
      try {
        await instance.handleRedirectPromise();
        const authStatus = checkAuth();
        setIsAuthenticated(authStatus);
        if (authStatus) {
          const account = instance.getAllAccounts()[0];
          setUser(account);
        }
      } catch (error) {
        setError(error as Error);
        console.error('Error handling redirect:', error);
      } finally {
        setIsLoading(false);
      }
    };

    handleRedirectPromise();
  }, [instance]);

  useEffect(() => {
    if (userInfo && isAuthenticated) {
      const fullName = userInfo.givenName + ' ' + userInfo.surname;
      setUser(currentUser => {
        if (!currentUser) return null;
        return {
          ...currentUser,
          name: fullName,
        };
      });
    }
  }, [userInfo, isAuthenticated]);

  const checkAuth = (): boolean => {
    const accounts = instance.getAllAccounts();
    return accounts.length > 0;
  };

  const login = () => {
    instance.loginRedirect(loginRequest)
      .catch(error => {
        setError(error);
        console.error('Login error:', error);
      });
  }

  const logout = async (): Promise<void> => {
    try {
      await instance.logoutRedirect({
        onRedirectNavigate: () => false
      });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      setError(error as Error);
      console.error('Logout error:', error);
    }
  };

  return { isAuthenticated, isLoading, error, user, login, logout, checkAuth };
};