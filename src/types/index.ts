export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface Student {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateNaissance: string;
  filiere: string;
  niveau: string;
  statut: 'actif' | 'inactif' | 'diplome';
  dateInscription: string;
}

export interface Lot {
  codeLot: string;
  superficie: number;
  region: string;
  etat: 'disponible' | 'en_amenagement' | 'amenage' | 'occupe';
  prix?: number;
  description?: string;
  dateCreation: string;
}

export interface Service {
  codeServ: string;
  designation: string;
  cout: number;
  duree: number; // in days
  description?: string;
}

export interface Amenagement {
  id: string;
  codeLot: string;
  codeServ: string;
  dateAmenagement: string;
  statut: 'planifie' | 'en_cours' | 'termine' | 'annule';
  observations?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalLots: number;
  totalServices: number;
  totalAmenagements: number;
  activeStudents: number;
  availableLots: number;
  completedAmenagements: number;
}