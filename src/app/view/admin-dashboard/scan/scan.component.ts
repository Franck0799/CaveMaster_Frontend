import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Interface pour le résultat du scan
 */
interface ScanResult {
  barcode: string;
  productName: string;
  category: string;
  price: number;
  stock: number;
  timestamp: Date;
}

/**
 * Interface pour l'historique des scans
 */
interface ScanHistory {
  id: string;
  scanResult: ScanResult;
  action: 'added' | 'modified' | 'viewed';
  actionDate: Date;
}

/**
 * Composant Scan - Scanner de code-barres
 * Permet de scanner des produits et d'obtenir leurs informations
 */
@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnInit, OnDestroy {

  // État du scan
  isScanActive: boolean = false;

  // Résultat du scan
  scanResult: ScanResult | null = null;

  // Timer pour simulation du scan
  private scanTimer: any = null;

  // Gestion du modal de modification
  showEditModal: boolean = false;
  editForm!: FormGroup;

  // Gestion du modal d'ajout au stock
  showStockModal: boolean = false;
  stockForm!: FormGroup;

  // Gestion du modal d'historique
  showHistoryModal: boolean = false;
  scanHistory: ScanHistory[] = [];

  // Liste des catégories disponibles
  categories: string[] = [
    'Vin Rouge',
    'Vin Blanc',
    'Vin Rosé',
    'Champagne',
    'Bière',
    'Liqueur',
    'Whisky',
    'Vodka',
    'Rhum',
    'Cognac',
    'Gin',
    'Tequila',
    'Cocktails',
    'Soft Drinks',
    'Eau',
    'Jus'
  ];

  constructor(private fb: FormBuilder) {
    this.initForms();
  }

  ngOnInit(): void {
    console.log('Composant Scan initialisé');
    this.loadScanHistory();
  }

  ngOnDestroy(): void {
    this.stopScan();
  }

  /**
   * Initialise les formulaires
   */
  private initForms(): void {
    // Formulaire de modification
    this.editForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      barcode: ['', Validators.required]
    });

    // Formulaire d'ajout au stock
    this.stockForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      notes: ['']
    });
  }

  /**
   * Charge l'historique depuis localStorage
   */
  private loadScanHistory(): void {
    const stored = localStorage.getItem('scanHistory');
    if (stored) {
      this.scanHistory = JSON.parse(stored).map((item: any) => ({
        ...item,
        scanResult: {
          ...item.scanResult,
          timestamp: new Date(item.scanResult.timestamp)
        },
        actionDate: new Date(item.actionDate)
      }));
    }
  }

  /**
   * Sauvegarde l'historique dans localStorage
   */
  private saveScanHistory(): void {
    localStorage.setItem('scanHistory', JSON.stringify(this.scanHistory));
  }

  /**
   * Ajoute une entrée à l'historique
   */
  private addToHistory(action: 'added' | 'modified' | 'viewed'): void {
    if (!this.scanResult) return;

    const historyItem: ScanHistory = {
      id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      scanResult: { ...this.scanResult },
      action,
      actionDate: new Date()
    };

    this.scanHistory.unshift(historyItem);

    // Limite l'historique à 50 entrées
    if (this.scanHistory.length > 50) {
      this.scanHistory = this.scanHistory.slice(0, 50);
    }

    this.saveScanHistory();
  }

  /**
   * Démarre le processus de scan
   */
  startScan(): void {
    this.isScanActive = true;
    this.scanResult = null;
    console.log('Scan démarré...');

    this.scanTimer = setTimeout(() => {
      this.completeScan();
    }, 3000);
  }

  /**
   * Arrête le processus de scan
   */
  stopScan(): void {
    this.isScanActive = false;

    if (this.scanTimer) {
      clearTimeout(this.scanTimer);
      this.scanTimer = null;
    }

    console.log('Scan arrêté');
  }

  /**
   * Complète le scan et génère un résultat
   */
  private completeScan(): void {
    this.isScanActive = false;
    this.scanResult = this.generateMockScanResult();
    console.log('Scan terminé:', this.scanResult);
    this.playBeepSound();
  }

  /**
   * Génère un résultat de scan simulé pour la démo
   */
  private generateMockScanResult(): ScanResult {
    const mockProducts = [
      {
        barcode: '3256220025508',
        productName: 'Château Margaux 2015',
        category: 'Vin Rouge',
        price: 450000,
        stock: 12
      },
      {
        barcode: '3161780254897',
        productName: 'Champagne Moët & Chandon',
        category: 'Champagne',
        price: 85000,
        stock: 25
      },
      {
        barcode: '5449000000996',
        productName: 'Heineken 33cl',
        category: 'Bière',
        price: 1500,
        stock: 150
      },
      {
        barcode: '8712000043094',
        productName: 'Martini Rosso',
        category: 'Liqueur',
        price: 8500,
        stock: 30
      }
    ];

    const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];

    return {
      ...randomProduct,
      timestamp: new Date()
    };
  }

  /**
   * Réinitialise le scan pour un nouveau scan
   */
  resetScan(): void {
    this.scanResult = null;
    this.isScanActive = false;
    console.log('Scan réinitialisé');
  }

  /**
   * Formate le résultat du scan en JSON lisible
   */
  getFormattedScanResult(): string {
    if (!this.scanResult) return '';

    return JSON.stringify({
      'Code-barres': this.scanResult.barcode,
      'Nom du produit': this.scanResult.productName,
      'Catégorie': this.scanResult.category,
      'Prix': `${this.formatPrice(this.scanResult.price)} FCFA`,
      'Stock disponible': `${this.scanResult.stock} unités`,
      'Date du scan': this.formatDate(this.scanResult.timestamp)
    }, null, 2);
  }

  /**
   * Formate un prix en ajoutant des séparateurs de milliers
   */
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  /**
   * Formate une date en format lisible
   */
  formatDate(date: Date): string {
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Joue un son de confirmation (bip)
   */
  private playBeepSound(): void {
    console.log('🔊 Bip!');
  }

  // ===== MODAL DE MODIFICATION =====

  /**
   * Ouvre le modal de modification
   */
  editProductInfo(): void {
    if (!this.scanResult) return;

    // Pré-remplit le formulaire avec les données actuelles
    this.editForm.patchValue({
      productName: this.scanResult.productName,
      category: this.scanResult.category,
      price: this.scanResult.price,
      stock: this.scanResult.stock,
      barcode: this.scanResult.barcode
    });

    this.showEditModal = true;
  }

  /**
   * Ferme le modal de modification
   */
  closeEditModal(): void {
    this.showEditModal = false;
    this.editForm.reset();
  }

  /**
   * Sauvegarde les modifications
   */
  saveProductEdits(): void {
    if (this.editForm.invalid || !this.scanResult) return;

    const formValue = this.editForm.value;

    // Met à jour le résultat du scan
    this.scanResult = {
      ...this.scanResult,
      productName: formValue.productName,
      category: formValue.category,
      price: formValue.price,
      stock: formValue.stock,
      barcode: formValue.barcode
    };

    // Ajoute à l'historique
    this.addToHistory('modified');

    console.log('Produit modifié:', this.scanResult);

    // Ferme le modal
    this.closeEditModal();

    // TODO: Appel API pour sauvegarder en base de données
    alert('Modifications enregistrées avec succès !');
  }

  // ===== MODAL D'AJOUT AU STOCK =====

  /**
   * Ouvre le modal d'ajout au stock
   */
  addToStock(): void {
    if (!this.scanResult) return;

    this.stockForm.patchValue({
      quantity: 1,
      notes: ''
    });

    this.showStockModal = true;
  }

  /**
   * Ferme le modal d'ajout au stock
   */
  closeStockModal(): void {
    this.showStockModal = false;
    this.stockForm.reset();
  }

  /**
   * Confirme l'ajout au stock
   */
  confirmAddToStock(): void {
    if (this.stockForm.invalid || !this.scanResult) return;

    const quantity = this.stockForm.value.quantity;
    const notes = this.stockForm.value.notes;

    // Met à jour le stock
    this.scanResult.stock += quantity;

    // Ajoute à l'historique
    this.addToHistory('added');

    console.log(`Ajout de ${quantity} unité(s) au stock. Notes:`, notes);

    // Ferme le modal
    this.closeStockModal();

    // TODO: Appel API pour mettre à jour le stock en base de données
    alert(`${quantity} unité(s) de "${this.scanResult.productName}" ajoutée(s) au stock avec succès !`);

    // Réinitialise pour un nouveau scan
    this.resetScan();
  }

  // ===== MODAL D'HISTORIQUE =====

  /**
   * Ouvre le modal d'historique
   */
  viewProductHistory(): void {
    this.showHistoryModal = true;
  }

  /**
   * Ferme le modal d'historique
   */
  closeHistoryModal(): void {
    this.showHistoryModal = false;
  }

  /**
   * Retourne l'icône selon le type d'action
   */
  getActionIcon(action: string): string {
    switch (action) {
      case 'added': return '➕';
      case 'modified': return '📝';
      case 'viewed': return '👁️';
      default: return '📊';
    }
  }

  /**
   * Retourne le libellé de l'action
   */
  getActionLabel(action: string): string {
    switch (action) {
      case 'added': return 'Ajouté au stock';
      case 'modified': return 'Modifié';
      case 'viewed': return 'Consulté';
      default: return 'Action inconnue';
    }
  }

  /**
   * Efface l'historique
   */
  clearHistory(): void {
    if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
      this.scanHistory = [];
      this.saveScanHistory();
      alert('Historique effacé avec succès !');
    }
  }

  /**
   * Filtre l'historique par produit actuel
   */
  getCurrentProductHistory(): ScanHistory[] {
    if (!this.scanResult) return this.scanHistory;

    return this.scanHistory.filter(
      item => item.scanResult.barcode === this.scanResult!.barcode
    );
  }
}
