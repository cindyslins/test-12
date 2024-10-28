import React, { useState } from 'react';
import { Search, Bell, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../store/auth';
import { AuthModal } from './AuthModal';

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-gray-900">reddit</h1>
        </div>
        
        <form onSubmit={handleSearch} className="flex-1 max-w-xl px-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Reddit"
              className="w-full bg-gray-100 rounded-full py-1.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </form>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <button className="p-1.5 hover:bg-gray-100 rounded-full">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-full">
                <MessageSquare className="h-5 w-5 text-gray-600" />
              </button>
              <div className="relative group">
                <button className="p-1.5 hover:bg-gray-100 rounded-full">
                  <User className="h-5 w-5 text-gray-600" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                  <div className="px-4 py-2 border-b">
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600"
            >
              Log In
            </button>
          )}
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}