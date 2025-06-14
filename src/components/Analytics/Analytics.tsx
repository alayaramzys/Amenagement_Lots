import React, { useState } from 'react';

import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MapPin, 
  Settings, 
  Calendar,
  Euro,
  Clock,
  Target,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockStudents, mockLots, mockServices, mockAmenagements } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [students] = useLocalStorage('students', mockStudents);
  const [lots] = useLocalStorage('lots', mockLots);
  const [services] = useLocalStorage('services', mockServices);
  const [amenagements] = useLocalStorage('amenagements', mockAmenagements);
  const [timeRange, setTimeRange] = useState('month');

  // Calculs des statistiques
  const stats = {
    students: {
      total: students.length,
      active: students.filter(s => s.statut === 'actif').length,
      newThisMonth: students.filter(s => {
        const inscriptionDate = new Date(s.dateInscription);
        const now = new Date();
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return inscriptionDate >= monthAgo;
      }).length,
      byFiliere: students.reduce((acc, s) => {
        acc[s.filiere] = (acc[s.filiere] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    },
    lots: {
      total: lots.length,
      available: lots.filter(l => l.etat === 'disponible').length,
      inDevelopment: lots.filter(l => l.etat === 'en_amenagement').length,
      completed: lots.filter(l => l.etat === 'amenage').length,
      byRegion: lots.reduce((acc, l) => {
        acc[l.region] = (acc[l.region] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalValue: lots.reduce((acc, l) => acc + (l.prix || 0), 0),
    },
    services: {
      total: services.length,
      averageCost: Math.round(services.reduce((acc, s) => acc + s.cout, 0) / services.length),
      averageDuration: Math.round(services.reduce((acc, s) => acc + s.duree, 0) / services.length),
      totalValue: services.reduce((acc, s) => acc + s.cout, 0),
    },
    amenagements: {
      total: amenagements.length,
      planned: amenagements.filter(a => a.statut === 'planifie').length,
      inProgress: amenagements.filter(a => a.statut === 'en_cours').length,
      completed: amenagements.filter(a => a.statut === 'termine').length,
      cancelled: amenagements.filter(a => a.statut === 'annule').length,
      completionRate: Math.round((amenagements.filter(a => a.statut === 'termine').length / amenagements.length) * 100),
    }
  };

  const chartData = {
    studentsByFiliere: Object.entries(stats.students.byFiliere).map(([filiere, count]) => ({
      name: filiere,
      value: count,
      percentage: Math.round((count / stats.students.total) * 100)
    })),
    lotsByRegion: Object.entries(stats.lots.byRegion).slice(0, 5).map(([region, count]) => ({
      name: region.length > 15 ? region.substring(0, 15) + '...' : region,
      value: count,
      percentage: Math.round((count / stats.lots.total) * 100)
    })),
    amenagementsByStatus: [
      { name: 'Planifiés', value: stats.amenagements.planned, color: 'bg-blue-500' },
      { name: 'En cours', value: stats.amenagements.inProgress, color: 'bg-yellow-500' },
      { name: 'Terminés', value: stats.amenagements.completed, color: 'bg-green-500' },
      { name: 'Annulés', value: stats.amenagements.cancelled, color: 'bg-red-500' },
    ]
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès Restreint</h2>
          <p className="text-gray-600">Les statistiques avancées sont réservées aux administrateurs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Analytique</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble des performances et tendances</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="quarter">Ce trimestre</option>
          <option value="year">Cette année</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Nouveaux Étudiants</p>
              <p className="text-3xl font-bold">{stats.students.newThisMonth}</p>
              <p className="text-sm text-blue-100">Ce mois</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-400 bg-opacity-30">
              <Users className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Valeur Totale Lots</p>
              <p className="text-3xl font-bold">{(stats.lots.totalValue / 1000000).toFixed(1)}MTND</p>
              <p className="text-sm text-green-100">Portfolio</p>
            </div>
            <div className="p-3 rounded-lg bg-green-400 bg-opacity-30">
              <Euro className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Taux de Réussite</p>
              <p className="text-3xl font-bold">{stats.amenagements.completionRate}%</p>
              <p className="text-sm text-purple-100">Aménagements</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-400 bg-opacity-30">
              <Target className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Projets Actifs</p>
              <p className="text-3xl font-bold">{stats.amenagements.inProgress}</p>
              <p className="text-sm text-orange-100">En cours</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-400 bg-opacity-30">
              <Activity className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students by Filiere */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Étudiants par Filière</h2>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {chartData.studentsByFiliere.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-3"></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lots by Region */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Lots par Région</h2>
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {chartData.lotsByRegion.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Amenagements Status & Services Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Amenagements Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">État des Aménagements</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {chartData.amenagementsByStatus.map((item, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`w-12 h-12 ${item.color} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{item.value}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-600">
                  {Math.round((item.value / stats.amenagements.total) * 100)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Services Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Aperçu des Services</h2>
            <Settings className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Euro className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Coût Moyen</p>
                  <p className="text-sm text-gray-600">Par service</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {stats.services.averageCost.toLocaleString('fr-FR')} TND
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Durée Moyenne</p>
                  <p className="text-sm text-gray-600">Par service</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {stats.services.averageDuration} jours
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Métriques de Performance</h2>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.students.total}</div>
            <div className="text-sm text-gray-600">Total Étudiants</div>
            <div className="text-xs text-green-600 mt-1">
              +{stats.students.newThisMonth} ce mois
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.lots.available}</div>
            <div className="text-sm text-gray-600">Lots Disponibles</div>
            <div className="text-xs text-blue-600 mt-1">
              {Math.round((stats.lots.available / stats.lots.total) * 100)}% du total
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.services.total}</div>
            <div className="text-sm text-gray-600">Services Actifs</div>
            <div className="text-xs text-orange-600 mt-1">
              {(stats.services.totalValue / 1000).toFixed(0)}kTND valeur
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.amenagements.completionRate}%</div>
            <div className="text-sm text-gray-600">Taux de Réussite</div>
            <div className="text-xs text-green-600 mt-1">
              {stats.amenagements.completed} terminés
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;