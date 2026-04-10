import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-surface-500 hover:text-primary-500 hover:bg-surface-100 dark:hover:bg-surface-800/60 transition-all duration-200"
            title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <HiOutlineSun className="w-5 h-5" />
            ) : (
                <HiOutlineMoon className="w-5 h-5" />
            )}
        </button>
    );
};

export default ThemeToggle;
