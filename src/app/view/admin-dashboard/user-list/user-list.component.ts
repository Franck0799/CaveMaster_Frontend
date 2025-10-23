// ===== FICHIER: user-lists.component.ts =====
// Ce composant affiche la liste des utilisateurs (managers et employés)

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface pour représenter un utilisateur (employé ou manager)
interface User {
  id: string;           // Identifiant unique de l'utilisateur
  firstName: string;    // Prénom de l'utilisateur
  lastName: string;     // Nom de famille
  email: string;        // Adresse email
  phone: string;        // Numéro de téléphone
  role: string;         // Rôle (Manager, Vendeur, Caissier, etc.)
  avatar: string;       // Emoji d'avatar
  cave: string;         // Cave d'affectation
  status: 'active' | 'inactive' | 'on-leave'; // Statut du collaborateur
  joinDate: string;     // Date d'embauche
  performance: {
    sales: number;      // Montant total des ventes
    hours: number;      // Heures travaillées
    satisfaction: string; // Note de satisfaction
  };
}

// Interface pour les filtres de recherche
interface FilterOptions {
  searchTerm: string;   // Terme de recherche général
  role: string;         // Filtre par rôle
  cave: string;         // Filtre par cave
  status: string;       // Filtre par statut
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  // Import du module CommonModule pour *ngIf, *ngFor, etc.
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListsComponent implements OnInit {

  // ===== PROPRIÉTÉS DU COMPOSANT =====

  // Liste complète des utilisateurs
  users: User[] = [];

  // Liste filtrée des utilisateurs à afficher
  filteredUsers: User[] = [];

  // Utilisateur sélectionné pour voir les détails
  selectedUser: User | null = null;

  // Flag pour afficher le détail d'un utilisateur
  isDetailModalOpen: boolean = false;

  // Options de filtre actuelles
  filters: FilterOptions = {
    searchTerm: '',
    role: '',
    cave: '',
    status: ''
  };

  // Liste des rôles disponibles pour le filtrage
  roles: string[] = [
    'Manager Principal',
    'Manager Adjoint',
    'Manager Nuit',
    'Caissier(ère)',
    'Vendeur(se)',
    'Magasinier',
    'Livreur',
    'Assistant(e)',
    'Sommelier',
    'Conseiller(ère)'
  ];

  // Liste des caves disponibles
  caves: string[] = [
    'Cave Principale',
    'Cave Secondaire',
    'Cave Premium'
  ];

  // Statuts disponibles pour le filtrage
  statuses: string[] = ['active', 'inactive', 'on-leave'];

  // Tri actuel (nom du champ et direction)
  sortField: string = 'lastName';  // Champ sur lequel trier
  sortDirection: 'asc' | 'desc' = 'asc'; // Direction du tri

  // Pagination
  currentPage: number = 1;      // Page actuelle
  itemsPerPage: number = 10;    // Nombre d'items par page
  totalPages: number = 1;       // Nombre total de pages

  // ===== CONSTRUCTEUR =====
  constructor() {}

  // ===== MÉTHODE D'INITIALISATION =====
  ngOnInit(): void {
    // Charge les données des utilisateurs au démarrage
    this.loadUsers();

    // Applique les filtres et affiche les utilisateurs
    this.applyFilters();
  }

  // ===== MÉTHODE DE CHARGEMENT DES UTILISATEURS =====
  /**
   * Charge la liste de tous les utilisateurs
   * À remplacer par un appel API backend
   */
  loadUsers(): void {
    // Données mockées des utilisateurs
    this.users = [
      {
        id: 'user_1',
        firstName: 'Jean',
        lastName: 'Kouassi',
        email: 'jean.kouassi@drinkstore.com',
        phone: '+234 801 234 5678',
        role: 'Manager Principal',
        avatar: '👨‍💼',
        cave: 'Cave Principale',
        status: 'active',
        joinDate: '2023-01-15',
        performance: { sales: 2500000, hours: 160, satisfaction: '96%' }
      },
      {
        id: 'user_2',
        firstName: 'Marie',
        lastName: 'Diabate',
        email: 'marie.diabate@drinkstore.com',
        phone: '+234 802 345 6789',
        role: 'Manager Adjoint',
        avatar: '👩‍💼',
        cave: 'Cave Principale',
        status: 'active',
        joinDate: '2023-03-20',
        performance: { sales: 1800000, hours: 158, satisfaction: '94%' }
      },
      {
        id: 'user_3',
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'alice.martin@drinkstore.com',
        phone: '+234 803 456 7890',
        role: 'Caissière',
        avatar: '👩',
        cave: 'Cave Principale',
        status: 'active',
        joinDate: '2023-02-10',
        performance: { sales: 450000, hours: 160, satisfaction: '92%' }
      },
      {
        id: 'user_4',
        firstName: 'Bob',
        lastName: 'Traore',
        email: 'bob.traore@drinkstore.com',
        phone: '+234 804 567 8901',
        role: 'Magasinier',
        avatar: '👨',
        cave: 'Cave Principale',
        status: 'active',
        joinDate: '2023-04-05',
        performance: { sales: 380000, hours: 158, satisfaction: '88%' }
      },
      {
        id: 'user_5',
        firstName: 'Sophie',
        lastName: 'Bakayoko',
        email: 'sophie.bakayoko@drinkstore.com',
        phone: '+234 805 678 9012',
        role: 'Manager Principal',
        avatar: '👩‍💼',
        cave: 'Cave Secondaire',
        status: 'active',
        joinDate: '2023-05-18',
        performance: { sales: 1900000, hours: 160, satisfaction: '93%' }
      },
      {
        id: 'user_6',
        firstName: 'Thomas',
        lastName: 'Diarra',
        email: 'thomas.diarra@drinkstore.com',
        phone: '+234 806 789 0123',
        role: 'Manager Adjoint',
        avatar: '👨‍💼',
        cave: 'Cave Secondaire',
        status: 'inactive',
        joinDate: '2023-06-22',
        performance: { sales: 1500000, hours: 155, satisfaction: '90%' }
      },
      {
        id: 'user_7',
        firstName: 'Claire',
        lastName: 'Diop',
        email: 'claire.diop@drinkstore.com',
        phone: '+234 807 890 1234',
        role: 'Vendeuse',
        avatar: '👩',
        cave: 'Cave Principale',
        status: 'on-leave',
        joinDate: '2023-07-14',
        performance: { sales: 520000, hours: 140, satisfaction: '95%' }
      },
      {
        id: 'user_8',
        firstName: 'David',
        lastName: 'Kone',
        email: 'david.kone@drinkstore.com',
        phone: '+234 808 901 2345',
        role: 'Livreur',
        avatar: '👨',
        cave: 'Cave Principale',
        status: 'active',
        joinDate: '2023-08-25',
        performance: { sales: 290000, hours: 155, satisfaction: '87%' }
      }
    ];
  }

  // ===== MÉTHODE D'APPLICATION DES FILTRES =====
  /**
   * Applique tous les filtres et le tri sur la liste des utilisateurs
   */
  applyFilters(): void {
    // Commence avec la liste complète des utilisateurs
    let result = [...this.users];

    // Filtre par terme de recherche (prénom, nom, email)
    if (this.filters.searchTerm.trim()) {
      // Convertit le terme de recherche en minuscules pour comparaison insensible à la casse
      const searchTerm = this.filters.searchTerm.toLowerCase();

      // Filtre les utilisateurs dont le prénom, nom ou email contient le terme
      result = result.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    // Filtre par rôle si un rôle est sélectionné
    if (this.filters.role) {
      // Garde seulement les utilisateurs avec le rôle sélectionné
      result = result.filter(user => user.role === this.filters.role);
    }

    // Filtre par cave si une cave est sélectionnée
    if (this.filters.cave) {
      // Garde seulement les utilisateurs affectés à la cave sélectionnée
      result = result.filter(user => user.cave === this.filters.cave);
    }

    // Filtre par statut si un statut est sélectionné
    if (this.filters.status) {
      // Garde seulement les utilisateurs avec le statut sélectionné
      result = result.filter(user => user.status === this.filters.status);
    }

    // Applique le tri sur les résultats filtrés
    this.sortUsers(result);

    // Applique la pagination sur les résultats triés
    this.applyPagination(result);
  }

  // ===== MÉTHODE DE TRI =====
  /**
   * Trie les utilisateurs selon le champ et la direction définis
   * @param users La liste des utilisateurs à trier
   */
  private sortUsers(users: User[]): void {
    // Trie le tableau en place en fonction du champ de tri
    users.sort((a, b) => {
      // Récupère les valeurs du champ pour chaque utilisateur
      // Utilise `any` pour accéder aux propriétés dynamiquement
      const valueA = (a as any)[this.sortField];
      const valueB = (b as any)[this.sortField];

      // Compare les valeurs (pour les strings et numbers)
      if (typeof valueA === 'string') {
        // Pour les strings, compare en ignorant la casse
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        // Pour les nombres, soustrait les valeurs
        return this.sortDirection === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }
    });
  }

  // ===== MÉTHODE DE PAGINATION =====
  /**
   * Applique la pagination sur la liste filtrée et triée
   * @param users La liste complète des utilisateurs filtrés
   */
  private applyPagination(users: User[]): void {
    // Calcule le nombre total de pages
    this.totalPages = Math.ceil(users.length / this.itemsPerPage);

    // Garantit que la page actuelle est valide
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    // Calcule l'index de départ pour la page actuelle
    // Par exemple, page 1 (0-based) : 0 * 10 = 0
    // Page 2 : 1 * 10 = 10
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;

    // Calcule l'index de fin
    // Par exemple, page 1 : 0 + 10 = 10
    const endIndex = startIndex + this.itemsPerPage;

    // Récupère les utilisateurs pour la page actuelle
    this.filteredUsers = users.slice(startIndex, endIndex);
  }

  // ===== MÉTHODE DE CHANGEMENT DE TRI =====
  /**
   * Change le champ de tri et applique les filtres
   * @param field Le nom du champ sur lequel trier
   */
  changeSortField(field: string): void {
    // Vérifie si le champ de tri est déjà celui cliqué
    if (this.sortField === field) {
      // Si oui, inverse la direction du tri
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Sinon, définit le nouveau champ de tri
      this.sortField = field;
      // Réinitialise la direction à ascendant
      this.sortDirection = 'asc';
    }

    // Réinitialise à la première page avec le nouveau tri
    this.currentPage = 1;

    // Réapplique les filtres avec le nouveau tri
    this.applyFilters();
  }

  // ===== MÉTHODE DE RECHERCHE =====
  /**
   * Met à jour le terme de recherche et réapplique les filtres
   * @param term Le terme de recherche
   */
  onSearch(term: string): void {
    // Stocke le terme de recherche dans les filtres
    this.filters.searchTerm = term;

    // Réinitialise à la première page (nouvelle recherche)
    this.currentPage = 1;

    // Réapplique tous les filtres avec le nouveau terme
    this.applyFilters();
  }

  // ===== MÉTHODE DE CHANGEMENT DE FILTRE =====
  /**
   * Change les filtres et réapplique
   * @param filterName Le nom du filtre (role, cave, status)
   * @param value La nouvelle valeur du filtre
   */
  onFilterChange(filterName: string, value: string): void {
    // Met à jour le filtre spécifié (dynamiquement)
    (this.filters as any)[filterName] = value;

    // Réinitialise à la première page (nouveaux filtres)
    this.currentPage = 1;

    // Réapplique tous les filtres
    this.applyFilters();
  }

  // ===== MÉTHODE D'AFFICHAGE DES DÉTAILS =====
  /**
   * Affiche les détails d'un utilisateur sélectionné
   * @param user L'utilisateur dont afficher les détails
   */
  viewUserDetails(user: User): void {
    // Stocke l'utilisateur sélectionné
    this.selectedUser = user;

    // Ouvre le modal des détails
    this.isDetailModalOpen = true;
  }

  // ===== MÉTHODE DE FERMETURE DU MODAL =====
  /**
   * Ferme le modal des détails utilisateur
   */
  closeDetailModal(): void {
    // Ferme le modal
    this.isDetailModalOpen = false;

    // Efface la sélection d'utilisateur
    this.selectedUser = null;
  }

  // ===== MÉTHODE DE CHANGEMENT DE PAGE =====
  /**
   * Change la page active en pagination
   * @param page Le numéro de la page à afficher
   */
  goToPage(page: number): void {
    // Vérifie que la page demandée est valide (entre 1 et totalPages)
    if (page >= 1 && page <= this.totalPages) {
      // Définit la nouvelle page actuelle
      this.currentPage = page;

      // Réapplique les filtres pour mettre à jour l'affichage
      this.applyFilters();
    }
  }

  // ===== MÉTHODE PAGE SUIVANTE =====
  /**
   * Passe à la page suivante
   */
  nextPage(): void {
    // Vérifie qu'il y a une page suivante
    if (this.currentPage < this.totalPages) {
      // Passe à la page suivante
      this.goToPage(this.currentPage + 1);
    }
  }

  // ===== MÉTHODE PAGE PRÉCÉDENTE =====
  /**
   * Revient à la page précédente
   */
  previousPage(): void {
    // Vérifie qu'il y a une page précédente
    if (this.currentPage > 1) {
      // Revient à la page précédente
      this.goToPage(this.currentPage - 1);
    }
  }

  // ===== MÉTHODE DE RÉINITIALISATION DES FILTRES =====
  /**
   * Réinitialise tous les filtres
   */
  resetFilters(): void {
    // Réinitialise l'objet filtres avec des valeurs vides
    this.filters = {
      searchTerm: '',
      role: '',
      cave: '',
      status: ''
    };

    // Réinitialise la pagination à la première page
    this.currentPage = 1;

    // Réapplique les filtres (avec des filtres vides)
    this.applyFilters();
  }

  // ===== MÉTHODE DE CALCUL DE STATISTIQUES =====
  /**
   * Calcule les statistiques globales des utilisateurs filtrés
   * @returns L'objet contenant les statistiques
   */
  getStatistics(): { totalSales: number; totalHours: number; averageSatisfaction: string } {
    // Initialise les accumulateurs
    let totalSales = 0;
    let totalHours = 0;
    let satisfactionValues: number[] = [];

    // Parcourt chaque utilisateur filtré
    this.filteredUsers.forEach(user => {
      // Ajoute les ventes de cet utilisateur au total
      totalSales += user.performance.sales;
      // Ajoute les heures de cet utilisateur au total
      totalHours += user.performance.hours;
      // Extrait le nombre de satisfaction (enlève le %)
      const satisfaction = parseInt(user.performance.satisfaction);
      // Ajoute la valeur à la liste des satisfactions
      satisfactionValues.push(satisfaction);
    });

    // Calcule la moyenne des satisfactions
    const averageSatisfaction = satisfactionValues.length > 0
      ? (satisfactionValues.reduce((a, b) => a + b, 0) / satisfactionValues.length).toFixed(0)
      : '0';

    // Retourne les statistiques calculées
    return {
      totalSales,
      totalHours,
      averageSatisfaction: averageSatisfaction + '%'
    };
  }

  // ===== MÉTHODE DE FORMATAGE DE NOMBRE =====
  /**
   * Formate un nombre en format monétaire
   * @param value La valeur à formater
   * @returns La valeur formatée
   */
  formatCurrency(value: number): string {
    // Convertit le nombre en string avec séparateur de milliers
    return value.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'XOF' // Franc CFA d'Afrique de l'Ouest
    });
  }

  // ===== MÉTHODE DE DÉTERMINATION DE BADGE DE STATUT =====
  /**
   * Retourne le CSS class pour le badge de statut
   * @param status Le statut de l'utilisateur
   * @returns La classe CSS correspondante
   */
  getStatusBadgeClass(status: string): string {
    // Retourne une classe CSS différente selon le statut
    switch (status) {
      case 'active':
        // Utilisateur actif (vert)
        return 'badge-active';
      case 'inactive':
        // Utilisateur inactif (gris)
        return 'badge-inactive';
      case 'on-leave':
        // Utilisateur en congé (orange)
        return 'badge-on-leave';
      default:
        // Cas par défaut (ne devrait pas se produire)
        return 'badge-inactive';
    }
  }

  // ===== MÉTHODE DE TRADUCTION DE STATUT =====
  /**
   * Traduit le statut en français
   * @param status Le statut en anglais
   * @returns Le statut traduit
   */
  getStatusLabel(status: string): string {
    // Retourne la traduction du statut
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'on-leave':
        return 'En congé';
      default:
        return status;
    }
  }
}
