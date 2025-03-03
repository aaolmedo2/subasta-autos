import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const updateUserAndRoles = () => {
        try {
            const userRoles = authService.getCurrentUserRoles();
            console.log('Updated user roles:', userRoles);

            if (userRoles && userRoles.length > 0) {
                setRoles(userRoles);
                setUser({ roles: userRoles });
                console.log('User and roles updated:', { roles: userRoles });
            } else {
                console.log('No roles found, clearing user state');
                setRoles([]);
                setUser(null);
            }
        } catch (error) {
            console.error('Error updating user and roles:', error);
        }
    };

    useEffect(() => {
        console.log('AuthProvider mounted, checking for existing token');
        updateUserAndRoles();
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            console.log('Login attempt with credentials:', credentials);
            const response = await authService.login(credentials);
            console.log('Login successful, updating user state');

            // Pequeño retraso para asegurar que el token se guarde antes de actualizar el estado
            setTimeout(() => {
                updateUserAndRoles();
            }, 100);

            return response;
        } catch (error) {
            console.error('Login failed in context:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            console.log('Register attempt with data:', userData);
            const response = await authService.register(userData);
            console.log('Register successful');
            return response;
        } catch (error) {
            console.error('Register failed:', error);
            throw error;
        }
    };

    const logout = () => {
        console.log('Logging out, clearing user state');
        authService.logout();
        setUser(null);
        setRoles([]);
    };

    const hasRole = (role) => {
        return authService.hasRole(role);
    };

    const hasAnyRole = (rolesToCheck) => {
        return authService.hasAnyRole(rolesToCheck);
    };

    const value = {
        user,
        roles,
        login,
        logout,
        register,
        loading,
        hasRole,
        hasAnyRole
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext; 