// ===== FICHIER: cave-lists.component.ts =====
// Ce composant gère l'affichage de la liste des caves avec pagination

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interface pour une cave
interface Cave {
  id: string;              // Identifiant unique
  name: string;            // Nom de la cave
  location: string;        // Localisation
  description: string;     // Description
  capacity: number;        // Capacité totale
  bottles: number;         // Bouteilles actuelles
  managersCount: number;   // Nombre de managers
  employeesCount: number;  // Nombre d'employés
  productivity: number;    // Pourcentage de productivité
  createdDate: Date;       // Date de création
}

// Interface pour les filtres
interface FilterOptions {
  searchTerm: string;      // Terme de recherche
  location: string;        // Localisation filtrée
  capacity: string;        // Capacité filtrée
}

@Component({
  selector: 'app-cave-lists',
  standalone: true,
  // Imports des modules nécessaires
  imports: [CommonModule, FormsModule],
  templateUrl: './cave-lists.component.html',
  styleUrls: ['./cave-lists.component.scss']
})
export class CaveListsComponent implements OnInit {

  // ===== PROPRIÉTÉS DU COMPOSANT =====

  // Liste complète des caves
  caves: Cave[] = [];

  // Liste filtrée des caves à afficher
  filteredCaves: Cave[] = [];

  // Cave sélectionnée pour afficher les détails
  selectedCave: Cave | null = null;

  // Options de filtre actuelles
  filters: FilterOptions = {
    searchTerm: '',
    location: '',
    capacity: ''
  };

  // Messages de feedback
  message: string = '';
  messageType: 'success' | 'error' | 'info' = 'info';

  // Liste des régions disponibles
  regions: string[] = [
    'Lekki Phase 1, Lagos',
    'Victoria Island, Lagos',
    'Ikoyi, Lagos',
    'Ajah, Lagos',
    'Ikeja, Lagos',
    'Surulere, Lagos',
    'Bariga, Lagos'
  ];

  // Flags pour les modals
  isDetailModalOpen: boolean = false;
  isEditModalOpen: boolean = false;

  // Pagination
  currentPage: number = 1;       // Page actuelle
  itemsPerPage: number = 6;      // Items par page
  totalPages: number = 1;        // Total de pages

  // ===== CONSTRUCTEUR =====
  constructor() {}

  // ===== MÉTHODE D'INITIALISATION =====
  ngOnInit(): void {
    // Charge les données des caves au démarrage
    this.loadCaves();
    // Applique les filtres initiaux
    this.applyFilters();
  }

  // ===== MÉTHODE DE CHARGEMENT DES CAVES =====
  /**
   * Charge la liste de toutes les caves
   * À remplacer par un appel API backend
   */
  loadCaves(): void {
    // Données mockées des caves
    this.caves = [
      {
        id: 'cave_1',
        name: 'Cave Principale',
        location: 'Lekki Phase 1, Lagos',
        description: 'Cave principale avec température et humidité contrôlées',
        capacity: 500,
        bottles: 450,
        managersCount: 3,
        employeesCount: 12,
        productivity: 87,
        createdDate: new Date('2023-01-15')
      },
      {
        id: 'cave_2',
        name: 'Cave Secondaire',
        location: 'Victoria Island, Lagos',
        description: 'Cave secondaire pour stocks additionnels',
        capacity: 350,
        bottles: 280,
        managersCount: 2,
        employeesCount: 8,
        productivity: 92,
        createdDate: new Date('2023-03-20')
      },
      {
        id: 'cave_3',
        name: 'Cave Premium',
        location: 'Ikoyi, Lagos',
        description: 'Cave premium pour les sélections spéciales',
        capacity: 200,
        bottles: 185,
        managersCount: 1,
        employeesCount: 5,
        productivity: 95,
        createdDate: new Date('2023-05-10')
      },
      {
        id: 'cave_4',
        name: 'Cave Ajah',
        location: 'Ajah, Lagos',
        description: 'Succursale de Ajah',
        capacity: 300,
        bottles: 210,
        managersCount: 2,
        employeesCount: 7,
        productivity: 78,
        createdDate: new Date('2023-07-22')
      },
      {
        id: 'cave_5',
        name: 'Cave Ikeja',
        location: 'Ikeja, Lagos',
        description: 'Succursale d\'Ikeja avec zone de dégustation',
        capacity: 250,
        bottles: 220,
        managersCount: 1,
        employeesCount: 6,
        productivity: 85,
        createdDate: new Date('2023-08-15')
      },
      {
        id: 'cave_6',
        name: 'Cave Surulere',
        location: 'Surulere, Lagos',
        description: 'Cave de distribution',
        capacity: 400,
        bottles: 350,
        managersCount: 2,
        employeesCount: 9,
        productivity: 82,
        createdDate: new Date('2023-09-01')
      },
      {
        id: 'cave_7',
        name: 'Cave Bariga',
        location: 'Bariga, Lagos',
        description: 'Petite cave de quartier',
        capacity: 150,
        bottles: 130,
        managersCount: 1,
        employeesCount: 4,
        productivity: 88,
        createdDate: new Date('2023-10-05')
      }
    ];
  }

  // ===== MÉTHODE D'APPLICATION DES FILTRES =====
  /**
   * Applique tous les filtres sur la liste des caves
   */
  applyFilters(): void {
    // Commence avec la liste complète
    let result = [...this.caves];

    // Filtre par terme de recherche
    if (this.filters.searchTerm.trim()) {
      // Convertit le terme en minuscules
      const searchTerm = this.filters.searchTerm.toLowerCase();

      // Filtre par nom ou localisation
      result = result.filter(cave =>
        cave.name.toLowerCase().includes(searchTerm) ||
        cave.location.toLowerCase().includes(searchTerm) ||
        cave.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filtre par localisation
    if (this.filters.location) {
      result = result.filter(cave => cave.location === this.filters.location);
    }

    // Filtre par capacité
    if (this.filters.capacity) {
      result = result.filter(cave => {
        switch (this.filters.capacity) {
          case 'small':
            return cave.capacity < 200;
          case 'medium':
            return cave.capacity >= 200 && cave.capacity <= 500;
          case 'large':
            return cave.capacity > 500;
          default:
            return true;
        }
      });
    }

    // Applique la pagination
    this.applyPagination(result);
  }

  // ===== MÉTHODE DE PAGINATION =====
  /**
   * Applique la pagination sur la liste filtrée
   * @param caves La liste des caves à paginer
   */
  private applyPagination(caves: Cave[]): void {
    // Calcule le total de pages
    this.totalPages = Math.ceil(caves.length / this.itemsPerPage);

    // Garantit que la page actuelle est valide
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    // Calcule les indices de début et fin
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // Extrait les caves pour cette page
    this.filteredCaves = caves.slice(startIndex, endIndex);
  }

  // ===== MÉTHODE DE RECHERCHE =====
  /**
   * Met à jour le terme de recherche et applique les filtres
   * @param term Le terme de recherche
   */
  onSearch(term: string): void {
    // Stocke le terme
    this.filters.searchTerm = term;
    // Réinitialise la page
    this.currentPage = 1;
    // Applique les filtres
    this.applyFilters();
  }

  // ===== MÉTHODE DE CHANGEMENT DE FILTRE =====
  /**
   * Change un filtre et applique
   * @param filterName Le nom du filtre
   * @param value La valeur du filtre
   */
  onFilterChange(filterName: string, value: string): void {
    // Met à jour le filtre
    (this.filters as any)[filterName] = value;
    // Réinitialise la page
    this.currentPage = 1;
    // Applique les filtres
    this.applyFilters();
  }

  // ===== MÉTHODE DE RÉINITIALISATION DES FILTRES =====
  /**
   * Réinitialise tous les filtres
   */
  resetFilters(): void {
    // Réinitialise les filtres
    this.filters = {
      searchTerm: '',
      location: '',
      capacity: ''
    };
    // Réinitialise la page
    this.currentPage = 1;
    // Applique les filtres
    this.applyFilters();
  }

  // ===== MÉTHODES DE PAGINATION =====
  /**
   * Va à une page spécifique
   * @param page Le numéro de la page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  /**
   * Va à la page suivante
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  /**
   * Va à la page précédente
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  // ===== MÉTHODES DE MODAL =====
  /**
   * Affiche les détails d'une cave
   * @param cave La cave à afficher
   */
  viewCaveDetails(cave: Cave): void {
    // Stocke la cave sélectionnée
    this.selectedCave = cave;
    // Ouvre le modal
    this.isDetailModalOpen = true;
  }

  /**
   * Ferme le modal de détails
   */
  closeDetailModal(): void {
    // Ferme le modal
    this.isDetailModalOpen = false;
    // Efface la sélection
    this.selectedCave = null;
  }

  /**
   * Ouvre le modal d'édition
   * @param cave La cave à éditer
   */
  editCave(cave: Cave): void {
    // Stocke la cave
    this.selectedCave = cave;
    // Ouvre le modal d'édition
    this.isEditModalOpen = true;
  }

  /**
   * Ferme le modal d'édition
   */
  closeEditModal(): void {
    // Ferme le modal
    this.isEditModalOpen = false;
    // Efface la sélection
    this.selectedCave = null;
  }

  /**
   * Sauvegarde les modifications de la cave
   */
  saveCaveChanges(): void {
    // Vérifie que une cave est sélectionnée
    if (!this.selectedCave) {
      this.showMessage('⚠️ Aucune cave sélectionnée', 'error');
      return;
    }

    // Trouve la cave dans la liste
    const index = this.caves.findIndex(c => c.id === this.selectedCave?.id);

    // Vérifie que la cave a été trouvée
    if (index !== -1) {
      // Met à jour la cave
      this.caves[index] = { ...this.selectedCave };
      // Affiche un message de succès
      this.showMessage('✓ Cave mise à jour avec succès !', 'success');
    }

    // Réapplique les filtres
    this.applyFilters();
    // Ferme le modal
    this.closeEditModal();
  }

  /**
   * Supprime une cave après confirmation
   * @param caveId L'ID de la cave à supprimer
   */
  deleteCave(caveId: string): void {
    // Demande une confirmation
    if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer cette cave ?')) {
      // Filtre la cave de la liste
      this.caves = this.caves.filter(c => c.id !== caveId);
      // Affiche un message de succès
      this.showMessage('✓ Cave supprimée avec succès !', 'success');
      // Réapplique les filtres
      this.applyFilters();
    }
  }

  /**
   * Affiche les statistiques d'une cave
   * @param cave La cave à analyser
   */
  viewCaveStats(cave: Cave): void {
    // Affiche un message info
    this.showMessage(
      `📊 Statistiques de ${cave.name}: ${cave.bottles}/${cave.capacity} bouteilles`,
      'info'
    );
  }

  // ===== MÉTHODES DE CALCUL =====
  /**
   * Calcule le total de bouteilles
   * @returns Le total de bouteilles
   */
  getTotalBottles(): number {
    // Somme toutes les bouteilles des caves filtrées
    return this.filteredCaves.reduce((sum, cave) => sum + cave.bottles, 0);
  }

  /**
   * Calcule le total de managers
   * @returns Le total de managers
   */
  getTotalManagers(): number {
    // Somme tous les managers des caves filtrées
    return this.filteredCaves.reduce((sum, cave) => sum + cave.managersCount, 0);
  }

  /**
   * Calcule le total d'employés
   * @returns Le total d'employés
   */
  getTotalEmployees(): number {
    // Somme tous les employés des caves filtrées
    return this.filteredCaves.reduce((sum, cave) => sum + cave.employeesCount, 0);
  }

  /**
   * Calcule le pourcentage d'occupation d'une cave
   * @param cave La cave à calculer
   * @returns Le pourcentage d'occupation
   */
  getOccupancyPercentage(cave: Cave): number {
    // Calcule le pourcentage
    return Math.round((cave.bottles / cave.capacity) * 100);
  }

  /**
   * Détermine le niveau de productivité
   * @param productivity La productivité en pourcentage
   * @returns Le niveau (low, medium, high)
   */
  getProductivityLevel(productivity: number): string {
    // Retourne le niveau basé sur la productivité
    if (productivity < 70) {
      return 'low';
    } else if (productivity < 85) {
      return 'medium';
    } else {
      return 'high';
    }
  }

  // ===== MÉTHODE D'AFFICHAGE DE MESSAGE =====
  /**
   * Affiche un message temporaire
   * @param msg Le message à afficher
   * @param type Le type de message
   */
  showMessage(msg: string, type: 'success' | 'error' | 'info'): void {
    // Stocke le message
    this.message = msg;
    // Stocke le type
    this.messageType = type;
    // Efface après 3 secondes
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  /**
   * Ouvre le modal d'ajout de cave (optionnel)
   */
  openAddCaveModal(): void {
    // À implémenter selon vos besoins