
import React from 'react';
import { useAuth } from '../AuthContext';

const NewspaperIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6M7 8h6" />
  </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);


const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-700 shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <NewspaperIcon />
            <span className="text-white text-2xl font-bold">Sul News</span>
            <span className="text-blue-200 text-lg font-light hidden sm:inline">AI Editor Dashboard</span>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                 <p className="text-white text-sm font-medium">{user.email}</p>
                 <p className="text-blue-200 text-xs">{user.role}</p>
              </div>
              <button onClick={logout} className="p-2 rounded-full text-white hover:bg-blue-600 transition-colors" aria-label="Sair">
                <LogoutIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;