import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import StudentsList from './components/Students/StudentsList';
import LotsList from './components/Lots/LotsList';
import ServicesList from './components/Services/ServicesList';
import AmenagementsList from './components/Amenagements/AmenagementsList';
import Analytics from './components/Analytics/Analytics';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return user.role === 'admin' ? <StudentsList /> : <Dashboard />;
      case 'lots':
        return <LotsList />;
      case 'services':
        return <ServicesList />;
      case 'amenagements':
        return <AmenagementsList />;
      case 'analytics':
        return user.role === 'admin' ? <Analytics /> : <Dashboard />;
      case 'profile':
        return user.role === 'user' ? (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Mon Profil</h2>
              <p className="text-gray-600">Module de gestion du profil en développement</p>
            </div>
          </div>
        ) : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;