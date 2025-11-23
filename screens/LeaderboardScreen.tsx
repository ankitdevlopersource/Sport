import React, { useState, useMemo } from 'react';
import { LeaderboardEntry, User } from '../types';

const mockData: { [key: string]: LeaderboardEntry[] } = {
  District: [
    { rank: 1, name: 'Suresh Yadav', sport: 'Athletics', score: 95 },
    { rank: 2, name: 'News Kumar', sport: 'Athletics', score: 92 },
    { rank: 3, name: 'Ravi Sharma', sport: 'Athletics', score: 88 },
    { rank: 4, name: 'Ankit Kumar', sport: 'Athletics', score: 85 },
    { rank: 5, name: 'Shweta Joshi', sport: 'Athletics', score: 84 },
  ],
  State: [
    { rank: 1, name: 'Vikram Singh', sport: 'Athletics', score: 98 },
    { rank: 2, name: 'Priya Patel', sport: 'Athletics', score: 96 },
    { rank: 3, name: 'Suresh Yadav', sport: 'Athletics', score: 95 },
    { rank: 132, name: 'Ankit Kumar', sport: 'Athletics', score: 85 },
  ],
  National: [
    { rank: 1, name: 'Arjun Reddy', sport: 'Athletics', score: 99 },
    { rank: 2, name: 'Vikram Singh', sport: 'Athletics', score: 98 },
    { rank: 3, name: 'Meera Das', sport: 'Athletics', score: 97 },
  ],
};

interface LeaderboardScreenProps {
  user: User;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'District' | 'State' | 'National'>('District');

  const displayedData = useMemo(() => {
    // Create a mutable copy of the data for the active tab.
    const rawData = [...mockData[activeTab]];
    
    // Find the placeholder for the current user in the mock data.
    // The mock data uses 'Ankit Kumar' as a placeholder.
    const userIndex = rawData.findIndex(entry => entry.name === 'Ankit Kumar');

    // If the placeholder is found, update it with the current user's live data.
    if (userIndex !== -1) {
      rawData[userIndex] = {
        ...rawData[userIndex],
        name: user.name,
        score: user.totalScore,
        profilePictureUrl: user.profilePictureUrl,
      };
    }

    // Sort the data by score in descending order.
    const sortedData = rawData.sort((a, b) => b.score - a.score);

    // Re-assign ranks based on the sorted order for a consistent display.
    return sortedData.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }, [activeTab, user]);

  return (
    <div className="flex flex-col h-full bg-blue-900 text-white">
      <header className="p-4 flex items-center">
        <button className="p-2 rounded-full hover:bg-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <h1 className="text-xl font-bold mx-auto">Leaderboard</h1>
      </header>
      
      <div className="p-4">
        <div className="flex bg-blue-800 rounded-lg p-1">
          {(['District', 'State', 'National'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${
                activeTab === tab ? 'bg-white text-blue-800 shadow' : 'text-blue-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="bg-blue-800 rounded-lg overflow-hidden">
          {displayedData.map((entry, index) => (
            <div
              key={entry.rank}
              className={`flex items-center p-4 ${index !== displayedData.length - 1 ? 'border-b border-blue-700' : ''} ${entry.name === user.name ? 'bg-blue-700' : ''}`}
            >
              <div className="w-10 text-center font-bold text-lg">{entry.rank}</div>
              <img 
                 src={entry.profilePictureUrl || `https://picsum.photos/seed/${entry.name.replace(/\s+/g, '')}/48/48`} 
                 alt={entry.name} 
                 className="w-12 h-12 rounded-full mx-4 object-cover" 
              />
              <div className="flex-1">
                <p className="font-semibold">{entry.name}</p>
                <p className="text-sm text-blue-200">{entry.sport}</p>
              </div>
              <div className="text-xl font-bold">{entry.score}</div>
            </div>
          ))}
        </div>
      </div>
       <div className="p-4 bg-blue-900 border-t border-blue-800">
            <button className="w-full py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-200 transition-colors">
                View Details
            </button>
        </div>
    </div>
  );
};

export default LeaderboardScreen;