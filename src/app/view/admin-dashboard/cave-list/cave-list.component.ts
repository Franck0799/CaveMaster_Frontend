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
  imports: [CommonModule, FormsModule],
  templateUrl: './cave-list.component.html',
  styleUrls: ['./cave-list.component.scss']
})
export class CaveListsComponent implements OnInit {

  // ===== PROPRIÉTÉS DU COMPOSANT =====

  caves: Cave[] = [];
  filteredCaves: Cave[] = [];
  selectedCave: Cave | null = null;

  filters: FilterOptions = {
    searchTerm: '',
    location: '',
    capacity: ''
  };

  message: string = '';
  messageType: 'success' | 'error' | 'info' = 'info';

  regions: string[] = [
    'Lekki Phase 1, Lagos',
    'Victoria Island, Lagos',
    'Ikoyi, Lagos',
    'Ajah, Lagos',
    'Ikeja, Lagos',
    'Surulere, Lagos',
    'Bariga, Lagos'
  ];

  capacites: Array<{value: string, label: string}> = [
    { value: '', label: 'Toutes les capacités' },
    { value: 'small', label: 'Petite (< 200)' },
    { value: 'medium', label: 'Moyenne (200-500)' },
    { value: 'large', label: 'Grande (> 500)' }
  ];

  isDetailModalOpen: boolean = false;
  isEditModalOpen: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  constructor() {}

  ngOnInit(): void {
    this.loadCaves();
    this.applyFilters();
  }

  loadCaves(): void {
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

  applyFilters(): void {
    let result = [...this.caves];

    if (this.filters.searchTerm.trim()) {
      const searchTerm = this.filters.searchTerm.toLowerCase();
      result = result.filter(cave =>
        cave.name.toLowerCase().includes(searchTerm) ||
        cave.location.toLowerCase().includes(searchTerm) ||
        cave.description.toLowerCase().includes(searchTerm)
      );
    }

    if (this.filters.location) {
      result = result.filter(cave => cave.location === this.filters.location);
    }

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

    this.applyPagination(result);
  }

  private applyPagination(caves: Cave[]): void {
    this.totalPages = Math.ceil(caves.length / this.itemsPerPage);

    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.filteredCaves = caves.slice(startIndex, endIndex);
  }

  onSearch(term: string): void {
    this.filters.searchTerm = term;
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange(filterName: string, value: string): void {
    (this.filters as any)[filterName] = value;
    this.currentPage = 1;
    this.applyFilters();
  }

  resetFilters(): void {
    this.filters = {
      searchTerm: '',
      location: '',
      capacity: ''
    };
    this.currentPage = 1;
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  viewCaveDetails(cave: Cave): void {
    this.selectedCave = cave;
    this.isDetailModalOpen = true;
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedCave = null;
  }

  editCave(cave: Cave): void {
    this.selectedCave = { ...cave };
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedCave = null;
  }

  saveCaveChanges(): void {
    if (!this.selectedCave) {
      this.showMessage('⚠️ Aucune cave sélectionnée', 'error');
      return;
    }

    const index = this.caves.findIndex(c => c.id === this.selectedCave?.id);

    if (index !== -1) {
      this.caves[index] = { ...this.selectedCave };
      this.showMessage('✓ Cave mise à jour avec succès !', 'success');
    }

    this.applyFilters();
    this.closeEditModal();
  }

  deleteCave(caveId: string): void {
    if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer cette cave ?')) {
      this.caves = this.caves.filter(c => c.id !== caveId);
      this.showMessage('✓ Cave supprimée avec succès !', 'success');
      this.applyFilters();
    }
  }

  viewCaveStats(cave: Cave): void {
    this.showMessage(
      `📊 Statistiques de ${cave.name}: ${cave.bottles}/${cave.capacity} bouteilles`,
      'info'
    );
  }

  getTotalBottles(): number {
    return this.filteredCaves.reduce((sum, cave) => sum + cave.bottles, 0);
  }

  getTotalManagers(): number {
    return this.filteredCaves.reduce((sum, cave) => sum + cave.managersCount, 0);
  }

  getTotalEmployees(): number {
    return this.filteredCaves.reduce((sum, cave) => sum + cave.employeesCount, 0);
  }

  getOccupancyPercentage(cave: Cave): number {
    return Math.round((cave.bottles / cave.capacity) * 100);
  }

  getProductivityLevel(productivity: number): string {
    if (productivity < 70) {
      return 'low';
    } else if (productivity < 85) {
      return 'medium';
    } else {
      return 'high';
    }
  }

  showMessage(msg: string, type: 'success' | 'error' | 'info'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  openAddCaveModal(): void {
    // TODO: Implémenter l'ouverture du modal d'ajout de cave
    this.showMessage('ℹ️ Fonctionnalité d\'ajout à implémenter', 'info');
  }
}
