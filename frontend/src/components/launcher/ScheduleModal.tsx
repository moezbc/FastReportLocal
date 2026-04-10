import React, { useState } from 'react';
import { HiOutlineXMark, HiOutlineCalendarDays, HiOutlineClock } from 'react-icons/hi2';

interface ScheduleModalProps {
    reportName: string;
    onConfirm: (data: {
        schedule_type: 'once' | 'recurring';
        scheduled_at?: string;
        cron_expression?: string;
        timezone: string;
    }) => void;
    onClose: () => void;
}

const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

const ScheduleModal: React.FC<ScheduleModalProps> = ({ reportName, onConfirm, onClose }) => {
    const [scheduleType, setScheduleType] = useState<'once' | 'recurring'>('once');
    const [scheduledAt, setScheduledAt] = useState('');
    const [recurrence, setRecurrence] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
    const [cronHour, setCronHour] = useState('08');
    const [cronMinute, setCronMinute] = useState('00');
    const [cronDayOfWeek, setCronDayOfWeek] = useState('1');
    const [cronDayOfMonth, setCronDayOfMonth] = useState('1');
    const [customCron, setCustomCron] = useState('0 8 * * *');

    const buildCron = (): string => {
        if (recurrence === 'custom') return customCron;
        if (recurrence === 'daily') return `${cronMinute} ${cronHour} * * *`;
        if (recurrence === 'weekly') return `${cronMinute} ${cronHour} * * ${cronDayOfWeek}`;
        if (recurrence === 'monthly') return `${cronMinute} ${cronHour} ${cronDayOfMonth} * *`;
        return '0 8 * * *';
    };

    const handleSubmit = () => {
        if (scheduleType === 'once') {
            if (!scheduledAt) return;
            onConfirm({
                schedule_type: 'once',
                scheduled_at: new Date(scheduledAt).toISOString(),
                timezone: TIMEZONE,
            });
        } else {
            onConfirm({
                schedule_type: 'recurring',
                cron_expression: buildCron(),
                timezone: TIMEZONE,
            });
        }
    };

    const daysOfWeek = [
        { value: '1', label: 'Lundi' },
        { value: '2', label: 'Mardi' },
        { value: '3', label: 'Mercredi' },
        { value: '4', label: 'Jeudi' },
        { value: '5', label: 'Vendredi' },
        { value: '6', label: 'Samedi' },
        { value: '0', label: 'Dimanche' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative glass-card w-full max-w-lg p-6 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-600/20 flex items-center justify-center">
                            <HiOutlineCalendarDays className="w-5 h-5 text-accent-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Planifier l'exécution</h2>
                            <p className="text-xs text-surface-500">{reportName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-surface-500 hover:text-surface-900 dark:hover:text-white rounded-lg hover:bg-surface-700/50 transition-all">
                        <HiOutlineXMark className="w-5 h-5" />
                    </button>
                </div>

                {/* Schedule type toggle */}
                <div className="flex gap-2 mb-6">
                    <button
                        type="button"
                        onClick={() => setScheduleType('once')}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${scheduleType === 'once'
                                ? 'bg-accent-600/20 text-accent-300 border border-accent-500/30'
                                : 'bg-surface-800/50 text-surface-400 border border-surface-700/50 hover:text-surface-200'
                            }`}
                    >
                        Une seule fois
                    </button>
                    <button
                        type="button"
                        onClick={() => setScheduleType('recurring')}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${scheduleType === 'recurring'
                                ? 'bg-accent-600/20 text-accent-300 border border-accent-500/30'
                                : 'bg-surface-800/50 text-surface-400 border border-surface-700/50 hover:text-surface-200'
                            }`}
                    >
                        Récurrent
                    </button>
                </div>

                {/* One-time schedule */}
                {scheduleType === 'once' && (
                    <div className="animate-fade-in space-y-4">
                        <div>
                            <label className="label-text">Date et heure d'exécution</label>
                            <input
                                type="datetime-local"
                                value={scheduledAt}
                                onChange={(e) => setScheduledAt(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-surface-500">
                            <HiOutlineClock className="w-4 h-4" />
                            <span>Fuseau horaire : {TIMEZONE}</span>
                        </div>
                    </div>
                )}

                {/* Recurring schedule */}
                {scheduleType === 'recurring' && (
                    <div className="animate-fade-in space-y-4">
                        <div>
                            <label className="label-text">Récurrence</label>
                            <div className="flex flex-wrap gap-2">
                                {(['daily', 'weekly', 'monthly', 'custom'] as const).map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRecurrence(r)}
                                        className={recurrence === r ? 'pill-active' : 'pill'}
                                    >
                                        {r === 'daily' ? 'Quotidien' : r === 'weekly' ? 'Hebdo' : r === 'monthly' ? 'Mensuel' : 'Personnalisé'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {recurrence !== 'custom' && (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="label-text">Heure</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="23"
                                        value={cronHour}
                                        onChange={(e) => setCronHour(e.target.value.padStart(2, '0'))}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="label-text">Minute</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="59"
                                        value={cronMinute}
                                        onChange={(e) => setCronMinute(e.target.value.padStart(2, '0'))}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        )}

                        {recurrence === 'weekly' && (
                            <div>
                                <label className="label-text">Jour de la semaine</label>
                                <select
                                    value={cronDayOfWeek}
                                    onChange={(e) => setCronDayOfWeek(e.target.value)}
                                    className="select-field"
                                >
                                    {daysOfWeek.map((d) => (
                                        <option key={d.value} value={d.value}>{d.label}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {recurrence === 'monthly' && (
                            <div>
                                <label className="label-text">Jour du mois</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={cronDayOfMonth}
                                    onChange={(e) => setCronDayOfMonth(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                        )}

                        {recurrence === 'custom' && (
                            <div>
                                <label className="label-text">Expression cron (5 champs)</label>
                                <input
                                    type="text"
                                    value={customCron}
                                    onChange={(e) => setCustomCron(e.target.value)}
                                    placeholder="minute heure jour_mois mois jour_semaine"
                                    className="input-field font-mono"
                                />
                                <p className="text-xs text-surface-500 mt-1">Exemple : 0 8 * * 1-5 (lun-ven à 8h)</p>
                            </div>
                        )}

                        <div className="p-3 bg-surface-900/50 rounded-xl border border-surface-700/30">
                            <p className="text-xs text-surface-400">
                                <span className="font-mono text-accent-400">{buildCron()}</span>
                                <span className="ml-2">({TIMEZONE})</span>
                            </p>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-surface-700/50">
                    <button onClick={onClose} className="btn-secondary flex-1">
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={scheduleType === 'once' && !scheduledAt}
                        className="btn-accent flex-1"
                    >
                        Planifier
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleModal;
