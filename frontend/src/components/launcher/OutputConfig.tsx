import React from 'react';
import {
    HiOutlineComputerDesktop,
    HiOutlineEnvelope,
    HiOutlineServerStack,
    HiOutlineFolderOpen,
    HiOutlineGlobeAlt,
} from 'react-icons/hi2';

interface OutputConfigProps {
    outputTypes: string[];
    routingModes: string[];
    selectedOutputType: string;
    selectedRoutingMode: string;
    routingConfig: Record<string, unknown>;
    onOutputTypeChange: (type: string) => void;
    onRoutingModeChange: (mode: string) => void;
    onRoutingConfigChange: (config: Record<string, unknown>) => void;
}

const routingIcons: Record<string, React.ReactNode> = {
    screen: <HiOutlineComputerDesktop className="w-4 h-4" />,
    email: <HiOutlineEnvelope className="w-4 h-4" />,
    sftp: <HiOutlineServerStack className="w-4 h-4" />,
    ftp: <HiOutlineGlobeAlt className="w-4 h-4" />,
    local: <HiOutlineFolderOpen className="w-4 h-4" />,
};

const routingLabels: Record<string, string> = {
    screen: 'Écran',
    email: 'Email',
    sftp: 'SFTP',
    ftp: 'FTP',
    local: 'Local',
};

const OutputConfig: React.FC<OutputConfigProps> = ({
    outputTypes,
    routingModes,
    selectedOutputType,
    selectedRoutingMode,
    routingConfig,
    onOutputTypeChange,
    onRoutingModeChange,
    onRoutingConfigChange,
}) => {
    return (
        <div className="space-y-5">
            {/* Output type */}
            <div>
                <label className="label-text">Type de sortie</label>
                <div className="flex flex-wrap gap-2">
                    {outputTypes.map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => onOutputTypeChange(type)}
                            className={selectedOutputType === type ? 'pill-active' : 'pill'}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Routing mode */}
            <div>
                <label className="label-text">Mode de routage</label>
                <div className="flex flex-wrap gap-2">
                    {routingModes.map((mode) => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => onRoutingModeChange(mode)}
                            className={`flex items-center gap-1.5 ${selectedRoutingMode === mode ? 'pill-active' : 'pill'}`}
                        >
                            {routingIcons[mode]}
                            {routingLabels[mode] || mode}
                        </button>
                    ))}
                </div>
            </div>

            {/* Routing config: email recipients */}
            {selectedRoutingMode === 'email' && (
                <div className="animate-fade-in">
                    <label className="label-text">Destinataires email</label>
                    <input
                        type="text"
                        value={(routingConfig.recipients as string[] || []).join(', ')}
                        onChange={(e) => {
                            const recipients = e.target.value
                                .split(',')
                                .map((r) => r.trim())
                                .filter(Boolean);
                            onRoutingConfigChange({ ...routingConfig, recipients });
                        }}
                        placeholder="email1@exemple.com, email2@exemple.com"
                        className="input-field"
                    />
                    <p className="text-xs text-surface-500 mt-1">Séparez les adresses par des virgules</p>
                </div>
            )}

            {/* SFTP / FTP config */}
            {(selectedRoutingMode === 'sftp' || selectedRoutingMode === 'ftp') && (
                <div className="animate-fade-in space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="label-text">Hôte</label>
                            <input
                                type="text"
                                value={(routingConfig.host as string) || ''}
                                onChange={(e) => onRoutingConfigChange({ ...routingConfig, host: e.target.value })}
                                placeholder="serveur.exemple.com"
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="label-text">Port</label>
                            <input
                                type="number"
                                value={(routingConfig.port as number) || (selectedRoutingMode === 'sftp' ? 22 : 21)}
                                onChange={(e) => onRoutingConfigChange({ ...routingConfig, port: parseInt(e.target.value) })}
                                className="input-field"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="label-text">Utilisateur</label>
                            <input
                                type="text"
                                value={(routingConfig.username as string) || ''}
                                onChange={(e) => onRoutingConfigChange({ ...routingConfig, username: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="label-text">Mot de passe</label>
                            <input
                                type="password"
                                value={(routingConfig.password as string) || ''}
                                onChange={(e) => onRoutingConfigChange({ ...routingConfig, password: e.target.value })}
                                className="input-field"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="label-text">Chemin distant</label>
                        <input
                            type="text"
                            value={(routingConfig.remote_path as string) || '/'}
                            onChange={(e) => onRoutingConfigChange({ ...routingConfig, remote_path: e.target.value })}
                            placeholder="/chemin/distant/"
                            className="input-field"
                        />
                    </div>
                </div>
            )}

            {/* Local config */}
            {selectedRoutingMode === 'local' && (
                <div className="animate-fade-in">
                    <label className="label-text">Chemin local</label>
                    <input
                        type="text"
                        value={(routingConfig.path as string) || ''}
                        onChange={(e) => onRoutingConfigChange({ ...routingConfig, path: e.target.value })}
                        placeholder="/chemin/local/rapports/"
                        className="input-field"
                    />
                </div>
            )}
        </div>
    );
};

export default OutputConfig;
