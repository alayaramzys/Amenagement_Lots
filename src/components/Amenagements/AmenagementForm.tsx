import React, { useState, useEffect } from 'react';
import { Save, X, Calendar, MapPin, Settings } from 'lucide-react';
import { Amenagement, Lot, Service } from '../../types';

interface AmenagementFormProps {
  amenagement?: Amenagement | null;
  lots: Lot[];
  services: Service[];
  onSave: (amenagement: Omit<Amenagement, 'id'>) => void;
  onCancel: () => void;
}

const AmenagementForm: React.FC<AmenagementFormProps> = ({ 
  amenagement, 
  lots, 
  services, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    codeLot: '',
    codeServ: '',
    dateAmenagement: new Date().toISOString().split('T')[0],
    statut: 'planifie' as const,
    observations: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (amenagement) {
      setFormData({
        codeLot: amenagement.codeLot,
        codeServ: amenagement.codeServ,
        dateAmenagement: amenagement.dateAmenagement,
        statut: amenagement.statut,
        observations: amenagement.observations || '',
      });
    }
  }, [amenagement]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.codeLot) newErrors.codeLot = 'Le lot est requis';
    if (!formData.codeServ) newErrors.codeServ = 'Le service est requis';
    if (!formData.dateAmenagement) newErrors.dateAmenagement = 'La date est requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        observations: formData.observations || undefined,
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectedLot = lots.find(l => l.codeLot === formData.codeLot);
  const selectedService = services.find(s => s.codeServ === formData.codeServ);

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {amenagement ? 'Modifier l\'aménagement' : 'Planifier un aménagement'}
          </h1>
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lot à aménager *
              </label>
              <select
                value={formData.codeLot}
                onChange={(e) => handleChange('codeLot', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.codeLot ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner un lot</option>
                {lots.map(lot => (
                  <option key={lot.codeLot} value={lot.codeLot}>
                    {lot.codeLot} - {lot.region} ({lot.superficie} m²)
                  </option>
                ))}
              </select>
              {errors.codeLot && <p className="text-red-500 text-sm mt-1">{errors.codeLot}</p>}
              {selectedLot && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-sm text-blue-800">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{selectedLot.region} - {selectedLot.superficie} m² - État: {selectedLot.etat}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service à réaliser *
              </label>
              <select
                value={formData.codeServ}
                onChange={(e) => handleChange('codeServ', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.codeServ ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner un service</option>
                {services.map(service => (
                  <option key={service.codeServ} value={service.codeServ}>
                    {service.designation} - {service.cout.toLocaleString('fr-FR')} TND
                  </option>
                ))}
              </select>
              {errors.codeServ && <p className="text-red-500 text-sm mt-1">{errors.codeServ}</p>}
              {selectedService && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center text-sm text-green-800">
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Durée: {selectedService.duree} jours - Coût: {selectedService.cout.toLocaleString('fr-FR')} TND</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'aménagement *
              </label>
              <input
                type="date"
                value={formData.dateAmenagement}
                onChange={(e) => handleChange('dateAmenagement', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.dateAmenagement ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dateAmenagement && <p className="text-red-500 text-sm mt-1">{errors.dateAmenagement}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={formData.statut}
                onChange={(e) => handleChange('statut', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="planifie">Planifié</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
                <option value="annule">Annulé</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observations
              </label>
              <textarea
                value={formData.observations}
                onChange={(e) => handleChange('observations', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Observations sur l'aménagement..."
              />
            </div>
          </div>

          {/* Summary */}
          {selectedLot && selectedService && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Résumé de l'aménagement
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Lot</h4>
                  <p className="text-sm text-gray-600">{selectedLot.codeLot}</p>
                  <p className="text-sm text-gray-600">{selectedLot.region}</p>
                  <p className="text-sm text-gray-600">{selectedLot.superficie} m²</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Service</h4>
                  <p className="text-sm text-gray-600">{selectedService.designation}</p>
                  <p className="text-sm text-gray-600">Durée: {selectedService.duree} jours</p>
                  <p className="text-sm font-semibold text-green-600">{selectedService.cout.toLocaleString('fr-FR')} TND</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Planning</h4>
                  <p className="text-sm text-gray-600">Début: {new Date(formData.dateAmenagement).toLocaleDateString('fr-FR')}</p>
                  <p className="text-sm text-gray-600">
                    Fin prévue: {new Date(new Date(formData.dateAmenagement).getTime() + selectedService.duree * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-sm text-gray-600">Statut: {formData.statut}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {amenagement ? 'Modifier' : 'Planifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AmenagementForm;