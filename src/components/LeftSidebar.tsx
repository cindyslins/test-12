import React from 'react';
import { Home, Compass, TrendingUp, Star, BookMarked } from 'lucide-react';

const FEEDS = [
  { icon: Home, label: 'Home' },
  { icon: Compass, label: 'Popular' },
  { icon: TrendingUp, label: 'All' },
];

const FAVORITES = [
  'programming',
  'AskReddit',
  'worldnews',
  'gaming',
  'science',
];

export function LeftSidebar() {
  return (
    <aside className="hidden md:block w-64 pr-4 space-y-4">
      <div className="space-y-2">
        {FEEDS.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <Icon className="w-5 h-5 text-gray-500" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="pt-4 border-t">
        <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Favorites
        </h3>
        <div className="space-y-2">
          {FAVORITES.map((subreddit) => (
            <button
              key={subreddit}
              className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              <Star className="w-5 h-5 text-gray-500" />
              <span>r/{subreddit}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}