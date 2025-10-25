// ==========================================
// FICHIER: src/app/features/entries/entries.component.ts
// DESCRIPTION: Composant pour gérer les entrées de stock (réceptions de marchandises)
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Interface pour définir une boisson
 */
interface Drink {
  id: string;
  name: string;
  category: string;
  icon: string;
  price: number;
  stock: number;
  description?: string;
  sales?: number;
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
}

/**
 * Interface pour définir une entrée de stock
 */
interface StockEntry {
  id: string;
  drinkId: string;
  drinkName: string;
  quantity: number;
  date: Date;
  supplier?: string;
  unitPrice: number;
  totalCost: number;
  caveId: string;
  addedBy: string;
  notes?: string;
}

/**
 * Interface pour le formulaire d'ajout d'entrée
 */
interface StockEntryForm {
  drinkId: string;
  quantity: number;
  unitPrice: number;
  caveId: string;
  supplier: string;
  notes: string;
}

/**
 * Composant de gestion des entrées de stock
 * Permet d'enregistrer les réceptions de marchandises et de consulter l'historique
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
   * Liste des boissons disponibles (pour le formulaire)
   */
  drinks: Drink[] = [];

  /**
   * Liste des caves disponibles (pour le formulaire)
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
   * Filtre par cave sélectionnée
   */
  selectedCaveFilter: string | null = null;

  /**
   * Filtre par période (jours)
   */
  periodFilter: number = 30; // 30 derniers jours par défaut

  /**
   * Terme de recherche
   */
  searchTerm: string = '';

  /**
   * Statistiques des entrées
   */
  stats = {
    totalEntries: 0,          // Nombre total d'entrées
    totalQuantity: 0,         // Quantité totale entrée
    totalCost: 0,             // Coût total
    recentEntries: 0          // Entrées récentes (7 derniers jours)
  };

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
    console.log('✅ EntriesComponent initialisé');
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
    this.isLoading = true;

    // Simulation avec des données de test
    this.drinks = this.generateMockDrinks();
    this.caves = this.generateMockCaves();
    this.entries = this.generateMockEntries();

    this.filteredEntries = [...this.entries];
    this.calculateStats();

    this.isLoading = false;
    console.log('✅ Données chargées:', {
      entries: this.entries.length,
      drinks: this.drinks.length,
      caves: this.caves.length
    });
  }

  /**
   * Génère des boissons de test pour la démo
   * @returns Liste de boissons simulées
   */
  private generateMockDrinks(): Drink[] {
    return [
      {
        id: 'drink_1',
        name: 'Bordeaux Rouge 2018',
        category: 'Vin Rouge',
        icon: '🍷',
        price: 15000,
        stock: 45,
        description: 'Vin rouge de Bordeaux, millésime 2018'
      },
      {
        id: 'drink_2',
        name: 'Champagne Moët & Chandon',
        category: 'Champagne',
        icon: '🍾',
        price: 35000,
        stock: 20,
        description: 'Champagne brut impérial'
      },
      {
        id: 'drink_3',
        name: 'Heineken',
        category: 'Bières',
        icon: '🍺',
        price: 800,
        stock: 150,
        description: 'Bière blonde hollandaise'
      },
      {
        id: 'drink_4',
        name: 'Chablis 2020',
        category: 'Vin Blanc',
        icon: '🍷',
        price: 12000,
        stock: 30,
        description: 'Vin blanc sec de Bourgogne'
      },
      {
        id: 'drink_5',
        name: 'Hennessy VSOP',
        category: 'Liqueurs',
        icon: '🥃',
        price: 35000,
        stock: 25,
        description: 'Cognac premium'
      }
    ];
  }

  /**
   * Génère des caves de test pour la démo
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
        description: 'Cave principale de stockage'
      },
      {
        id: 'cave_2',
        name: 'Cave Secondaire',
        location: 'Bâtiment B - RDC',
        capacity: 500,
        currentStock: 320,
        description: 'Cave secondaire pour rotation rapide'
      },
      {
        id: 'cave_3',
        name: 'Cave de Vieillissement',
        location: 'Bâtiment A - Niveau -2',
        capacity: 300,
        currentStock: 180,
        description: 'Cave climatisée pour vins de garde'
      }
    ];
  }

  /**
   * Génère des entrées de test pour la démo
   * @returns Liste d'entrées de stock simulées triées par date décroissante
   */
  private generateMockEntries(): StockEntry[] {
    const now = new Date();
    return [
      {
        id: 'entry_1',
        drinkId: 'drink_1',
        drinkName: 'Bordeaux Rouge 2018',
        quantity: 24,
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
        supplier: 'Vins & Co',
        unitPrice: 12000,
        totalCost: 288000,
        caveId: 'cave_1',
        addedBy: 'Jean Dupont',
        notes: 'Livraison en bon état, bouteilles bien emballées'
      },
      {
        id: 'entry_2',
        drinkId: 'drink_2',
        drinkName: 'Champagne Moët & Chandon',
        quantity: 12,
        date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // Il y a 5 jours
        supplier: 'Champagne Direct',
        unitPrice: 30000,
        totalCost: 360000,
        caveId: 'cave_3',
        addedBy: 'Marie Martin',
        notes: 'Stockage à température contrôlée recommandé'
      },
      {
        id: 'entry_3',
        drinkId: 'drink_3',
        drinkName: 'Heineken',
        quantity: 100,
        date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // Il y a 10 jours
        supplier: 'Brasserie Import',
        unitPrice: 600,
        totalCost: 60000,
        caveId: 'cave_2',
        addedBy: 'Pierre Dubois',
        notes: 'Promotion fournisseur - Prix réduit'
      },
      {
        id: 'entry_4',
        drinkId: 'drink_4',
        drinkName: 'Chablis 2020',
        quantity: 18,
        date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // Il y a 15 jours
        supplier: 'Vins de Bourgogne',
        unitPrice: 9500,
        totalCost: 171000,
        caveId: 'cave_3',
        addedBy: 'Sophie Bernard',
        notes: 'Millésime exceptionnel, qualité premium'
      },
      {
        id: 'entry_5',
        drinkId: 'drink_1',
        drinkName: 'Bordeaux Rouge 2018',
        quantity: 36,
        date: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // Il y a 20 jours
        supplier: 'Vins & Co',
        unitPrice: 11500,
        totalCost: 414000,
        caveId: 'cave_1',
        addedBy: 'Luc Moreau',
        notes: 'Réapprovisionnement mensuel habituel'
      },
      {
        id: 'entry_6',
        drinkId: 'drink_5',
        drinkName: 'Hennessy VSOP',
        quantity: 15,
        date: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000), // Il y a 25 jours
        supplier: 'Spiritueux Premium',
        unitPrice: 32000,
        totalCost: 480000,
        caveId: 'cave_3',
        addedBy: 'Marie Martin',
        notes: 'Demande spéciale client VIP'
      }
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // ========================================
  // FILTRAGE ET RECHERCHE
  // ========================================

  /**
   * Applique tous les filtres actifs sur les entrées
   * Combine: cave, période, et recherche textuelle
   */
  applyFilters(): void {
    let result = [...this.entries];

    // Filtre par cave sélectionnée
    if (this.selectedCaveFilter) {
      result = result.filter(entry => entry.caveId === this.selectedCaveFilter);
    }

    // Filtre par période (nombre de jours)
    if (this.periodFilter) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.periodFilter);
      result = result.filter(entry => new Date(entry.date) >= cutoffDate);
    }

    // Filtre par terme de recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(entry =>
        entry.drinkName.toLowerCase().includes(term) ||
        entry.supplier?.toLowerCase().includes(term) ||
        entry.notes?.toLowerCase().includes(term) ||
        entry.addedBy.toLowerCase().includes(term)
      );
    }

    this.filteredEntries = result;
    console.log(`✅ Filtres appliqués: ${result.length} résultat(s) sur ${this.entries.length}`);
  }

  /**
   * Gère le changement du filtre cave
   */
  onCaveFilterChange(): void {
    this.applyFilters();
  }

  /**
   * Gère le changement de la période de filtre
   */
  onPeriodFilterChange(): void {
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
    this.periodFilter = 30;
    this.searchTerm = '';
    this.filteredEntries = [...this.entries];
    console.log('✅ Filtres réinitialisés');
  }

  // ========================================
  // CALCUL DES STATISTIQUES
  // ========================================

  /**
   * Calcule toutes les statistiques des entrées
   * Met à jour: total entrées, quantité, coût, entrées récentes
   */
  calculateStats(): void {
    // Nombre total d'entrées
    this.stats.totalEntries = this.entries.length;

    // Quantité totale entrée
    this.stats.totalQuantity = this.entries.reduce((sum, entry) => sum + entry.quantity, 0);

    // Coût total de toutes les entrées
    this.stats.totalCost = this.entries.reduce((sum, entry) => sum + entry.totalCost, 0);

    // Entrées des 7 derniers jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    this.stats.recentEntries = this.entries.filter(
      entry => new Date(entry.date) >= sevenDaysAgo
    ).length;

    console.log('✅ Statistiques calculées:', this.stats);
  }

  // ========================================
  // MODAL - AJOUT D'ENTRÉE
  // ========================================

  /**
   * Ouvre le modal d'ajout d'une nouvelle entrée
   */
  openAddModal(): void {
    this.entryForm = this.getEmptyForm();
    this.isAddModalOpen = true;
    console.log('✅ Modal d\'ajout ouvert');
  }

  /**
   * Ferme le modal d'ajout et réinitialise le formulaire
   */
  closeAddModal(): void {
    this.isAddModalOpen = false;
    this.entryForm = this.getEmptyForm();
    console.log('✅ Modal d\'ajout fermé');
  }

  /**
   * Sauvegarde une nouvelle entrée de stock
   * Valide les données, crée l'entrée et met à jour les stats
   */
  saveEntry(): void {
    // Validation des champs obligatoires
    if (!this.validateForm()) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Récupère les infos de la boisson sélectionnée
    const drink = this.drinks.find(d => d.id === this.entryForm.drinkId);
    if (!drink) {
      alert('❌ Boisson non trouvée');
      return;
    }

    // Calcule le coût total
    const totalCost = this.entryForm.quantity * this.entryForm.unitPrice;

    // Crée la nouvelle entrée
    const newEntry: StockEntry = {
      id: this.generateId(),
      drinkId: this.entryForm.drinkId,
      drinkName: drink.name,
      quantity: this.entryForm.quantity,
      date: new Date(),
      supplier: this.entryForm.supplier,
      unitPrice: this.entryForm.unitPrice,
      totalCost: totalCost,
      caveId: this.entryForm.caveId,
      addedBy: 'Utilisateur actuel', // TODO: Remplacer par l'utilisateur connecté
      notes: this.entryForm.notes
    };

    // Ajoute l'entrée en première position
    this.entries.unshift(newEntry);

    // Met à jour les filtres et statistiques
    this.applyFilters();
    this.calculateStats();

    // TODO: Appel API POST pour sauvegarder sur le serveur
    console.log('✅ Entrée ajoutée:', newEntry);

    alert('✅ Entrée de stock enregistrée avec succès !');
    this.closeAddModal();
  }

  /**
   * Calcule le coût total en temps réel
   * Utilisé pour l'aperçu dans le formulaire
   * @returns Coût total calculé (quantité × prix unitaire)
   */
  calculateTotalCost(): number {
    return (this.entryForm.quantity || 0) * (this.entryForm.unitPrice || 0);
  }

  /**
   * Valide le formulaire d'entrée
   * Vérifie que tous les champs obligatoires sont remplis
   * @returns true si le formulaire est valide
   */
  private validateForm(): boolean {
    return !!(
      this.entryForm.drinkId &&
      this.entryForm.quantity > 0 &&
      this.entryForm.unitPrice > 0 &&
      this.entryForm.caveId
    );
  }

  /**
   * Retourne un formulaire vide initialisé
   * @returns Formulaire avec valeurs par défaut
   */
  private getEmptyForm(): StockEntryForm {
    return {
      drinkId: '',
      quantity: 0,
      unitPrice: 0,
      caveId: '',
      supplier: '',
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
    this.selectedEntry = entry;
    this.isDetailModalOpen = true;
    console.log('✅ Détails de l\'entrée affichés:', entry);
  }

  /**
   * Ferme le modal de détails
   */
  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedEntry = null;
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
    // Message de confirmation détaillé
    const confirmMessage =
      `Êtes-vous sûr de vouloir supprimer cette entrée ?\n\n` +
      `📦 Produit: ${entry.drinkName}\n` +
      `🔢 Quantité: ${entry.quantity}\n` +
      `💰 Coût: ${this.formatNumber(entry.totalCost)} FCFA\n` +
      `📅 Date: ${this.formatDate(entry.date)}`;

    if (confirm(confirmMessage)) {
      // Trouve l'index de l'entrée
      const index = this.entries.findIndex(e => e.id === entry.id);

      if (index !== -1) {
        // Supprime l'entrée du tableau
        this.entries.splice(index, 1);

        // Met à jour les filtres et les stats
        this.applyFilters();
        this.calculateStats();

        // TODO: Appel API DELETE pour supprimer du serveur
        console.log('✅ Entrée supprimée:', entry.id);

        alert('✅ Entrée supprimée avec succès !');
      }
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
    return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
   * Exporte les entrées filtrées en fichier CSV
   * Télécharge automatiquement le fichier
   */
  exportToCSV(): void {
    if (this.filteredEntries.length === 0) {
      alert('❌ Aucune entrée à exporter');
      return;
    }

    // En-têtes du CSV
    const headers = [
      'Date',
      'Boisson',
      'Quantité',
      'Prix Unitaire (FCFA)',
      'Coût Total (FCFA)',
      'Cave',
      'Fournisseur',
      'Ajouté par',
      'Notes'
    ];

    // Conversion des données en lignes CSV
    const rows = this.filteredEntries.map(entry => [
      this.formatDate(entry.date),
      entry.drinkName,
      entry.quantity.toString(),
      entry.unitPrice.toString(),
      entry.totalCost.toString(),
      this.getCaveName(entry.caveId),
      entry.supplier || 'N/A',
      entry.addedBy,
      (entry.notes || 'Aucune note').replace(/,/g, ';') // Remplace les virgules pour éviter les problèmes CSV
    ]);

    // Création du contenu CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Création et téléchargement du fichier
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }); // \ufeff = BOM UTF-8
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const fileName = `entrees_stock_${new Date().toISOString().split('T')[0]}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`✅ Export CSV effectué: ${fileName} (${this.filteredEntries.length} entrées)`);
    alert(`✅ Export réussi !\n${this.filteredEntries.length} entrée(s) exportée(s)`);
  }

  /**
   * Lance l'impression de la page actuelle
   * Utilise la fonction d'impression du navigateur
   */
  printEntries(): void {
    console.log('🖨️ Impression lancée');
    window.print();
  }
}
