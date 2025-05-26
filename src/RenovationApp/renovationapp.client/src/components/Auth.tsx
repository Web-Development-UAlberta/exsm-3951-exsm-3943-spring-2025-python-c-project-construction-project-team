import React from 'react';
import { useAuth } from '../hooks/auth/useAuth';
import { Button } from './ButtonComponent/Button';

interface AuthComponentProps {
    children: React.ReactNode;
}

const AuthComponent: React.FC<AuthComponentProps> = ({ children }) => {
    const { isAuthenticated, isLoading, login } = useAuth();

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-50">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="container mt-5 text-center">
                <div className="card p-5 shadow-sm">
                    <h2>Authentication Required</h2>
                    <p className="text-muted mb-4">Please sign in to access this page</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Button
                            className="btn btn-primary"
                            onClick={login}
                        >
                            Sign In
                        </Button>
                        <Button
                            className="btn btn-secondary"
                            onClick={() => window.location.href = '/'}
                        >
                            Return to Home
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthComponent;