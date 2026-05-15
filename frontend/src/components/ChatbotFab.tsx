import React, { useState } from 'react';
import { HiSparkles, HiXMark, HiPaperAirplane } from 'react-icons/hi2';

const ChatbotFab: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in origin-bottom-right transition-colors">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <HiSparkles className="text-white w-5 h-5" />
                            <h3 className="text-white font-semibold text-sm">Assistant FastReport</h3>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
                        >
                            <HiXMark className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="h-96 p-4 overflow-y-auto bg-surface-50 dark:bg-surface-950 flex flex-col gap-4">
                        <div className="flex items-start gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                                <HiSparkles className="text-white w-4 h-4" />
                            </div>
                            <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 p-3 rounded-2xl rounded-tl-sm shadow-sm">
                                <p className="text-sm text-surface-700 dark:text-surface-300">
                                    Bonjour ! 👋 Je suis l'assistant IA de FastReport. Comment puis-je vous aider aujourd'hui ?
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700">
                        <div className="flex items-center gap-2">
                            <input 
                                type="text" 
                                placeholder="Posez votre question..." 
                                className="flex-1 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                            />
                            <button className="p-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors shadow-glow flex-shrink-0">
                                <HiPaperAirplane className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ${isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
                title="Ouvrir l'assistant"
            >
                <HiSparkles className="w-6 h-6" />
            </button>
            
            {/* Alternative close button that replaces the FAB when open */}
            {isOpen && (
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute bottom-0 right-0 w-14 h-14 rounded-full bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300 flex items-center justify-center shadow-lg hover:bg-surface-300 dark:hover:bg-surface-700 hover:scale-105 transition-all duration-200 animate-fade-in"
                    title="Fermer l'assistant"
                >
                    <HiXMark className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};

export default ChatbotFab;
