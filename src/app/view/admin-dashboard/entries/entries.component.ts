// ==========================================
// FICHIER: src/app/view/admin-dashboard/entries/entries.component.ts
// DESCRIPTION: Composant pour gérer les entrées de stock avec détails complets
// VERSION ACTUALISÉE avec intégration complète des détails boissons
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Énumérations importées depuis drinks.component
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

export enum PackagingType {
  BOUTEILLE = 'Bouteille',
  CANETTE = 'Canette',
  VERRE = 'Verre',
  PLASTIQUE = 'Plastique',
  SACHET = 'Sachet'
}

export enum BulkUnit {
  CARTON = 'Carton',
  CASIER = 'Casier',
  PACK = 'Pack',
  CAISSE = 'Caisse'
}

/**
 * Interface pour définir une boisson complète
 * Cette interface contient TOUS les détails d'une boisson
 */
interface Drink {
  // Identifiants
  id: string;
  name: string;
  icon: string;

  // Caractéristiques produit
  category: DrinkCategory;
  format: DrinkFormat;
  packagingType: PackagingType;

  // Informations fournisseur et commercial
  supplier: Supplier;
  depot: string;                    // Nom du dépôt
  commercialName: string;           // Nom du commercial
  commercialContact: string;        // Contact du commercial

  // Conditionnement en gros
  bulkUnit: BulkUnit;              // Unité de gros (Carton, Casier...)
  bulkQuantity: number;            // Nombre d'unités de gros
  unitsPerBulk: number;            // Unités par conditionnement
  totalBottles: number;            // Total calculé automatiquement

  // Tarification
  purchasePrice: number;           // Prix d'achat unitaire
  sellingPrice: number;            // Prix de vente unitaire

  // Stock et ventes
  stock: number;
  sales?: number;

  // Informations complémentaires
  description?: string;
  createdAt?: Date;
  badge?: 'hot' | 'new';
}

/**
 * Interface pour définir une cave
 */
interface Cave {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentStock: number;
  description?: string;
  temperature?: string;           // Température de conservation
  humidity?: string;              // Taux d'humidité
}

/**
 * Interface pour définir une entrée de stock enrichie
 * Maintenant avec TOUS les détails de la boisson
 */
interface StockEntry {
  // Identifiants
  id: string;
  date: Date;

  // Informations boisson
  drinkId: string;
  drinkName: string;
  drinkIcon: string;
  drinkCategory: DrinkCategory;
  drinkFormat: DrinkFormat;

  // Conditionnement reçu
  bulkUnit: BulkUnit;              // Type de conditionnement reçu
  bulkQuantity: number;            // Nombre de conditionnements reçus
  unitsPerBulk: number;            // Unités par conditionnement
  quantity: number;                // Quantité totale d'unités

  // Informations fournisseur
  supplier: Supplier;
  supplierInvoice?: string;        // Numéro de facture fournisseur
  deliveryNote?: string;           // Numéro de bon de livraison

  // Commercial associé
  commercialName: string;
  commercialContact: string;

  // Tarification
  unitPrice: number;               // Prix d'achat unitaire
  bulkPrice: number;               // Prix par conditionnement
  totalCost: number;               // Coût total de l'entrée

  // Destination
  caveId: string;

  // Qualité et conformité
  qualityCheck: 'conforme' | 'non-conforme' | 'avec-reserve';
  qualityNotes?: string;

  // Traçabilité
  addedBy: string;
  batchNumber?: string;            // Numéro de lot
  expiryDate?: Date;               // Date de péremption si applicable

  // Notes
  notes?: string;
}

/**
 * Interface pour le formulaire d'entrée enrichi
 */
interface StockEntryForm {
  // Sélection boisson
  drinkId: string;

  // Conditionnement
  bulkUnit: BulkUnit;
  bulkQuantity: number;
  unitsPerBulk: number;
  totalUnits: number;              // Calculé automatiquement

  // Tarification
  unitPrice: number;
  bulkPrice: number;               // Calculé automatiquement
  totalCost: number;               // Calculé automatiquement

  // Fournisseur et documents
  supplier: Supplier;
  supplierInvoice: string;
  deliveryNote: string;

  // Destination
  caveId: string;

  // Qualité
  qualityCheck: 'conforme' | 'non-conforme' | 'avec-reserve';
  qualityNotes: string;

  // Traçabilité
  batchNumber: string;
  expiryDate: string;

  // Notes
  notes: string;
}

/**
 * Interface pour les accords mets-vins suggérés
 * Intégration avec wine-pairing
 */
interface WinePairingSuggestion {
  dish: string;
  dishIcon: string;
  description: string;
  temperature: string;
}

/**
 * Composant EntriesComponent - VERSION ENRICHIE
 * Gestion complète des entrées de stock avec tous les détails
 */
@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent implements OnInit {

  // ========================================
  // PROPRIÉTÉS
  // ========================================

  /**
   * Liste complète des entrées de stock
   */
  entries: StockEntry[] = [];

  /**
   * Liste filtrée des entrées à afficher
   */
  filteredEntries: StockEntry[] = [];

  /**
   * Liste des boissons disponibles (avec détails complets)
   */
  drinks: Drink[] = [];

  /**
   * Liste des caves disponibles
   */
  caves: Cave[] = [];

  /**
   * Indicateur de chargement
   */
  isLoading: boolean = false;

  /**
   * Indique si le modal d'ajout est ouvert
   */
  isAddModalOpen: boolean = false;

  /**
   * Indique si le modal de détails est ouvert
   */
  isDetailModalOpen: boolean = false;

  /**
   * Entrée sélectionnée pour afficher les détails
   */
  selectedEntry: StockEntry | null = null;

  /**
   * Formulaire pour ajouter une entrée
   */
  entryForm: StockEntryForm = this.getEmptyForm();

  /**
   * Filtres
   */
  selectedCaveFilter: string | null = null;
  selectedCategoryFilter: DrinkCategory | null = null;
  selectedSupplierFilter: Supplier | null = null;
  periodFilter: number = 30; // 30 derniers jours par défaut
  searchTerm: string = '';

  /**
   * Énumérations pour le template
   */
  drinkCategories = Object.values(DrinkCategory);
  suppliers = Object.values(Supplier);
  bulkUnits = Object.values(BulkUnit);
  qualityOptions: Array<'conforme' | 'non-conforme' | 'avec-reserve'> = [
    'conforme',
    'non-conforme',
    'avec-reserve'
  ];

  /**
   * Statistiques enrichies des entrées
   */
  stats = {
    totalEntries: 0,              // Nombre total d'entrées
    totalQuantity: 0,             // Quantité totale d'unités reçues
    totalCost: 0,                 // Coût total des entrées
    recentEntries: 0,             // Entrées des 7 derniers jours
    averageUnitPrice: 0,          // Prix unitaire moyen
    totalBulkUnits: 0,            // Nombre total de conditionnements reçus
    conformityRate: 0,            // Taux de conformité (%)
    topSupplier: '',              // Fournisseur principal
    topCategory: ''               // Catégorie la plus reçue
  };

  /**
   * Suggestions d'accords mets-vins pour la boisson sélectionnée
   */
  winePairingSuggestions: WinePairingSuggestion[] = [];

  // ========================================
  // CONSTRUCTEUR
  // ========================================

  constructor() {}

  // ========================================
  // LIFECYCLE HOOKS
  // ========================================

  /**
   * Initialisation du composant
   * Charge toutes les données au démarrage
   */
  ngOnInit(): void {
    console.log('✅ EntriesComponent initialisé avec détails complets');
    this.loadData();
  }

  // ========================================
  // CHARGEMENT DES DONNÉES
  // ========================================

  /**
   * Charge toutes les données nécessaires
   * TODO: Remplacer par des appels API réels
   */
  loadData(): void {
    // Cette ligne active l'indicateur de chargement pour informer l'utilisateur
    this.isLoading = true;

    // On charge d'abord les boissons avec TOUS leurs détails (format, conditionnement, commercial, etc.)
    this.drinks = this.generateMockDrinks();

    // Ensuite on charge les caves disponibles pour le stockage
    this.caves = this.generateMockCaves();

    // Enfin on charge l'historique des entrées de stock
    this.entries = this.generateMockEntries();

    // On initialise les entrées filtrées avec toutes les entrées
    this.filteredEntries = [...this.entries];

    // On calcule toutes les statistiques (total, coûts, conformité, etc.)
    this.calculateStats();

    // Le chargement est terminé
    this.isLoading = false;

    // Log pour le debug : affiche le nombre d'éléments chargés
    console.log('✅ Données chargées:', {
      entries: this.entries.length,
      drinks: this.drinks.length,
      caves: this.caves.length
    });
  }

  /**
   * Génère des boissons de test AVEC TOUS LES DÉTAILS
   * Chaque boisson contient maintenant les informations complètes
   * @returns Liste de boissons simulées avec détails complets
   */
  private generateMockDrinks(): Drink[] {
    // On retourne un tableau de boissons avec TOUS les champs remplis
    return [
      {
        // === IDENTIFIANTS ===
        id: 'drink_1',                              // ID unique de la boisson
        name: 'Heineken',                           // Nom commercial
        icon: '🍺',                                 // Emoji pour l'affichage

        // === CARACTÉRISTIQUES PRODUIT ===
        category: DrinkCategory.BIERES,             // Catégorie : Bière
        format: DrinkFormat.CL_33,                  // Format : 33cl
        packagingType: PackagingType.BOUTEILLE,     // Type : Bouteille en verre

        // === FOURNISSEUR ET COMMERCIAL ===
        supplier: Supplier.SOLIBRA,                 // Fournisseur : Solibra
        depot: 'Dépôt Abidjan Zone 4',             // Localisation du dépôt
        commercialName: 'Kouadio Jean',             // Nom du commercial responsable
        commercialContact: '+225 07 00 00 00 01',   // Téléphone du commercial

        // === CONDITIONNEMENT EN GROS ===
        bulkUnit: BulkUnit.CARTON,                  // On commande par carton
        bulkQuantity: 3,                            // 3 cartons
        unitsPerBulk: 12,                           // 12 bouteilles par carton
        totalBottles: 36,                           // Total : 3 × 12 = 36 bouteilles

        // === TARIFICATION ===
        purchasePrice: 650,                         // Prix d'achat : 650 FCFA/bouteille
        sellingPrice: 800,                          // Prix de vente : 800 FCFA/bouteille

        // === STOCK ET VENTES ===
        stock: 150,                                 // Stock actuel : 150 unités
        sales: 450,                                 // Ventes totales : 450 unités

        // === INFORMATIONS COMPLÉMENTAIRES ===
        description: 'Bière blonde hollandaise premium',
        createdAt: new Date(),
        badge: 'hot'                                // Badge "hot" = produit populaire
      },
      {
        id: 'drink_2',
        name: 'Bordeaux Rouge 2018',
        icon: '🍷',

        category: DrinkCategory.VIN_ROUGE,
        format: DrinkFormat.CL_75,
        packagingType: PackagingType.BOUTEILLE,

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
        sales: 120,

        description: 'Vin rouge de Bordeaux, millésime 2018, appellation contrôlée',
        createdAt: new Date()
      },
      {
        id: 'drink_3',
        name: 'Champagne Moët & Chandon',
        icon: '🍾',

        category: DrinkCategory.CHAMPAGNE,
        format: DrinkFormat.CL_75,
        packagingType: PackagingType.BOUTEILLE,

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
        sales: 85,

        description: 'Champagne brut impérial, cuvée prestige',
        createdAt: new Date(),
        badge: 'new'
      },
      {
        id: 'drink_4',
        name: 'Guinness',
        icon: '🍺',

        category: DrinkCategory.BIERES,
        format: DrinkFormat.CL_33,
        packagingType: PackagingType.CANETTE,

        supplier: Supplier.BRASSIVOIRE,
        depot: 'Dépôt Yopougon',
        commercialName: 'Traoré Sekou',
        commercialContact: '+225 01 55 66 77 88',

        bulkUnit: BulkUnit.PACK,
        bulkQuantity: 2,
        unitsPerBulk: 24,
        totalBottles: 48,

        purchasePrice: 850,
        sellingPrice: 1000,

        stock: 100,
        sales: 320,

        description: 'Bière brune irlandaise, goût intense',
        createdAt: new Date()
      },
      {
        id: 'drink_5',
        name: 'Chablis 2020',
        icon: '🍷',

        category: DrinkCategory.VIN_BLANC,
        format: DrinkFormat.CL_75,
        packagingType: PackagingType.BOUTEILLE,

        supplier: Supplier.AUTRES,
        depot: 'Dépôt Cocody',
        commercialName: 'Bakayoko Aminata',
        commercialContact: '+225 05 00 00 00 02',

        bulkUnit: BulkUnit.CAISSE,
        bulkQuantity: 2,
        unitsPerBulk: 6,
        totalBottles: 12,

        purchasePrice: 9500,
        sellingPrice: 12000,

        stock: 30,
        sales: 95,

        description: 'Vin blanc sec de Bourgogne, notes minérales',
        createdAt: new Date()
      }
    ];
  }

  /**
   * Génère des caves de test avec détails enrichis
   * @returns Liste de caves simulées
   */
  private generateMockCaves(): Cave[] {
    // Chaque cave a maintenant des informations de température et humidité
    return [
      {
        id: 'cave_1',
        name: 'Cave Principale',
        location: 'Bâtiment A - Sous-sol',
        capacity: 1000,                       // Capacité maximale : 1000 unités
        currentStock: 650,                    // Stock actuel : 650 unités
        description: 'Cave principale de stockage',
        temperature: '12-14°C',               // Température contrôlée
        humidity: '70-75%'                    // Taux d'humidité optimal
      },
      {
        id: 'cave_2',
        name: 'Cave Secondaire',
        location: 'Bâtiment B - RDC',
        capacity: 500,
        currentStock: 320,
        description: 'Cave secondaire pour rotation rapide',
        temperature: '14-16°C',
        humidity: '65-70%'
      },
      {
        id: 'cave_3',
        name: 'Cave de Vieillissement',
        location: 'Bâtiment A - Niveau -2',
        capacity: 300,
        currentStock: 180,
        description: 'Cave climatisée pour vins de garde',
        temperature: '10-12°C',               // Plus fraîche pour les vins de garde
        humidity: '75-80%'                    // Humidité plus élevée
      }
    ];
  }

 /**
 * Génère des entrées de test ENRICHIES avec tous les détails
 * Chaque entrée contient maintenant les informations complètes de la boisson
 * @returns Liste d'entrées de stock simulées triées par date décroissante
 */
private generateMockEntries(): StockEntry[] {
  const now = new Date();

  // Déclaration explicite du tableau avec le bon type
  const entries: StockEntry[] = [
    {
      // === IDENTIFIANTS ===
      id: 'entry_1',
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours

      // === INFORMATIONS BOISSON COMPLÈTES ===
      drinkId: 'drink_1',
      drinkName: 'Heineken',
      drinkIcon: '🍺',
      drinkCategory: DrinkCategory.BIERES,
      drinkFormat: DrinkFormat.CL_33,

      // === CONDITIONNEMENT REÇU ===
      bulkUnit: BulkUnit.CARTON,            // Type : Carton
      bulkQuantity: 5,                      // Nombre : 5 cartons
      unitsPerBulk: 12,                     // 12 bouteilles par carton
      quantity: 60,                         // Total : 5 × 12 = 60 bouteilles

      // === FOURNISSEUR ET DOCUMENTS ===
      supplier: Supplier.SOLIBRA,
      supplierInvoice: 'INV-2024-001234',   // Numéro de facture fournisseur
      deliveryNote: 'BL-2024-005678',       // Numéro de bon de livraison

      // === COMMERCIAL ===
      commercialName: 'Kouadio Jean',
      commercialContact: '+225 07 00 00 00 01',

      // === TARIFICATION ===
      unitPrice: 650,                       // 650 FCFA par bouteille
      bulkPrice: 7800,                      // 650 × 12 = 7800 FCFA par carton
      totalCost: 39000,                     // 7800 × 5 = 39000 FCFA total

      // === DESTINATION ===
      caveId: 'cave_1',                     // Stocké dans Cave Principale

      // === QUALITÉ ET CONFORMITÉ ===
      qualityCheck: 'conforme' as 'conforme' | 'non-conforme' | 'avec-reserve',  // ← TYPAGE EXPLICITE
      qualityNotes: 'Livraison en bon état, bouteilles bien emballées',

      // === TRAÇABILITÉ ===
      addedBy: 'Jean Dupont',               // Qui a enregistré l'entrée
      batchNumber: 'LOT-2024-H-0123',       // Numéro de lot fabricant
      expiryDate: new Date(2025, 11, 31),   // Date de péremption : 31/12/2025

      // === NOTES ===
      notes: 'Réception normale, stockage immédiat en cave fraîche'
    },
    {
      id: 'entry_2',
      date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // Il y a 5 jours

      drinkId: 'drink_2',
      drinkName: 'Bordeaux Rouge 2018',
      drinkIcon: '🍷',
      drinkCategory: DrinkCategory.VIN_ROUGE,
      drinkFormat: DrinkFormat.CL_75,

      bulkUnit: BulkUnit.CAISSE,
      bulkQuantity: 3,
      unitsPerBulk: 6,
      quantity: 18,

      supplier: Supplier.AUTRES,
      supplierInvoice: 'VINS-2024-456',
      deliveryNote: 'BL-VINS-789',

      commercialName: 'Bakayoko Aminata',
      commercialContact: '+225 05 00 00 00 02',

      unitPrice: 12000,
      bulkPrice: 72000,                     // 12000 × 6
      totalCost: 216000,                    // 72000 × 3

      caveId: 'cave_3',                     // Cave de vieillissement

      qualityCheck: 'conforme' as 'conforme' | 'non-conforme' | 'avec-reserve',  // ← TYPAGE EXPLICITE
      qualityNotes: 'Millésime exceptionnel, bouchons intacts',

      addedBy: 'Marie Martin',
      batchNumber: 'BDX-2018-RED-456',
      expiryDate: new Date(2028, 11, 31),   // Vin de garde

      notes: 'Stockage horizontal recommandé pour préserver le bouchon'
    },
    {
      id: 'entry_3',
      date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // Il y a 10 jours

      drinkId: 'drink_3',
      drinkName: 'Champagne Moët & Chandon',
      drinkIcon: '🍾',
      drinkCategory: DrinkCategory.CHAMPAGNE,
      drinkFormat: DrinkFormat.CL_75,

      bulkUnit: BulkUnit.CAISSE,
      bulkQuantity: 2,
      unitsPerBulk: 6,
      quantity: 12,

      supplier: Supplier.AUTRES,
      supplierInvoice: 'CHAMP-2024-789',
      deliveryNote: 'BL-CHAMP-321',

      commercialName: 'Koné Moussa',
      commercialContact: '+225 07 11 22 33 44',

      unitPrice: 30000,
      bulkPrice: 180000,                    // 30000 × 6
      totalCost: 360000,                    // 180000 × 2

      caveId: 'cave_3',

      qualityCheck: 'conforme' as 'conforme' | 'non-conforme' | 'avec-reserve',  // ← TYPAGE EXPLICITE
      qualityNotes: 'Température de transport respectée, emballage premium',

      addedBy: 'Sophie Bernard',
      batchNumber: 'MC-NV-2024-001',
      expiryDate: new Date(2027, 5, 30),

      notes: 'Stockage à température contrôlée impératif (8-10°C)'
    },
    {
      id: 'entry_4',
      date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // Il y a 15 jours

      drinkId: 'drink_4',
      drinkName: 'Guinness',
      drinkIcon: '🍺',
      drinkCategory: DrinkCategory.BIERES,
      drinkFormat: DrinkFormat.CL_33,

      bulkUnit: BulkUnit.PACK,
      bulkQuantity: 4,
      unitsPerBulk: 24,
      quantity: 96,

      supplier: Supplier.BRASSIVOIRE,
      supplierInvoice: 'BRA-2024-555',
      deliveryNote: 'BL-BRA-666',

      commercialName: 'Traoré Sekou',
      commercialContact: '+225 01 55 66 77 88',

      unitPrice: 850,
      bulkPrice: 20400,                     // 850 × 24
      totalCost: 81600,                     // 20400 × 4

      caveId: 'cave_2',

      qualityCheck: 'conforme' as 'conforme' | 'non-conforme' | 'avec-reserve',  // ← TYPAGE EXPLICITE
      qualityNotes: 'Canettes en parfait état, date de production récente',

      addedBy: 'Pierre Dubois',
      batchNumber: 'GUIN-2024-333',
      expiryDate: new Date(2025, 8, 30),

      notes: 'Promotion fournisseur - Prix réduit de 10%'
    },
    {
      id: 'entry_5',
      date: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // Il y a 20 jours

      drinkId: 'drink_5',
      drinkName: 'Chablis 2020',
      drinkIcon: '🍷',
      drinkCategory: DrinkCategory.VIN_BLANC,
      drinkFormat: DrinkFormat.CL_75,

      bulkUnit: BulkUnit.CAISSE,
      bulkQuantity: 2,
      unitsPerBulk: 6,
      quantity: 12,

      supplier: Supplier.AUTRES,
      supplierInvoice: 'CHAB-2024-888',
      deliveryNote: 'BL-CHAB-999',

      commercialName: 'Bakayoko Aminata',
      commercialContact: '+225 05 00 00 00 02',

      unitPrice: 9500,
      bulkPrice: 57000,                     // 9500 × 6
      totalCost: 114000,                    // 57000 × 2

      caveId: 'cave_3',

      qualityCheck: 'avec-reserve' as 'conforme' | 'non-conforme' | 'avec-reserve',  // ← TYPAGE EXPLICITE
      qualityNotes: '1 bouteille légèrement fêlée, reste conforme',

      addedBy: 'Luc Moreau',
      batchNumber: 'CHAB-2020-112',
      expiryDate: new Date(2026, 11, 31),

      notes: 'Remise commerciale obtenue pour la bouteille défectueuse'
    }
  ];

  // TRI par date décroissante (plus récent en premier) et RETURN
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
  // ... (suite dans le prochain message)
  // ... (suite du fichier entries.component.ts)

  // ========================================
  // CALCULS AUTOMATIQUES DU FORMULAIRE
  // ========================================

  /**
   * Calcule automatiquement le nombre total d'unités
   * Exemple : 3 cartons × 12 bouteilles = 36 bouteilles
   */
  calculateTotalUnits(): void {
    // Multiplie le nombre de conditionnements par les unités par conditionnement
    this.entryForm.totalUnits =
      (this.entryForm.bulkQuantity || 0) * (this.entryForm.unitsPerBulk || 0);

    // Recalcule ensuite le coût total
    this.calculateTotalCost();

    console.log('🔢 Total unités calculé:', this.entryForm.totalUnits);
  }

  /**
   * Calcule automatiquement le prix par conditionnement
   * Exemple : 650 FCFA/bouteille × 12 bouteilles = 7800 FCFA/carton
   */
  calculateBulkPrice(): void {
    // Prix unitaire × nombre d'unités par conditionnement
    this.entryForm.bulkPrice =
      (this.entryForm.unitPrice || 0) * (this.entryForm.unitsPerBulk || 0);

    // Recalcule le coût total
    this.calculateTotalCost();

    console.log('💰 Prix par conditionnement:', this.entryForm.bulkPrice);
  }

  /**
   * Calcule le coût total de l'entrée
   * Exemple : 7800 FCFA/carton × 3 cartons = 23400 FCFA
   */
  calculateTotalCost(): void {
    // Prix par conditionnement × nombre de conditionnements
    this.entryForm.totalCost =
      (this.entryForm.bulkPrice || 0) * (this.entryForm.bulkQuantity || 0);

    console.log('💵 Coût total calculé:', this.entryForm.totalCost, 'FCFA');
  }

  /**
   * Gère le changement de boisson sélectionnée
   * Remplit automatiquement les champs depuis la boisson
   */
  onDrinkSelected(): void {
    // Trouve la boisson sélectionnée dans la liste
    const drink = this.drinks.find(d => d.id === this.entryForm.drinkId);

    if (drink) {
      // Remplit automatiquement les informations de la boisson
      this.entryForm.bulkUnit = drink.bulkUnit;
      this.entryForm.unitsPerBulk = drink.unitsPerBulk;
      this.entryForm.unitPrice = drink.purchasePrice;
      this.entryForm.supplier = drink.supplier;

      // Recalcule tout
      this.calculateBulkPrice();
      this.calculateTotalUnits();

      // Charge les suggestions d'accords mets-vins pour cette boisson
      this.loadWinePairingSuggestions(drink);

      console.log('✅ Boisson sélectionnée:', drink.name);
    }
  }

  /**
   * Charge les suggestions d'accords mets-vins pour une boisson
   * Intégration avec le composant wine-pairing
   * @param drink Boisson sélectionnée
   */
  loadWinePairingSuggestions(drink: Drink): void {
    // Réinitialise les suggestions
    this.winePairingSuggestions = [];

    // Suggestions selon la catégorie de boisson
    switch (drink.category) {
      case DrinkCategory.VIN_ROUGE:
        // Pour les vins rouges : viandes, fromages
        this.winePairingSuggestions = [
          {
            dish: 'Steak grillé',
            dishIcon: '🥩',
            description: 'Les tanins du vin rouge s\'accordent parfaitement avec la richesse de la viande rouge',
            temperature: '16-18°C'
          },
          {
            dish: 'Fromages affinés',
            dishIcon: '🧀',
            description: 'Un accord classique entre la puissance du vin et l\'intensité du fromage',
            temperature: '16-18°C'
          }
        ];
        break;

      case DrinkCategory.VIN_BLANC:
        // Pour les vins blancs : poissons, fruits de mer
        this.winePairingSuggestions = [
          {
            dish: 'Poisson grillé',
            dishIcon: '🐟',
            description: 'La fraîcheur du vin blanc complète délicatement le goût du poisson',
            temperature: '10-12°C'
          },
          {
            dish: 'Fruits de mer',
            dishIcon: '🦞',
            description: 'Un mariage parfait entre la minéralité du vin et l\'iode des fruits de mer',
            temperature: '8-10°C'
          }
        ];
        break;

      case DrinkCategory.CHAMPAGNE:
        // Pour le champagne : apéritifs, desserts
        this.winePairingSuggestions = [
          {
            dish: 'Apéritif',
            dishIcon: '🥂',
            description: 'Les bulles fines du champagne sont parfaites pour l\'apéritif',
            temperature: '6-8°C'
          },
          {
            dish: 'Desserts légers',
            dishIcon: '🍰',
            description: 'Un champagne demi-sec accompagne merveilleusement les desserts',
            temperature: '6-8°C'
          }
        ];
        break;

      case DrinkCategory.BIERES:
        // Pour les bières : snacks, plats épicés
        this.winePairingSuggestions = [
          {
            dish: 'Grillades',
            dishIcon: '🍖',
            description: 'La fraîcheur de la bière rafraîchit le palais entre chaque bouchée',
            temperature: '4-6°C'
          },
          {
            dish: 'Plats épicés',
            dishIcon: '🌶️',
            description: 'La bière atténue le piquant des épices',
            temperature: '4-6°C'
          }
        ];
        break;

      default:
        // Pas de suggestion spécifique
        this.winePairingSuggestions = [];
    }

    console.log('🍽️ Suggestions d\'accords chargées:', this.winePairingSuggestions.length);
  }

  // ========================================
  // FILTRAGE ET RECHERCHE
  // ========================================

  /**
   * Applique tous les filtres actifs sur les entrées
   * Combine : cave, catégorie, fournisseur, période et recherche textuelle
   */
  applyFilters(): void {
    // On part de toutes les entrées
    let result = [...this.entries];

    // FILTRE 1 : Par cave sélectionnée
    if (this.selectedCaveFilter) {
      result = result.filter(entry => entry.caveId === this.selectedCaveFilter);
      console.log(`📍 Filtre cave appliqué: ${result.length} résultats`);
    }

    // FILTRE 2 : Par catégorie de boisson
    if (this.selectedCategoryFilter) {
      result = result.filter(entry => entry.drinkCategory === this.selectedCategoryFilter);
      console.log(`🏷️ Filtre catégorie appliqué: ${result.length} résultats`);
    }

    // FILTRE 3 : Par fournisseur
    if (this.selectedSupplierFilter) {
      result = result.filter(entry => entry.supplier === this.selectedSupplierFilter);
      console.log(`🚚 Filtre fournisseur appliqué: ${result.length} résultats`);
    }

    // FILTRE 4 : Par période (nombre de jours)
    if (this.periodFilter > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.periodFilter);
      result = result.filter(entry => new Date(entry.date) >= cutoffDate);
      console.log(`📅 Filtre période appliqué (${this.periodFilter} jours): ${result.length} résultats`);
    }

    // FILTRE 5 : Par terme de recherche (nom, notes, commercial, etc.)
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(entry =>
        // Recherche dans le nom de la boisson
        entry.drinkName.toLowerCase().includes(term) ||
        // Recherche dans le fournisseur
        entry.supplier.toLowerCase().includes(term) ||
        // Recherche dans les notes
        entry.notes?.toLowerCase().includes(term) ||
        // Recherche dans le nom du commercial
        entry.commercialName.toLowerCase().includes(term) ||
        // Recherche dans la personne qui a ajouté
        entry.addedBy.toLowerCase().includes(term) ||
        // Recherche dans le numéro de facture
        entry.supplierInvoice?.toLowerCase().includes(term) ||
        // Recherche dans le numéro de bon de livraison
        entry.deliveryNote?.toLowerCase().includes(term)
      );
      console.log(`🔍 Recherche "${term}" appliquée: ${result.length} résultats`);
    }

    // Affecte les résultats filtrés
    this.filteredEntries = result;

    console.log(`✅ Filtrage terminé: ${result.length} entrée(s) sur ${this.entries.length}`);
  }

  /**
   * Gère le changement du filtre cave
   */
  onCaveFilterChange(): void {
    console.log('🔄 Changement filtre cave:', this.selectedCaveFilter);
    this.applyFilters();
  }

  /**
   * Gère le changement du filtre catégorie
   */
  onCategoryFilterChange(): void {
    console.log('🔄 Changement filtre catégorie:', this.selectedCategoryFilter);
    this.applyFilters();
  }

  /**
   * Gère le changement du filtre fournisseur
   */
  onSupplierFilterChange(): void {
    console.log('🔄 Changement filtre fournisseur:', this.selectedSupplierFilter);
    this.applyFilters();
  }

  /**
   * Gère le changement de la période de filtre
   */
  onPeriodFilterChange(): void {
    console.log('🔄 Changement période:', this.periodFilter, 'jours');
    this.applyFilters();
  }

  /**
   * Gère le changement du terme de recherche
   */
  onSearchChange(): void {
    this.applyFilters();
  }

  /**
   * Réinitialise tous les filtres à leurs valeurs par défaut
   */
  resetFilters(): void {
    this.selectedCaveFilter = null;
    this.selectedCategoryFilter = null;
    this.selectedSupplierFilter = null;
    this.periodFilter = 30;
    this.searchTerm = '';
    this.filteredEntries = [...this.entries];

    console.log('🔄 Tous les filtres réinitialisés');
  }

  // ========================================
  // CALCUL DES STATISTIQUES ENRICHIES
  // ========================================

  /**
   * Calcule toutes les statistiques des entrées
   * Version enrichie avec moyennes, taux de conformité, etc.
   */
  calculateStats(): void {
    // 1. Nombre total d'entrées
    this.stats.totalEntries = this.entries.length;

    // 2. Quantité totale d'unités reçues
    this.stats.totalQuantity = this.entries.reduce((sum, entry) => sum + entry.quantity, 0);

    // 3. Coût total de toutes les entrées
    this.stats.totalCost = this.entries.reduce((sum, entry) => sum + entry.totalCost, 0);

    // 4. Prix unitaire moyen
    if (this.entries.length > 0) {
      const totalUnitPrices = this.entries.reduce((sum, entry) => sum + entry.unitPrice, 0);
      this.stats.averageUnitPrice = Math.round(totalUnitPrices / this.entries.length);
    }

    // 5. Nombre total de conditionnements (cartons, caisses, etc.)
    this.stats.totalBulkUnits = this.entries.reduce((sum, entry) => sum + entry.bulkQuantity, 0);

    // 6. Entrées des 7 derniers jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    this.stats.recentEntries = this.entries.filter(
      entry => new Date(entry.date) >= sevenDaysAgo
    ).length;

    // 7. Taux de conformité (%)
    const conformEntries = this.entries.filter(e => e.qualityCheck === 'conforme').length;
    this.stats.conformityRate = this.entries.length > 0
      ? Math.round((conformEntries / this.entries.length) * 100)
      : 0;

    // 8. Fournisseur principal (celui qui a le plus d'entrées)
    const supplierCounts: { [key: string]: number } = {};
    this.entries.forEach(entry => {
      const supplier = entry.supplier;
      supplierCounts[supplier] = (supplierCounts[supplier] || 0) + 1;
    });

    let maxCount = 0;
    let topSupplier = '';
    Object.entries(supplierCounts).forEach(([supplier, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topSupplier = supplier;
      }
    });
    this.stats.topSupplier = topSupplier;

    // 9. Catégorie la plus reçue
    const categoryCounts: { [key: string]: number } = {};
    this.entries.forEach(entry => {
      const category = entry.drinkCategory;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    maxCount = 0;
    let topCategory = '';
    Object.entries(categoryCounts).forEach(([category, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topCategory = category;
      }
    });
    this.stats.topCategory = topCategory;

    console.log('📊 Statistiques calculées:', this.stats);
  }

  // ========================================
  // MODAL - AJOUT D'ENTRÉE
  // ========================================

  /**
   * Ouvre le modal d'ajout d'une nouvelle entrée
   */
  openAddModal(): void {
    // Réinitialise le formulaire avec des valeurs vides
    this.entryForm = this.getEmptyForm();

    // Réinitialise les suggestions d'accords
    this.winePairingSuggestions = [];

    // Ouvre le modal
    this.isAddModalOpen = true;

    console.log('➕ Modal d\'ajout ouvert');
  }

  /**
   * Ferme le modal d'ajout et réinitialise le formulaire
   */
  closeAddModal(): void {
    // Ferme le modal
    this.isAddModalOpen = false;

    // Réinitialise le formulaire
    this.entryForm = this.getEmptyForm();

    // Réinitialise les suggestions
    this.winePairingSuggestions = [];

    console.log('✅ Modal d\'ajout fermé');
  }

  /**
   * Sauvegarde une nouvelle entrée de stock
   * Valide les données, crée l'entrée enrichie et met à jour les stats
   */
  saveEntry(): void {
    // VALIDATION : Vérifie que tous les champs obligatoires sont remplis
    if (!this.validateForm()) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires (boisson, quantité, prix, cave)');
      return;
    }

    // RÉCUPÉRATION : Trouve la boisson sélectionnée dans la liste
    const drink = this.drinks.find(d => d.id === this.entryForm.drinkId);
    if (!drink) {
      alert('❌ Boisson non trouvée. Veuillez sélectionner une boisson valide.');
      return;
    }

    // VALIDATION QUANTITÉ : Vérifie que la quantité est positive
    if (this.entryForm.bulkQuantity <= 0 || this.entryForm.totalUnits <= 0) {
      alert('❌ La quantité doit être supérieure à zéro');
      return;
    }

    // CRÉATION : Construit la nouvelle entrée avec TOUS les détails
    const newEntry: StockEntry = {
      // Génère un ID unique
      id: this.generateId(),

      // Date actuelle
      date: new Date(),

      // Informations complètes de la boisson
      drinkId: this.entryForm.drinkId,
      drinkName: drink.name,
      drinkIcon: drink.icon,
      drinkCategory: drink.category,
      drinkFormat: drink.format,

      // Conditionnement reçu
      bulkUnit: this.entryForm.bulkUnit,
      bulkQuantity: this.entryForm.bulkQuantity,
      unitsPerBulk: this.entryForm.unitsPerBulk,
      quantity: this.entryForm.totalUnits,

      // Fournisseur et documents
      supplier: this.entryForm.supplier,
      supplierInvoice: this.entryForm.supplierInvoice,
      deliveryNote: this.entryForm.deliveryNote,

      // Commercial
      commercialName: drink.commercialName,
      commercialContact: drink.commercialContact,

      // Tarification
      unitPrice: this.entryForm.unitPrice,
      bulkPrice: this.entryForm.bulkPrice,
      totalCost: this.entryForm.totalCost,

      // Destination
      caveId: this.entryForm.caveId,

      // Qualité
      qualityCheck: this.entryForm.qualityCheck,
      qualityNotes: this.entryForm.qualityNotes,

      // Traçabilité
      addedBy: 'Utilisateur actuel', // TODO: Remplacer par l'utilisateur connecté
      batchNumber: this.entryForm.batchNumber,
      expiryDate: this.entryForm.expiryDate ? new Date(this.entryForm.expiryDate) : undefined,

      // Notes
      notes: this.entryForm.notes
    };

    // AJOUT : Insère la nouvelle entrée en première position (plus récente en haut)
    this.entries.unshift(newEntry);

    // MISE À JOUR : Applique les filtres pour rafraîchir l'affichage
    this.applyFilters();

    // RECALCUL : Met à jour toutes les statistiques
    this.calculateStats();

    // TODO: APPEL API pour sauvegarder sur le serveur
    // this.entryService.createEntry(newEntry).subscribe(...)

    console.log('✅ Entrée ajoutée avec succès:', newEntry);

    // NOTIFICATION : Informe l'utilisateur
    alert(`✅ Entrée enregistrée avec succès !\n\n` +
          `📦 Boisson: ${drink.name}\n` +
          `🔢 Quantité: ${newEntry.quantity} unités\n` +
          `💰 Coût total: ${this.formatNumber(newEntry.totalCost)} FCFA`);

    // FERMETURE : Ferme le modal
    this.closeAddModal();
  }

  /**
   * Valide le formulaire d'entrée
   * Vérifie que tous les champs obligatoires sont remplis
   * @returns true si le formulaire est valide
   */
  private validateForm(): boolean {
    return !!(
      // Boisson sélectionnée
      this.entryForm.drinkId &&

      // Quantités valides
      this.entryForm.bulkQuantity > 0 &&
      this.entryForm.unitsPerBulk > 0 &&
      this.entryForm.totalUnits > 0 &&

      // Prix valides
      this.entryForm.unitPrice > 0 &&
      this.entryForm.bulkPrice > 0 &&
      this.entryForm.totalCost > 0 &&

      // Cave sélectionnée
      this.entryForm.caveId &&

      // Contrôle qualité effectué
      this.entryForm.qualityCheck
    );
  }

  /**
   * Retourne un formulaire vide initialisé avec valeurs par défaut
   * @returns Formulaire avec valeurs par défaut
   */
  private getEmptyForm(): StockEntryForm {
    return {
      drinkId: '',
      bulkUnit: BulkUnit.CARTON,
      bulkQuantity: 1,
      unitsPerBulk: 12,
      totalUnits: 12,
      unitPrice: 0,
      bulkPrice: 0,
      totalCost: 0,
      supplier: Supplier.SOLIBRA,
      supplierInvoice: '',
      deliveryNote: '',
      caveId: '',
      qualityCheck: 'conforme',
      qualityNotes: '',
      batchNumber: '',
      expiryDate: '',
      notes: ''
    };
  }

  // ========================================
  // MODAL - DÉTAILS D'ENTRÉE
  // ========================================

  /**
   * Affiche les détails complets d'une entrée dans un modal
   * @param entry Entrée à afficher
   */
  viewEntryDetails(entry: StockEntry): void {
    // Sélectionne l'entrée
    this.selectedEntry = entry;

    // Charge les informations de la boisson pour afficher les accords
    const drink = this.drinks.find(d => d.id === entry.drinkId);
    if (drink) {
      this.loadWinePairingSuggestions(drink);
    }

    // Ouvre le modal de détails
    this.isDetailModalOpen = true;

    console.log('👁️ Détails de l\'entrée affichés:', entry);
  }

  /**
   * Ferme le modal de détails
   */
  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedEntry = null;
    this.winePairingSuggestions = [];

    console.log('✅ Modal de détails fermé');
  }

  // ========================================
  // SUPPRESSION
  // ========================================

  /**
   * Supprime une entrée après confirmation de l'utilisateur
   * Met à jour la liste, les filtres et les statistiques
   * @param entry Entrée à supprimer
   */
  deleteEntry(entry: StockEntry): void {
    // Message de confirmation détaillé avec toutes les infos
    const confirmMessage =
      `⚠️ Êtes-vous sûr de vouloir supprimer cette entrée ?\n\n` +
      `📦 Produit: ${entry.drinkIcon} ${entry.drinkName}\n` +
      `📏 Format: ${entry.drinkFormat}\n` +
      `🔢 Quantité: ${entry.quantity} unités (${entry.bulkQuantity} × ${entry.bulkUnit})\n` +
      `💰 Coût: ${this.formatNumber(entry.totalCost)} FCFA\n` +
      `📅 Date: ${this.formatDate(entry.date)}\n` +
      `🚚 Fournisseur: ${entry.supplier}\n\n` +
      `Cette action est irréversible !`;

    // Demande confirmation
    if (confirm(confirmMessage)) {
      // Trouve l'index de l'entrée dans le tableau
      const index = this.entries.findIndex(e => e.id === entry.id);

      if (index !== -1) {
        // Supprime l'entrée du tableau
        this.entries.splice(index, 1);

        // Met à jour les filtres pour rafraîchir l'affichage
        this.applyFilters();

        // Recalcule les statistiques
        this.calculateStats();

        // TODO: APPEL API DELETE pour supprimer du serveur
        // this.entryService.deleteEntry(entry.id).subscribe(...)

        console.log('🗑️ Entrée supprimée:', entry.id);

        // Notification de succès
        alert('✅ Entrée supprimée avec succès !');
      }
    } else {
      console.log('❌ Suppression annulée par l\'utilisateur');
    }
  }

  // ========================================
  // MÉTHODES UTILITAIRES
  // ========================================

  /**
   * Génère un ID unique pour une entrée
   * Format: entry_timestamp_random
   * @returns ID unique généré
   */
  private generateId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `entry_${timestamp}_${random}`;
  }

  /**
   * Formate un nombre avec des espaces comme séparateurs de milliers
   * Exemple: 1000000 → "1 000 000"
   * @param num Nombre à formater
   * @returns Nombre formaté
   */
  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  /**
   * Formate une date au format français complet
   * Exemple: "15 janvier 2024 à 14:30"
   * @param date Date à formater
   * @returns Date formatée en français
   */
  formatDate(date: Date): string {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return d.toLocaleDateString('fr-FR', options);
  }

  /**
   * Retourne le nom d'une cave à partir de son ID
   * @param caveId ID de la cave
   * @returns Nom de la cave ou "Cave inconnue"
   */
  getCaveName(caveId: string): string {
    const cave = this.caves.find(c => c.id === caveId);
    return cave ? cave.name : 'Cave inconnue';
  }

  /**
   * Retourne le nom d'une boisson à partir de son ID
   * @param drinkId ID de la boisson
   * @returns Nom de la boisson ou "Boisson inconnue"
   */
  getDrinkName(drinkId: string): string {
    const drink = this.drinks.find(d => d.id === drinkId);
    return drink ? drink.name : 'Boisson inconnue';
  }

  /**
   * Retourne une date relative lisible
   * Exemples: "Aujourd'hui", "Hier", "Il y a 3 jours", "Il y a 2 semaines"
   * @param date Date à convertir
   * @returns Texte représentant la date relative
   */
  getRelativeDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    }
    const months = Math.floor(days / 30);
    return `Il y a ${months} mois`;
  }

  /**
   * Retourne le libellé du contrôle qualité
   * @param check Type de contrôle
   * @returns Libellé formaté
   */
  getQualityCheckLabel(check: string): string {
    const labels: {[key: string]: string} = {
      'conforme': '✅ Conforme',
      'non-conforme': '❌ Non conforme',
      'avec-reserve': '⚠️ Avec réserve'
    };
    return labels[check] || check;
  }

  /**
   * Retourne la classe CSS pour le contrôle qualité
   * @param check Type de contrôle
   * @returns Classe CSS
   */
  getQualityCheckClass(check: string): string {
    const classes: {[key: string]: string} = {
      'conforme': 'quality-conform',
      'non-conforme': 'quality-non-conform',
      'avec-reserve': 'quality-reserve'
    };
    return classes[check] || '';
  }

  /**
   * Exporte les entrées filtrées en fichier CSV
   * Télécharge automatiquement le fichier
   */
  exportToCSV(): void {
    // Vérifie qu'il y a des entrées à exporter
    if (this.filteredEntries.length === 0) {
      alert('❌ Aucune entrée à exporter');
      return;
    }

    // En-têtes du CSV avec TOUS les champs
    const headers = [
      'Date',
      'Boisson',
      'Catégorie',
      'Format',
      'Conditionnement',
      'Quantité Conditionnements',
      'Unités par Conditionnement',
      'Quantité Totale',
      'Prix Unitaire (FCFA)',
      'Prix Conditionnement (FCFA)',
      'Coût Total (FCFA)',
      'Fournisseur',
      'Commercial',
      'Contact Commercial',
      'Cave',
      'Facture Fournisseur',
      'Bon de Livraison',
      'Contrôle Qualité',
      'Notes Qualité',
      'Numéro de Lot',
      'Date de Péremption',
      'Ajouté par',
      'Notes'
    ];
// Conversion des données en lignes CSV
    const rows = this.filteredEntries.map(entry => [
      this.formatDate(entry.date),
      entry.drinkName,
      entry.drinkCategory,
      entry.drinkFormat,
      entry.bulkUnit,
      entry.bulkQuantity.toString(),
      entry.unitsPerBulk.toString(),
      entry.quantity.toString(),
      entry.unitPrice.toString(),
      entry.bulkPrice.toString(),
      entry.totalCost.toString(),
      entry.supplier,
      entry.commercialName,
      entry.commercialContact,
      this.getCaveName(entry.caveId),
      entry.supplierInvoice || 'N/A',
      entry.deliveryNote || 'N/A',
      this.getQualityCheckLabel(entry.qualityCheck),
      (entry.qualityNotes || 'Aucune note').replace(/,/g, ';'), // Remplace les virgules
      entry.batchNumber || 'N/A',
      entry.expiryDate ? this.formatDate(entry.expiryDate) : 'N/A',
      entry.addedBy,
      (entry.notes || 'Aucune note').replace(/,/g, ';') // Remplace les virgules
    ]);

    // Création du contenu CSV avec encodage UTF-8
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Création du blob avec BOM UTF-8 pour Excel
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });

    // Création du lien de téléchargement
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const fileName = `entrees_stock_${new Date().toISOString().split('T')[0]}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';

    // Ajout, clic et suppression du lien
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Libération de la mémoire
    URL.revokeObjectURL(url);

    console.log(`📊 Export CSV effectué: ${fileName} (${this.filteredEntries.length} entrées)`);

    alert(`✅ Export réussi !\n\n` +
          `📄 Fichier: ${fileName}\n` +
          `📊 ${this.filteredEntries.length} entrée(s) exportée(s)\n` +
          `💾 Le fichier a été téléchargé`);
  }

  /**
   * Lance l'impression de la page actuelle
   * Utilise la fonction d'impression du navigateur
   */
  printEntries(): void {
    console.log('🖨️ Impression des entrées lancée');
    window.print();
  }

  /**
   * Calcule le taux de marge pour une entrée
   * Compare le prix d'achat et le prix de vente
   * @param entry Entrée de stock
   * @returns Taux de marge en pourcentage
   */
  calculateMarginRate(entry: StockEntry): number {
    // Trouve la boisson correspondante
    const drink = this.drinks.find(d => d.id === entry.drinkId);

    if (drink && entry.unitPrice > 0) {
      // Calcule la marge : (Prix vente - Prix achat) / Prix achat × 100
      const margin = drink.sellingPrice - entry.unitPrice;
      const marginRate = (margin / entry.unitPrice) * 100;
      return Math.round(marginRate * 100) / 100; // Arrondi à 2 décimales
    }

    return 0;
  }

  /**
   * Retourne la classe CSS selon la catégorie de boisson
   * @param category Catégorie de la boisson
   * @returns Classe CSS
   */
  getCategoryClass(category: DrinkCategory): string {
    const classMap: { [key in DrinkCategory]: string } = {
      [DrinkCategory.BIERES]: 'category-beer',
      [DrinkCategory.SUCRERIES]: 'category-sweet',
      [DrinkCategory.CHAMPAGNE]: 'category-champagne',
      [DrinkCategory.VIN_BLANC]: 'category-white-wine',
      [DrinkCategory.VIN_ROUGE]: 'category-red-wine',
      [DrinkCategory.VIN_ROSE]: 'category-rose-wine',
      [DrinkCategory.VIN_MOUSSEUX]: 'category-sparkling',
      [DrinkCategory.LIQUEURS]: 'category-liquor',
      [DrinkCategory.BOISSONS_ENERGISANTES]: 'category-energy',
      [DrinkCategory.BOISSONS_LOCALES]: 'category-local'
    };
    return classMap[category] || '';
  }

  /**
   * Retourne l'icône selon le type de conditionnement
   * @param bulkUnit Type de conditionnement
   * @returns Emoji représentatif
   */
  getBulkUnitIcon(bulkUnit: BulkUnit): string {
    const iconMap: { [key in BulkUnit]: string } = {
      [BulkUnit.CARTON]: '📦',
      [BulkUnit.CASIER]: '🧰',
      [BulkUnit.PACK]: '📦',
      [BulkUnit.CAISSE]: '🗃️'
    };
    return iconMap[bulkUnit] || '📦';
  }

  /**
   * Vérifie si une entrée est récente (moins de 7 jours)
   * @param entry Entrée à vérifier
   * @returns true si récente
   */
  isRecentEntry(entry: StockEntry): boolean {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(entry.date) >= sevenDaysAgo;
  }

  /**
   * Vérifie si la date de péremption approche (moins de 30 jours)
   * @param entry Entrée à vérifier
   * @returns true si la péremption approche
   */
  isExpiryApproaching(entry: StockEntry): boolean {
    if (!entry.expiryDate) return false;

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return new Date(entry.expiryDate) <= thirtyDaysFromNow;
  }

  /**
   * Calcule le nombre de jours avant la péremption
   * @param expiryDate Date de péremption
   * @returns Nombre de jours restants
   */
  getDaysUntilExpiry(expiryDate: Date): number {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
