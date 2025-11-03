// ==========================================
// FICHIER: src/app/view/admin-dashboard/benefice/benefice.component.ts
// DESCRIPTION: Composant pour calculer et analyser les bénéfices
// VERSION COMPLÈTE avec calculs automatiques et filtres avancés
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Énumérations importées
 */
export enum DrinkCategory {
  BIERES = 'Bières',
  SUCRERIES = 'Sucreries',
  CHAMPAGNE = 'Champagne',
  VIN_BLANC = 'Vin Blanc',
  VIN_ROUGE = 'Vin Rouge',
  VIN_ROSE = 'Vin Rosé',
  VIN_MOUSSEUX = 'Vin Mousseux',
  LIQUEURS = 'Liqueurs',
  BOISSONS_ENERGISANTES = 'Boissons Énergisantes',
  BOISSONS_LOCALES = 'Boissons Locales'
}

export enum DrinkFormat {
  CL_25 = '25cl',
  CL_33 = '33cl',
  CL_50 = '50cl',
  CL_65 = '65cl',
  CL_75 = '75cl',
  L_1 = '1L',
  L_1_5 = '1.5L',
  L_2 = '2L'
}

export enum Supplier {
  SOLIBRA = 'Solibra',
  BRASSIVOIRE = 'Brassivoire',
  SICOBRA = 'Sicobra',
  UNIBRA = 'Unibra',
  AUTRES = 'Autres'
}

export enum BulkUnit {
  CARTON = 'Carton',
  CASIER = 'Casier',
  PACK = 'Pack',
  CAISSE = 'Caisse'
}

/**
 * Interface pour une boisson
 */
interface Drink {
  id: string;
  name: string;
  icon: string;
  category: DrinkCategory;
  format: DrinkFormat;
  supplier: Supplier;
  depot: string;
  commercialName: string;
  commercialContact: string;
  bulkUnit: BulkUnit;
  bulkQuantity: number;
  unitsPerBulk: number;
  totalBottles: number;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  sales?: number;
  description?: string;
}

/**
 * Interface pour une entrée de stock
 */
interface StockEntry {
  id: string;
  date: Date;
  drinkId: string;
  drinkName: string;
  drinkIcon: string;
  drinkCategory: DrinkCategory;
  drinkFormat: DrinkFormat;
  bulkUnit: BulkUnit;
  bulkQuantity: number;
  unitsPerBulk: number;
  quantity: number;
  supplier: Supplier;
  supplierInvoice?: string;
  deliveryNote?: string;
  commercialName: string;
  commercialContact: string;
  unitPrice: number;
  bulkPrice: number;
  totalCost: number;
  caveId: string;
  qualityCheck: 'conforme' | 'non-conforme' | 'avec-reserve';
  qualityNotes?: string;
  addedBy: string;
  batchNumber?: string;
  expiryDate?: Date;
  notes?: string;
}

/**
 * Type de sortie
 */
type ExitType = 'vente' | 'transfert' | 'perte' | 'casse' | 'peremption' | 'degustation';

/**
 * Interface pour une sortie de stock
 */
interface StockExit {
  id: string;
  date: Date;
  drinkId: string;
  drinkName: string;
  drinkIcon: string;
  drinkCategory: DrinkCategory;
  drinkFormat: DrinkFormat;
  type: ExitType;
  quantity: number;
  destination?: string;
  customer?: string;
  customerContact?: string;
  transferToCaveId?: string;
  unitPrice: number;
  totalAmount: number;
  caveId: string;
  processedBy: string;
  processedByName?: string;
  invoiceNumber?: string;
  deliveryNote?: string;
  lossReason?: string;
  breakageDetails?: string;
  expiryDate?: Date;
  notes?: string;
}

/**
 * Interface pour une dépense
 */
interface Expense {
  id: string;
  category: 'salaire' | 'electricite' | 'eau' | 'carburant' | 'materiel' | 'autre';
  description: string;
  amount: number;
  date: string;
  beneficiary?: string;
}

/**
 * Interface pour une cave
 */
interface Cave {
  id: string;
  name: string;
  location: string;
}

/**
 * Type de période
 */
type PeriodType = 'mensuel' | 'trimestriel' | 'annuel' | 'personnalise';

/**
 * Interface pour les statistiques globales
 */
interface GlobalStats {
  // Revenus
  chiffreAffaires: number;           // Total des ventes
  totalVentesBrutes: number;         // Montant brut des ventes

  // Coûts
  totalAchats: number;               // Total des achats (entrées)
  totalDepenses: number;             // Total des dépenses
  totalPertes: number;               // Total des pertes (casse, péremption, etc.)
  coutTotal: number;                 // Total des coûts (achats + dépenses + pertes)

  // Bénéfices
  beneficeBrut: number;              // CA - Achats
  beneficeNet: number;               // CA - (Achats + Dépenses + Pertes)
  margeBrute: number;                // (CA - Achats) / CA * 100
  margeNette: number;                // Bénéfice Net / CA * 100

  // Stock
  stockDepart: number;               // Valeur du stock au début de la période
  stockRestant: number;              // Valeur du stock actuel
  totalBoissonsAchetees: number;     // Nombre total d'unités achetées
  totalBoissonsVendues: number;      // Nombre total d'unités vendues
  totalBoissonsPertes: number;       // Nombre total d'unités perdues

  // Transactions
  nombreVentes: number;              // Nombre de transactions de vente
  nombreEntrees: number;             // Nombre d'entrées de stock
  nombrePertes: number;              // Nombre de pertes enregistrées
  nombreDepenses: number;            // Nombre de dépenses

  // Moyennes
  prixMoyenVente: number;            // Prix moyen de vente
  prixMoyenAchat: number;            // Prix moyen d'achat
  panierMoyen: number;               // Montant moyen par vente
}

/**
 * Interface pour les statistiques détaillées par item
 */
interface ItemStats {
  drinkId: string;
  drinkName: string;
  drinkIcon: string;
  category: DrinkCategory;
  format: DrinkFormat;
  supplier: Supplier;

  // Quantités
  quantiteAchetee: number;
  quantiteVendue: number;
  quantitePerdue: number;
  stockActuel: number;

  // Montants
  coutAchat: number;
  revenueVente: number;
  valeurPertes: number;

  // Marges
  benefice: number;
  margePourcentage: number;

  // Prix
  prixAchatMoyen: number;
  prixVenteMoyen: number;
}

/**
 * Composant BeneficeComponent - VERSION COMPLÈTE
 * Calcul automatique des bénéfices avec filtres avancés
 */
@Component({
  selector: 'app-profit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profit.component.html',
  styleUrls: ['./profit.component.scss']
})
export class ProfitComponent implements OnInit {

  // ========================================
  // PROPRIÉTÉS - DONNÉES
  // ========================================

  drinks: Drink[] = [];
  entries: StockEntry[] = [];
  exits: StockExit[] = [];
  expenses: Expense[] = [];
  caves: Cave[] = [];

  // Données filtrées
  filteredEntries: StockEntry[] = [];
  filteredExits: StockExit[] = [];
  filteredExpenses: Expense[] = [];

  // Statistiques
  globalStats: GlobalStats = this.getEmptyStats();
  itemStats: ItemStats[] = [];

  // ========================================
  // PROPRIÉTÉS - FILTRES
  // ========================================

  // Filtre de période
  periodType: PeriodType = 'mensuel';
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;
  selectedQuarter: number = Math.ceil((new Date().getMonth() + 1) / 3);
  customStartDate: string = '';
  customEndDate: string = '';

  // Filtres avancés
  selectedCave: string = 'all';
  selectedCategory: DrinkCategory | 'all' = 'all';
  selectedSupplier: Supplier | 'all' = 'all';
  selectedFormat: DrinkFormat | 'all' = 'all';
  selectedBulkUnit: BulkUnit | 'all' = 'all';
  selectedDrink: string = 'all';
  selectedExpenseCategory: string = 'all';
  searchTerm: string = '';

  // ========================================
  // PROPRIÉTÉS - UI
  // ========================================

  isLoading: boolean = false;
  showFilters: boolean = true;
  viewMode: 'global' | 'details' = 'global';
  chartType: 'bar' | 'line' | 'pie' = 'bar';

  // Énumérations pour le template
  drinkCategories = Object.values(DrinkCategory);
  suppliers = Object.values(Supplier);
  formats = Object.values(DrinkFormat);
  bulkUnits = Object.values(BulkUnit);
  expenseCategories = ['salaire', 'electricite', 'eau', 'carburant', 'materiel', 'autre'];

  // Années disponibles
  availableYears: number[] = [];

  // Mois
  months = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' }
  ];

  // Trimestres
  quarters = [
    { value: 1, label: 'T1 (Jan-Mar)' },
    { value: 2, label: 'T2 (Avr-Jun)' },
    { value: 3, label: 'T3 (Jul-Sep)' },
    { value: 4, label: 'T4 (Oct-Déc)' }
  ];

  // ========================================
  // CONSTRUCTEUR
  // ========================================

  constructor() {}

  // ========================================
  // LIFECYCLE HOOKS
  // ========================================

  ngOnInit(): void {
    console.log('✅ ProfitComponent initialisé');
    this.loadData();
    this.initializeYears();
    this.applyFilters();
  }

  // ========================================
  // CHARGEMENT DES DONNÉES
  // ========================================

  loadData(): void {
    this.isLoading = true;

    // Charge toutes les données
    this.drinks = this.loadDrinks();
    this.entries = this.loadEntries();
    this.exits = this.loadExits();
    this.expenses = this.loadExpenses();
    this.caves = this.loadCaves();

    this.isLoading = false;
    console.log('✅ Données chargées:', {
      drinks: this.drinks.length,
      entries: this.entries.length,
      exits: this.exits.length,
      expenses: this.expenses.length,
      caves: this.caves.length
    });
  }

  private loadDrinks(): Drink[] {
    // Simule le chargement des boissons
    return [
      {
        id: 'drink_1',
        name: 'Heineken',
        icon: '🍺',
        category: DrinkCategory.BIERES,
        format: DrinkFormat.CL_33,
        supplier: Supplier.SOLIBRA,
        depot: 'Dépôt Abidjan Zone 4',
        commercialName: 'Kouadio Jean',
        commercialContact: '+225 07 00 00 00 01',
        bulkUnit: BulkUnit.CARTON,
        bulkQuantity: 3,
        unitsPerBulk: 12,
        totalBottles: 36,
        purchasePrice: 650,
        sellingPrice: 800,
        stock: 150,
        sales: 450
      },
      {
        id: 'drink_2',
        name: 'Bordeaux Rouge 2018',
        icon: '🍷',
        category: DrinkCategory.VIN_ROUGE,
        format: DrinkFormat.CL_75,
        supplier: Supplier.AUTRES,
        depot: 'Dépôt Cocody',
        commercialName: 'Bakayoko Aminata',
        commercialContact: '+225 05 00 00 00 02',
        bulkUnit: BulkUnit.CAISSE,
        bulkQuantity: 2,
        unitsPerBulk: 6,
        totalBottles: 12,
        purchasePrice: 12000,
        sellingPrice: 15000,
        stock: 45,
        sales: 120
      },
      {
        id: 'drink_3',
        name: 'Champagne Moët & Chandon',
        icon: '🍾',
        category: DrinkCategory.CHAMPAGNE,
        format: DrinkFormat.CL_75,
        supplier: Supplier.AUTRES,
        depot: 'Dépôt Plateau',
        commercialName: 'Koné Moussa',
        commercialContact: '+225 07 11 22 33 44',
        bulkUnit: BulkUnit.CAISSE,
        bulkQuantity: 1,
        unitsPerBulk: 6,
        totalBottles: 6,
        purchasePrice: 30000,
        sellingPrice: 35000,
        stock: 20,
        sales: 85
      }
    ];
  }

  private loadEntries(): StockEntry[] {
    const now = new Date();
    return [
      {
        id: 'entry_1',
        date: new Date(now.getFullYear(), now.getMonth(), 15),
        drinkId: 'drink_1',
        drinkName: 'Heineken',
        drinkIcon: '🍺',
        drinkCategory: DrinkCategory.BIERES,
        drinkFormat: DrinkFormat.CL_33,
        bulkUnit: BulkUnit.CARTON,
        bulkQuantity: 10,
        unitsPerBulk: 12,
        quantity: 120,
        supplier: Supplier.SOLIBRA,
        commercialName: 'Kouadio Jean',
        commercialContact: '+225 07 00 00 00 01',
        unitPrice: 650,
        bulkPrice: 7800,
        totalCost: 78000,
        caveId: 'cave_1',
        qualityCheck: 'conforme',
        addedBy: 'Admin'
      },
      {
        id: 'entry_2',
        date: new Date(now.getFullYear(), now.getMonth(), 10),
        drinkId: 'drink_2',
        drinkName: 'Bordeaux Rouge 2018',
        drinkIcon: '🍷',
        drinkCategory: DrinkCategory.VIN_ROUGE,
        drinkFormat: DrinkFormat.CL_75,
        bulkUnit: BulkUnit.CAISSE,
        bulkQuantity: 5,
        unitsPerBulk: 6,
        quantity: 30,
        supplier: Supplier.AUTRES,
        commercialName: 'Bakayoko Aminata',
        commercialContact: '+225 05 00 00 00 02',
        unitPrice: 12000,
        bulkPrice: 72000,
        totalCost: 360000,
        caveId: 'cave_1',
        qualityCheck: 'conforme',
        addedBy: 'Admin'
      },
      {
        id: 'entry_3',
        date: new Date(now.getFullYear(), now.getMonth(), 5),
        drinkId: 'drink_3',
        drinkName: 'Champagne Moët & Chandon',
        drinkIcon: '🍾',
        drinkCategory: DrinkCategory.CHAMPAGNE,
        drinkFormat: DrinkFormat.CL_75,
        bulkUnit: BulkUnit.CAISSE,
        bulkQuantity: 3,
        unitsPerBulk: 6,
        quantity: 18,
        supplier: Supplier.AUTRES,
        commercialName: 'Koné Moussa',
        commercialContact: '+225 07 11 22 33 44',
        unitPrice: 30000,
        bulkPrice: 180000,
        totalCost: 540000,
        caveId: 'cave_1',
        qualityCheck: 'conforme',
        addedBy: 'Admin'
      }
    ];
  }

  private loadExits(): StockExit[] {
    const now = new Date();
    return [
      {
        id: 'exit_1',
        date: new Date(now.getFullYear(), now.getMonth(), 20),
        drinkId: 'drink_1',
        drinkName: 'Heineken',
        drinkIcon: '🍺',
        drinkCategory: DrinkCategory.BIERES,
        drinkFormat: DrinkFormat.CL_33,
        type: 'vente',
        quantity: 50,
        unitPrice: 800,
        totalAmount: 40000,
        caveId: 'cave_1',
        customer: 'Restaurant Le Gourmet',
        customerContact: '+225 07 22 33 44 55',
        destination: 'Restaurant Le Gourmet - Cocody',
        processedBy: 'user_1',
        processedByName: 'Jean Dupont'
      },
      {
        id: 'exit_2',
        date: new Date(now.getFullYear(), now.getMonth(), 18),
        drinkId: 'drink_2',
        drinkName: 'Bordeaux Rouge 2018',
        drinkIcon: '🍷',
        drinkCategory: DrinkCategory.VIN_ROUGE,
        drinkFormat: DrinkFormat.CL_75,
        type: 'vente',
        quantity: 15,
        unitPrice: 15000,
        totalAmount: 225000,
        caveId: 'cave_1',
        customer: 'Hôtel Ivoire',
        customerContact: '+225 27 22 48 10 00',
        destination: 'Hôtel Ivoire - Cocody',
        processedBy: 'user_2',
        processedByName: 'Marie Martin'
      },
      {
        id: 'exit_3',
        date: new Date(now.getFullYear(), now.getMonth(), 22),
        drinkId: 'drink_3',
        drinkName: 'Champagne Moët & Chandon',
        drinkIcon: '🍾',
        drinkCategory: DrinkCategory.CHAMPAGNE,
        drinkFormat: DrinkFormat.CL_75,
        type: 'vente',
        quantity: 8,
        unitPrice: 35000,
        totalAmount: 280000,
        caveId: 'cave_1',
        customer: 'Événement Corporate',
        customerContact: '+225 05 66 77 88 99',
        destination: 'Sofitel Hôtel Ivoire',
        processedBy: 'user_2',
        processedByName: 'Marie Martin'
      },
      {
        id: 'exit_4',
        date: new Date(now.getFullYear(), now.getMonth(), 12),
        drinkId: 'drink_1',
        drinkName: 'Heineken',
        drinkIcon: '🍺',
        drinkCategory: DrinkCategory.BIERES,
        drinkFormat: DrinkFormat.CL_33,
        type: 'casse',
        quantity: 5,
        unitPrice: 650,
        totalAmount: 3250,
        caveId: 'cave_1',
        lossReason: 'Casse lors de la manipulation',
        breakageDetails: '5 bouteilles cassées',
        destination: 'Perte par casse',
        processedBy: 'user_3',
        processedByName: 'Pierre Dubois'
      }
    ];
  }

  private loadExpenses(): Expense[] {
    const now = new Date();
    return [
      {
        id: 'exp_1',
        category: 'salaire',
        description: 'Salaires du mois',
        amount: 500000,
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`,
        beneficiary: 'Employés'
      },
      {
        id: 'exp_2',
        category: 'electricite',
        description: 'Facture d\'électricité',
        amount: 75000,
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-05`,
        beneficiary: 'CIE'
      },
      {
        id: 'exp_3',
        category: 'eau',
        description: 'Facture d\'eau',
        amount: 25000,
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-06`,
        beneficiary: 'SODECI'
      },
      {
        id: 'exp_4',
        category: 'materiel',
        description: 'Achat de verres',
        amount: 120000,
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-10`,
        beneficiary: 'Fournisseur Matériel'
      }
    ];
  }

  private loadCaves(): Cave[] {
    return [
      { id: 'cave_1', name: 'Cave Principale', location: 'Bâtiment A' },
      { id: 'cave_2', name: 'Cave Secondaire', location: 'Bâtiment B' },
      { id: 'cave_3', name: 'Cave Restaurant', location: 'Restaurant' }
    ];
  }

  // ========================================
  // INITIALISATION
  // ========================================

  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    this.availableYears = [];
    for (let year = currentYear - 5; year <= currentYear; year++) {
      this.availableYears.push(year);
    }
  }

  // ========================================
  // FILTRAGE
  // ========================================

  applyFilters(): void {
    console.log('🔄 Application des filtres...');

    // 1. Filtre par période
    this.filterByPeriod();

    // 2. Filtre par critères
    this.filterByCriteria();

    // 3. Calcul des statistiques
    this.calculateGlobalStats();
    this.calculateItemStats();

    console.log('✅ Filtres appliqués');
  }

  private filterByPeriod(): void {
    let startDate: Date;
    let endDate: Date;

    switch (this.periodType) {
      case 'mensuel':
        startDate = new Date(this.selectedYear, this.selectedMonth - 1, 1);
        endDate = new Date(this.selectedYear, this.selectedMonth, 0, 23, 59, 59);
        break;

      case 'trimestriel':
        const quarterStartMonth = (this.selectedQuarter - 1) * 3;
        startDate = new Date(this.selectedYear, quarterStartMonth, 1);
        endDate = new Date(this.selectedYear, quarterStartMonth + 3, 0, 23, 59, 59);
        break;

      case 'annuel':
        startDate = new Date(this.selectedYear, 0, 1);
        endDate = new Date(this.selectedYear, 11, 31, 23, 59, 59);
        break;

      case 'personnalise':
        if (!this.customStartDate || !this.customEndDate) {
          alert('⚠️ Veuillez sélectionner une période personnalisée');
          return;
        }
        startDate = new Date(this.customStartDate);
        endDate = new Date(this.customEndDate);
        endDate.setHours(23, 59, 59);
        break;

      default:
        return;
    }

    // Filtre les entrées
    this.filteredEntries = this.entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });

    // Filtre les sorties
    this.filteredExits = this.exits.filter(exit => {
      const exitDate = new Date(exit.date);
      return exitDate >= startDate && exitDate <= endDate;
    });

    // Filtre les dépenses
    this.filteredExpenses = this.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    console.log('📅 Période filtrée:', {
      startDate: startDate.toLocaleDateString('fr-FR'),
      endDate: endDate.toLocaleDateString('fr-FR'),
      entries: this.filteredEntries.length,
      exits: this.filteredExits.length,
      expenses: this.filteredExpenses.length
    });
  }

  private filterByCriteria(): void {
    // Filtre par cave
    if (this.selectedCave !== 'all') {
      this.filteredEntries = this.filteredEntries.filter(e => e.caveId === this.selectedCave);
      this.filteredExits = this.filteredExits.filter(e => e.caveId === this.selectedCave);
    }

    // Filtre par catégorie
    if (this.selectedCategory !== 'all') {
      this.filteredEntries = this.filteredEntries.filter(e => e.drinkCategory === this.selectedCategory);
      this.filteredExits = this.filteredExits.filter(e => e.drinkCategory === this.selectedCategory);
    }

    // Filtre par fournisseur
    if (this.selectedSupplier !== 'all') {
      this.filteredEntries = this.filteredEntries.filter(e => e.supplier === this.selectedSupplier);
    }

    // Filtre par format
    if (this.selectedFormat !== 'all') {
      this.filteredEntries = this.filteredEntries.filter(e => e.drinkFormat === this.selectedFormat);
      this.filteredExits = this.filteredExits.filter(e => e.drinkFormat === this.selectedFormat);
    }

    // Filtre par conditionnement
    if (this.selectedBulkUnit !== 'all') {
      this.filteredEntries = this.filteredEntries.filter(e => e.bulkUnit === this.selectedBulkUnit);
    }

    // Filtre par boisson
    if (this.selectedDrink !== 'all') {
      this.filteredEntries = this.filteredEntries.filter(e => e.drinkId === this.selectedDrink);
      this.filteredExits = this.filteredExits.filter(e => e.drinkId === this.selectedDrink);
    }

    // Filtre par catégorie de dépense
    if (this.selectedExpenseCategory !== 'all') {
      this.filteredExpenses = this.filteredExpenses.filter(e => e.category === this.selectedExpenseCategory);
    }

    // Filtre par recherche textuelle
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();

      this.filteredEntries = this.filteredEntries.filter(e =>
        e.drinkName.toLowerCase().includes(term) ||
        e.commercialName.toLowerCase().includes(term) ||
        e.notes?.toLowerCase().includes(term)
      );

      this.filteredExits = this.filteredExits.filter(e =>
        e.drinkName.toLowerCase().includes(term) ||
        e.customer?.toLowerCase().includes(term) ||
        e.destination?.toLowerCase().includes(term) ||
        e.notes?.toLowerCase().includes(term)
      );

      this.filteredExpenses = this.filteredExpenses.filter(e =>
        e.description.toLowerCase().includes(term) ||
        e.beneficiary?.toLowerCase().includes(term)
      );
    }
  }

  onPeriodTypeChange(): void {
    this.applyFilters();
  }

  onYearChange(): void {
    this.applyFilters();
  }

  onMonthChange(): void {
    this.applyFilters();
  }

  onQuarterChange(): void {
    this.applyFilters();
  }

  onCaveChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onSupplierChange(): void {
    this.applyFilters();
  }

  onFormatChange(): void {
    this.applyFilters();
  }

  onBulkUnitChange(): void {
    this.applyFilters();
  }

  onDrinkChange(): void {
    this.applyFilters();
  }

  onExpenseCategoryChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedCave = 'all';
    this.selectedCategory = 'all';
    this.selectedSupplier = 'all';
    this.selectedFormat = 'all';
    this.selectedBulkUnit = 'all';
    this.selectedDrink = 'all';
    this.selectedExpenseCategory = 'all';
    this.searchTerm = '';
    this.applyFilters();
  }

  // ========================================
  // CALCUL DES STATISTIQUES GLOBALES
  // ========================================

  calculateGlobalStats(): void {
    console.log('📊 Calcul des statistiques globales...');

    // Réinitialise les stats
    this.globalStats = this.getEmptyStats();

    // 1. CALCUL DES ACHATS (Entrées)
    this.globalStats.totalAchats = this.filteredEntries.reduce((sum, entry) => sum + entry.totalCost, 0);
    this.globalStats.totalBoissonsAchetees = this.filteredEntries.reduce((sum, entry) => sum + entry.quantity, 0);
    this.globalStats.nombreEntrees = this.filteredEntries.length;

    if (this.filteredEntries.length > 0) {
      const totalPrixAchats = this.filteredEntries.reduce((sum, entry) => sum + entry.unitPrice, 0);
      this.globalStats.prixMoyenAchat = totalPrixAchats / this.filteredEntries.length;
    }

    // 2. CALCUL DES VENTES
    const ventes = this.filteredExits.filter(exit => exit.type === 'vente');
    this.globalStats.chiffreAffaires = ventes.reduce((sum, exit) => sum + exit.totalAmount, 0);
    this.globalStats.totalVentesBrutes = this.globalStats.chiffreAffaires;
    this.globalStats.totalBoissonsVendues = ventes.reduce((sum, exit) => sum + exit.quantity, 0);
    this.globalStats.nombreVentes = ventes.length;

    if (ventes.length > 0) {
      const totalPrixVentes = ventes.reduce((sum, exit) => sum + exit.unitPrice, 0);
      this.globalStats.prixMoyenVente = totalPrixVentes / ventes.length;
      this.globalStats.panierMoyen = this.globalStats.chiffreAffaires / ventes.length;
    }

    // 3. CALCUL DES PERTES (Casse, Péremption, Perte)
    const pertes = this.filteredExits.filter(exit =>
      ['perte', 'casse', 'peremption'].includes(exit.type)
    );
    this.globalStats.totalPertes = pertes.reduce((sum, exit) => sum + exit.totalAmount, 0);
    this.globalStats.totalBoissonsPertes = pertes.reduce((sum, exit) => sum + exit.quantity, 0);
    this.globalStats.nombrePertes = pertes.length;

    // 4. CALCUL DES DÉPENSES
    this.globalStats.totalDepenses = this.filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    this.globalStats.nombreDepenses = this.filteredExpenses.length;

    // 5. CALCUL DES COÛTS TOTAUX
    this.globalStats.coutTotal =
      this.globalStats.totalAchats +
      this.globalStats.totalDepenses +
      this.globalStats.totalPertes;

    // 6. CALCUL DES BÉNÉFICES
    this.globalStats.beneficeBrut = this.globalStats.chiffreAffaires - this.globalStats.totalAchats;
    this.globalStats.beneficeNet = this.globalStats.chiffreAffaires - this.globalStats.coutTotal;

    // 7. CALCUL DES MARGES
    if (this.globalStats.chiffreAffaires > 0) {
      this.globalStats.margeBrute = (this.globalStats.beneficeBrut / this.globalStats.chiffreAffaires) * 100;
      this.globalStats.margeNette = (this.globalStats.beneficeNet / this.globalStats.chiffreAffaires) * 100;
    }

    // 8. CALCUL DU STOCK
    // Stock de départ = Stock actuel + Ventes - Achats + Pertes
    this.drinks.forEach(drink => {
      const achats = this.filteredEntries
        .filter(e => e.drinkId === drink.id)
        .reduce((sum, e) => sum + e.quantity, 0);

      const ventesQty = ventes
        .filter(e => e.drinkId === drink.id)
        .reduce((sum, e) => sum + e.quantity, 0);

      const pertesQty = pertes
        .filter(e => e.drinkId === drink.id)
        .reduce((sum, e) => sum + e.quantity, 0);

      const stockDepart = drink.stock + ventesQty + pertesQty - achats;

      this.globalStats.stockDepart += stockDepart * drink.purchasePrice;
      this.globalStats.stockRestant += drink.stock * drink.purchasePrice;
    });

    console.log('✅ Statistiques globales calculées:', this.globalStats);
  }

  // ========================================
  // CALCUL DES STATISTIQUES PAR ITEM
  // ========================================

  calculateItemStats(): void {
    console.log('📊 Calcul des statistiques par item...');

    this.itemStats = [];

    // Pour chaque boisson, calcule ses statistiques
    this.drinks.forEach(drink => {
      // Filtre les entrées et sorties pour cette boisson
      const drinkEntries = this.filteredEntries.filter(e => e.drinkId === drink.id);
      const drinkExits = this.filteredExits.filter(e => e.drinkId === drink.id);
      const ventes = drinkExits.filter(e => e.type === 'vente');
      const pertes = drinkExits.filter(e => ['perte', 'casse', 'peremption'].includes(e.type));

      // Si aucune transaction, on passe
      if (drinkEntries.length === 0 && drinkExits.length === 0) {
        return;
      }

      // Quantités
      const quantiteAchetee = drinkEntries.reduce((sum, e) => sum + e.quantity, 0);
      const quantiteVendue = ventes.reduce((sum, e) => sum + e.quantity, 0);
      const quantitePerdue = pertes.reduce((sum, e) => sum + e.quantity, 0);

      // Montants
      const coutAchat = drinkEntries.reduce((sum, e) => sum + e.totalCost, 0);
      const revenueVente = ventes.reduce((sum, e) => sum + e.totalAmount, 0);
      const valeurPertes = pertes.reduce((sum, e) => sum + e.totalAmount, 0);

      // Bénéfice
      const benefice = revenueVente - coutAchat;
      const margePourcentage = revenueVente > 0 ? (benefice / revenueVente) * 100 : 0;

      // Prix moyens
      const prixAchatMoyen = drinkEntries.length > 0
        ? drinkEntries.reduce((sum, e) => sum + e.unitPrice, 0) / drinkEntries.length
        : drink.purchasePrice;

      const prixVenteMoyen = ventes.length > 0
        ? ventes.reduce((sum, e) => sum + e.unitPrice, 0) / ventes.length
        : drink.sellingPrice;

      // Ajoute les stats
      this.itemStats.push({
        drinkId: drink.id,
        drinkName: drink.name,
        drinkIcon: drink.icon,
        category: drink.category,
        format: drink.format,
        supplier: drink.supplier,
        quantiteAchetee,
        quantiteVendue,
        quantitePerdue,
        stockActuel: drink.stock,
        coutAchat,
        revenueVente,
        valeurPertes,
        benefice,
        margePourcentage,
        prixAchatMoyen,
        prixVenteMoyen
      });
    });

    // Trie par bénéfice décroissant
    this.itemStats.sort((a, b) => b.benefice - a.benefice);

    console.log('✅ Statistiques par item calculées:', this.itemStats.length, 'items');
  }

  // ========================================
  // MÉTHODES UTILITAIRES
  // ========================================

  private getEmptyStats(): GlobalStats {
    return {
      chiffreAffaires: 0,
      totalVentesBrutes: 0,
      totalAchats: 0,
      totalDepenses: 0,
      totalPertes: 0,
      coutTotal: 0,
      beneficeBrut: 0,
      beneficeNet: 0,
      margeBrute: 0,
      margeNette: 0,
      stockDepart: 0,
      stockRestant: 0,
      totalBoissonsAchetees: 0,
      totalBoissonsVendues: 0,
      totalBoissonsPertes: 0,
      nombreVentes: 0,
      nombreEntrees: 0,
      nombrePertes: 0,
      nombreDepenses: 0,
      prixMoyenVente: 0,
      prixMoyenAchat: 0,
      panierMoyen: 0
    };
  }

  formatNumber(num: number): string {
    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  formatCurrency(num: number): string {
    return this.formatNumber(num) + ' FCFA';
  }

  formatPercentage(num: number): string {
    return num.toFixed(2) + ' %';
  }

  getCaveName(caveId: string): string {
    const cave = this.caves.find(c => c.id === caveId);
    return cave ? cave.name : 'Inconnue';
  }

  getPeriodLabel(): string {
    switch (this.periodType) {
      case 'mensuel':
        const month = this.months.find(m => m.value === this.selectedMonth);
        return `${month?.label} ${this.selectedYear}`;

      case 'trimestriel':
        const quarter = this.quarters.find(q => q.value === this.selectedQuarter);
        return `${quarter?.label} ${this.selectedYear}`;

      case 'annuel':
        return `Année ${this.selectedYear}`;

      case 'personnalise':
        if (this.customStartDate && this.customEndDate) {
          const start = new Date(this.customStartDate).toLocaleDateString('fr-FR');
          const end = new Date(this.customEndDate).toLocaleDateString('fr-FR');
          return `${start} - ${end}`;
        }
        return 'Période personnalisée';

      default:
        return '';
    }
  }

  getStatusClass(value: number): string {
    if (value > 0) return 'text-success';
    if (value < 0) return 'text-danger';
    return 'text-muted';
  }

  getStatusIcon(value: number): string {
    if (value > 0) return '📈';
    if (value < 0) return '📉';
    return '➖';
  }

  // ========================================
  // CHANGEMENT DE VUE
  // ========================================

  switchView(view: 'global' | 'details'): void {
    this.viewMode = view;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  // ========================================
  // EXPORT
  // ========================================

  exportToCSV(): void {
    if (this.viewMode === 'global') {
      this.exportGlobalToCSV();
    } else {
      this.exportDetailsToCSV();
    }
  }

  private exportGlobalToCSV(): void {
    const headers = [
      'Période',
      'Chiffre d\'Affaires (FCFA)',
      'Total Achats (FCFA)',
      'Total Dépenses (FCFA)',
      'Total Pertes (FCFA)',
      'Coût Total (FCFA)',
      'Bénéfice Brut (FCFA)',
      'Bénéfice Net (FCFA)',
      'Marge Brute (%)',
      'Marge Nette (%)',
      'Stock Départ (FCFA)',
      'Stock Restant (FCFA)',
      'Boissons Achetées',
      'Boissons Vendues',
      'Boissons Perdues',
      'Nombre Ventes',
      'Nombre Entrées',
      'Nombre Pertes',
      'Nombre Dépenses',
      'Prix Moyen Vente',
      'Prix Moyen Achat',
      'Panier Moyen'
    ];

    const row = [
      this.getPeriodLabel(),
      this.globalStats.chiffreAffaires,
      this.globalStats.totalAchats,
      this.globalStats.totalDepenses,
      this.globalStats.totalPertes,
      this.globalStats.coutTotal,
      this.globalStats.beneficeBrut,
      this.globalStats.beneficeNet,
      this.globalStats.margeBrute.toFixed(2),
      this.globalStats.margeNette.toFixed(2),
      this.globalStats.stockDepart,
      this.globalStats.stockRestant,
      this.globalStats.totalBoissonsAchetees,
      this.globalStats.totalBoissonsVendues,
      this.globalStats.totalBoissonsPertes,
      this.globalStats.nombreVentes,
      this.globalStats.nombreEntrees,
      this.globalStats.nombrePertes,
      this.globalStats.nombreDepenses,
      this.globalStats.prixMoyenVente.toFixed(0),
      this.globalStats.prixMoyenAchat.toFixed(0),
      this.globalStats.panierMoyen.toFixed(0)
    ];

    const csv = [
      headers.join(','),
      row.join(',')
    ].join('\n');

    this.downloadFile(csv, `benefices-global-${Date.now()}.csv`);
    alert('✅ Export global réussi !');
  }

  private exportDetailsToCSV(): void {
    const headers = [
      'Boisson',
      'Catégorie',
      'Format',
      'Fournisseur',
      'Quantité Achetée',
      'Quantité Vendue',
      'Quantité Perdue',
      'Stock Actuel',
      'Coût Achat (FCFA)',
      'Revenue Vente (FCFA)',
      'Valeur Pertes (FCFA)',
      'Bénéfice (FCFA)',
      'Marge (%)',
      'Prix Achat Moyen',
      'Prix Vente Moyen'
    ];

    const rows = this.itemStats.map(item => [
      item.drinkName,
      item.category,
      item.format,
      item.supplier,
      item.quantiteAchetee,
      item.quantiteVendue,
      item.quantitePerdue,
      item.stockActuel,
      item.coutAchat,
      item.revenueVente,
      item.valeurPertes,
      item.benefice,
      item.margePourcentage.toFixed(2),
      item.prixAchatMoyen.toFixed(0),
      item.prixVenteMoyen.toFixed(0)
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    this.downloadFile(csv, `benefices-details-${Date.now()}.csv`);
    alert('✅ Export détaillé réussi !');
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

  exportToPDF(): void {
    console.log('📄 Export PDF en cours...');
    window.print();
  }

  // ========================================
  // GRAPHIQUES - Données pour les charts
  // ========================================

  getChartData(): any {
    if (this.viewMode === 'global') {
      return {
        labels: ['CA', 'Achats', 'Dépenses', 'Pertes', 'Bénéfice Net'],
        datasets: [{
          label: 'Montants (FCFA)',
          data: [
            this.globalStats.chiffreAffaires,
            this.globalStats.totalAchats,
            this.globalStats.totalDepenses,
            this.globalStats.totalPertes,
            this.globalStats.beneficeNet
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(54, 162, 235, 0.6)'
          ]
        }]
      };
    } else {
      // Top 10 boissons par bénéfice
      const top10 = this.itemStats.slice(0, 10);
      return {
        labels: top10.map(item => item.drinkName),
        datasets: [{
          label: 'Bénéfice (FCFA)',
          data: top10.map(item => item.benefice),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      };
    }
  }

  // ========================================
  // ANALYSE AVANCÉE
  // ========================================

  getTopPerformers(limit: number = 5): ItemStats[] {
    return this.itemStats
      .filter(item => item.benefice > 0)
      .slice(0, limit);
  }

  getLowPerformers(limit: number = 5): ItemStats[] {
    return [...this.itemStats]
      .sort((a, b) => a.benefice - b.benefice)
      .slice(0, limit);
  }

  getMostSoldDrinks(limit: number = 5): ItemStats[] {
    return [...this.itemStats]
      .sort((a, b) => b.quantiteVendue - a.quantiteVendue)
      .slice(0, limit);
  }

  getHighestMarginDrinks(limit: number = 5): ItemStats[] {
    return [...this.itemStats]
      .filter(item => item.revenueVente > 0)
      .sort((a, b) => b.margePourcentage - a.margePourcentage)
      .slice(0, limit);
  }

  // ========================================
  // ALERTES ET RECOMMANDATIONS
  // ========================================

  getAlerts(): string[] {
    const alerts: string[] = [];

    // Alerte si bénéfice net négatif
    if (this.globalStats.beneficeNet < 0) {
      alerts.push('⚠️ Bénéfice net négatif ! Vos coûts dépassent vos revenus.');
    }

    // Alerte si marge nette faible
    if (this.globalStats.margeNette < 10 && this.globalStats.margeNette > 0) {
      alerts.push('⚠️ Marge nette faible (< 10%). Optimisez vos coûts.');
    }

    // Alerte sur les pertes élevées
    if (this.globalStats.totalPertes > 0) {
      const tauxPerte = (this.globalStats.totalPertes / this.globalStats.totalAchats) * 100;
      if (tauxPerte > 5) {
        alerts.push(`⚠️ Taux de perte élevé (${tauxPerte.toFixed(1)}%). Vérifiez la gestion du stock.`);
      }
    }

    // Alerte sur les dépenses élevées
    if (this.globalStats.totalDepenses > 0) {
      const ratioDepenses = (this.globalStats.totalDepenses / this.globalStats.chiffreAffaires) * 100;
      if (ratioDepenses > 30) {
        alerts.push(`⚠️ Dépenses représentent ${ratioDepenses.toFixed(1)}% du CA. Optimisation recommandée.`);
      }
    }

    // Alerte sur les boissons non rentables
    const nonRentables = this.itemStats.filter(item => item.benefice < 0);
    if (nonRentables.length > 0) {
      alerts.push(`⚠️ ${nonRentables.length} boisson(s) non rentable(s). Révision des prix recommandée.`);
    }

    return alerts;
  }

  getRecommendations(): string[] {
    const recommendations: string[] = [];

    // Recommandation sur les best sellers
    const topSellers = this.getMostSoldDrinks(3);
    if (topSellers.length > 0) {
      recommendations.push(`✅ Augmentez le stock de: ${topSellers.map(d => d.drinkName).join(', ')}`);
    }

    // Recommandation sur les marges élevées
    const highMargin = this.getHighestMarginDrinks(3);
    if (highMargin.length > 0) {
      recommendations.push(`💰 Promouvez les produits à forte marge: ${highMargin.map(d => d.drinkName).join(', ')}`);
    }

    // Recommandation sur les produits peu performants
    const lowPerf = this.getLowPerformers(3);
    if (lowPerf.length > 0 && lowPerf[0].benefice < 0) {
      recommendations.push(`❌ Envisagez de retirer: ${lowPerf.map(d => d.drinkName).join(', ')}`);
    }

    return recommendations;
  }
}
