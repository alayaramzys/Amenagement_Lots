import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Settings, Clock, Euro } from 'lucide-react';
import { Service } from '../../types';
import { mockServices } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAuth } from '../../contexts/AuthContext';
import ServiceForm from './ServiceForm';

const ServicesList: React.FC = () => {
  const { user } = useAuth();
  const [services, setServices] = useLocalStorage<Service[]>('services', mockServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCost, setFilterCost] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewService, setViewService] = useState<Service | null>(null);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.codeServ.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCost = filterCost === 'all' || 
                       (filterCost === 'low' && service.cout < 15000) ||
                       (filterCost === 'medium' && service.cout >= 15000 && service.cout < 25000) ||
                       (filterCost === 'high' && service.cout >= 25000);
    
    return matchesSearch && matchesCost;
  });

  const handleSaveService = (serviceData: Omit<Service, 'codeServ'> & { codeServ?: string }) => {
    if (selectedService) {
      setServices(prev => prev.map(s => 
        s.codeServ === selectedService.codeServ ? { ...serviceData, codeServ: selectedService.codeServ } as Service : s
      ));
    } else {
      const newService: Service = {
        ...serviceData,
        codeServ: serviceData.codeServ || `SRV${Date.now()}`,
      };
      setServices(prev => [...prev, newService]);
    }
    setIsFormOpen(false);
    setSelectedService(null);
  };

  const handleDeleteService = (codeServ: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      setServices(prev => prev.filter(s => s.codeServ !== codeServ));
    }
  };

  const getCostColor = (cost: number) => {
    if (cost < 15000) return 'text-green-600 bg-green-50';
    if (cost < 25000) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const isAdmin = user?.role === 'admin';

  if (isFormOpen && isAdmin) {
    return (
      <ServiceForm
        service={selectedService}
        onSave={handleSaveService}
        onCancel={() => {
          setIsFormOpen(false);
          setSelectedService(null);
        }}
      />
    );
  }

  if (viewService) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Détails du service</h1>
            <button
              onClick={() => setViewService(null)}
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
                  <label className="text-sm font-medium text-gray-600">Code du service</label>
                  <p className="text-gray-900 font-mono">{viewService.codeServ}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Désignation</label>
                  <p className="text-gray-900">{viewService.designation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-900">{viewService.description || 'Aucune description'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails financiers</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Coût</label>
                  <p className={`text-2xl font-bold px-3 py-1 rounded-lg inline-block ${getCostColor(viewService.cout)}`}>
                    {viewService.cout.toLocaleString('fr-FR')} TND
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Durée</label>
                  <p className="text-gray-900 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {viewService.duree} jours
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Coût par jour</label>
                  <p className="text-gray-900">
                    {Math.round(viewService.cout / viewService.duree).toLocaleString('fr-FR')} TND/jour
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {isAdmin && (
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setSelectedService(viewService);
                  setViewService(null);
                  setIsFormOpen(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </button>
              <button
                onClick={() => handleDeleteService(viewService.codeServ)}
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? 'Gestion des Services' : 'Consulter les Services'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin ? 'Gérer les services d\'aménagement disponibles' : 'Parcourir les services disponibles'}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un service
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-3xl font-bold text-gray-900">{services.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Coût Moyen</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(services.reduce((acc, s) => acc + s.cout, 0) / services.length).toLocaleString('fr-FR')} TND
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <Euro className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Durée Moyenne</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(services.reduce((acc, s) => acc + s.duree, 0) / services.length)} j
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Services Actifs</p>
              <p className="text-3xl font-bold text-gray-900">{filteredServices.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-50">
              <Eye className="h-6 w-6 text-orange-600" />
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
              placeholder="Rechercher un service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterCost}
            onChange={(e) => setFilterCost(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les coûts</option>
            <option value="low">Économique (&lt; 15kTND)</option>
            <option value="medium">Standard (15k-25kTND)</option>
            <option value="high">Premium (&gt; 25kTND)</option>
          </select>
          
          <div className="flex items-center text-sm text-gray-600">
            <Settings className="h-4 w-4 mr-2" />
            {filteredServices.length} service(s)
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.codeServ} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-mono">{service.codeServ}</h3>
                  <p className="text-sm text-gray-600 mt-1">{service.designation}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCostColor(service.cout)}`}>
                  {service.cout.toLocaleString('fr-FR')} TND
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Durée:</span>
                  <span className="text-sm font-medium flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {service.duree} jours
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Coût/jour:</span>
                  <span className="text-sm font-medium">
                    {Math.round(service.cout / service.duree).toLocaleString('fr-FR')} TND
                  </span>
                </div>
              </div>
              
              {service.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
              )}
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewService(service)}
                  className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Voir
                </button>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setIsFormOpen(true);
                      }}
                      className="bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.codeServ)}
                      className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun service trouvé</p>
        </div>
      )}
    </div>
  );
};

export default ServicesList;