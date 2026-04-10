import client from './client';

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    password?: string;
    group_ids?: number[];
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

export interface Group {
    id: number;
    name: string;
}

// User CRUD
export const fetchUsers = () => client.get<User[]>('/auth/users/');
export const fetchUser = (id: number) => client.get<User>(`/auth/users/${id}/`);
export const createUser = (data: any) => client.post<User>('/auth/users/', data);
export const updateUser = (id: number, data: any) => client.put<User>(`/auth/users/${id}/`, data);
export const deleteUser = (id: number) => client.delete(`/auth/users/${id}/`);

// Group CRUD
export const fetchGroups = () => client.get<Group[]>('/auth/groups/');
export const fetchGroup = (id: number) => client.get<Group>(`/auth/groups/${id}/`);
export const createGroup = (data: any) => client.post<Group>('/auth/groups/', data);
export const updateGroup = (id: number, data: any) => client.put<Group>(`/auth/groups/${id}/`, data);
export const deleteGroup = (id: number) => client.delete(`/auth/groups/${id}/`);
