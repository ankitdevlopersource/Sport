import React, { useState, useEffect } from 'react';
import { Performance, User } from '../types';

interface ProfileScreenProps {
  onLogout: () => void;
  user: User;
  onUpdateUser: (user: User) => void;
}

const mockPerformances: Performance[] = [
    {id: 1, title: 'Fitness Assessment', date: 'Apr 11, 2024', score: 88, metric: '60.00ml', imageUrl: 'https://picsum.photos/seed/perf1/200/120'},
    {id: 2, title: '100m Sprint', date: 'Jan 23, 2024', score: 88, imageUrl: 'https://picsum.photos/seed/perf2/200/120'},
];

const sportsList = [
  'Athletics',
  'Cricket',
  'Football',
  'Badminton',
  'Kabaddi',
  'Wrestling',
  'Basketball',
  'Tennis',
];

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout, user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<User>(user);

  useEffect(() => {
    if (!isEditing) {
      setEditData(user);
    }
  }, [user, isEditing]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    onUpdateUser(editData);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditData(user); // Revert changes
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setEditData(prev => ({ ...prev, profilePictureUrl: event.target.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  return (
    <div className="bg-blue-900 min-h-full">
        <header className="p-4 flex items-center text-white">
            <button className="p-2 rounded-full hover:bg-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <h1 className="text-xl font-bold mx-auto">Profile</h1>
            <button onClick={onLogout} className="p-2 rounded-full hover:bg-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            </button>
        </header>

        <div className="text-center mt-4">
             <div className="relative inline-block mb-4">
                <img src={editData.profilePictureUrl} alt={editData.name} className="w-28 h-28 rounded-full border-4 border-blue-700 object-cover"/>
                 {isEditing && (
                  <label htmlFor="profile-photo-upload" className="absolute -bottom-1 -right-1 bg-white text-blue-800 rounded-full p-2 cursor-pointer shadow-md hover:bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                    <input id="profile-photo-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                )}
            </div>
            {isEditing ? (
                 <div className="px-6 space-y-4">
                    <input type="text" name="name" value={editData.name} onChange={handleInputChange} className="w-full px-4 py-2 bg-blue-800 border border-blue-600 rounded-lg text-white" />
                    <select name="sport" value={editData.sport} onChange={handleSelectChange} className="w-full px-4 py-2 bg-blue-800 border border-blue-600 rounded-lg text-white">
                        {sportsList.map(sport => <option key={sport} value={sport}>{sport}</option>)}
                    </select>
                    <input type="text" name="location" value={editData.location} onChange={handleInputChange} className="w-full px-4 py-2 bg-blue-800 border border-blue-600 rounded-lg text-white" />
                </div>
            ) : (
                <div>
                    <h2 className="text-3xl font-bold text-white">{user.name}</h2>
                    <p className="text-blue-200 mt-1">{user.sport} | {user.location}</p>
                </div>
            )}
             <div className="flex items-center justify-center space-x-8 mt-4 text-white">
                <div><p className="text-2xl font-bold">{user.districtRank}</p><p className="text-sm text-blue-200">District</p></div>
                <div><p className="text-2xl font-bold">{user.totalScore}</p><p className="text-sm text-blue-200">Score</p></div>
                <div><p className="text-2xl font-bold">{user.stateRank}</p><p className="text-sm text-blue-200">State</p></div>
            </div>
        </div>

      <main className="mt-6 bg-white rounded-t-3xl p-4 space-y-6 flex-1">
        {isEditing ? (
             <div className="flex space-x-4">
               <button onClick={handleSave} className="w-full py-3 bg-blue-800 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700">Save</button>
               <button onClick={handleCancel} className="w-full py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300">Cancel</button>
            </div>
        ) : (
             <button onClick={handleEdit} className="w-full py-3 bg-blue-800 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700">Edit Profile</button>
        )}
       
        <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Recent Performance</h3>
            <div className="space-y-4">
                {mockPerformances.map(perf => (
                     <div key={perf.id} className="bg-white rounded-lg border overflow-hidden flex shadow-sm">
                        <img src={perf.imageUrl} alt={perf.title} className="w-1/3 object-cover" />
                        <div className="p-4 flex-1">
                            <p className="font-semibold text-gray-900">{perf.title}</p>
                            <p className="text-xs text-gray-500">{perf.date}</p>
                            {perf.metric && <p className="text-sm text-gray-700 mt-1">Recent Performance: {perf.metric}</p>}
                             <div className="mt-2">
                                <span className="text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">Score: {perf.score}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileScreen;