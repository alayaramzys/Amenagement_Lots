import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Calendar, MapPin, Settings } from 'lucide-react';
import { Amenagement, Lot, Service } from '../../types';
import { mockAmenagements, mockLots, mockServices } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAuth } from '../../contexts/AuthContext';
import AmenagementForm from './AmenagementForm';

const AmenagementsList: React.FC = () => {
  const { user } = useAuth();
  const [amenagements, setAmenagements] = useLocalStorage<Amenagement[]>('amenagements', mockAmenagements);
  const [lots] = useLocalStorage<Lot[]>('lots', mockLots);
  const [services] = useLocalStorage<Service[]>('services', mockServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAmenagement, setSelectedAmenagement] = useState<Amenagement | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewAmenagement, setViewAmenagement] = useState<Amenagement | null>(null);

  const filteredAmenagements = amenagements.filter(amenagement => {
    const lot = lots.find(l => l.codeLot === amenagement.codeLot);
    const service = services.find(s => s.codeServ === amenagement.codeServ);
    
    const matchesSearch = amenagement.codeLot.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         amenagement.codeServ.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lot?.region.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (service?.designation.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || amenagement.statut === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleSaveAmenagement = (amenagementData: Omit<Amenagement, 'id'>) => {
    if (selectedAmenagement) {
      setAmenagements(prev => prev.map(a => 
        a.id === selectedAmenagement.id ? { ...amenagementData, id: selectedAmenagement.id } : a
      ));
    } else {
      const newAmenagement: Amenagement = {
        ...amenagementData,
        id: Date.now().toString(),
      };
      setAmenagements(prev => [...prev, newAmenagement]);
    }
    setIsFormOpen(false);
    setSelectedAmenagement(null);
  };

  const handleDeleteAmenagement = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet aménagement ?')) {
      setAmenagements(prev => prev.filter(a => a.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planifie': return 'bg-blue-100 text-blue-800';
      case 'en_cours': return 'bg-yellow-100 text-yellow-800';
      case 'termine': return 'bg-green-100 text-green-800';
      case 'annule': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planifie': return Calendar;
      case 'en_cours': return Settings;
      case 'termine': return Eye;
      case 'annule': return Trash2;
      default: return Calendar;
    }
  };

  const isAdmin = user?.role === 'admin';

  if (isFormOpen && isAdmin) {
    return (
      <AmenagementForm
        amenagement={selectedAmenagement}
        lots={lots}
        services={services}
        onSave={handleSaveAmenagement}
        onCancel={() => {
          setIsFormOpen(false);
          setSelectedAmenagement(null);
        }}
      />
    );
  }

  if (viewAmenagement) {
    const lot = lots.find(l => l.codeLot === viewAmenagement.codeLot);
    const service = services.find(s => s.codeServ === viewAmenagement.codeServ);
    const StatusIcon = getStatusIcon(viewAmenagement.statut);

    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Détails de l'aménagement</h1>
            <button
              onClick={() => setViewAmenagement(null)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Retour
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Lot concerné</label>
                  <p className="text-gray-900 font-mono flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {viewAmenagement.codeLot} - {lot?.region}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Service</label>
                  <p className="text-gray-900 flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    {service?.designation}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date d'aménagement</label>
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(viewAmenagement.dateAmenagement).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Statut</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewAmenagement.statut)}`}>
                    <StatusIcon className="h-4 w-4 mr-2" />
                    {viewAmenagement.statut.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails techniques</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Superficie du lot</label>
                  <p className="text-gray-900">{lot?.superficie} m²</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Coût du service</label>
                  <p className="text-gray-900 text-xl font-semibold text-green-600">
                    {service?.cout.toLocaleString('fr-FR')} TND
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Durée prévue</label>
                  <p className="text-gray-900">{service?.duree} jours</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Observations</label>
                  <p className="text-gray-900">{viewAmenagement.observations || 'Aucune observation'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {isAdmin && (
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setSelectedAmenagement(viewAmenagement);
                  setViewAmenagement(null);
                  setIsFormOpen(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </button>
              <button
                onClick={() => handleDeleteAmenagement(viewAmenagement.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const stats = {
    total: amenagements.length,
    planifie: amenagements.filter(a => a.statut === 'planifie').length,
    enCours: amenagements.filter(a => a.statut === 'en_cours').length,
    termine: amenagements.filter(a => a.statut === 'termine').length,
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? 'Gestion des Aménagements' : 'Consulter les Aménagements'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin ? 'Planifier et suivre les aménagements des lots' : 'Suivre l\'état des aménagements'}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Planifier un aménagement
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <Calendar className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Planifiés</p>
              <p className="text-3xl font-bold text-blue-600">{stats.planifie}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.enCours}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <Settings className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Terminés</p>
              <p className="text-3xl font-bold text-green-600">{stats.termine}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="planifie">Planifié</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
            <option value="annule">Annulé</option>
          </select>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            {filteredAmenagements.length} aménagement(s)
          </div>
        </div>
      </div>

      {/* Amenagements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAmenagements.map((amenagement) => {
          const lot = lots.find(l => l.codeLot === amenagement.codeLot);
          const service = services.find(s => s.codeServ === amenagement.codeServ);
          const StatusIcon = getStatusIcon(amenagement.statut);

          return (
            <div key={amenagement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 font-mono">{amenagement.codeLot}</h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {lot?.region}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(amenagement.statut)}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {amenagement.statut.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-sm text-gray-600">Service:</span>
                    <p className="text-sm font-medium">{service?.designation}</p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date:</span>
                    <span className="text-sm font-medium">{new Date(amenagement.dateAmenagement).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Coût:</span>
                    <span className="text-sm font-medium text-green-600">{service?.cout.toLocaleString('fr-FR')} TND</span>
                  </div>
                </div>
                
                {amenagement.observations && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{amenagement.observations}</p>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewAmenagement(amenagement)}
                    className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedAmenagement(amenagement);
                          setIsFormOpen(true);
                        }}
                        className="bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAmenagement(amenagement.id)}
                        className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredAmenagements.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun aménagement trouvé</p>
        </div>
      )}
    </div>
  );
};

export default AmenagementsList;