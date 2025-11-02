// ==========================================
// FICHIER: src/app/view/admin-dashboard/exits/exits.component.ts
// DESCRIPTION: Composant pour gérer les sorties de stock avec détails complets
// VERSION ACTUALISÉE avec intégration complète des détails boissons
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Import des énumérations depuis drinks
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
 */
interface Drink {
  id: string;
  name: string;
  icon: string;
  category: DrinkCategory;
  format: DrinkFormat;
  packagingType: PackagingType;
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
  temperature?: string;
  humidity?: string;
}

/**
 * Type de sortie de stock
 */
type ExitType = 'vente' | 'transfert' | 'perte' | 'casse' | 'peremption' | 'degustation';

/**
 * Interface pour définir une sortie de stock enrichie
 */
interface StockExit {
  // Identifiants
  id: string;
  date: Date;

  // Informations boisson complètes
  drinkId: string;
  drinkName: string;
  drinkIcon: string;
  drinkCategory: DrinkCategory;
  drinkFormat: DrinkFormat;

  // Type de sortie
  type: ExitType;

  // Quantité
  quantity: number;

  // Destination/Motif selon le type
  destination?: string;        // Client, cave destination, etc.
  customer?: string;           // Nom du client pour les ventes
  customerContact?: string;    // Contact du client
  transferToCaveId?: string;   // Cave de destination pour transfert

  // Tarification
  unitPrice: number;           // Prix unitaire de sortie
  totalAmount: number;         // Montant total

  // Cave source
  caveId: string;

  // Commercial ayant traité la sortie
  processedBy: string;
  processedByName?: string;

  // Informations spécifiques selon le type
  invoiceNumber?: string;      // Numéro de facture (vente)
  deliveryNote?: string;       // Bon de livraison
  lossReason?: string;         // Raison de la perte
  breakageDetails?: string;    // Détails de la casse
  expiryDate?: Date;           // Date de péremption

  // Notes
  notes?: string;
}

/**
 * Interface pour le formulaire de sortie
 */
interface StockExitForm {
  drinkId: string;
  type: ExitType;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  caveId: string;
  destination: string;
  customer: string;
  customerContact: string;
  transferToCaveId: string;
  lossReason: string;
  breakageDetails: string;
  invoiceNumber: string;
  deliveryNote: string;
  notes: string;
}

/**
 * Interface pour les suggestions d'accords mets-vins
 */
interface WinePairingSuggestion {
  dish: string;
  dishIcon: string;
  description: string;
  temperature: string;
}

/**
 * Composant ExitsComponent - VERSION ENRICHIE
 * Gestion complète des sorties de stock avec tous les détails
 */
@Component({
  selector: 'app-exits',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './exits.component.html',
  styleUrls: ['./exits.component.scss']
})
export class ExitsComponent implements OnInit {

  // ========================================
  // PROPRIÉTÉS
  // ========================================

  /**
   * Liste complète des sorties de stock
   */
  exits: StockExit[] = [];

  /**
   * Liste filtrée des sorties à afficher
   */
  filteredExits: StockExit[] = [];

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
   * Sortie sélectionnée pour afficher les détails
   */
  selectedExit: StockExit | null = null;

  /**
   * Formulaire pour ajouter une sortie
   */
  exitForm: StockExitForm = this.getEmptyForm();

  /**
   * Filtres
   */
  selectedCaveFilter: string | null = null;
  selectedTypeFilter: ExitType | null = null;
  selectedCategoryFilter: DrinkCategory | null = null;
  periodFilter: number = 30;
  searchTerm: string = '';

  /**
   * Énumérations pour le template
   */
  drinkCategories = Object.values(DrinkCategory);
  exitTypes: ExitType[] = ['vente', 'transfert', 'perte', 'casse', 'peremption', 'degustation'];

  /**
   * Statistiques enrichies des sorties
   */
  stats = {
    totalExits: 0,              // Nombre total de sorties
    totalQuantity: 0,           // Quantité totale sortie
    totalRevenue: 0,            // Revenus totaux (ventes uniquement)
    totalLoss: 0,               // Pertes totales (pertes + casse + péremption)
    recentExits: 0,             // Sorties des 7 derniers jours
    averageUnitPrice: 0,        // Prix unitaire moyen
    salesCount: 0,              // Nombre de ventes
    transfersCount: 0,          // Nombre de transferts
    lossesCount: 0,             // Nombre de pertes
    topCategory: '',            // Catégorie la plus vendue
    topCustomer: '',            // Meilleur client
    averageMargin: 0            // Marge moyenne en %
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
    console.log('✅ ExitsComponent initialisé avec détails complets');
    this.loadData();
  }

  // ========================================
  // CHARGEMENT DES DONNÉES
  // ========================================

  /**
   * Charge toutes les données nécessaires
   */
  loadData(): void {
    // Active le chargement
    this.isLoading = true;

    // Charge les boissons avec tous les détails
    this.drinks = this.generateMockDrinks();

    // Charge les caves
    this.caves = this.generateMockCaves();

    // Charge l'historique des sorties
    this.exits = this.generateMockExits();

    // Initialise les sorties filtrées
    this.filteredExits = [...this.exits];

    // Calcule les statistiques
    this.calculateStats();

    // Désactive le chargement
    this.isLoading = false;

    console.log('✅ Données chargées:', {
      exits: this.exits.length,
      drinks: this.drinks.length,
      caves: this.caves.length
    });
  }

  /**
   * Génère des boissons de test avec tous les détails
   * @returns Liste de boissons simulées
   */
  private generateMockDrinks(): Drink[] {
    return [
      {
        id: 'drink_1',
        name: 'Heineken',
        icon: '🍺',
        category: DrinkCategory.BIERES,
        format: DrinkFormat.CL_33,
        packagingType: PackagingType.BOUTEILLE,
        supplier: Supplier.SOLIBRA,
        depot: 'Dépôt Abidjan Zone 4',
        commercialName: 'Kouadio Jean',
        commercialContact: '+225 07 00 00 00 01',
        bulkUnit: BulkUnit.CARTON,
        bulkQuantity: 3,
        unitsPerBulk: 12,
        totalBottles: 36,
        purchasePrice: 650,        // Prix d'achat
        sellingPrice: 800,         // Prix de vente
        stock: 150,
        sales: 450,
        description: 'Bière blonde hollandaise',
        createdAt: new Date(),
        badge: 'hot'
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
        description: 'Vin rouge de Bordeaux, millésime 2018',
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
        description: 'Champagne brut impérial',
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
        description: 'Bière brune irlandaise',
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
        description: 'Vin blanc sec de Bourgogne',
        createdAt: new Date()
      }
    ];
  }

  /**
   * Génère des caves de test
   * @returns Liste de caves simulées
   */
  private generateMockCaves(): Cave[] {
    return [
      {
        id: 'cave_1',
        name: 'Cave Principale',
        location: 'Bâtiment A - Sous-sol',
        capacity: 1000,
        currentStock: 650,
        description: 'Cave principale de stockage',
        temperature: '12-14°C',
        humidity: '70-75%'
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
        temperature: '10-12°C',
        humidity: '75-80%'
      }
    ];
  }

 /**
 * Génère des sorties de test ENRICHIES
 * @returns Liste de sorties de stock simulées
 */
private generateMockExits(): StockExit[] {
  const now = new Date();

  // Déclaration explicite du tableau avec le bon type
  const exits: StockExit[] = [
    {
      // === VENTE CLIENT ===
      id: 'exit_1',
      date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Hier

      // Informations boisson
      drinkId: 'drink_1',
      drinkName: 'Heineken',
      drinkIcon: '🍺',
      drinkCategory: DrinkCategory.BIERES,
      drinkFormat: DrinkFormat.CL_33,

      // Type : Vente (TYPAGE EXPLICITE)
      type: 'vente' as ExitType,

      // Quantité et tarification
      quantity: 24,
      unitPrice: 800,
      totalAmount: 19200,

      // Cave source
      caveId: 'cave_1',

      // Client
      customer: 'Restaurant Le Gourmet',
      customerContact: '+225 07 22 33 44 55',
      destination: 'Restaurant Le Gourmet - Cocody',

      // Documents
      invoiceNumber: 'FACT-2024-001',
      deliveryNote: 'BL-2024-001',

      // Traité par
      processedBy: 'user_1',
      processedByName: 'Jean Dupont',

      // Notes
      notes: 'Livraison effectuée. Client satisfait, commande régulière.'
    },
    {
      // === VENTE CLIENT VIP ===
      id: 'exit_2',
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // Il y a 3 jours

      drinkId: 'drink_2',
      drinkName: 'Bordeaux Rouge 2018',
      drinkIcon: '🍷',
      drinkCategory: DrinkCategory.VIN_ROUGE,
      drinkFormat: DrinkFormat.CL_75,

      type: 'vente' as ExitType,

      quantity: 12,
      unitPrice: 15000,
      totalAmount: 180000,

      caveId: 'cave_3',

      customer: 'Hôtel Ivoire',
      customerContact: '+225 27 22 48 10 00',
      destination: 'Hôtel Ivoire - Cocody',

      invoiceNumber: 'FACT-2024-002',
      deliveryNote: 'BL-2024-002',

      processedBy: 'user_2',
      processedByName: 'Marie Martin',

      notes: 'Client VIP. Remise de 5% appliquée. Prochain rendez-vous prévu.'
    },
    {
      // === TRANSFERT ENTRE CAVES ===
      id: 'exit_3',
      date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // Il y a 5 jours

      drinkId: 'drink_3',
      drinkName: 'Champagne Moët & Chandon',
      drinkIcon: '🍾',
      drinkCategory: DrinkCategory.CHAMPAGNE,
      drinkFormat: DrinkFormat.CL_75,

      type: 'transfert' as ExitType,

      quantity: 6,
      unitPrice: 35000,
      totalAmount: 210000,

      caveId: 'cave_3',
      transferToCaveId: 'cave_2',
      destination: 'Cave Secondaire',

      processedBy: 'user_1',
      processedByName: 'Jean Dupont',

      notes: 'Réorganisation du stock. Transfert pour rotation rapide.'
    },
    {
      // === VENTE ÉVÉNEMENT ===
      id: 'exit_4',
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // Il y a 7 jours

      drinkId: 'drink_4',
      drinkName: 'Guinness',
      drinkIcon: '🍺',
      drinkCategory: DrinkCategory.BIERES,
      drinkFormat: DrinkFormat.CL_33,

      type: 'vente' as ExitType,

      quantity: 50,
      unitPrice: 1000,
      totalAmount: 50000,

      caveId: 'cave_2',

      customer: 'Événement Entreprise XYZ',
      customerContact: '+225 05 66 77 88 99',
      destination: 'Sofitel Hôtel Ivoire',

      invoiceNumber: 'FACT-2024-003',
      deliveryNote: 'BL-2024-003',

      processedBy: 'user_2',
      processedByName: 'Marie Martin',

      notes: 'Événement corporate. 50 participants. Livraison directe sur site.'
    },
    {
      // === PERTE : CASSE ===
      id: 'exit_5',
      date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // Il y a 10 jours

      drinkId: 'drink_2',
      drinkName: 'Bordeaux Rouge 2018',
      drinkIcon: '🍷',
      drinkCategory: DrinkCategory.VIN_ROUGE,
      drinkFormat: DrinkFormat.CL_75,

      type: 'casse' as ExitType,

      quantity: 2,
      unitPrice: 12000,
      totalAmount: 24000,

      caveId: 'cave_1',

      lossReason: 'Casse lors de la manipulation',
      breakageDetails: '2 bouteilles tombées lors du déplacement d\'un casier',
      destination: 'Perte par casse',

      processedBy: 'user_3',
      processedByName: 'Pierre Dubois',

      notes: 'Accident lors du réaménagement de la cave. Procédure de sécurité revue.'
    },
    {
      // === PERTE : PÉREMPTION ===
      id: 'exit_6',
      date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // Il y a 15 jours

      drinkId: 'drink_4',
      drinkName: 'Guinness',
      drinkIcon: '🍺',
      drinkCategory: DrinkCategory.BIERES,
      drinkFormat: DrinkFormat.CL_33,

      type: 'peremption' as ExitType,

      quantity: 12,
      unitPrice: 850,
      totalAmount: 10200,

      caveId: 'cave_2',

      lossReason: 'Date de péremption dépassée',
      expiryDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      destination: 'Destruction réglementaire',

      processedBy: 'user_3',
      processedByName: 'Pierre Dubois',

      notes: 'Contrôle DLUO. Produits retirés et détruits selon procédure.'
    },
    {
      // === DÉGUSTATION ===
      id: 'exit_7',
      date: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000), // Il y a 18 jours

      drinkId: 'drink_5',
      drinkName: 'Chablis 2020',
      drinkIcon: '🍷',
      drinkCategory: DrinkCategory.VIN_BLANC,
      drinkFormat: DrinkFormat.CL_75,

      type: 'degustation' as ExitType,

      quantity: 3,
      unitPrice: 9500,
      totalAmount: 28500,

      caveId: 'cave_3',

      destination: 'Séance de dégustation clients',
      customer: 'Clients VIP',

      processedBy: 'user_2',
      processedByName: 'Marie Martin',

      notes: 'Dégustation organisée pour présenter le nouveau millésime. 15 clients présents.'
    },
    {
      // === VENTE EN GROS ===
      id: 'exit_8',
      date: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // Il y a 20 jours

      drinkId: 'drink_1',
      drinkName: 'Heineken',
      drinkIcon: '🍺',
      drinkCategory: DrinkCategory.BIERES,
      drinkFormat: DrinkFormat.CL_33,

      type: 'vente' as ExitType,

      quantity: 120,
      unitPrice: 750,
      totalAmount: 90000,

      caveId: 'cave_1',

      customer: 'Bar Le Tropical',
      customerContact: '+225 07 88 99 00 11',
      destination: 'Bar Le Tropical - Marcory',

      invoiceNumber: 'FACT-2024-004',
      deliveryNote: 'BL-2024-004',

      processedBy: 'user_1',
      processedByName: 'Jean Dupont',

      notes: 'Commande en gros. Remise de 6% appliquée. Fidélité client.'
    }
  ];

  // TRI par date décroissante (plus récent en premier)
  return exits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

  // ========================================
  // CALCULS AUTOMATIQUES DU FORMULAIRE
  // ========================================

  /**
   * Calcule automatiquement le montant total
   * Montant = Quantité × Prix unitaire
   */
  calculateTotalAmount(): void {
    // Multiplie la quantité par le prix unitaire
    this.exitForm.totalAmount =
      (this.exitForm.quantity || 0) * (this.exitForm.unitPrice || 0);

    console.log('💰 Montant total calculé:', this.exitForm.totalAmount, 'FCFA');
  }

  /**
   * Gère le changement de boisson sélectionnée
   * Remplit automatiquement le prix depuis la boisson
   */
  onDrinkSelected(): void {
    // Trouve la boisson sélectionnée
    const drink = this.drinks.find(d => d.id === this.exitForm.drinkId);

    if (drink) {
      // Remplit automatiquement le prix de vente
      this.exitForm.unitPrice = drink.sellingPrice;

      // Recalcule le montant total
      this.calculateTotalAmount();

      // Charge les suggestions d'accords mets-vins
      this.loadWinePairingSuggestions(drink);

      console.log('✅ Boisson sélectionnée:', drink.name, '- Stock disponible:', drink.stock);

      // Vérifie le stock disponible
      if (drink.stock === 0) {
        alert(`⚠️ Attention : Stock épuisé pour ${drink.name}`);
      } else if (drink.stock < 10) {
        console.warn('⚠️ Stock faible:', drink.stock, 'unités');
      }
    }
  }

  /**
   * Gère le changement de type de sortie
   * Ajuste les champs nécessaires selon le type
   */
  onTypeChange(): void {
    const drink = this.drinks.find(d => d.id === this.exitForm.drinkId);

    if (drink) {
      switch (this.exitForm.type) {
        case 'vente':
          // Pour une vente : utilise le prix de vente
          this.exitForm.unitPrice = drink.sellingPrice;
          break;

        case 'transfert':
        case 'perte':
        case 'casse':
        case 'peremption':
        case 'degustation':
          // Pour les autres : utilise le prix d'achat (valorisation du stock)
          this.exitForm.unitPrice = drink.purchasePrice;
          break;
      }

      this.calculateTotalAmount();
    }

    console.log('🔄 Type de sortie changé:', this.exitForm.type);
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
        this.winePairingSuggestions = [
          {
            dish: 'Steak grillé',
            dishIcon: '🥩',
            description: 'Les tanins du vin rouge subliment la richesse de la viande rouge',
            temperature: '16-18°C'
          },
          {
            dish: 'Fromages affinés',
            dishIcon: '🧀',
            description: 'Un accord classique entre la puissance du vin et l\'intensité du fromage',
            temperature: '16-18°C'
          },
          {
            dish: 'Plats en sauce',
            dishIcon: '🍝',
            description: 'Le vin rouge accompagne parfaitement les sauces riches',
            temperature: '16-18°C'
          }
        ];
        break;

      case DrinkCategory.VIN_BLANC:
        this.winePairingSuggestions = [
          {
            dish: 'Poisson grillé',
            dishIcon: '🐟',
            description: 'La fraîcheur du vin blanc complète le goût délicat du poisson',
            temperature: '10-12°C'
          },
          {
            dish: 'Fruits de mer',
            dishIcon: '🦞',
            description: 'Un mariage parfait entre la minéralité du vin et l\'iode des fruits de mer',
            temperature: '8-10°C'
          },
          {
            dish: 'Volaille en sauce blanche',
            dishIcon: '🍗',
            description: 'Le vin blanc souligne la délicatesse de la volaille',
            temperature: '10-12°C'
          }
        ];
        break;

      case DrinkCategory.CHAMPAGNE:
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
          },
          {
            dish: 'Fruits de mer',
            dishIcon: '🦪',
            description: 'Les huîtres et le champagne forment un duo parfait',
            temperature: '6-8°C'
          }
        ];
        break;

      case DrinkCategory.BIERES:
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
          },
          {
            dish: 'Pizza et burgers',
            dishIcon: '🍕',
            description: 'Un classique qui fonctionne toujours',
            temperature: '4-6°C'
          }
        ];
        break;

      default:
        this.winePairingSuggestions = [];
    }

    console.log('🍽️ Suggestions d\'accords chargées:', this.winePairingSuggestions.length);
  }

  // ========================================
  // FILTRAGE ET RECHERCHE
  // ========================================

  /**
   * Applique tous les filtres actifs sur les sorties
   * Combine : cave, type, catégorie, période et recherche
   */
  applyFilters(): void {
    // On part de toutes les sorties
    let result = [...this.exits];

    // FILTRE 1 : Par cave sélectionnée
    if (this.selectedCaveFilter) {
      result = result.filter(exit => exit.caveId === this.selectedCaveFilter);
      console.log(`📍 Filtre cave appliqué: ${result.length} résultats`);
    }

    // FILTRE 2 : Par type de sortie
    if (this.selectedTypeFilter) {
      result = result.filter(exit => exit.type === this.selectedTypeFilter);
      console.log(`🏷️ Filtre type appliqué: ${result.length} résultats`);
    }

    // FILTRE 3 : Par catégorie de boisson
    if (this.selectedCategoryFilter) {
      result = result.filter(exit => exit.drinkCategory === this.selectedCategoryFilter);
      console.log(`📦 Filtre catégorie appliqué: ${result.length} résultats`);
    }

    // FILTRE 4 : Par période (nombre de jours)
    if (this.periodFilter > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.periodFilter);
      result = result.filter(exit => new Date(exit.date) >= cutoffDate);
      console.log(`📅 Filtre période appliqué (${this.periodFilter} jours): ${result.length} résultats`);
    }

    // FILTRE 5 : Par terme de recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(exit =>
        // Recherche dans le nom de la boisson
        exit.drinkName.toLowerCase().includes(term) ||
        // Recherche dans la destination
        exit.destination?.toLowerCase().includes(term) ||
        // Recherche dans le client
        exit.customer?.toLowerCase().includes(term) ||
        // Recherche dans les notes
        exit.notes?.toLowerCase().includes(term) ||
        // Recherche dans le numéro de facture
        exit.invoiceNumber?.toLowerCase().includes(term) ||
        // Recherche dans le numéro de bon de livraison
        exit.deliveryNote?.toLowerCase().includes(term) ||
        // Recherche dans le nom du traitant
        exit.processedByName?.toLowerCase().includes(term)
      );
      console.log(`🔍 Recherche "${term}" appliquée: ${result.length} résultats`);
    }

    // Affecte les résultats filtrés
    this.filteredExits = result;

    console.log(`✅ Filtrage terminé: ${result.length} sortie(s) sur ${this.exits.length}`);
  }

  /**
   * Gère le changement du filtre cave
   */
  onCaveFilterChange(): void {
    console.log('🔄 Changement filtre cave:', this.selectedCaveFilter);
    this.applyFilters();
  }

  /**
   * Gère le changement du filtre type
   */
  onTypeFilterChange(): void {
    console.log('🔄 Changement filtre type:', this.selectedTypeFilter);
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
   * Réinitialise tous les filtres
   */
  resetFilters(): void {
    this.selectedCaveFilter = null;
    this.selectedTypeFilter = null;
    this.selectedCategoryFilter = null;
    this.periodFilter = 30;
    this.searchTerm = '';
    this.filteredExits = [...this.exits];

    console.log('🔄 Tous les filtres réinitialisés');
  }

  // ========================================
  // CALCUL DES STATISTIQUES ENRICHIES
  // ========================================

  /**
   * Calcule toutes les statistiques des sorties
   * Version enrichie avec revenus, pertes, marges, etc.
   */
  calculateStats(): void {
    // 1. Nombre total de sorties
    this.stats.totalExits = this.exits.length;

    // 2. Quantité totale sortie
    this.stats.totalQuantity = this.exits.reduce((sum, exit) => sum + exit.quantity, 0);

    // 3. Revenus totaux (ventes uniquement)
    this.stats.totalRevenue = this.exits
      .filter(exit => exit.type === 'vente')
      .reduce((sum, exit) => sum + exit.totalAmount, 0);

    // 4. Pertes totales (pertes + casse + péremption)
    this.stats.totalLoss = this.exits
      .filter(exit => ['perte', 'casse', 'peremption'].includes(exit.type))
      .reduce((sum, exit) => sum + exit.totalAmount, 0);

    // 5. Sorties des 7 derniers jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    this.stats.recentExits = this.exits.filter(
      exit => new Date(exit.date) >= sevenDaysAgo
    ).length;

    // 6. Prix unitaire moyen
    if (this.exits.length > 0) {
      const totalUnitPrices = this.exits.reduce((sum, exit) => sum + exit.unitPrice, 0);
      this.stats.averageUnitPrice = Math.round(totalUnitPrices / this.exits.length);
    }

    // 7. Comptage par type
    this.stats.salesCount = this.exits.filter(e => e.type === 'vente').length;
    this.stats.transfersCount = this.exits.filter(e => e.type === 'transfert').length;
    this.stats.lossesCount = this.exits.filter(e =>
      ['perte', 'casse', 'peremption'].includes(e.type)
    ).length;

    // 8. Catégorie la plus vendue
    const categoryCounts: { [key: string]: number } = {};
    this.exits
      .filter(e => e.type === 'vente')
      .forEach(exit => {
        const category = exit.drinkCategory;
        categoryCounts[category] = (categoryCounts[category] || 0) + exit.quantity;
      });

    let maxCount = 0;
    let topCategory = '';
    Object.entries(categoryCounts).forEach(([category, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topCategory = category;
      }
    });
    this.stats.topCategory = topCategory;

    // 9. Meilleur client
    const customerCounts: { [key: string]: number } = {};
    this.exits
      .filter(e => e.type === 'vente' && e.customer)
      .forEach(exit => {
        const customer = exit.customer!;
        customerCounts[customer] = (customerCounts[customer] || 0) + exit.totalAmount;
      });

    let maxRevenue = 0;
    let topCustomer = '';
    Object.entries(customerCounts).forEach(([customer, revenue]) => {
      if (revenue > maxRevenue) {
        maxRevenue = revenue;
        topCustomer = customer;
      }
    });
    this.stats.topCustomer = topCustomer;

    // 10. Marge moyenne (%)
    const sales = this.exits.filter(e => e.type === 'vente');
    if (sales.length > 0) {
      let totalMarginRate = 0;
      sales.forEach(sale => {
        const drink = this.drinks.find(d => d.id === sale.drinkId);
        if (drink && drink.purchasePrice > 0) {
          const margin = sale.unitPrice - drink.purchasePrice;
          const marginRate = (margin / drink.purchasePrice) * 100;
          totalMarginRate += marginRate;
        }
      });
      this.stats.averageMargin = Math.round((totalMarginRate / sales.length) * 100) / 100;
    }

    console.log('📊 Statistiques calculées:', this.stats);
  }

  // ========================================
  // MODAL - AJOUT DE SORTIE
  // ========================================

  /**
   * Ouvre le modal d'ajout d'une nouvelle sortie
   */
  openAddModal(): void {
    // Réinitialise le formulaire
    this.exitForm = this.getEmptyForm();

    // Réinitialise les suggestions
    this.winePairingSuggestions = [];

    // Ouvre le modal
    this.isAddModalOpen = true;

    console.log('➕ Modal d\'ajout ouvert');
  }

  /**
   * Ferme le modal d'ajout
   */
  closeAddModal(): void {
    // Ferme le modal
    this.isAddModalOpen = false;

    // Réinitialise le formulaire
    this.exitForm = this.getEmptyForm();

    // Réinitialise les suggestions
    this.winePairingSuggestions = [];

    console.log('✅ Modal d\'ajout fermé');
  }

  /**
   * Sauvegarde une nouvelle sortie de stock
   * Valide, crée la sortie et met à jour les stats
   */
  saveExit(): void {
    // VALIDATION : Vérifie tous les champs obligatoires
    if (!this.validateForm()) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }

    // RÉCUPÉRATION : Trouve la boisson
    const drink = this.drinks.find(d => d.id === this.exitForm.drinkId);
    if (!drink) {
      alert('❌ Boisson non trouvée');
      return;
    }

    // VÉRIFICATION STOCK : Vérifie la disponibilité
    if (drink.stock < this.exitForm.quantity) {
      alert(`❌ Stock insuffisant !\n\n` +
            `Stock disponible: ${drink.stock} unités\n` +
            `Quantité demandée: ${this.exitForm.quantity} unités\n\n` +
            `Manquant: ${this.exitForm.quantity - drink.stock} unités`);
      return;
    }

    // CRÉATION : Construit la nouvelle sortie avec TOUS les détails
    const newExit: StockExit = {
      // Génère un ID unique
      id: this.generateId(),

      // Date actuelle
      date: new Date(),

      // Informations complètes de la boisson
      drinkId: this.exitForm.drinkId,
      drinkName: drink.name,
      drinkIcon: drink.icon,
      drinkCategory: drink.category,
      drinkFormat: drink.format,

      // Type de sortie
      type: this.exitForm.type,

      // Quantité et tarification
      quantity: this.exitForm.quantity,
      unitPrice: this.exitForm.unitPrice,
      totalAmount: this.exitForm.totalAmount,

      // Cave source
      caveId: this.exitForm.caveId,

      // Destination selon le type
      destination: this.exitForm.destination,
      customer: this.exitForm.customer,
      customerContact: this.exitForm.customerContact,
      transferToCaveId: this.exitForm.transferToCaveId,

      // Documents (vente)
      invoiceNumber: this.exitForm.invoiceNumber,
      deliveryNote: this.exitForm.deliveryNote,

      // Motifs (pertes)
      lossReason: this.exitForm.lossReason,
      breakageDetails: this.exitForm.breakageDetails,

      // Traité par
      processedBy: 'current-user-id', // TODO: Remplacer par l'utilisateur connecté
      processedByName: 'Utilisateur actuel',

      // Notes
      notes: this.exitForm.notes
    };

    // AJOUT : Insère la nouvelle sortie en première position
    this.exits.unshift(newExit);

    // MISE À JOUR : Applique les filtres
    this.applyFilters();

    // RECALCUL : Met à jour les statistiques
    this.calculateStats();

    // TODO: APPEL API pour sauvegarder sur le serveur
    // this.exitService.createExit(newExit).subscribe(...)

    console.log('✅ Sortie ajoutée avec succès:', newExit);

    // NOTIFICATION : Informe l'utilisateur
    const typeLabel = this.getTypeLabel(newExit.type);
    alert(`✅ ${typeLabel} enregistrée avec succès !\n\n` +
          `📦 Boisson: ${drink.name}\n` +
          `🔢 Quantité: ${newExit.quantity} unités\n` +
          `💰 Montant: ${this.formatNumber(newExit.totalAmount)} FCFA`);

    // FERMETURE : Ferme le modal
    this.closeAddModal();
  }

  /**
   * Valide le formulaire de sortie
   * @returns true si valide
   */
  private validateForm(): boolean {
    // Champs obligatoires de base
    const baseValidation = !!(
      this.exitForm.drinkId &&
      this.exitForm.type &&
      this.exitForm.quantity > 0 &&
      this.exitForm.unitPrice > 0 &&
      this.exitForm.totalAmount > 0 &&
      this.exitForm.caveId
    );

    if (!baseValidation) return false;

    // Validation spécifique selon le type
    switch (this.exitForm.type) {
      case 'vente':
        // Pour une vente : client obligatoire
        return !!this.exitForm.customer;

      case 'transfert':
        // Pour un transfert : cave de destination obligatoire
        return !!this.exitForm.transferToCaveId;

      case 'perte':
      case 'casse':
      case 'peremption':
        // Pour les pertes : motif obligatoire
        return !!this.exitForm.lossReason;

      default:
        return true;
    }
  }

  /**
   * Retourne un formulaire vide
   * @returns Formulaire initialisé
   */
  private getEmptyForm(): StockExitForm {
    return {
      drinkId: '',
      type: 'vente',
      quantity: 0,
      unitPrice: 0,
      totalAmount: 0,
      caveId: '',
      destination: '',
      customer: '',
      customerContact: '',
      transferToCaveId: '',
      lossReason: '',
      breakageDetails: '',
      invoiceNumber: '',
      deliveryNote: '',
      notes: ''
    };
  }
  // ... (suite dans le prochain message)
  // ========================================
  // MODAL - DÉTAILS DE SORTIE
  // ========================================

  /**
   * Affiche les détails complets d'une sortie dans un modal
   * @param exit Sortie à afficher
   */
  viewExitDetails(exit: StockExit): void {
    // Sélectionne la sortie
    this.selectedExit = exit;

    // Charge les informations de la boisson pour afficher les accords
    const drink = this.drinks.find(d => d.id === exit.drinkId);
    if (drink) {
      this.loadWinePairingSuggestions(drink);
    }

    // Ouvre le modal de détails
    this.isDetailModalOpen = true;

    console.log('👁️ Détails de la sortie affichés:', exit);
  }

  /**
   * Ferme le modal de détails
   */
  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedExit = null;
    this.winePairingSuggestions = [];

    console.log('✅ Modal de détails fermé');
  }

  // ========================================
  // SUPPRESSION
  // ========================================

  /**
   * Supprime une sortie après confirmation
   * @param exit Sortie à supprimer
   */
  deleteExit(exit: StockExit): void {
    // Message de confirmation détaillé
    const typeLabel = this.getTypeLabel(exit.type);
    const confirmMessage =
      `⚠️ Êtes-vous sûr de vouloir supprimer cette sortie ?\n\n` +
      `📦 Produit: ${exit.drinkIcon} ${exit.drinkName}\n` +
      `🏷️ Type: ${typeLabel}\n` +
      `📏 Format: ${exit.drinkFormat}\n` +
      `🔢 Quantité: ${exit.quantity} unités\n` +
      `💰 Montant: ${this.formatNumber(exit.totalAmount)} FCFA\n` +
      `📅 Date: ${this.formatDate(exit.date)}\n` +
      `${exit.customer ? `👤 Client: ${exit.customer}\n` : ''}` +
      `\nCette action est irréversible !`;

    if (confirm(confirmMessage)) {
      // Trouve l'index
      const index = this.exits.findIndex(e => e.id === exit.id);

      if (index !== -1) {
        // Supprime du tableau
        this.exits.splice(index, 1);

        // Met à jour
        this.applyFilters();
        this.calculateStats();

        // TODO: APPEL API DELETE
        // this.exitService.deleteExit(exit.id).subscribe(...)

        console.log('🗑️ Sortie supprimée:', exit.id);
        alert('✅ Sortie supprimée avec succès !');
      }
    } else {
      console.log('❌ Suppression annulée');
    }
  }

  // ========================================
  // MÉTHODES UTILITAIRES
  // ========================================

  /**
   * Génère un ID unique pour une sortie
   * @returns ID unique généré
   */
  private generateId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `exit_${timestamp}_${random}`;
  }

  /**
   * Formate un nombre avec séparateurs de milliers
   * @param num Nombre à formater
   * @returns Nombre formaté
   */
  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  /**
   * Formate une date au format français complet
   * @param date Date à formater
   * @returns Date formatée
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
   * Retourne le nom d'une cave par son ID
   * @param caveId ID de la cave
   * @returns Nom de la cave
   */
  getCaveName(caveId: string): string {
    const cave = this.caves.find(c => c.id === caveId);
    return cave ? cave.name : 'Cave inconnue';
  }

  /**
   * Retourne le nom d'une boisson par son ID
   * @param drinkId ID de la boisson
   * @returns Nom de la boisson
   */
  getDrinkName(drinkId: string): string {
    const drink = this.drinks.find(d => d.id === drinkId);
    return drink ? drink.name : 'Boisson inconnue';
  }

  /**
   * Retourne une date relative lisible
   * @param date Date à convertir
   * @returns Texte de date relative
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
   * Retourne le libellé d'un type de sortie
   * @param type Type de sortie
   * @returns Libellé formaté
   */
  getTypeLabel(type: ExitType): string {
    const labels: { [key in ExitType]: string } = {
      'vente': '💰 Vente',
      'transfert': '🔄 Transfert',
      'perte': '❌ Perte',
      'casse': '💔 Casse',
      'peremption': '⏰ Péremption',
      'degustation': '🍷 Dégustation'
    };
    return labels[type] || type;
  }

  /**
   * Retourne la classe CSS pour un type de sortie
   * @param type Type de sortie
   * @returns Classe CSS
   */
  getTypeClass(type: ExitType): string {
    const classes: { [key in ExitType]: string } = {
      'vente': 'type-sale',
      'transfert': 'type-transfer',
      'perte': 'type-loss',
      'casse': 'type-breakage',
      'peremption': 'type-expiry',
      'degustation': 'type-tasting'
    };
    return classes[type] || '';
  }

  /**
   * Retourne l'icône pour un type de sortie
   * @param type Type de sortie
   * @returns Emoji représentatif
   */
  getTypeIcon(type: ExitType): string {
    const icons: { [key in ExitType]: string } = {
      'vente': '💰',
      'transfert': '🔄',
      'perte': '❌',
      'casse': '💔',
      'peremption': '⏰',
      'degustation': '🍷'
    };
    return icons[type] || '📦';
  }

  /**
   * Calcule la marge pour une sortie de type vente
   * @param exit Sortie à analyser
   * @returns Marge en FCFA
   */
  calculateMargin(exit: StockExit): number {
    if (exit.type !== 'vente') return 0;

    const drink = this.drinks.find(d => d.id === exit.drinkId);
    if (!drink) return 0;

    return (exit.unitPrice - drink.purchasePrice) * exit.quantity;
  }

  /**
   * Calcule le taux de marge pour une sortie
   * @param exit Sortie à analyser
   * @returns Taux de marge en %
   */
  calculateMarginRate(exit: StockExit): number {
    if (exit.type !== 'vente') return 0;

    const drink = this.drinks.find(d => d.id === exit.drinkId);
    if (!drink || drink.purchasePrice === 0) return 0;

    const margin = exit.unitPrice - drink.purchasePrice;
    const marginRate = (margin / drink.purchasePrice) * 100;
    return Math.round(marginRate * 100) / 100;
  }

  /**
   * Retourne la classe CSS selon la catégorie
   * @param category Catégorie de boisson
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
   * Vérifie si une sortie est récente (moins de 7 jours)
   * @param exit Sortie à vérifier
   * @returns true si récente
   */
  isRecentExit(exit: StockExit): boolean {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(exit.date) >= sevenDaysAgo;
  }

  /**
   * Vérifie si une sortie représente une perte
   * @param exit Sortie à vérifier
   * @returns true si c'est une perte
   */
  isLoss(exit: StockExit): boolean {
    return ['perte', 'casse', 'peremption'].includes(exit.type);
  }

  /**
   * Exporte les sorties filtrées en CSV
   */
  exportToCSV(): void {
    if (this.filteredExits.length === 0) {
      alert('❌ Aucune sortie à exporter');
      return;
    }

    // En-têtes CSV complets
    const headers = [
      'Date',
      'Boisson',
      'Catégorie',
      'Format',
      'Type de Sortie',
      'Quantité',
      'Prix Unitaire (FCFA)',
      'Montant Total (FCFA)',
      'Cave Source',
      'Client',
      'Contact Client',
      'Destination',
      'Cave Destination',
      'Numéro Facture',
      'Bon de Livraison',
      'Motif Perte',
      'Détails Casse',
      'Traité par',
      'Marge (FCFA)',
      'Taux Marge (%)',
      'Notes'
    ];

    // Conversion des données
    const rows = this.filteredExits.map(exit => {
      const margin = this.calculateMargin(exit);
      const marginRate = this.calculateMarginRate(exit);

      return [
        this.formatDate(exit.date),
        exit.drinkName,
        exit.drinkCategory,
        exit.drinkFormat,
        this.getTypeLabel(exit.type),
        exit.quantity.toString(),
        exit.unitPrice.toString(),
        exit.totalAmount.toString(),
        this.getCaveName(exit.caveId),
        exit.customer || 'N/A',
        exit.customerContact || 'N/A',
        exit.destination || 'N/A',
        exit.transferToCaveId ? this.getCaveName(exit.transferToCaveId) : 'N/A',
        exit.invoiceNumber || 'N/A',
        exit.deliveryNote || 'N/A',
        exit.lossReason || 'N/A',
        exit.breakageDetails || 'N/A',
        exit.processedByName || exit.processedBy,
        margin.toString(),
        marginRate.toString(),
        (exit.notes || 'Aucune note').replace(/,/g, ';')
      ];
    });

    // Création du contenu CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Téléchargement
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const fileName = `sorties_stock_${new Date().toISOString().split('T')[0]}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`📊 Export CSV effectué: ${fileName} (${this.filteredExits.length} sorties)`);
    alert(`✅ Export réussi !\n\n📄 Fichier: ${fileName}\n📊 ${this.filteredExits.length} sortie(s) exportée(s)`);
  }

  /**
   * Lance l'impression
   */
  printExits(): void {
    console.log('🖨️ Impression des sorties lancée');
    window.print();
  }
}
