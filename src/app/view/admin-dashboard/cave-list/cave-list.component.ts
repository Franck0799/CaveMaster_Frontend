// ===== FICHIER: cave-list.component.ts - VERSION ACTUALISÉE =====
// Ce composant gère l'affichage de la liste des caves avec données cohérentes

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Interface pour une cave
interface Cave {
  id: string;
  name: string;
  location: string;
  description: string;
  capacity: number;
  bottles: number;
  managersCount: number;
  employeesCount: number;
  productivity: number;
  createdDate: Date;

  // Nouvelles propriétés cohérentes avec les autres composants
  temperature?: string;
  humidity?: string;
  currentStock?: number;
  buildingInfo?: string;
  storageType?: 'principale' | 'secondaire' | 'vieillissement' | 'restaurant';
}

// Interface pour les filtres
interface FilterOptions {
  searchTerm: string;
  location: string;
  capacity: string;
  storageType: string;
}

@Component({
  selector: 'app-cave-lists',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cave-list.component.html',
  styleUrls: ['./cave-list.component.scss']
})
export class CaveListComponent implements OnInit {

  // ===== PROPRIÉTÉS DU COMPOSANT =====

  caves: Cave[] = [];
  filteredCaves: Cave[] = [];
  selectedCave: Cave | null = null;

  filters: FilterOptions = {
    searchTerm: '',
    location: '',
    capacity: '',
    storageType: ''
  };

  message: string = '';
  messageType: 'success' | 'error' | 'info' = 'info';

  // Localisations cohérentes avec le système
  regions: string[] = [
    'Lekki Phase 1, Abidjan',
    'Grand Maitre, Abidjan',
    'Temple du repos, Abidjan',
    'Mood, Abidjan',
    'FunHouse, Abidjan',
    'La cachette, Abidjan',
    'Viking, Abidjan',
    'Cocody, Abidjan',
    'Yopougon, Abidjan',
    'Plateau, Abidjan',
    'Marcory, Abidjan'
  ];

  capacites: Array<{value: string, label: string}> = [
    { value: '', label: 'Toutes les capacités' },
    { value: 'small', label: 'Petite (< 300)' },
    { value: 'medium', label: 'Moyenne (300-600)' },
    { value: 'large', label: 'Grande (> 600)' }
  ];

  storageTypes: Array<{value: string, label: string}> = [
    { value: '', label: 'Tous les types' },
    { value: 'principale', label: 'Cave Principale' },
    { value: 'secondaire', label: 'Cave Secondaire' },
    { value: 'vieillissement', label: 'Cave de Vieillissement' },
    { value: 'restaurant', label: 'Cave Restaurant' }
  ];

  isDetailModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  isAddModalOpen: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  // Formulaire pour ajouter une cave
  caveForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    // Initialise le formulaire réactif
    this.caveForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      description: [''],
      temperature: ['12-14°C'],
      humidity: ['70-75%'],
      storageType: ['principale', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCaves();
    this.applyFilters();
  }

  // ===== CHARGEMENT DES DONNÉES ACTUALISÉES =====
  loadCaves(): void {
    // Données cohérentes avec entries, exits, stock et profit components
    this.caves = [
      {
        id: 'cave_1',
        name: 'Cave Principale',
        location: 'Lekki Phase 1, Abidjan',
        description: 'Cave principale de stockage avec température et humidité contrôlées',
        buildingInfo: 'Bâtiment A - Sous-sol',
        storageType: 'principale',
        capacity: 1000,
        bottles: 650,
        currentStock: 650,
        managersCount: 3,
        employeesCount: 12,
        productivity: 87,
        temperature: '12-14°C',
        humidity: '70-75%',
        createdDate: new Date('2023-01-15')
      },
      {
        id: 'cave_2',
        name: 'Cave Secondaire',
        location: 'Grand Maitre, Abidjan',
        description: 'Cave secondaire pour rotation rapide et stocks additionnels',
        buildingInfo: 'Bâtiment B - RDC',
        storageType: 'secondaire',
        capacity: 500,
        bottles: 320,
        currentStock: 320,
        managersCount: 2,
        employeesCount: 8,
        productivity: 92,
        temperature: '14-16°C',
        humidity: '65-70%',
        createdDate: new Date('2023-03-20')
      },
      {
        id: 'cave_3',
        name: 'Cave de Vieillissement',
        location: 'Temple du repos, Abidjan',
        description: 'Cave climatisée pour vins de garde et millésimes rares',
        buildingInfo: 'Bâtiment A - Niveau -2',
        storageType: 'vieillissement',
        capacity: 300,
        bottles: 180,
        currentStock: 180,
        managersCount: 1,
        employeesCount: 5,
        productivity: 95,
        temperature: '10-12°C',
        humidity: '75-80%',
        createdDate: new Date('2023-05-10')
      },
      {
        id: 'cave_4',
        name: 'Cave Mood',
        location: 'Mood, Abidjan',
        description: 'Cave dédiée à l\'espace Mood avec zone de service rapide',
        buildingInfo: 'Complexe Mood - Rez-de-chaussée',
        storageType: 'restaurant',
        capacity: 400,
        bottles: 280,
        currentStock: 280,
        managersCount: 2,
        employeesCount: 7,
        productivity: 78,
        temperature: '14-16°C',
        humidity: '65-70%',
        createdDate: new Date('2023-07-22')
      },
      {
        id: 'cave_5',
        name: 'Cave FunHouse',
        location: 'FunHouse, Abidjan',
        description: 'Cave FunHouse avec zone de dégustation et service événementiel',
        buildingInfo: 'Complexe FunHouse - Sous-sol',
        storageType: 'restaurant',
        capacity: 350,
        bottles: 245,
        currentStock: 245,
        managersCount: 1,
        employeesCount: 6,
        productivity: 85,
        temperature: '12-14°C',
        humidity: '70-75%',
        createdDate: new Date('2023-08-15')
      },
      {
        id: 'cave_6',
        name: 'Cave La Cachette',
        location: 'La cachette, Abidjan',
        description: 'Cave de distribution pour approvisionnement des points de vente',
        buildingInfo: 'Entrepôt La Cachette',
        storageType: 'secondaire',
        capacity: 600,
        bottles: 420,
        currentStock: 420,
        managersCount: 2,
        employeesCount: 9,
        productivity: 82,
        temperature: '14-16°C',
        humidity: '65-70%',
        createdDate: new Date('2023-09-01')
      },
      {
        id: 'cave_7',
        name: 'Cave Viking',
        location: 'Viking, Abidjan',
        description: 'Cave Viking - Point de vente principal avec stockage intégré',
        buildingInfo: 'Complexe Viking - Niveau -1',
        storageType: 'principale',
        capacity: 450,
        bottles: 310,
        currentStock: 310,
        managersCount: 2,
        employeesCount: 8,
        productivity: 88,
        temperature: '12-14°C',
        humidity: '70-75%',
        createdDate: new Date('2023-10-05')
      },
      {
        id: 'cave_8',
        name: 'Cave Cocody Premium',
        location: 'Cocody, Abidjan',
        description: 'Cave premium pour clientèle haut de gamme',
        buildingInfo: 'Résidence Cocody - Cave privée',
        storageType: 'vieillissement',
        capacity: 250,
        bottles: 185,
        currentStock: 185,
        managersCount: 1,
        employeesCount: 4,
        productivity: 93,
        temperature: '10-12°C',
        humidity: '75-80%',
        createdDate: new Date('2023-11-10')
      },
      {
        id: 'cave_9',
        name: 'Cave Yopougon Distribution',
        location: 'Yopougon, Abidjan',
        description: 'Centre de distribution pour la zone ouest d\'Abidjan',
        buildingInfo: 'Zone Industrielle Yopougon',
        storageType: 'secondaire',
        capacity: 800,
        bottles: 560,
        currentStock: 560,
        managersCount: 3,
        employeesCount: 15,
        productivity: 84,
        temperature: '14-16°C',
        humidity: '65-70%',
        createdDate: new Date('2024-01-15')
      },
      {
        id: 'cave_10',
        name: 'Cave Plateau Business',
        location: 'Plateau, Abidjan',
        description: 'Cave dédiée aux entreprises et événements corporates',
        buildingInfo: 'Tour Plateau - Sous-sol 2',
        storageType: 'restaurant',
        capacity: 300,
        bottles: 220,
        currentStock: 220,
        managersCount: 1,
        employeesCount: 6,
        productivity: 90,
        temperature: '12-14°C',
        humidity: '70-75%',
        createdDate: new Date('2024-02-01')
      }
    ];

    console.log('✅ Caves chargées:', this.caves.length);
  }

  // ===== FILTRAGE =====
  applyFilters(): void {
    let result = [...this.caves];

    // Filtre par recherche
    if (this.filters.searchTerm.trim()) {
      const searchTerm = this.filters.searchTerm.toLowerCase();
      result = result.filter(cave =>
        cave.name.toLowerCase().includes(searchTerm) ||
        cave.location.toLowerCase().includes(searchTerm) ||
        cave.description.toLowerCase().includes(searchTerm) ||
        cave.buildingInfo?.toLowerCase().includes(searchTerm)
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
            return cave.capacity < 300;
          case 'medium':
            return cave.capacity >= 300 && cave.capacity <= 600;
          case 'large':
            return cave.capacity > 600;
          default:
            return true;
        }
      });
    }

    // Filtre par type de stockage
    if (this.filters.storageType) {
      result = result.filter(cave => cave.storageType === this.filters.storageType);
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
      capacity: '',
      storageType: ''
    };
    this.currentPage = 1;
    this.applyFilters();
  }

  // ===== PAGINATION =====
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

  // ===== MODALS =====
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
    const cave = this.caves.find(c => c.id === caveId);
    if (confirm(`⚠️ Êtes-vous sûr de vouloir supprimer la cave "${cave?.name}" ?\n\nCette action est irréversible.`)) {
      this.caves = this.caves.filter(c => c.id !== caveId);
      this.showMessage('✓ Cave supprimée avec succès !', 'success');
      this.applyFilters();
    }
  }

  viewCaveStats(cave: Cave): void {
    this.showMessage(
      `📊 Statistiques de ${cave.name}:\n` +
      `• Stock: ${cave.bottles}/${cave.capacity} bouteilles (${this.getOccupancyPercentage(cave)}%)\n` +
      `• Managers: ${cave.managersCount}\n` +
      `• Employés: ${cave.employeesCount}\n` +
      `• Productivité: ${cave.productivity}%\n` +
      `• Température: ${cave.temperature}\n` +
      `• Humidité: ${cave.humidity}`,
      'info'
    );
  }

  // ===== MODAL D'AJOUT =====
  openAddCaveModal(): void {
    this.isAddModalOpen = true;
    this.caveForm.reset({
      temperature: '12-14°C',
      humidity: '70-75%',
      storageType: 'principale'
    });
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
    this.caveForm.reset();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.caveForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  submitAddCaveForm(): void {
    if (this.caveForm.invalid) {
      this.showMessage('⚠️ Veuillez remplir tous les champs obligatoires correctement', 'error');
      Object.keys(this.caveForm.controls).forEach(key => {
        this.caveForm.get(key)?.markAsTouched();
      });
      return;
    }

    const newCave: Cave = {
      id: 'cave_' + Date.now(),
      name: this.caveForm.get('name')?.value,
      location: this.caveForm.get('location')?.value,
      capacity: parseInt(this.caveForm.get('capacity')?.value),
      description: this.caveForm.get('description')?.value || '',
      temperature: this.caveForm.get('temperature')?.value,
      humidity: this.caveForm.get('humidity')?.value,
      storageType: this.caveForm.get('storageType')?.value,
      createdDate: new Date(),
      bottles: 0,
      currentStock: 0,
      managersCount: 0,
      employeesCount: 0,
      productivity: 0
    };

    this.caves.push(newCave);
    this.showMessage('✓ Cave créée avec succès !', 'success');
    this.closeAddModal();
    this.applyFilters();
  }

  // ===== STATISTIQUES =====
  getTotalBottles(): number {
    return this.filteredCaves.reduce((sum, cave) => sum + cave.bottles, 0);
  }

  getTotalCapacity(): number {
    return this.filteredCaves.reduce((sum, cave) => sum + cave.capacity, 0);
  }

  getTotalManagers(): number {
    return this.filteredCaves.reduce((sum, cave) => sum + cave.managersCount, 0);
  }

  getTotalEmployees(): number {
    return this.filteredCaves.reduce((sum, cave) => sum + cave.employeesCount, 0);
  }

  getAverageProductivity(): number {
    if (this.filteredCaves.length === 0) return 0;
    const total = this.filteredCaves.reduce((sum, cave) => sum + cave.productivity, 0);
    return Math.round(total / this.filteredCaves.length);
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

  getStorageTypeLabel(type: string): string {
    const labels: {[key: string]: string} = {
      'principale': 'Cave Principale',
      'secondaire': 'Cave Secondaire',
      'vieillissement': 'Cave de Vieillissement',
      'restaurant': 'Cave Restaurant'
    };
    return labels[type] || type;
  }

  getStorageTypeIcon(type: string): string {
    const icons: {[key: string]: string} = {
      'principale': '🏛️',
      'secondaire': '📦',
      'vieillissement': '⏳',
      'restaurant': '🍽️'
    };
    return icons[type] || '🏢';
  }

  showMessage(msg: string, type: 'success' | 'error' | 'info'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  // ===== EXPORT =====
  exportCaves(): void {
    const csv = this.generateCSV();
    this.downloadFile(csv, `caves-${Date.now()}.csv`);
    this.showMessage('✓ Export réussi !', 'success');
  }

  private generateCSV(): string {
    const headers = [
      'ID', 'Nom', 'Localisation', 'Type', 'Capacité', 'Stock actuel',
      'Occupation (%)', 'Managers', 'Employés', 'Productivité (%)',
      'Température', 'Humidité', 'Date de création'
    ];

    const rows = this.caves.map(cave => [
      cave.id,
      cave.name,
      cave.location,
      this.getStorageTypeLabel(cave.storageType || ''),
      cave.capacity,
      cave.bottles,
      this.getOccupancyPercentage(cave),
      cave.managersCount,
      cave.employeesCount,
      cave.productivity,
      cave.temperature || '-',
      cave.humidity || '-',
      cave.createdDate.toLocaleDateString('fr-FR')
    ]);

    return [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
  }

  private downloadFile(content: string, filename: string): void {
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
