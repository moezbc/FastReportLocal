import client from './client';

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
}

export interface LoginResponse {
    access: string;
    refresh: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
    const res = await client.post('/auth/login/', { username, password });
    return res.data;
};

export const register = async (data: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
}): Promise<User> => {
    const res = await client.post('/auth/register/', data);
    return res.data;
};

export const getCurrentUser = async (): Promise<User> => {
    const res = await client.get('/auth/me/');
    return res.data;
};
