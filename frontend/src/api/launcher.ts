import client from './client';

export interface ReportParameter {
    id: number;
    name: string;
    label: string;
    param_type: 'string' | 'number' | 'date' | 'datetime' | 'enum' | 'boolean';
    operators: string[];
    default_value: string;
    required: boolean;
    order: number;
    enum_values: string[];
}

export interface ReportListItem {
    id: number;
    name: string;
    description: string;
    owner_username: string;
    visibility: 'private' | 'public';
    output_types: string[];
    routing_modes: string[];
    parameter_count: number;
    updated_at: string;
}

export interface ReportDetail {
    id: number;
    name: string;
    description: string;
    owner_username: string;
    visibility: 'private' | 'public';
    output_types: string[];
    routing_modes: string[];
    csv_separator: string;
    parameters: ReportParameter[];
    updated_at: string;
}

export interface RunImmediatePayload {
    parameters: Record<string, { operator: string; value: string }>;
    output_type: string;
    routing_mode: string;
    routing_config?: Record<string, unknown>;
}

export interface RunDeferredPayload {
    parameters: Record<string, { operator: string; value: string }>;
    output_type: string;
    routing_mode: string;
    routing_config?: Record<string, unknown>;
    schedule_type: 'once' | 'recurring';
    scheduled_at?: string;
    cron_expression?: string;
    timezone?: string;
}

export interface ExecutionResult {
    id: number;
    report: number;
    report_name: string;
    status: string;
    output_type: string;
    routing_mode: string;
    started_at: string;
    completed_at: string | null;
    error_message: string;
}

export interface ScheduleResult {
    id: number;
    report: number;
    report_name: string;
    schedule_type: string;
    scheduled_at: string | null;
    cron_expression: string;
    timezone: string;
    is_active: boolean;
    output_type: string;
    routing_mode: string;
    created_at: string;
}

export const getExecutableReports = async (): Promise<ReportListItem[]> => {
    const res = await client.get('/report-launcher/reports/');
    return res.data;
};

export const getReportDetail = async (id: number): Promise<ReportDetail> => {
    const res = await client.get(`/report-launcher/reports/${id}/`);
    return res.data;
};

export const runImmediate = async (id: number, data: RunImmediatePayload): Promise<Blob | ExecutionResult> => {
    const res = await client.post(`/report-launcher/reports/${id}/run-immediate/`, data, {
        responseType: data.routing_mode === 'screen' ? 'blob' : 'json',
    });

    if (data.routing_mode === 'screen') {
        // Trigger file download
        const contentDisposition = res.headers['content-disposition'] || '';
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        const filename = filenameMatch ? filenameMatch[1] : `report.${data.output_type.toLowerCase()}`;

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return res.data;
    }

    return res.data;
};

export const runDeferred = async (id: number, data: RunDeferredPayload): Promise<ScheduleResult> => {
    const res = await client.post(`/report-launcher/reports/${id}/run-deferred/`, data);
    return res.data;
};
