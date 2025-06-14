import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Lot } from '../../types';

interface LotFormProps {
  lot?: Lot | null;
  onSave: (lot: Omit<Lot, 'codeLot'> & { codeLot?: string }) => void;
  onCancel: () => void;
}

const LotForm: React.FC<LotFormProps> = ({ lot, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    codeLot: '',
    superficie: 0,
    region: '',
    etat: 'disponible' as const,
    prix: 0,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lot) {
      setFormData({
        codeLot: lot.codeLot,
        superficie: lot.superficie,
        region: lot.region,
        etat: lot.etat,
        prix: lot.prix || 0,
        description: lot.description || '',
      });
    }
  }, [lot]);

  const regions = [
        "Ariana",
        "Béja",
        "BenArous",
        "Bizerte",
        "Gabès",
        "Gafsa",
        "Jendouba",
        "Kairouan",
        "Kasserine",
        "Kébili",
        "Kef",
        "Mahdia",
        "Manouba",
        "Médenine",
        "Monastir",
        "Nabeul",
        "Sfax",
        "Sidi Bouzid",
        "Siliana",
        "Sousse",
        "Tataouine",
        "Tozeur",
        "Tunis",
        "Zaghouan",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.codeLot.trim()) newErrors.codeLot = 'Le code du lot est requis';
    if (formData.superficie <= 0) newErrors.superficie = 'La superficie doit être positive';
    if (!formData.region) newErrors.region = 'La région est requise';
    if (formData.prix && formData.prix < 0) newErrors.prix = 'Le prix ne peut pas être négatif';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        prix: formData.prix > 0 ? formData.prix : undefined,
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
            {lot ? 'Modifier le lot' : 'Ajouter un lot'}
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
                Code du lot *
              </label>
              <input
                type="text"
                value={formData.codeLot}
                onChange={(e) => handleChange('codeLot', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${
                  errors.codeLot ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="LOT001"
                disabled={!!lot}
              />
              {errors.codeLot && <p className="text-red-500 text-sm mt-1">{errors.codeLot}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Superficie (m²) *
              </label>
              <input
                type="number"
                value={formData.superficie}
                onChange={(e) => handleChange('superficie', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.superficie ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="500"
                min="1"
              />
              {errors.superficie && <p className="text-red-500 text-sm mt-1">{errors.superficie}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Région *
              </label>
              <select
                value={formData.region}
                onChange={(e) => handleChange('region', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.region ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner une région</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                État
              </label>
              <select
                value={formData.etat}
                onChange={(e) => handleChange('etat', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="disponible">Disponible</option>
                <option value="en_amenagement">En aménagement</option>
                <option value="amenage">Aménagé</option>
                <option value="occupe">Occupé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (TND)
              </label>
              <input
                type="number"
                value={formData.prix}
                onChange={(e) => handleChange('prix', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.prix ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="150000"
                min="0"
              />
              {errors.prix && <p className="text-red-500 text-sm mt-1">{errors.prix}</p>}
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
                placeholder="Description du lot..."
              />
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
              {lot ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LotForm;