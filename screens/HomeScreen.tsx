import React from 'react';
import { User } from '../types';

interface HomeScreenProps {
    user: User;
}

const StatCard: React.FC<{ title: string; value: string; category: string }> = ({ title, value, category }) => (
    <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-blue-800">{value}</p>
        <p className="text-xs text-green-600">{category}</p>
    </div>
);

const TopAthleteBanner: React.FC<{ name: string; level: string; score: number; imageUrl: string }> = ({ name, level, score, imageUrl }) => (
    <div 
        className="relative h-28 rounded-xl shadow-lg overflow-hidden flex items-end p-4 text-white"
        style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="relative z-10">
            <p className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full inline-block mb-1">{level}</p>
            <h3 className="text-lg font-bold">{name}</h3>
            <p className="text-sm font-medium">Score: {score}</p>
        </div>
    </div>
);


const HomeScreen: React.FC<HomeScreenProps> = ({ user }) => {
    return (
        <div className="bg-gray-50 min-h-full">
            <header className="bg-blue-800 text-white pt-6 px-6 pb-24 rounded-b-3xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">SPARK KHOJ</h1>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-xl">Welcome, {user.name.split(' ')[0]}!</h2>
                <p className="text-blue-200 text-sm">Here's a look at your progress.</p>
            </header>

            <main className="p-4 space-y-6">
                <section className="-mt-20">
                    <div className="grid grid-cols-3 gap-4">
                        <StatCard title="District Rank" value={String(user.districtRank)} category="Top 5%" />
                        <StatCard title="Total Score" value={String(user.totalScore)} category="Advanced" />
                        <StatCard title="State Rank" value={String(user.stateRank)} category="Top 20%" />
                    </div>
                </section>
                
                <section>
                    <h2 className="text-lg font-bold text-gray-800 mb-3">Top Athletes</h2>
                    <div className="space-y-4">
                       <TopAthleteBanner 
                            name="Suresh Yadav" 
                            level="#1 District" 
                            score={95} 
                            imageUrl="https://picsum.photos/seed/district/400/200"
                        />
                        <TopAthleteBanner 
                            name="Vikram Singh" 
                            level="#1 State" 
                            score={98} 
                            imageUrl="https://picsum.photos/seed/state/400/200"
                        />
                        <TopAthleteBanner 
                            name="Arjun Reddy" 
                            level="#1 National" 
                            score={99} 
                            imageUrl="https://picsum.photos/seed/national/400/200"
                        />
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-800 mb-3">Your Recent Submissions</h2>
                    <div className="bg-white p-4 rounded-lg shadow-md space-y-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">Fitness Assessment</p>
                                <p className="text-xs text-gray-500">Jan 11, 2024</p>
                            </div>
                            <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Scored: 88</span>
                        </div>
                         <div className="border-t border-gray-100 my-2"></div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">100m Sprint Analysis</p>
                                <p className="text-xs text-gray-500">Jan 23, 2024</p>
                            </div>
                            <span className="text-sm font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Under Review</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomeScreen;