import React from 'react';
import { Users, MapPin, Settings, Calendar, TrendingUp, AlertCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockStudents, mockLots, mockServices, mockAmenagements } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [students] = useLocalStorage('students', mockStudents);
  const [lots] = useLocalStorage('lots', mockLots);
  const [services] = useLocalStorage('services', mockServices);
  const [amenagements] = useLocalStorage('amenagements', mockAmenagements);

  // Calcul des nouveaux étudiants ce mois
  const newStudentsThisMonth = students.filter(s => {
    const inscriptionDate = new Date(s.dateInscription);
    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    return inscriptionDate >= monthAgo;
  }).length;

  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.statut === 'actif').length,
    newStudentsThisMonth,
    totalLots: lots.length,
    availableLots: lots.filter(l => l.etat === 'disponible').length,
    totalServices: services.length,
    totalAmenagements: amenagements.length,
    completedAmenagements: amenagements.filter(a => a.statut === 'termine').length,
  };

  const adminCards = [
    {
      title: 'Étudiants',
      value: stats.totalStudents,
      subtitle: `${stats.activeStudents} actifs`,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Nouveaux Étudiants',
      value: stats.newStudentsThisMonth,
      subtitle: 'Ce mois',
      icon: UserPlus,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Lots',
      value: stats.totalLots,
      subtitle: `${stats.availableLots} disponibles`,
      icon: MapPin,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Services',
      value: stats.totalServices,
      subtitle: 'Services actifs',
      icon: Settings,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Aménagements',
      value: stats.totalAmenagements,
      subtitle: `${stats.completedAmenagements} terminés`,
      icon: Calendar,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const userCards = [
    {
      title: 'Lots Disponibles',
      value: stats.availableLots,
      subtitle: 'Prêts à l\'achat',
      icon: MapPin,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'En Aménagement',
      value: lots.filter(l => l.etat === 'en_amenagement').length,
      subtitle: 'En cours de travaux',
      icon: Settings,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Nouveaux Étudiants',
      value: stats.newStudentsThisMonth,
      subtitle: 'Ce mois',
      icon: UserPlus,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  const cards = user?.role === 'admin' ? adminCards : userCards;

  const recentAmenagements = amenagements.slice(0, 5);
  const recentStudents = students.slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
          </h1>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble de votre système de gestion des aménagements
          </p>
        </div>
      </div>

      {/* New Students Counter Highlight */}
      {stats.newStudentsThisMonth > 0 && (
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <UserPlus className="h-6 w-6 mr-2" />
                <h2 className="text-lg font-semibold">Nouveaux Étudiants</h2>
              </div>
              <p className="text-3xl font-bold mb-1">{stats.newStudentsThisMonth}</p>
              <p className="text-emerald-100">étudiants inscrits ce mois</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-100 text-sm">Croissance</p>
              <p className="text-2xl font-bold">
                +{Math.round((stats.newStudentsThisMonth / stats.totalStudents) * 100)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Aménagements Récents</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentAmenagements.map((amenagement) => {
              const lot = lots.find(l => l.codeLot === amenagement.codeLot);
              const service = services.find(s => s.codeServ === amenagement.codeServ);
              
              return (
                <div key={amenagement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{lot?.codeLot}</p>
                    <p className="text-sm text-gray-600">{service?.designation}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    amenagement.statut === 'termine' ? 'bg-green-100 text-green-800' :
                    amenagement.statut === 'en_cours' ? 'bg-yellow-100 text-yellow-800' :
                    amenagement.statut === 'planifie' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {amenagement.statut.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Étudiants Récents</h2>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {recentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{student.prenom} {student.nom}</p>
                    <p className="text-sm text-gray-600">{student.filiere} - {student.niveau}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.statut === 'actif' ? 'bg-green-100 text-green-800' :
                      student.statut === 'diplome' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {student.statut}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(student.dateInscription).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {user?.role === 'user' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Alertes & Notifications</h2>
              <AlertCircle className="h-5 w-5 text-orange-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">Nouveaux lots disponibles</p>
                  <p className="text-sm text-gray-600">3 nouveaux lots ont été ajoutés en Monastir</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">Aménagement terminé</p>
                  <p className="text-sm text-gray-600">Le lot LOT003 est maintenant prêt à l'occupation</p>
                </div>
              </div>
              {stats.newStudentsThisMonth > 0 && (
                <div className="flex items-start p-3 bg-emerald-50 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900">Nouveaux étudiants</p>
                    <p className="text-sm text-gray-600">{stats.newStudentsThisMonth} nouveaux étudiants inscrits ce mois</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;