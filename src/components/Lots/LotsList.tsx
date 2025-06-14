import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, MapPin } from 'lucide-react';
import { Lot } from '../../types';
import { mockLots } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAuth } from '../../contexts/AuthContext';
import LotForm from './LotForm';

const LotsList: React.FC = () => {
  const { user } = useAuth();
  const [lots, setLots] = useLocalStorage<Lot[]>('lots', mockLots);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterEtat, setFilterEtat] = useState<string>('all');
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewLot, setViewLot] = useState<Lot | null>(null);

  const regions = [...new Set(lots.map(l => l.region))];

  const filteredLots = lots.filter(lot => {
    const matchesSearch = lot.codeLot.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lot.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'all' || lot.region === filterRegion;
    const matchesEtat = filterEtat === 'all' || lot.etat === filterEtat;
    
    return matchesSearch && matchesRegion && matchesEtat;
  });

  const handleSaveLot = (lotData: Omit<Lot, 'codeLot'> & { codeLot?: string }) => {
    if (selectedLot) {
      setLots(prev => prev.map(l => 
        l.codeLot === selectedLot.codeLot ? { ...lotData, codeLot: selectedLot.codeLot } as Lot : l
      ));
    } else {
      const newLot: Lot = {
        ...lotData,
        codeLot: lotData.codeLot || `LOT${Date.now()}`,
        dateCreation: new Date().toISOString().split('T')[0],
      };
      setLots(prev => [...prev, newLot]);
    }
    setIsFormOpen(false);
    setSelectedLot(null);
  };

  const handleDeleteLot = (codeLot: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce lot ?')) {
      setLots(prev => prev.filter(l => l.codeLot !== codeLot));
    }
  };

  const getEtatColor = (etat: string) => {
    switch (etat) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'en_amenagement': return 'bg-yellow-100 text-yellow-800';
      case 'amenage': return 'bg-blue-100 text-blue-800';
      case 'occupe': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isAdmin = user?.role === 'admin';

  if (isFormOpen && isAdmin) {
    return (
      <LotForm
        lot={selectedLot}
        onSave={handleSaveLot}
        onCancel={() => {
          setIsFormOpen(false);
          setSelectedLot(null);
        }}
      />
    );
  }

  if (viewLot) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Détails du lot</h1>
            <button
              onClick={() => setViewLot(null)}
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
                  <label className="text-sm font-medium text-gray-600">Code du lot</label>
                  <p className="text-gray-900 font-mono">{viewLot.codeLot}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Superficie</label>
                  <p className="text-gray-900">{viewLot.superficie} m²</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Région</label>
                  <p className="text-gray-900 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {viewLot.region}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">État</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEtatColor(viewLot.etat)}`}>
                    {viewLot.etat.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date de création</label>
                  <p className="text-gray-900">{new Date(viewLot.dateCreation).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails commerciaux</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Prix</label>
                  <p className="text-gray-900 text-xl font-semibold">
                    {viewLot.prix ? `${viewLot.prix.toLocaleString('fr-FR')} TND` : 'Non spécifié'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-900">{viewLot.description || 'Aucune description'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Prix au m²</label>
                  <p className="text-gray-900">
                    {viewLot.prix ? `${Math.round(viewLot.prix / viewLot.superficie).toLocaleString('fr-FR')} TND/m²` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {isAdmin && (
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setSelectedLot(viewLot);
                  setViewLot(null);
                  setIsFormOpen(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </button>
              <button
                onClick={() => handleDeleteLot(viewLot.codeLot)}
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
            {isAdmin ? 'Gestion des Lots' : 'Consulter les Lots'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin ? 'Gérer les lots disponibles pour aménagement' : 'Parcourir les lots disponibles'}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un lot
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les régions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          
          <select
            value={filterEtat}
            onChange={(e) => setFilterEtat(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les états</option>
            <option value="disponible">Disponible</option>
            <option value="en_amenagement">En aménagement</option>
            <option value="amenage">Aménagé</option>
            <option value="occupe">Occupé</option>
          </select>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {filteredLots.length} lot(s)
          </div>
        </div>
      </div>

      {/* Lots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLots.map((lot) => (
          <div key={lot.codeLot} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-mono">{lot.codeLot}</h3>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {lot.region}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEtatColor(lot.etat)}`}>
                  {lot.etat.replace('_', ' ')}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Superficie:</span>
                  <span className="text-sm font-medium">{lot.superficie} m²</span>
                </div>
                {lot.prix && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Prix:</span>
                    <span className="text-sm font-medium">{lot.prix.toLocaleString('fr-FR')} TND</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Créé le:</span>
                  <span className="text-sm font-medium">{new Date(lot.dateCreation).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              
              {lot.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{lot.description}</p>
              )}
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewLot(lot)}
                  className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Voir
                </button>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedLot(lot);
                        setIsFormOpen(true);
                      }}
                      className="bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLot(lot.codeLot)}
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
      
      {filteredLots.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun lot trouvé</p>
        </div>
      )}
    </div>
  );
};

export default LotsList;