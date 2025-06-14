import React from 'react';
import { 
  Home, 
  Users, 
  MapPin, 
  Settings, 
  Calendar,
  BarChart3,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  const adminMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'students', label: 'Étudiants', icon: Users },
    { id: 'lots', label: 'Lots', icon: MapPin },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'amenagements', label: 'Aménagements', icon: Calendar },
    { id: 'analytics', label: 'Statistiques', icon: BarChart3 },
  ];

  const userMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'lots', label: 'Consulter Lots', icon: MapPin },
    { id: 'profile', label: 'Mon Profil', icon: User },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Aménagement Lots</h1>
        <p className="text-sm text-gray-600 mt-1">
          {user?.role === 'admin' ? 'Espace Administrateur' : 'Espace Utilisateur'}
        </p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;