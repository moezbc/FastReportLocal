import React from 'react';
import { ReportListItem } from '../../api/launcher';
import { HiOutlineDocumentText, HiOutlineClock } from 'react-icons/hi2';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReportCardProps {
    report: ReportListItem;
    selected: boolean;
    onClick: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, selected, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${selected
                    ? 'bg-primary-600/15 border border-primary-500/30 shadow-glow'
                    : 'bg-surface-800/40 border border-surface-700/30 hover:bg-surface-800/60 hover:border-surface-600/50'
                }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <HiOutlineDocumentText className={`w-4 h-4 flex-shrink-0 ${selected ? 'text-primary-400' : 'text-surface-500 group-hover:text-surface-400'
                            }`} />
                        <h3 className={`text-sm font-semibold truncate ${selected ? 'text-primary-300' : 'text-surface-200 group-hover:text-white'
                            }`}>
                            {report.name}
                        </h3>
                    </div>

                    {report.description && (
                        <p className="text-xs text-surface-500 line-clamp-2 ml-6 mb-2">
                            {report.description}
                        </p>
                    )}

                    <div className="flex items-center gap-3 ml-6">
                        <span className={report.visibility === 'public' ? 'badge-public' : 'badge-private'}>
                            {report.visibility === 'public' ? 'Public' : 'Privé'}
                        </span>
                        {report.parameter_count > 0 && (
                            <span className="text-xs text-surface-500">
                                {report.parameter_count} param{report.parameter_count > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-surface-600 flex-shrink-0">
                    <HiOutlineClock className="w-3.5 h-3.5" />
                    <span>{format(new Date(report.updated_at), 'dd MMM', { locale: fr })}</span>
                </div>
            </div>
        </button>
    );
};

export default ReportCard;
