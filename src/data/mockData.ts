import { Student, Lot, Service, Amenagement } from '../types';

export const mockStudents: Student[] = [
  {
      id: "1",
      nom: "Mohammed",
      prenom: "Bouallagui",
      email: "Mohammed.Bouallagui@gmail.com",
      telephone: "0123456789",
      adresse: "123 Rue de la Paix, Sousse",
      dateNaissance: "1998-05-15",
      filiere: "Informatique",
      niveau: "Master 2",
      statut: "actif",
      dateInscription: "2022-09-01",
    },
    {
      id: "2",
      nom: "Znina",
      prenom: "Mohammed",
      email: "Mohammed.Znina@gmail.com",
      telephone: "0123456789",
      adresse: "123 Rue de la Paix, Sousse",
      dateNaissance: "1998-05-15",
      filiere: "Informatique",
      niveau: "Master 2",
      statut: "actif",
      dateInscription: "2022-09-01",
    },
    {
      id: "3",
      nom: "Sakhraoui",
      prenom: "Fawzi",
      email: "Fawzi.Sakhraoui@gmail.com",
      telephone: "0123456789",
      adresse: "123 Rue de la Paix, Sousse",
      dateNaissance: "1998-05-15",
      filiere: "Informatique",
      niveau: "Master 2",
      statut: "actif",
      dateInscription: "2022-09-01",
    },
];

export const mockLots: Lot[] = [
  {
    codeLot: 'LOT001',
    superficie: 500,
    region: 'Sousse',
    etat: 'disponible',
    prix: 150000,
    description: 'Lot résidentiel avec vue sur parc',
    dateCreation: '2023-01-15',
  },
  {
    codeLot: 'LOT002',
    superficie: 750,
    region: 'Monastir',
    etat: 'en_amenagement',
    prix: 200000,
    description: 'Lot commercial en centre-ville',
    dateCreation: '2023-02-20',
  },
  {
    codeLot: 'LOT003',
    superficie: 1000,
    region: 'Mahdia',
    etat: 'amenage',
    prix: 180000,
    description: 'Lot industriel proche autoroute',
    dateCreation: '2023-03-10',
  },
];

export const mockServices: Service[] = [
  {
    codeServ: 'SRV001',
    designation: 'Viabilisation électrique',
    cout: 15000,
    duree: 30,
    description: 'Installation complète du réseau électrique',
  },
  {
    codeServ: 'SRV002',
    designation: 'Raccordement eau potable',
    cout: 12000,
    duree: 20,
    description: 'Raccordement au réseau d\'eau potable municipal',
  },
  {
    codeServ: 'SRV003',
    designation: 'Aménagement voirie',
    cout: 25000,
    duree: 45,
    description: 'Construction des routes et trottoirs',
  },
];

export const mockAmenagements: Amenagement[] = [
  {
    id: '1',
    codeLot: 'LOT001',
    codeServ: 'SRV001',
    dateAmenagement: '2024-01-15',
    statut: 'planifie',
    observations: 'Début des travaux prévu',
  },
  {
    id: '2',
    codeLot: 'LOT002',
    codeServ: 'SRV002',
    dateAmenagement: '2023-12-01',
    statut: 'en_cours',
    observations: 'Travaux en cours depuis 2 semaines',
  },
  {
    id: '3',
    codeLot: 'LOT003',
    codeServ: 'SRV003',
    dateAmenagement: '2023-11-15',
    statut: 'termine',
    observations: 'Travaux terminés avec succès',
  },
];