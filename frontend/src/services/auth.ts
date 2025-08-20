import api from "./api";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";


export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/auth/register', userData);
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Error al registrar usuario');
    }
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
    try {
        const loginData: LoginRequest = { username, password };
        const response = await api.post<AuthResponse>('/auth/login', loginData);
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Error al Iniciar Sesión');
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};