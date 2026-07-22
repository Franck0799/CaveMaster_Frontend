// ===== FICHIER: cave-list.component.ts - VERSION ACTUALISÉE =====
// Ce composant gère l'affichage de la liste des caves avec données cohérentes

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CavesService } from '../../../core/services/cave/caves.service';
import { ApiCave } from '../../../core/models/Cave/Cave';

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

  constructor(private formBuilder: FormBuilder, private cavesService: CavesService) {
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
    this.cavesService.getAll().subscribe({
      next: (apiCaves) => {
        this.caves = apiCaves.map(c => this.mapApiCaveToLocal(c));
        this.applyFilters();
        console.log('Caves chargées depuis le backend :', this.caves.length);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des caves depuis le backend :', error);
        this.caves = [];
        this.applyFilters();
      }
    });
  }

  /** Convertit une cave reçue de l'API vers le modèle local utilisé par cet écran. */
  private mapApiCaveToLocal(c: ApiCave): Cave {
    const validTypes = ['principale', 'secondaire', 'vieillissement', 'restaurant'];
    return {
      id: c.id,
      name: c.name,
      location: c.location,
      description: c.description || '',
      capacity: c.capacity,
      bottles: c.currentStock,
      currentStock: c.currentStock,
      managersCount: c.managersCount,
      employeesCount: c.employeesCount,
      productivity: c.productivity,
      createdDate: c.createdAt ? new Date(c.createdAt) : new Date(),
      buildingInfo: c.buildingInfo,
      storageType: validTypes.includes(c.storageType || '') ? (c.storageType as Cave['storageType']) : 'principale',
      temperature: c.condition ? `${c.condition.temperature}°C` : undefined,
      humidity: c.condition ? `${c.condition.humidity}%` : undefined
    };
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

    const parseLeadingNumber = (value: string | undefined, fallback: number): number => {
      const match = /-?\d+(\.\d+)?/.exec(value || '');
      return match ? parseFloat(match[0]) : fallback;
    };

    const payload: Partial<ApiCave> = {
      name: this.selectedCave.name,
      location: this.selectedCave.location,
      description: this.selectedCave.description,
      capacity: this.selectedCave.capacity,
      buildingInfo: this.selectedCave.buildingInfo,
      storageType: this.selectedCave.storageType,
      currentStock: this.selectedCave.currentStock,
      managersCount: this.selectedCave.managersCount,
      employeesCount: this.selectedCave.employeesCount,
      productivity: this.selectedCave.productivity,
      condition: {
        temperature: parseLeadingNumber(this.selectedCave.temperature, 12),
        humidity: parseLeadingNumber(this.selectedCave.humidity, 70)
      }
    };

    this.cavesService.update(this.selectedCave.id, payload).subscribe({
      next: (updated) => {
        const index = this.caves.findIndex(c => c.id === this.selectedCave?.id);
        if (index !== -1) {
          this.caves[index] = updated ? this.mapApiCaveToLocal(updated) : { ...this.selectedCave! };
          this.showMessage('✓ Cave mise à jour avec succès !', 'success');
        }
        this.applyFilters();
        this.closeEditModal();
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour de la cave :', error);
        this.showMessage('❌ Erreur lors de la mise à jour de la cave', 'error');
      }
    });
  }

  deleteCave(caveId: string): void {
    const cave = this.caves.find(c => c.id === caveId);
    if (confirm(`⚠️ Êtes-vous sûr de vouloir supprimer la cave "${cave?.name}" ?\n\nCette action est irréversible.`)) {
      this.cavesService.delete(caveId).subscribe({
        next: (success) => {
          if (success) {
            this.caves = this.caves.filter(c => c.id !== caveId);
            this.showMessage('✓ Cave supprimée avec succès !', 'success');
            this.applyFilters();
          }
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la cave :', error);
          this.showMessage('❌ Erreur lors de la suppression de la cave', 'error');
        }
      });
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

    const parseLeadingNumber = (value: string, fallback: number): number => {
      const match = /-?\d+(\.\d+)?/.exec(value || '');
      return match ? parseFloat(match[0]) : fallback;
    };

    const payload: Partial<ApiCave> = {
      name: this.caveForm.get('name')?.value,
      location: this.caveForm.get('location')?.value,
      capacity: parseInt(this.caveForm.get('capacity')?.value, 10),
      description: this.caveForm.get('description')?.value || '',
      storageType: this.caveForm.get('storageType')?.value,
      condition: {
        temperature: parseLeadingNumber(this.caveForm.get('temperature')?.value, 12),
        humidity: parseLeadingNumber(this.caveForm.get('humidity')?.value, 70)
      },
      currentStock: 0,
      managersCount: 0,
      employeesCount: 0,
      productivity: 0
    };

    this.cavesService.create(payload).subscribe({
      next: (created) => {
        if (created) {
          this.caves.push(this.mapApiCaveToLocal(created));
          this.showMessage('✓ Cave créée avec succès !', 'success');
          this.closeAddModal();
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la création de la cave :', error);
        this.showMessage('❌ Erreur lors de la création de la cave', 'error');
      }
    });
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
