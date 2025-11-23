import React, { useState, useEffect } from 'react';
import { User, TrainingPlan, Drill } from '../types';
import { getAITrainingPlan } from '../services/geminiService';
import Header from '../components/Header';

const DrillCard: React.FC<{ drill: Drill, imageUrl: string }> = ({ drill, imageUrl }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
    <img src={imageUrl} alt={drill.name} className="h-32 w-full object-cover" />
    <div className="p-4 flex flex-col flex-1">
      <h4 className="font-bold text-gray-800">{drill.name}</h4>
      <p className="text-sm text-gray-600 mt-1 flex-1">{drill.description}</p>
      <button className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 self-start">
        View Details &rarr;
      </button>
    </div>
  </div>
);

const TrainingHubScreen: React.FC<{ user: User }> = ({ user }) => {
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const trainingPlan = await getAITrainingPlan(user.sport);
      setPlan(trainingPlan);
    } catch (err) {
      setError('Failed to generate a training plan. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [user.sport]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full flex-1 p-8 text-gray-600">
          <div className="w-12 h-12 mb-4 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
          <p className="font-semibold">Generating your personalized plan...</p>
          <p className="text-sm mt-1">AI is tailoring drills just for you.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full flex-1 p-8 text-center">
           <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button onClick={fetchPlan} className="px-5 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
            Retry
          </button>
        </div>
      );
    }

    if (!plan) {
      return <div className="p-6">No plan available.</div>;
    }

    return (
      <div className="p-6 space-y-6">
        <section className="p-6 bg-blue-800 text-white rounded-xl shadow-lg">
          <h3 className="text-xl font-bold">Personalized Training Plan</h3>
          <p className="text-blue-200 mt-2">{plan.summary}</p>
          <button className="w-full mt-4 py-3 bg-white text-blue-800 font-bold rounded-lg hover:bg-gray-200 transition-colors">
            Start Training
          </button>
        </section>
        
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-3">Recommended Drills</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plan.drills.map((drill, index) => (
              <DrillCard 
                key={drill.name} 
                drill={drill} 
                imageUrl={`https://picsum.photos/seed/drill${index + 1}/400/200`}
              />
            ))}
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title="Training Hub" />
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default TrainingHubScreen;
