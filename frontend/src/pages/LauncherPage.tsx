import React, { useState, useEffect, useCallback } from 'react';
import {
    ReportListItem,
    ReportDetail,
    getExecutableReports,
    getReportDetail,
    runImmediate,
    runDeferred,
    RunImmediatePayload,
    RunDeferredPayload,
} from '../api/launcher';
import ReportCard from '../components/launcher/ReportCard';
import ParameterForm from '../components/launcher/ParameterForm';
import OutputConfig from '../components/launcher/OutputConfig';
import ScheduleModal from '../components/launcher/ScheduleModal';
import {
    HiOutlineRocketLaunch,
    HiOutlineMagnifyingGlass,
    HiOutlineCalendarDays,
    HiOutlineBolt,
    HiOutlineCheckCircle,
    HiOutlineExclamationTriangle,
} from 'react-icons/hi2';

const LauncherPage: React.FC = () => {
    // Report list
    const [reports, setReports] = useState<ReportListItem[]>([]);
    const [filteredReports, setFilteredReports] = useState<ReportListItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingList, setLoadingList] = useState(true);

    // Selected report detail
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [reportDetail, setReportDetail] = useState<ReportDetail | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Form state
    const [paramValues, setParamValues] = useState<Record<string, { operator: string; value: string; value2?: string }>>({});
    const [outputType, setOutputType] = useState('CSV');
    const [routingMode, setRoutingMode] = useState('screen');
    const [routingConfig, setRoutingConfig] = useState<Record<string, unknown>>({});
    const [executionMode, setExecutionMode] = useState<'immediate' | 'deferred'>('immediate');

    // UI state
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [executing, setExecuting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Load reports
    useEffect(() => {
        getExecutableReports()
            .then((data) => {
                setReports(data);
                setFilteredReports(data);
            })
            .catch(() => setErrorMessage('Erreur lors du chargement des rapports.'))
            .finally(() => setLoadingList(false));
    }, []);

    // Search filter
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredReports(reports);
        } else {
            const q = searchQuery.toLowerCase();
            setFilteredReports(
                reports.filter(
                    (r) =>
                        r.name.toLowerCase().includes(q) ||
                        r.description.toLowerCase().includes(q)
                )
            );
        }
    }, [searchQuery, reports]);

    // Load report detail
    const selectReport = useCallback(async (id: number) => {
        if (id === selectedId) return;
        setSelectedId(id);
        setLoadingDetail(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const detail = await getReportDetail(id);
            setReportDetail(detail);

            // Initialize param values from defaults
            const initParams: Record<string, { operator: string; value: string }> = {};
            detail.parameters.forEach((p) => {
                initParams[p.name] = {
                    operator: p.operators[0] || '=',
                    value: p.default_value || '',
                };
            });
            setParamValues(initParams);

            // Set defaults
            setOutputType(detail.output_types[0] || 'CSV');
            setRoutingMode(detail.routing_modes[0] || 'screen');
            setRoutingConfig({});
            setExecutionMode('immediate');
        } catch {
            setErrorMessage("Erreur lors du chargement du rapport.");
        } finally {
            setLoadingDetail(false);
        }
    }, [selectedId]);

    const handleParamChange = (name: string, field: 'operator' | 'value' | 'value2', val: string) => {
        setParamValues((prev) => ({
            ...prev,
            [name]: { ...prev[name], [field]: val },
        }));
    };

    const handleRunImmediate = async () => {
        if (!reportDetail) return;
        setExecuting(true);
        setErrorMessage('');
        setSuccessMessage('');

        const payload: RunImmediatePayload = {
            parameters: paramValues,
            output_type: outputType,
            routing_mode: routingMode,
            routing_config: routingConfig,
        };

        try {
            await runImmediate(reportDetail.id, payload);
            if (routingMode === 'screen') {
                setSuccessMessage('Le rapport a été téléchargé avec succès.');
            } else {
                setSuccessMessage(`Le rapport est en cours de traitement (routage : ${routingMode}).`);
            }
        } catch (err: any) {
            const msg = err.response?.data?.error || "Erreur lors de l'exécution du rapport.";
            setErrorMessage(msg);
        } finally {
            setExecuting(false);
        }
    };

    const handleRunDeferred = async (scheduleData: {
        schedule_type: 'once' | 'recurring';
        scheduled_at?: string;
        cron_expression?: string;
        timezone: string;
    }) => {
        if (!reportDetail) return;
        setExecuting(true);
        setErrorMessage('');
        setSuccessMessage('');
        setShowScheduleModal(false);

        const payload: RunDeferredPayload = {
            parameters: paramValues,
            output_type: outputType,
            routing_mode: routingMode,
            routing_config: routingConfig,
            ...scheduleData,
        };

        try {
            const result = await runDeferred(reportDetail.id, payload);
            setSuccessMessage(
                scheduleData.schedule_type === 'once'
                    ? `Exécution planifiée avec succès (ID: ${result.id}).`
                    : `Planification récurrente créée avec succès (ID: ${result.id}).`
            );
        } catch (err: any) {
            const msg = err.response?.data?.error || 'Erreur lors de la planification.';
            setErrorMessage(msg);
        } finally {
            setExecuting(false);
        }
    };

    const handleExecute = () => {
        if (executionMode === 'immediate') {
            handleRunImmediate();
        } else {
            setShowScheduleModal(true);
        }
    };

    return (
        <div className="h-full flex">
            {/* Left panel – Report list */}
            <div className="w-80 xl:w-96 flex-shrink-0 border-r border-surface-800 flex flex-col bg-surface-900/30">
                {/* Search header */}
                <div className="p-4 border-b border-surface-800">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <HiOutlineRocketLaunch className="w-5 h-5 text-primary-400" />
                        Lanceur
                    </h2>
                    <div className="relative">
                        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher un rapport..."
                            className="input-field pl-10 text-sm"
                        />
                    </div>
                </div>

                {/* Report list */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {loadingList ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-20 bg-surface-800/40 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div className="text-center py-12 text-surface-500">
                            <HiOutlineRocketLaunch className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">
                                {searchQuery ? 'Aucun rapport trouvé.' : 'Aucun rapport disponible.'}
                            </p>
                        </div>
                    ) : (
                        filteredReports.map((report) => (
                            <ReportCard
                                key={report.id}
                                report={report}
                                selected={report.id === selectedId}
                                onClick={() => selectReport(report.id)}
                            />
                        ))
                    )}
                </div>

                <div className="p-3 border-t border-surface-800">
                    <p className="text-xs text-surface-600 text-center">
                        {filteredReports.length} rapport{filteredReports.length !== 1 ? 's' : ''} disponible{filteredReports.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Right panel – Report detail & execution form */}
            <div className="flex-1 overflow-y-auto">
                {!selectedId ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-surface-800/40 flex items-center justify-center">
                                <HiOutlineRocketLaunch className="w-8 h-8 text-surface-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-surface-400 mb-1">Sélectionnez un rapport</h3>
                            <p className="text-sm text-surface-600">Choisissez un rapport dans la liste pour configurer et lancer son exécution.</p>
                        </div>
                    </div>
                ) : loadingDetail ? (
                    <div className="p-8 space-y-4">
                        <div className="h-8 w-64 bg-surface-800/40 rounded-lg animate-pulse" />
                        <div className="h-4 w-full bg-surface-800/40 rounded-lg animate-pulse" />
                        <div className="h-4 w-3/4 bg-surface-800/40 rounded-lg animate-pulse" />
                    </div>
                ) : reportDetail ? (
                    <div className="p-6 xl:p-8 max-w-4xl space-y-6">
                        {/* Report header */}
                        <div className="animate-slide-up">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-white">{reportDetail.name}</h2>
                                <span className={reportDetail.visibility === 'public' ? 'badge-public' : 'badge-private'}>
                                    {reportDetail.visibility === 'public' ? 'Public' : 'Privé'}
                                </span>
                            </div>
                            {reportDetail.description && (
                                <p className="text-surface-400 leading-relaxed">{reportDetail.description}</p>
                            )}
                            <p className="text-xs text-surface-600 mt-2">Par {reportDetail.owner_username}</p>
                        </div>

                        {/* Parameters section */}
                        <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.05s' }}>
                            <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-4">
                                Paramètres
                            </h3>
                            <ParameterForm
                                parameters={reportDetail.parameters}
                                values={paramValues}
                                onChange={handleParamChange}
                            />
                        </div>

                        {/* Output & routing section */}
                        <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-4">
                                Sortie & Routage
                            </h3>
                            <OutputConfig
                                outputTypes={reportDetail.output_types}
                                routingModes={reportDetail.routing_modes}
                                selectedOutputType={outputType}
                                selectedRoutingMode={routingMode}
                                routingConfig={routingConfig}
                                onOutputTypeChange={setOutputType}
                                onRoutingModeChange={setRoutingMode}
                                onRoutingConfigChange={setRoutingConfig}
                            />
                        </div>

                        {/* Execution mode section */}
                        <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                            <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-4">
                                Mode d'exécution
                            </h3>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setExecutionMode('immediate')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${executionMode === 'immediate'
                                            ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30 shadow-glow'
                                            : 'bg-surface-800/50 text-surface-400 border border-surface-700/50 hover:text-surface-200'
                                        }`}
                                >
                                    <HiOutlineBolt className="w-5 h-5" />
                                    Immédiat
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setExecutionMode('deferred')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${executionMode === 'deferred'
                                            ? 'bg-accent-600/20 text-accent-300 border border-accent-500/30 shadow-glow-accent'
                                            : 'bg-surface-800/50 text-surface-400 border border-surface-700/50 hover:text-surface-200'
                                        }`}
                                >
                                    <HiOutlineCalendarDays className="w-5 h-5" />
                                    Différé
                                </button>
                            </div>
                        </div>

                        {/* Status messages */}
                        {successMessage && (
                            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-fade-in">
                                <HiOutlineCheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                <p className="text-sm text-emerald-300">{successMessage}</p>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in">
                                <HiOutlineExclamationTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <p className="text-sm text-red-300">{errorMessage}</p>
                            </div>
                        )}

                        {/* Execute button */}
                        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <button
                                onClick={handleExecute}
                                disabled={executing}
                                className={`w-full py-3.5 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${executionMode === 'immediate'
                                        ? 'btn-primary'
                                        : 'btn-accent'
                                    }`}
                            >
                                {executing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Exécution en cours...
                                    </>
                                ) : executionMode === 'immediate' ? (
                                    <>
                                        <HiOutlineBolt className="w-5 h-5" />
                                        Exécuter maintenant
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineCalendarDays className="w-5 h-5" />
                                        Planifier l'exécution
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Schedule modal */}
            {showScheduleModal && reportDetail && (
                <ScheduleModal
                    reportName={reportDetail.name}
                    onConfirm={handleRunDeferred}
                    onClose={() => setShowScheduleModal(false)}
                />
            )}
        </div>
    );
};

export default LauncherPage;
