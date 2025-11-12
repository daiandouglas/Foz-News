
import React from 'react';
import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';

const App: React.FC = () => {
  const { user } = useAuth();

  return user ? <Dashboard /> : <LoginPage />;
};

export default App;
