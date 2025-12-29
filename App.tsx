import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import GameGuide from './components/GameGuide';
import PenaltyMaker from './components/PenaltyMaker';
import ReactionTest from './components/ReactionTest';
import { PageView } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'games':
        return <GameGuide />;
      case 'penalty':
        return <PenaltyMaker />;
      case 'test':
        return <ReactionTest />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout 
        showHomeBtn={currentPage !== 'home'}
        onHomeClick={() => setCurrentPage('home')}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;