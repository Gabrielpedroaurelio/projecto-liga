import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, isAuthenticated, logoutRequest } from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        if (!isAuthenticated()) {
            setUser(null);
            setLoading(false);
            return null;
        }

        try {
            const result = await getMe();
            if (result && result.sucesso) {
                setUser(result.usuario);
            } else {
                // Se falhar ao buscar o usuário (token expidado, etc), faz logout
                logoutRequest();
                setUser(null);
            }
        } catch (error) {
            console.error("AuthContext refreshUser error:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = () => {
        logoutRequest();
        setUser(null);
    };

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    return (
        <AuthContext.Provider value={{ user, loading, refreshUser, logout, authenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
