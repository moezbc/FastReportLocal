import React from 'react';
import { ReportParameter } from '../../api/launcher';

interface ParameterFormProps {
    parameters: ReportParameter[];
    values: Record<string, { operator: string; value: string; value2?: string }>;
    onChange: (name: string, field: 'operator' | 'value' | 'value2', val: string) => void;
}

const ParameterForm: React.FC<ParameterFormProps> = ({ parameters, values, onChange }) => {
    if (parameters.length === 0) {
        return (
            <div className="text-center py-6 text-surface-500 text-sm">
                Ce rapport n'a pas de paramètres.
            </div>
        );
    }

    const renderInput = (param: ReportParameter) => {
        const val = values[param.name] || { operator: param.operators[0] || '=', value: param.default_value || '' };
        const operator = val.operator;
        const isBetween = operator === 'BETWEEN';
        const isIn = operator === 'IN';
        const isNull = operator === 'IS NULL' || operator === 'IS NOT NULL';

        return (
            <div key={param.id} className="animate-fade-in">
                <div className="flex items-center gap-2 mb-1.5">
                    <label className="label-text mb-0">
                        {param.label}
                        {param.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-700/50 text-surface-500 font-mono">
                        {param.param_type}
                    </span>
                </div>

                <div className="flex gap-2">
                    {/* Operator selector */}
                    {param.operators.length > 1 && (
                        <select
                            value={operator}
                            onChange={(e) => onChange(param.name, 'operator', e.target.value)}
                            className="select-field w-32 flex-shrink-0 text-sm"
                        >
                            {param.operators.map((op) => (
                                <option key={op} value={op}>{op}</option>
                            ))}
                        </select>
                    )}

                    {/* Value input(s) */}
                    {!isNull && (
                        <div className="flex-1 flex gap-2">
                            {param.param_type === 'enum' ? (
                                <select
                                    value={val.value}
                                    onChange={(e) => onChange(param.name, 'value', e.target.value)}
                                    className="select-field"
                                >
                                    <option value="">— Sélectionner —</option>
                                    {param.enum_values.map((ev) => (
                                        <option key={ev} value={ev}>{ev}</option>
                                    ))}
                                </select>
                            ) : param.param_type === 'boolean' ? (
                                <select
                                    value={val.value}
                                    onChange={(e) => onChange(param.name, 'value', e.target.value)}
                                    className="select-field"
                                >
                                    <option value="">— Sélectionner —</option>
                                    <option value="true">Vrai</option>
                                    <option value="false">Faux</option>
                                </select>
                            ) : (
                                <>
                                    <input
                                        type={param.param_type === 'date' ? 'date' : param.param_type === 'datetime' ? 'datetime-local' : param.param_type === 'number' ? 'number' : 'text'}
                                        value={val.value}
                                        onChange={(e) => onChange(param.name, 'value', e.target.value)}
                                        placeholder={isIn ? 'val1, val2, val3...' : isBetween ? 'Valeur min' : `Valeur${param.required ? ' (requis)' : ''}`}
                                        className="input-field flex-1"
                                    />
                                    {isBetween && (
                                        <input
                                            type={param.param_type === 'date' ? 'date' : param.param_type === 'datetime' ? 'datetime-local' : param.param_type === 'number' ? 'number' : 'text'}
                                            value={val.value2 || ''}
                                            onChange={(e) => onChange(param.name, 'value2', e.target.value)}
                                            placeholder="Valeur max"
                                            className="input-field flex-1"
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {parameters.map(renderInput)}
        </div>
    );
};

export default ParameterForm;
