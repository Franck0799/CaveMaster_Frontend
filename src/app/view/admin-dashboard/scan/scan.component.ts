import { Component, OnInit, OnDestroy } from '@angular/core';

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
 * Composant Scan - Scanner de code-barres
 * Permet de scanner des produits et d'obtenir leurs informations
 */
@Component({
  selector: 'app-scan',
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

  constructor() {}

  ngOnInit(): void {
    // Initialisation du composant
    console.log('Composant Scan initialisé');
  }

  ngOnDestroy(): void {
    // Nettoyage lors de la destruction du composant
    this.stopScan();
  }

  /**
   * Démarre le processus de scan
   */
  startScan(): void {
    // Active l'état de scan
    this.isScanActive = true;
    
    // Réinitialise le résultat précédent
    this.scanResult = null;
    
    console.log('Scan démarré...');
    
    // Simulation du scan (3 secondes)
    // Dans une vraie app, on utiliserait une librairie de scan de code-barres
    this.scanTimer = setTimeout(() => {
      this.completeScan();
    }, 3000);
  }

  /**
   * Arrête le processus de scan
   */
  stopScan(): void {
    // Désactive l'état de scan
    this.isScanActive = false;
    
    // Annule le timer s'il existe
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
    // Désactive l'état de scan
    this.isScanActive = false;
    
    // Génère un résultat de scan simulé
    this.scanResult = this.generateMockScanResult();
    
    console.log('Scan terminé:', this.scanResult);
    
    // Émet un son de confirmation (optionnel)
    this.playBeepSound();
  }

  /**
   * Génère un résultat de scan simulé pour la démo
   * @returns Résultat de scan simulé
   */
  private generateMockScanResult(): ScanResult {
    // Données de produits simulées
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
    
    // Sélectionne un produit aléatoire
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
   * @returns JSON formaté du résultat
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
   * @param price - Prix à formater
   * @returns Prix formaté
   */
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  /**
   * Formate une date en format lisible
   * @param date - Date à formater
   * @returns Date formatée
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
   * Dans une vraie app, on utiliserait l'API Audio
   */
  private playBeepSound(): void {
    // Simulation du son
    console.log('🔊 Bip!');
    
    // Dans une vraie implémentation:
    // const audio = new Audio('assets/sounds/beep.mp3');
    // audio.play();
  }

  /**
   * Ajoute le produit scanné au stock
   */
  addToStock(): void {
    if (!this.scanResult) return;
    
    console.log('Ajout au stock:', this.scanResult);
    
    // TODO: Appel API pour ajouter au stock
    alert(`Produit "${this.scanResult.productName}" ajouté au stock avec succès !`);
    
    // Réinitialise pour un nouveau scan
    this.resetScan();
  }

  /**
   * Ouvre le formulaire de modification des informations du produit
   */
  editProductInfo(): void {
    if (!this.scanResult) return;
    
    console.log('Modification du produit:', this.scanResult);
    
    // TODO: Ouvrir modal ou naviguer vers page de modification
    alert('Ouverture du formulaire de modification...');
  }

  /**
   * Affiche l'historique du produit scanné
   */
  viewProductHistory(): void {
    if (!this.scanResult) return;
    
    console.log('Historique du produit:', this.scanResult);
    
    // TODO: Navigation vers page d'historique
    alert('Affichage de l\'historique du produit...');
  }
}