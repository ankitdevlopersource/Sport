
import React from 'react';
import { Page } from '../types';
import { HomeIcon, RunIcon, MessageIcon, TrophyIcon, UserIcon } from './icons/NavIcons';

interface BottomNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const navItems: { page: Page; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { page: 'Home', icon: HomeIcon },
  { page: 'Join Athletics', icon: RunIcon },
  { page: 'Messages', icon: MessageIcon },
  { page: 'Leaderboard', icon: TrophyIcon },
  { page: 'Profile', icon: UserIcon },
];

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-t">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ page, icon: Icon }) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`flex flex-col items-center justify-center w-full text-xs transition-colors duration-200 ${
                isActive ? 'text-blue-800' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} />
              <span>{page}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;