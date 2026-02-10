import api from './client';

// ─── Types ─────────────────────────────────────────
export interface DataSource {
    id: number;
    name: string;
    db_type: 'postgresql' | 'mysql' | 'oracle' | 'sqlserver';
    host: string;
    port: number;
    database_name: string;
    username: string;
    password?: string;
    password_set?: boolean;
    options: Record<string, any>;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface SmtpConfig {
    id: number;
    name: string;
    host: string;
    port: number;
    username: string;
    password?: string;
    password_set?: boolean;
    use_tls: boolean;
    from_email: string;
    is_default: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface FtpConfig {
    id: number;
    name: string;
    protocol: 'ftp' | 'sftp';
    host: string;
    port: number;
    username: string;
    password?: string;
    password_set?: boolean;
    remote_path: string;
    is_default: boolean;
    created_at?: string;
    updated_at?: string;
}

// ─── DataSource API ────────────────────────────────
export const fetchDataSources = () => api.get<DataSource[]>('/settings/datasources/');
export const fetchActiveDataSources = () => api.get<DataSource[]>('/settings/datasources/active/');
export const fetchDataSource = (id: number) => api.get<DataSource>(`/settings/datasources/${id}/`);
export const createDataSource = (data: Partial<DataSource>) => api.post<DataSource>('/settings/datasources/', data);
export const updateDataSource = (id: number, data: Partial<DataSource>) => api.patch<DataSource>(`/settings/datasources/${id}/`, data);
export const deleteDataSource = (id: number) => api.delete(`/settings/datasources/${id}/`);
export const testDataSourceConnection = (id: number) =>
    api.post<{ success: boolean; message: string }>(`/settings/datasources/${id}/test-connection/`);

// ─── SMTP API ──────────────────────────────────────
export const fetchSmtpConfigs = () => api.get<SmtpConfig[]>('/settings/smtp/');
export const fetchSmtpConfig = (id: number) => api.get<SmtpConfig>(`/settings/smtp/${id}/`);
export const createSmtpConfig = (data: Partial<SmtpConfig>) => api.post<SmtpConfig>('/settings/smtp/', data);
export const updateSmtpConfig = (id: number, data: Partial<SmtpConfig>) => api.patch<SmtpConfig>(`/settings/smtp/${id}/`, data);
export const deleteSmtpConfig = (id: number) => api.delete(`/settings/smtp/${id}/`);
export const testSmtpConnection = (id: number) =>
    api.post<{ success: boolean; message: string }>(`/settings/smtp/${id}/test-connection/`);

// ─── FTP API ───────────────────────────────────────
export const fetchFtpConfigs = () => api.get<FtpConfig[]>('/settings/ftp/');
export const fetchFtpConfig = (id: number) => api.get<FtpConfig>(`/settings/ftp/${id}/`);
export const createFtpConfig = (data: Partial<FtpConfig>) => api.post<FtpConfig>('/settings/ftp/', data);
export const updateFtpConfig = (id: number, data: Partial<FtpConfig>) => api.patch<FtpConfig>(`/settings/ftp/${id}/`, data);
export const deleteFtpConfig = (id: number) => api.delete(`/settings/ftp/${id}/`);
