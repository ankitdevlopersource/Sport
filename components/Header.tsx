import React from 'react';

interface HeaderProps {
  title?: string;
  logoTitle?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, logoTitle, onBack, actions }) => {
  return (
    <header className="bg-blue-900 text-white p-4 sticky top-0 z-20 flex items-center h-[65px] shadow-md">
      <div className="w-1/4">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-blue-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>
      <div className="w-1/2 text-center">
        {logoTitle ? (
            <h1 className="text-xl font-bold tracking-wider">
                SPARK <span className="text-orange-400">KHOJ</span>
            </h1>
        ) : (
            <h1 className="text-xl font-bold whitespace-nowrap">{title}</h1>
        )}
      </div>
      <div className="w-1/4 flex justify-end items-center">
        {actions}
      </div>
    </header>
  );
};

export default Header;
