import React from 'react';
import { FiX, FiShield } from 'react-icons/fi';
import ReportPermissionsPanel from './ReportPermissionsPanel';

interface Props {
    reportId: number;
    reportName: string;
    onClose: () => void;
}

const ReportPermissionsDialog: React.FC<Props> = ({ reportId, reportName, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface-900 border border-surface-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-surface-800 flex items-center justify-between bg-surface-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
                            <FiShield className="text-primary-400" />
                            Gérer les accès
                        </h2>
                        <p className="text-sm text-surface-400 mt-1">
                            Rapport : <span className="text-surface-900 dark:text-white font-medium">{reportName}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-white/5 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <ReportPermissionsPanel reportId={reportId} />
                </div>
            </div>
        </div>
    );
};

export default ReportPermissionsDialog;
