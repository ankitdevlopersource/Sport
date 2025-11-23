import React, { useState, useCallback } from 'react';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import JoinAthleticsScreen from './screens/JoinAthleticsScreen';
import MessagesScreen from './screens/MessagesScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNav from './components/BottomNav';
import { Page, User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState<Page>('Home');

  const handleAuthSuccess = useCallback((userData: User) => {
    setUser(userData);
    setCurrentPage('Home');
  }, []);

  const handleSimulatedLogin = useCallback(() => {
    // For demonstration, login creates a default user.
    // In a real app, this would fetch user data from a server.
    const defaultUser: User = {
      name: 'Ankit Kumar',
      role: 'Athlete',
      sport: 'Athletics',
      location: 'Muzaffarnagar, Uttar Pradesh',
      profilePictureUrl: 'https://picsum.photos/seed/ankit/100/100',
      districtRank: 12,
      stateRank: 132,
      totalScore: 85,
    };
    handleAuthSuccess(defaultUser);
  }, [handleAuthSuccess]);
  
  const handleLogout = useCallback(() => {
    setUser(null);
    setAuthPage('login');
  }, []);

  const renderCurrentPage = () => {
    if (!user) return null; // Should not happen due to the check below, but good for type safety

    switch (currentPage) {
      case 'Home':
        return <HomeScreen user={user} />;
      case 'Join Athletics':
        return <JoinAthleticsScreen />;
      case 'Messages':
        return <MessagesScreen user={user} />;
      case 'Leaderboard':
        return <LeaderboardScreen user={user} />;
      case 'Profile':
        return <ProfileScreen user={user} onUpdateUser={setUser} onLogout={handleLogout} />;
      default:
        return <HomeScreen user={user} />;
    }
  };

  if (!user) {
    if (authPage === 'login') {
      return <LoginScreen onLogin={handleSimulatedLogin} onNavigateToRegister={() => setAuthPage('register')} />;
    }
    return <RegisterScreen onRegister={handleAuthSuccess} onNavigateToLogin={() => setAuthPage('login')} />;
  }

  return (
    <div className="max-w-md mx-auto bg-gray-50 font-sans shadow-lg h-screen flex flex-col">
       <main className="flex-1 overflow-y-auto pb-16">
        {renderCurrentPage()}
      </main>
      <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default App;