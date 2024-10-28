import React from 'react';
import { Cake, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as api from '../lib/api';

const TRENDING_COMMUNITIES = [
  { name: 'programming', members: 4200000 },
  { name: 'AskReddit', members: 12000000 },
  { name: 'worldnews', members: 8500000 },
  { name: 'gaming', members: 6300000 },
];

export function Sidebar() {
  const { user } = useAuth();

  const handleJoinCommunity = async (subreddit: string) => {
    if (!user) {
      // Show auth modal or alert user to login
      return;
    }
    try {
      await api.joinSubreddit(subreddit);
      // Update UI or show success message
    } catch (error) {
      console.error('Failed to join community:', error);
    }
  };

  return (
    <aside className="hidden lg:block w-80 space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Trending Communities</h2>
        <div className="space-y-3">
          {TRENDING_COMMUNITIES.map((community) => (
            <div key={community.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">r/{community.name}</p>
                  <p className="text-xs text-gray-500">
                    {(community.members / 1000000).toFixed(1)}M members
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleJoinCommunity(community.name)}
                className="text-xs font-medium text-blue-500 hover:text-blue-600"
              >
                Join
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Reddit Premium</h2>
        <p className="text-sm text-gray-600 mb-4">
          Get an ad-free experience with special benefits, and directly support Reddit.
        </p>
        <button className="w-full bg-orange-500 text-white rounded-full py-2 font-medium hover:bg-orange-600 transition-colors">
          Try Now
        </button>
      </div>
    </aside>
  );
}