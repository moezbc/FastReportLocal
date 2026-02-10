import api from './client';

// ─── Types ─────────────────────────────────────────
export interface Report {
    id: number;
    name: string;
    description: string;
    sql_query?: string;
    datasource: number | null;
    datasource_name: string | null;
    owner: number;
    owner_username: string;
    visibility: 'private' | 'public';
    output_types: string[];
    routing_modes: string[];
    csv_separator: string;
    parameters?: ReportParameter[];
    permissions?: ReportPermission[];
    created_at: string;
    updated_at: string;
}

export interface ReportParameter {
    id?: number;
    name: string;
    label: string;
    param_type: string;
    operators: string[];
    default_value: string;
    required: boolean;
    order: number;
    enum_values: string[];
}

export interface ReportPermission {
    id: number;
    user: number | null;
    user_username: string | null;
    group: number | null;
    group_name: string | null;
    can_execute: boolean;
    can_modify: boolean;
}

export interface ReportExecution {
    id: number;
    report: number;
    report_name: string;
    user: number;
    user_username: string;
    parameters: Record<string, any>;
    output_type: string;
    routing_mode: string;
    routing_config: Record<string, any>;
    status: 'pending' | 'running' | 'success' | 'failed';
    started_at: string;
    completed_at: string | null;
    error_message: string;
}

// ─── API Calls ─────────────────────────────────────
export const fetchReports = () => api.get<Report[]>('/reports/');
export const fetchReport = (id: number) => api.get<Report>(`/reports/${id}/`);
export const createReport = (data: Partial<Report>) => api.post<Report>('/reports/', data);
export const updateReport = (id: number, data: Partial<Report>) => api.put<Report>(`/reports/${id}/`, data);
export const deleteReport = (id: number) => api.delete(`/reports/${id}/`);

export const testQuery = (id: number) =>
    api.post<{ columns: string[]; rows: any[]; row_count: number; truncated: boolean }>(
        `/reports/${id}/test-query/`
    );

export const fetchExecutions = () => api.get<ReportExecution[]>('/report-launcher/executions/');
