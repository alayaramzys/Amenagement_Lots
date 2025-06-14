import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { Student } from '../../types';
import { mockStudents } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import StudentForm from './StudentForm';

const StudentsList: React.FC = () => {
  const [students, setStudents] = useLocalStorage<Student[]>('students', mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterFiliere, setFilterFiliere] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);

  const filieres = [...new Set(students.map(s => s.filiere))];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.statut === filterStatus;
    const matchesFiliere = filterFiliere === 'all' || student.filiere === filterFiliere;
    
    return matchesSearch && matchesStatus && matchesFiliere;
  });

  const handleSaveStudent = (studentData: Omit<Student, 'id'>) => {
    if (selectedStudent) {
      setStudents(prev => prev.map(s => 
        s.id === selectedStudent.id ? { ...studentData, id: selectedStudent.id } : s
      ));
    } else {
      const newStudent: Student = {
        ...studentData,
        id: Date.now().toString(),
      };
      setStudents(prev => [...prev, newStudent]);
    }
    setIsFormOpen(false);
    setSelectedStudent(null);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'diplome': return 'bg-blue-100 text-blue-800';
      case 'inactif': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isFormOpen) {
    return (
      <StudentForm
        student={selectedStudent}
        onSave={handleSaveStudent}
        onCancel={() => {
          setIsFormOpen(false);
          setSelectedStudent(null);
        }}
      />
    );
  }

  if (viewStudent) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Détails de l'étudiant</h1>
            <button
              onClick={() => setViewStudent(null)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Retour
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nom complet</label>
                  <p className="text-gray-900">{viewStudent.prenom} {viewStudent.nom}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{viewStudent.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Téléphone</label>
                  <p className="text-gray-900">{viewStudent.telephone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Adresse</label>
                  <p className="text-gray-900">{viewStudent.adresse}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date de naissance</label>
                  <p className="text-gray-900">{new Date(viewStudent.dateNaissance).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations académiques</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Filière</label>
                  <p className="text-gray-900">{viewStudent.filiere}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Niveau</label>
                  <p className="text-gray-900">{viewStudent.niveau}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Statut</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewStudent.statut)}`}>
                    {viewStudent.statut}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date d'inscription</label>
                  <p className="text-gray-900">{new Date(viewStudent.dateInscription).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => {
                setSelectedStudent(viewStudent);
                setViewStudent(null);
                setIsFormOpen(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </button>
            <button
              onClick={() => handleDeleteStudent(viewStudent.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Étudiants</h1>
          <p className="text-gray-600 mt-1">Gérer les étudiants inscrits dans le système</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un étudiant
        </button>
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="diplome">Diplômé</option>
          </select>
          
          <select
            value={filterFiliere}
            onChange={(e) => setFilterFiliere(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les filières</option>
            {filieres.map(filiere => (
              <option key={filiere} value={filiere}>{filiere}</option>
            ))}
          </select>
          
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {filteredStudents.length} étudiant(s)
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Étudiant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Formation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {student.prenom} {student.nom}
                      </div>
                      <div className="text-sm text-gray-500">
                        Inscrit le {new Date(student.dateInscription).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.email}</div>
                    <div className="text-sm text-gray-500">{student.telephone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.filiere}</div>
                    <div className="text-sm text-gray-500">{student.niveau}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.statut)}`}>
                      {student.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewStudent(student)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setIsFormOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun étudiant trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsList;