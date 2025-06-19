import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center h-8 w-16 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      
      {/* Icons inside the button */}
      <div className="absolute flex justify-between w-full px-2 z-0">
        <Sun className="w-5 h-5 text-yellow-500" />
        <Moon className="w-5 h-5 text-blue-300" />
      </div>

      {/* The moving circle */}
      <span
        className={`${ 
          theme === 'light' ? 'translate-x-0' : 'translate-x-8'
        } inline-block w-8 h-8 bg-white dark:bg-gray-300 rounded-full shadow-lg transform transition-transform duration-300 ease-in-out ring-1 ring-gray-400 dark:ring-gray-500`}
      />
    </button>
  );
};

export default ThemeToggleButton;
