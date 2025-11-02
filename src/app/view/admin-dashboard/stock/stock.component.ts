// ============================================
// stock.component.ts
// Composant de gestion centralisée des stocks
// ============================================

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ========== INTERFACES ==========

interface StockItem {
  id: string;
  nom: string;
  categorie: string;
  type: 'boisson' | 'materiel' | 'vin';
  stockInitial: number;
  stockActuel: number;
  stockMinimum: number;
  stockMaximum: number;
  unitesMesure: string;

  // Pour boissons (drinks)
  format?: string;
  supplier?: string;
  cave?: string;
  depot?: string;
  commercialName?: string;
  commercialContact?: string;
  packagingType?: string;
  bulkUnit?: string;
  bulkQuantity?: number;
  unitsPerBulk?: number;
  totalBottles?: number;

  // Pour vins (wine-pairing)
  wineType?: string;
  region?: string;
  vintage?: string;
  temperature?: string;
  pairingWith?: string[];

  // Pour matériel
  emplacement?: string;
  etat?: 'Neuf' | 'Bon' | 'Usé' | 'À remplacer';

  // Communs
  prixAchat: number;
  prixVente?: number;
  dateAcquisition: Date;
  dateDerniereEntree?: Date;
  dateDerniereSortie?: Date;
  icon: string;
  notes?: string;
}

interface StockMovement {
  id: string;
  stockItemId: string;
  type: 'entree' | 'sortie';
  quantite: number;
  date: Date;
  motif: string;
  responsable: string;
  reference?: string;
}

interface Cave {
  id: string;
  nom: string;
}

interface StockAlert {
  id: string;
  itemNom: string;
  type: 'critique' | 'faible' | 'excedent';
  message: string;
  stockActuel: number;
  stockMinimum: number;
}

// ========== COMPOSANT ==========

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {

  // Contrôles de formulaire
  caveControl = new FormControl('toutes');
  typeControl = new FormControl('tous');
  categorieControl = new FormControl('toutes');
  searchControl = new FormControl('');
  etatControl = new FormControl('tous');

  // Données
  stockItems: StockItem[] = [];
  filteredStockItems: StockItem[] = [];
  stockMovements: StockMovement[] = [];
  stockAlerts: StockAlert[] = [];

  // Configuration
  caves: Cave[] = [
    { id: 'cave1', nom: 'Cave Principale' },
    { id: 'cave2', nom: 'Cave Secondaire' },
    { id: 'cave3', nom: 'Cave Restaurant' }
  ];

  types = [
    { value: 'boisson', label: 'Boissons', icon: '🍷' },
    { value: 'vin', label: 'Vins & Accords', icon: '🍾' },
    { value: 'materiel', label: 'Matériel', icon: '🍴' }
  ];

  categories = {
    boisson: ['Bières', 'Sucreries', 'Champagnes', 'Vins Rouges', 'Vins Blancs', 'Vins Rosés', 'Vins Mousseux', 'Liqueurs', 'Boissons Énergisantes', 'Boissons Locales'],
    vin: ['Bordeaux', 'Bourgogne', 'Champagne', 'Loire', 'Rhône', 'Languedoc', 'Alsace', 'Porto'],
    materiel: ['Couverts', 'Vaisselle', 'Verrerie', 'Mobilier', 'Équipement cuisine', 'Matériel de nettoyage', 'Décoration']
  };

  etats = ['Neuf', 'Bon', 'Usé', 'À remplacer'];

  // États UI
  isLoading = false;
  isModalOpen = false;
  isMovementModalOpen = false;
  isDetailsModalOpen = false;
  selectedItem: StockItem | null = null;
  showAlerts = true;

  // Statistiques
  totalArticles = 0;
  valeurTotaleStock = 0;
  articlesEnRupture = 0;
  articlesAlerteFaible = 0;

  // Tri
  currentSort: 'nom' | 'stock' | 'valeur' | 'date' = 'nom';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Vue
  viewMode: 'grid' | 'list' = 'grid';

  ngOnInit(): void {
    this.loadStockData();
    this.setupFilters();
    this.calculateStats();
    this.generateAlerts();
  }

  // ========== CHARGEMENT DES DONNÉES ==========

  loadStockData(): void {
    this.isLoading = true;

    this.stockItems = [
      // ========== BOISSONS (Drinks) ==========
      {
        id: 'drink_1',
        nom: 'Heineken 33cl',
        categorie: 'Bières',
        type: 'boisson',
        format: '33cl',
        supplier: 'Solibra',
        cave: 'Cave Principale',
        depot: 'Dépôt Abidjan Zone 4',
        commercialName: 'Kouadio Jean',
        commercialContact: '+225 07 00 00 00 01',
        packagingType: 'Bouteille',
        bulkUnit: 'Carton',
        bulkQuantity: 3,
        unitsPerBulk: 12,
        totalBottles: 36,
        stockInitial: 500,
        stockActuel: 320,
        stockMinimum: 100,
        stockMaximum: 600,
        unitesMesure: 'bouteilles',
        prixAchat: 650,
        prixVente: 800,
        dateAcquisition: new Date('2024-10-15'),
        dateDerniereEntree: new Date('2024-10-28'),
        icon: '🍺',
        notes: 'Bière blonde populaire'
      },
      {
        id: 'drink_2',
        nom: 'Guinness 33cl',
        categorie: 'Bières',
        type: 'boisson',
        format: '33cl',
        supplier: 'Brassivoire',
        cave: 'Cave Secondaire',
        depot: 'Dépôt Yopougon',
        commercialName: 'Koné Moussa',
        commercialContact: '+225 05 00 00 00 02',
        packagingType: 'Canette',
        bulkUnit: 'Pack',
        bulkQuantity: 2,
        unitsPerBulk: 24,
        totalBottles: 48,
        stockInitial: 200,
        stockActuel: 100,
        stockMinimum: 100,
        stockMaximum: 300,
        unitesMesure: 'bouteilles',
        prixAchat: 850,
        prixVente: 1000,
        dateAcquisition: new Date('2024-10-20'),
        icon: '🍺',
        notes: 'Bière brune irlandaise'
      },
      {
        id: 'drink_3',
        nom: 'Moët & Chandon',
        categorie: 'Champagnes',
        type: 'boisson',
        format: '75cl',
        supplier: 'Importateur Premium',
        cave: 'Cave Principale',
        packagingType: 'Bouteille',
        bulkUnit: 'Caisse',
        bulkQuantity: 2,
        unitsPerBulk: 6,
        totalBottles: 12,
        stockInitial: 100,
        stockActuel: 45,
        stockMinimum: 20,
        stockMaximum: 150,
        unitesMesure: 'bouteilles',
        prixAchat: 35000,
        prixVente: 60000,
        dateAcquisition: new Date('2024-09-20'),
        icon: '🍾',
        notes: 'Champagne prestige'
      },
      {
        id: 'drink_4',
        nom: 'Coca-Cola',
        categorie: 'Sucreries',
        type: 'boisson',
        format: '50cl',
        supplier: 'SICOBRA',
        cave: 'Cave Restaurant',
        depot: 'Dépôt Central',
        packagingType: 'Bouteille',
        bulkUnit: 'Casier',
        bulkQuantity: 5,
        unitsPerBulk: 12,
        totalBottles: 60,
        stockInitial: 400,
        stockActuel: 280,
        stockMinimum: 150,
        stockMaximum: 500,
        unitesMesure: 'bouteilles',
        prixAchat: 400,
        prixVente: 600,
        dateAcquisition: new Date('2024-10-25'),
        icon: '🥤',
        notes: 'Boisson gazeuse classique'
      },

      // ========== VINS & ACCORDS ==========
      {
        id: 'wine_1',
        nom: 'Bordeaux Supérieur',
        categorie: 'Bordeaux',
        type: 'vin',
        wineType: 'Vin Rouge',
        region: 'Bordeaux',
        vintage: '2018',
        temperature: '16-18°C',
        pairingWith: ['Steak grillé', 'Gigot d\'agneau', 'Fromages affinés'],
        cave: 'Cave Restaurant',
        stockInitial: 200,
        stockActuel: 145,
        stockMinimum: 50,
        stockMaximum: 250,
        unitesMesure: 'bouteilles',
        prixAchat: 8500,
        prixVente: 15000,
        dateAcquisition: new Date('2024-10-01'),
        icon: '🍷',
        notes: 'Excellent avec viandes rouges'
      },
      {
        id: 'wine_2',
        nom: 'Chablis Premier Cru',
        categorie: 'Bourgogne',
        type: 'vin',
        wineType: 'Vin Blanc',
        region: 'Bourgogne',
        vintage: '2020',
        temperature: '10-12°C',
        pairingWith: ['Saumon grillé', 'Fruits de mer', 'Huîtres'],
        cave: 'Cave Principale',
        stockInitial: 80,
        stockActuel: 52,
        stockMinimum: 20,
        stockMaximum: 100,
        unitesMesure: 'bouteilles',
        prixAchat: 12000,
        prixVente: 22000,
        dateAcquisition: new Date('2024-09-15'),
        icon: '🍷',
        notes: 'Fraîcheur minérale exceptionnelle'
      },
      {
        id: 'wine_3',
        nom: 'Château Margaux 2015',
        categorie: 'Bordeaux',
        type: 'vin',
        wineType: 'Vin Rouge',
        region: 'Bordeaux',
        vintage: '2015',
        temperature: '16-18°C',
        pairingWith: ['Filet de bœuf', 'Gibier', 'Fromages à pâte dure'],
        cave: 'Cave Secondaire',
        stockInitial: 50,
        stockActuel: 8,
        stockMinimum: 10,
        stockMaximum: 60,
        unitesMesure: 'bouteilles',
        prixAchat: 45000,
        prixVente: 85000,
        dateAcquisition: new Date('2024-08-10'),
        icon: '🍷',
        notes: 'Grand cru classé - millésime exceptionnel'
      },
      {
        id: 'wine_4',
        nom: 'Porto Tawny 10 ans',
        categorie: 'Porto',
        type: 'vin',
        wineType: 'Porto',
        region: 'Porto',
        vintage: '10 ans',
        temperature: '14-16°C',
        pairingWith: ['Fromages affinés', 'Desserts au chocolat', 'Foie gras'],
        cave: 'Cave Principale',
        stockInitial: 60,
        stockActuel: 38,
        stockMinimum: 15,
        stockMaximum: 80,
        unitesMesure: 'bouteilles',
        prixAchat: 18000,
        prixVente: 32000,
        dateAcquisition: new Date('2024-09-05'),
        icon: '🥃',
        notes: 'Notes de fruits secs et caramel'
      },

      // ========== MATÉRIEL ==========
      {
        id: 'mat_1',
        nom: 'Verres à vin rouge',
        categorie: 'Verrerie',
        type: 'materiel',
        emplacement: 'Salle principale',
        etat: 'Bon',
        stockInitial: 200,
        stockActuel: 165,
        stockMinimum: 100,
        stockMaximum: 250,
        unitesMesure: 'unités',
        prixAchat: 2500,
        dateAcquisition: new Date('2024-07-01'),
        icon: '🍷',
        notes: 'Cristallin haute qualité'
      },
      {
        id: 'mat_2',
        nom: 'Assiettes plates 28cm',
        categorie: 'Vaisselle',
        type: 'materiel',
        emplacement: 'Réserve cuisine',
        etat: 'Bon',
        stockInitial: 150,
        stockActuel: 138,
        stockMinimum: 100,
        stockMaximum: 200,
        unitesMesure: 'unités',
        prixAchat: 1800,
        dateAcquisition: new Date('2024-06-15'),
        icon: '🍽️',
        notes: 'Porcelaine blanche'
      },
      {
        id: 'mat_3',
        nom: 'Couverts inox (set)',
        categorie: 'Couverts',
        type: 'materiel',
        emplacement: 'Cuisine',
        etat: 'Usé',
        stockInitial: 100,
        stockActuel: 5,
        stockMinimum: 50,
        stockMaximum: 150,
        unitesMesure: 'sets',
        prixAchat: 4500,
        dateAcquisition: new Date('2024-05-20'),
        icon: '🍴',
        notes: 'Nécessite réapprovisionnement urgent'
      },
      {
        id: 'mat_4',
        nom: 'Chaises restaurant',
        categorie: 'Mobilier',
        type: 'materiel',
        emplacement: 'Salle',
        etat: 'Bon',
        stockInitial: 50,
        stockActuel: 48,
        stockMinimum: 40,
        stockMaximum: 60,
        unitesMesure: 'unités',
        prixAchat: 25000,
        dateAcquisition: new Date('2024-03-10'),
        icon: '🪑',
        notes: 'Design moderne et confortable'
      },
      {
        id: 'mat_5',
        nom: 'Tire-bouchons professionnels',
        categorie: 'Équipement cuisine',
        type: 'materiel',
        emplacement: 'Bar',
        etat: 'Neuf',
        stockInitial: 20,
        stockActuel: 15,
        stockMinimum: 10,
        stockMaximum: 25,
        unitesMesure: 'unités',
        prixAchat: 8500,
        dateAcquisition: new Date('2024-08-05'),
        icon: '🍾',
        notes: 'Modèle sommelier professionnel'
      }
    ];

    this.filteredStockItems = [...this.stockItems];
    this.isLoading = false;
  }

  // ========== FILTRAGE ==========

  setupFilters(): void {
    this.caveControl.valueChanges.subscribe(() => this.applyFilters());
    this.typeControl.valueChanges.subscribe(() => this.applyFilters());
    this.categorieControl.valueChanges.subscribe(() => this.applyFilters());
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.etatControl.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    let result = [...this.stockItems];

    if (this.caveControl.value !== 'toutes') {
      const caveSelectionnee = this.caves.find(c => c.id === this.caveControl.value);
      if (caveSelectionnee) {
        result = result.filter(item => item.cave === caveSelectionnee.nom);
      }
    }

    if (this.typeControl.value !== 'tous') {
      result = result.filter(item => item.type === this.typeControl.value);
    }

    if (this.categorieControl.value !== 'toutes') {
      result = result.filter(item => item.categorie === this.categorieControl.value);
    }

    if (this.etatControl.value !== 'tous') {
      result = result.filter(item => item.etat === this.etatControl.value);
    }

    if (this.searchControl.value) {
      const search = this.searchControl.value.toLowerCase();
      result = result.filter(item =>
        item.nom.toLowerCase().includes(search) ||
        item.categorie.toLowerCase().includes(search) ||
        item.supplier?.toLowerCase().includes(search) ||
        item.region?.toLowerCase().includes(search) ||
        item.notes?.toLowerCase().includes(search)
      );
    }

    this.sortItems(result);
    this.filteredStockItems = result;
    this.calculateStats();
  }

  resetFilters(): void {
    this.caveControl.setValue('toutes');
    this.typeControl.setValue('tous');
    this.categorieControl.setValue('toutes');
    this.searchControl.setValue('');
    this.etatControl.setValue('tous');
  }

  // ========== TRI ==========

  sortItems(items: StockItem[]): void {
    items.sort((a, b) => {
      let comparison = 0;

      switch (this.currentSort) {
        case 'nom':
          comparison = a.nom.localeCompare(b.nom);
          break;
        case 'stock':
          comparison = a.stockActuel - b.stockActuel;
          break;
        case 'valeur':
          comparison = (a.stockActuel * a.prixAchat) - (b.stockActuel * b.prixAchat);
          break;
        case 'date':
          comparison = a.dateAcquisition.getTime() - b.dateAcquisition.getTime();
          break;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  changeSortCriteria(criteria: 'nom' | 'stock' | 'valeur' | 'date'): void {
    if (this.currentSort === criteria) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = criteria;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  // ========== STATISTIQUES ==========

  calculateStats(): void {
    this.totalArticles = this.filteredStockItems.reduce((sum, item) => sum + item.stockActuel, 0);
    this.valeurTotaleStock = this.filteredStockItems.reduce((sum, item) =>
      sum + (item.stockActuel * item.prixAchat), 0
    );
    this.articlesEnRupture = this.filteredStockItems.filter(item =>
      item.stockActuel === 0
    ).length;
    this.articlesAlerteFaible = this.filteredStockItems.filter(item =>
      item.stockActuel > 0 && item.stockActuel <= item.stockMinimum
    ).length;
  }

  // ========== ALERTES ==========

  generateAlerts(): void {
    this.stockAlerts = [];

    this.stockItems.forEach(item => {
      if (item.stockActuel === 0) {
        this.stockAlerts.push({
          id: `alert-${item.id}`,
          itemNom: item.nom,
          type: 'critique',
          message: 'Rupture de stock',
          stockActuel: item.stockActuel,
          stockMinimum: item.stockMinimum
        });
      } else if (item.stockActuel <= item.stockMinimum) {
        this.stockAlerts.push({
          id: `alert-${item.id}`,
          itemNom: item.nom,
          type: 'faible',
          message: 'Stock faible - Réapprovisionnement recommandé',
          stockActuel: item.stockActuel,
          stockMinimum: item.stockMinimum
        });
      } else if (item.stockActuel >= item.stockMaximum) {
        this.stockAlerts.push({
          id: `alert-${item.id}`,
          itemNom: item.nom,
          type: 'excedent',
          message: 'Stock excédentaire',
          stockActuel: item.stockActuel,
          stockMinimum: item.stockMinimum
        });
      }
    });
  }

  // ========== GESTION DES MOUVEMENTS ==========

  openMovementModal(item: StockItem): void {
    this.selectedItem = item;
    this.isMovementModalOpen = true;
  }

  closeMovementModal(): void {
    this.isMovementModalOpen = false;
    this.selectedItem = null;
  }

  openDetailsModal(item: StockItem): void {
    this.selectedItem = item;
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
    this.selectedItem = null;
  }

  addStockEntry(item: StockItem, quantite: number, motif: string): void {
    if (!quantite || quantite <= 0) {
      alert('⚠️ Veuillez saisir une quantité valide');
      return;
    }

    item.stockActuel += quantite;
    item.dateDerniereEntree = new Date();

    const movement: StockMovement = {
      id: this.generateId(),
      stockItemId: item.id,
      type: 'entree',
      quantite,
      date: new Date(),
      motif: motif || 'Réapprovisionnement',
      responsable: 'Admin'
    };

    this.stockMovements.push(movement);
    this.applyFilters();
    this.generateAlerts();
    alert('✅ Entrée de stock enregistrée');
    console.log('✅ Entrée de stock:', movement);
  }

  addStockExit(item: StockItem, quantite: number, motif: string): void {
    if (!quantite || quantite <= 0) {
      alert('⚠️ Veuillez saisir une quantité valide');
      return;
    }

    if (quantite > item.stockActuel) {
      alert('⚠️ Quantité insuffisante en stock');
      return;
    }

    item.stockActuel -= quantite;
    item.dateDerniereSortie = new Date();

    const movement: StockMovement = {
      id: this.generateId(),
      stockItemId: item.id,
      type: 'sortie',
      quantite,
      date: new Date(),
      motif: motif || 'Vente',
      responsable: 'Admin'
    };

    this.stockMovements.push(movement);
    this.applyFilters();
    this.generateAlerts();
    alert('✅ Sortie de stock enregistrée');
    console.log('✅ Sortie de stock:', movement);
  }

  // ========== EXPORT ==========

  exportStock(): void {
    const csv = this.generateCSV();
    this.downloadFile(csv, `stock-${Date.now()}.csv`);
  }

  private generateCSV(): string {
    const headers = [
      'ID', 'Nom', 'Type', 'Catégorie', 'Stock Actuel', 'Stock Min', 'Stock Max',
      'Unité', 'Cave/Emplacement', 'Prix Achat', 'Prix Vente', 'Valeur Stock', 'État/Notes'
    ];

    const rows = this.filteredStockItems.map(item => [
      item.id,
      item.nom,
      item.type,
      item.categorie,
      item.stockActuel,
      item.stockMinimum,
      item.stockMaximum,
      item.unitesMesure,
      item.cave || item.emplacement || '-',
      item.prixAchat,
      item.prixVente || '-',
      (item.stockActuel * item.prixAchat).toFixed(0),
      item.etat || item.notes || '-'
    ]);

    return [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
  }

  private downloadFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // ========== UTILITAIRES ==========

  getStockStatus(item: StockItem): { class: string; label: string } {
    if (item.stockActuel === 0) {
      return { class: 'status-rupture', label: 'Rupture' };
    } else if (item.stockActuel <= item.stockMinimum) {
      return { class: 'status-faible', label: 'Faible' };
    } else if (item.stockActuel >= item.stockMaximum) {
      return { class: 'status-excedent', label: 'Excédent' };
    } else {
      return { class: 'status-normal', label: 'Normal' };
    }
  }

  getStockPercentage(item: StockItem): number {
    return Math.min((item.stockActuel / item.stockMaximum) * 100, 100);
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'boisson': '🍷',
      'vin': '🍾',
      'materiel': '🍴'
    };
    return icons[type] || '📦';
  }

  getCategoriesForType(): string[] {
    const type = this.typeControl.value;
    if (type === 'tous') {
      return Object.values(this.categories).flat();
    }
    return this.categories[type as keyof typeof this.categories] || [];
  }

  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }
}
