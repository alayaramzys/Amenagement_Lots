import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Service } from '../../types';

interface ServiceFormProps {
  service?: Service | null;
  onSave: (service: Omit<Service, 'codeServ'> & { codeServ?: string }) => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    codeServ: '',
    designation: '',
    cout: 0,
    duree: 0,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (service) {
      setFormData({
        codeServ: service.codeServ,
        designation: service.designation,
        cout: service.cout,
        duree: service.duree,
        description: service.description || '',
      });
    }
  }, [service]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.codeServ.trim()) newErrors.codeServ = 'Le code du service est requis';
    if (!formData.designation.trim()) newErrors.designation = 'La désignation est requise';
    if (formData.cout <= 0) newErrors.cout = 'Le coût doit être positif';
    if (formData.duree <= 0) newErrors.duree = 'La durée doit être positive';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        description: formData.description || undefined,
      });
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {service ? 'Modifier le service' : 'Ajouter un service'}
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
                Code du service *
              </label>
              <input
                type="text"
                value={formData.codeServ}
                onChange={(e) => handleChange('codeServ', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${
                  errors.codeServ ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="SRV001"
                disabled={!!service}
              />
              {errors.codeServ && <p className="text-red-500 text-sm mt-1">{errors.codeServ}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Désignation *
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => handleChange('designation', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.designation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nom du service"
              />
              {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coût (TND) *
              </label>
              <input
                type="number"
                value={formData.cout}
                onChange={(e) => handleChange('cout', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.cout ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="15000"
                min="1"
              />
              {errors.cout && <p className="text-red-500 text-sm mt-1">{errors.cout}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée (jours) *
              </label>
              <input
                type="number"
                value={formData.duree}
                onChange={(e) => handleChange('duree', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.duree ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="30"
                min="1"
              />
              {errors.duree && <p className="text-red-500 text-sm mt-1">{errors.duree}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Description détaillée du service..."
              />
            </div>

            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Calculs automatiques</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Coût par jour:</span>
                  <span className="ml-2 font-medium">
                    {formData.cout && formData.duree ? 
                      `${Math.round(formData.cout / formData.duree).toLocaleString('fr-FR')} TND/jour` : 
                      'N/A'
                    }
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Coût total:</span>
                  <span className="ml-2 font-medium">
                    {formData.cout ? `${formData.cout.toLocaleString('fr-FR')} TND` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

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
              {service ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;