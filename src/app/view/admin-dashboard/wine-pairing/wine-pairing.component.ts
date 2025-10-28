import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Interface pour définir un accord mets & vins
 */
interface WinePairing {
  id: string;
  category: string; // Type de plat: Viandes, Poissons, Fromages, etc.
  dish: string; // Nom du plat
  dishIcon: string; // Emoji du plat
  wine: string; // Nom du vin
  wineIcon: string; // Emoji du vin
  wineType: string; // Type: Rouge, Blanc, Rosé, etc.
  description: string; // Description de l'accord
  temperature: string; // Température de service
  region?: string; // Région viticole
  vintage?: string; // Millésime recommandé
  tags?: string[]; // Tags pour recherche
  rating?: number; // Note de l'accord (1-5)
  createdAt: Date;
}

/**
 * Interface pour le formulaire d'ajout d'accord
 */
interface WinePairingForm {
  category: string;
  dish: string;
  dishIcon: string;
  wine: string;
  wineIcon: string;
  wineType: string;
  description: string;
  temperature: string;
  region: string;
  vintage: string;
  tags: string[];
}

/**
 * Composant WinePairing - Gestion des accords mets & vins
 * Permet de créer, consulter et gérer les associations plats-vins
 */
@Component({
  selector: 'app-wine-pairing',
   standalone: true,
  // Import des modules nécessaires
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './wine-pairing.component.html',
  styleUrls: ['./wine-pairing.component.scss']
})
export class WinePairingComponent implements OnInit {

  // Liste des accords mets & vins
  winePairings: WinePairing[] = [];

  // Accords filtrés (pour la recherche)
  filteredPairings: WinePairing[] = [];

  // Modal d'ajout/édition
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  selectedPairing: WinePairing | null = null;

  // Formulaire
  pairingForm: WinePairingForm = this.getEmptyForm();

  // Filtres et recherche
  searchQuery: string = '';
  selectedCategory: string = 'all';
  selectedWineType: string = 'all';

  // Catégories de plats disponibles
  categories: string[] = [
    'Viandes rouges',
    'Viandes blanches',
    'Poissons',
    'Fruits de mer',
    'Fromages',
    'Desserts',
    'Apéritifs',
    'Plats végétariens',
    'Plats épicés',
    'Charcuterie'
  ];

  // Types de vins
  wineTypes: string[] = [
    'Vin Rouge',
    'Vin Blanc',
    'Vin Rosé',
    'Champagne',
    'Vin Mousseux',
    'Vin Blanc Liquoreux',
    'Porto',
    'Vin de Glace'
  ];

  // Icônes disponibles pour les plats
  dishIcons: string[] = [
    '🥩', '🍗', '🐟', '🦞', '🧀', '🍰', '🥗', '🍕', '🍝', '🌮'
  ];

  // Icônes disponibles pour les vins
  wineIcons: string[] = [
    '🍷', '🥂', '🍾', '🍇', '🍾', '🥃'
  ];

  // État de chargement
  isLoading: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Chargement initial des accords
    this.loadWinePairings();
  }

  /**
   * Charge les accords mets & vins depuis le backend
   */
  loadWinePairings(): void {
    this.isLoading = true;

    // TODO: Appel API
    // Simulation avec des données de test
    this.winePairings = this.generateMockPairings();
    this.filteredPairings = [...this.winePairings];

    this.isLoading = false;
    console.log('Accords chargés:', this.winePairings.length);
  }

  /**
   * Génère des accords de test pour la démo
   * @returns Liste d'accords simulés
   */
  private generateMockPairings(): WinePairing[] {
    return [
      {
        id: '1',
        category: 'Viandes rouges',
        dish: 'Steak grillé',
        dishIcon: '🥩',
        wine: 'Bordeaux Rouge',
        wineIcon: '🍷',
        wineType: 'Vin Rouge',
        description: 'Un Bordeaux corsé sublime parfaitement un steak grillé. Les tanins structurés du vin s\'accordent avec la richesse de la viande.',
        temperature: '16-18°C',
        region: 'Bordeaux',
        vintage: '2015-2018',
        tags: ['classique', 'élégant', 'tanins'],
        rating: 5,
        createdAt: new Date()
      },
      {
        id: '2',
        category: 'Poissons',
        dish: 'Saumon grillé',
        dishIcon: '🐟',
        wine: 'Chablis',
        wineIcon: '🍷',
        wineType: 'Vin Blanc',
        description: 'La fraîcheur minérale d\'un Chablis complète délicatement le goût délicat du saumon grillé.',
        temperature: '10-12°C',
        region: 'Bourgogne',
        vintage: '2019-2021',
        tags: ['frais', 'minéral', 'délicat'],
        rating: 4,
        createdAt: new Date()
      },
      {
        id: '3',
        category: 'Fromages',
        dish: 'Plateau de fromages affinés',
        dishIcon: '🧀',
        wine: 'Porto Tawny',
        wineIcon: '🥃',
        wineType: 'Porto',
        description: 'Le Porto Tawny avec ses notes de fruits secs et de caramel s\'accorde merveilleusement avec les fromages affinés.',
        temperature: '14-16°C',
        region: 'Porto',
        vintage: '10-20 ans',
        tags: ['intense', 'complexe', 'doux'],
        rating: 5,
        createdAt: new Date()
      },
      {
        id: '4',
        category: 'Fruits de mer',
        dish: 'Huîtres fraîches',
        dishIcon: '🦞',
        wine: 'Muscadet',
        wineIcon: '🍷',
        wineType: 'Vin Blanc',
        description: 'Un Muscadet sec et iodé est le compagnon idéal des huîtres fraîches.',
        temperature: '8-10°C',
        region: 'Loire',
        vintage: 'Millésime récent',
        tags: ['iodé', 'frais', 'maritime'],
        rating: 5,
        createdAt: new Date()
      },
      {
        id: '5',
        category: 'Desserts',
        dish: 'Tarte tatin',
        dishIcon: '🍰',
        wine: 'Sauternes',
        wineIcon: '🍷',
        wineType: 'Vin Blanc Liquoreux',
        description: 'Un Sauternes moelleux avec ses notes de miel et d\'abricot sublime une tarte tatin aux pommes caramélisées.',
        temperature: '8-10°C',
        region: 'Bordeaux',
        vintage: '2015-2017',
        tags: ['sucré', 'onctueux', 'complexe'],
        rating: 4,
        createdAt: new Date()
      },
      {
        id: '6',
        category: 'Apéritifs',
        dish: 'Olives et tapenade',
        dishIcon: '🫒',
        wine: 'Champagne Brut',
        wineIcon: '🥂',
        wineType: 'Champagne',
        description: 'Les bulles fines d\'un Champagne Brut nettoient le palais entre chaque bouchée d\'olives.',
        temperature: '6-8°C',
        region: 'Champagne',
        vintage: 'Non millésimé',
        tags: ['festif', 'élégant', 'pétillant'],
        rating: 4,
        createdAt: new Date()
      }
    ];
  }

  /**
   * Recherche et filtre les accords
   */
  applyFilters(): void {
    let result = [...this.winePairings];

    // Filtre par recherche textuelle
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(pairing =>
        pairing.dish.toLowerCase().includes(query) ||
        pairing.wine.toLowerCase().includes(query) ||
        pairing.description.toLowerCase().includes(query) ||
        pairing.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filtre par catégorie
    if (this.selectedCategory !== 'all') {
      result = result.filter(pairing => pairing.category === this.selectedCategory);
    }

    // Filtre par type de vin
    if (this.selectedWineType !== 'all') {
      result = result.filter(pairing => pairing.wineType === this.selectedWineType);
    }

    this.filteredPairings = result;
    console.log('Filtres appliqués:', result.length, 'résultats');
  }

  /**
   * Gère le changement de recherche
   */
  onSearchChange(): void {
    this.applyFilters();
  }

  /**
   * Gère le changement de catégorie
   */
  onCategoryChange(): void {
    this.applyFilters();
  }

  /**
   * Gère le changement de type de vin
   */
  onWineTypeChange(): void {
    this.applyFilters();
  }

  /**
   * Réinitialise tous les filtres
   */
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.selectedWineType = 'all';
    this.filteredPairings = [...this.winePairings];
  }

  /**
   * Ouvre le modal d'ajout d'accord
   */
  openAddModal(): void {
    this.isEditMode = false;
    this.selectedPairing = null;
    this.pairingForm = this.getEmptyForm();
    this.isModalOpen = true;
  }

  /**
   * Ouvre le modal d'édition d'accord
   * @param pairing - Accord à éditer
   */
  openEditModal(pairing: WinePairing): void {
    this.isEditMode = true;
    this.selectedPairing = pairing;
    this.pairingForm = {
      category: pairing.category,
      dish: pairing.dish,
      dishIcon: pairing.dishIcon,
      wine: pairing.wine,
      wineIcon: pairing.wineIcon,
      wineType: pairing.wineType,
      description: pairing.description,
      temperature: pairing.temperature,
      region: pairing.region || '',
      vintage: pairing.vintage || '',
      tags: pairing.tags || []
    };
    this.isModalOpen = true;
  }

  /**
   * Ferme le modal
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.selectedPairing = null;
    this.pairingForm = this.getEmptyForm();
  }

  /**
   * Sauvegarde l'accord (ajout ou modification)
   */
  savePairing(): void {
    // Validation
    if (!this.validateForm()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.isEditMode && this.selectedPairing) {
      // Mode édition
      this.updatePairing();
    } else {
      // Mode ajout
      this.addPairing();
    }
  }

  /**
   * Ajoute un nouvel accord
   */
  private addPairing(): void {
    const newPairing: WinePairing = {
      id: this.generateId(),
      category: this.pairingForm.category,
      dish: this.pairingForm.dish,
      dishIcon: this.pairingForm.dishIcon,
      wine: this.pairingForm.wine,
      wineIcon: this.pairingForm.wineIcon,
      wineType: this.pairingForm.wineType,
      description: this.pairingForm.description,
      temperature: this.pairingForm.temperature,
      region: this.pairingForm.region,
      vintage: this.pairingForm.vintage,
      tags: this.pairingForm.tags,
      rating: 0,
      createdAt: new Date()
    };

    this.winePairings.unshift(newPairing);
    this.applyFilters();

    // TODO: Appel API
    console.log('Accord ajouté:', newPairing);

    alert('Accord mets & vins ajouté avec succès !');
    this.closeModal();
  }

  /**
   * Met à jour un accord existant
   */
  private updatePairing(): void {
    if (!this.selectedPairing) return;

    const index = this.winePairings.findIndex(p => p.id === this.selectedPairing!.id);
    if (index !== -1) {
      this.winePairings[index] = {
        ...this.selectedPairing,
        category: this.pairingForm.category,
        dish: this.pairingForm.dish,
        dishIcon: this.pairingForm.dishIcon,
        wine: this.pairingForm.wine,
        wineIcon: this.pairingForm.wineIcon,
        wineType: this.pairingForm.wineType,
        description: this.pairingForm.description,
        temperature: this.pairingForm.temperature,
        region: this.pairingForm.region,
        vintage: this.pairingForm.vintage,
        tags: this.pairingForm.tags
      };

      this.applyFilters();

      // TODO: Appel API
      console.log('Accord mis à jour:', this.winePairings[index]);

      alert('Accord mis à jour avec succès !');
      this.closeModal();
    }
  }

  /**
   * Supprime un accord
   * @param pairing - Accord à supprimer
   */
  deletePairing(pairing: WinePairing): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'accord "${pairing.dish} & ${pairing.wine}" ?`)) {
      this.winePairings = this.winePairings.filter(p => p.id !== pairing.id);
      this.applyFilters();

      // TODO: Appel API
      console.log('Accord supprimé:', pairing.id);

      alert('Accord supprimé avec succès');
    }
  }

  /**
   * Valide le formulaire
   * @returns true si le formulaire est valide
   */
  private validateForm(): boolean {
    return !!(
      this.pairingForm.category &&
      this.pairingForm.dish &&
      this.pairingForm.wine &&
      this.pairingForm.wineType &&
      this.pairingForm.description &&
      this.pairingForm.temperature
    );
  }

  /**
   * Retourne un formulaire vide
   * @returns Formulaire initialisé
   */
  private getEmptyForm(): WinePairingForm {
    return {
      category: '',
      dish: '',
      dishIcon: '🍽️',
      wine: '',
      wineIcon: '🍷',
      wineType: '',
      description: '',
      temperature: '',
      region: '',
      vintage: '',
      tags: []
    };
  }

  /**
   * Génère un ID unique
   * @returns ID généré
   */
  private generateId(): string {
    return `pairing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Ajoute un tag au formulaire
   * @param tag - Tag à ajouter
   */
  addTag(tag: string): void {
    if (tag && !this.pairingForm.tags.includes(tag)) {
      this.pairingForm.tags.push(tag);
    }
  }

  /**
   * Supprime un tag du formulaire
   * @param tag - Tag à supprimer
   */
  removeTag(tag: string): void {
    this.pairingForm.tags = this.pairingForm.tags.filter(t => t !== tag);
  }

  /**
   * Retourne les étoiles de notation
   * @param rating - Note (1-5)
   * @returns Tableau d'étoiles
   */
  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < rating);
  }

  /**
   * Exporte les accords en CSV
   */
  exportToPDF(): void {
    console.log('Export des accords en PDF...');
    // TODO: Implémenter l'export CSV
    alert('Accords exportés avec succès !');
  }

  /**
   * Imprime les accords
   */
  printPairings(): void {
    window.print();
  }
}
