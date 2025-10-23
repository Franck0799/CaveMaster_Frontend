// ==========================================
// FICHIER: src/app/features/scan/scan.component.ts
// DESCRIPTION: Composant pour scanner les codes-barres des produits
// ==========================================

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { Drink } from '../../core/models/models';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnInit {

  // États du scan
  isScanActive: boolean = false;     // Indique si le scan est en cours
  scanResult: any = null;            // Résultat du scan
  scanError: string = '';            // Message d'erreur éventuel

  // Historique des scans
  scanHistory: any[] = [];

  // Statistiques
  stats = {
    totalScans: 0,
    successfulScans: 0,
    failedScans: 0,
    todayScans: 0
  };

  constructor(
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.loadScanHistory();
    this.calculateStats();
  }

  /**
   * Démarre le processus de scan
   * Simulation d'un scan de code-barre (3 secondes)
   */
  startScan(): void {
    this.isScanActive = true;           // Active l'animation
    this.scanResult = null;              // Réinitialise le résultat
    this.scanError = '';                 // Efface les erreurs

    // Simulation du scan (à remplacer par une vraie API de scan)
    setTimeout(() => {
      this.performScan();
    }, 3000);  // 3 secondes de scan
  }

  /**
   * Effectue le scan et récupère les informations du produit
   * Dans un cas réel, cette méthode appellerait une API de scan
   */
  private performScan(): void {
    // Code simulé (dans la réalité, viendrait d'un scanner physique ou caméra)
    const scannedCode = this.generateRandomBarcode();

    // Recherche du produit dans la base de données
    const drinks = this.dataService.getDrinks();
    const foundDrink = drinks.find(d => d.id === scannedCode);

    this.isScanActive = false;  // Arrête l'animation

    if (foundDrink) {
      // Produit trouvé
      this.scanResult = {
        code: scannedCode,
        drinkId: foundDrink.id,
        drinkName: foundDrink.name,
        category: foundDrink.category,
        price: foundDrink.price,
        stock: foundDrink.stock,
        icon: foundDrink.icon,
        found: true,
        timestamp: new Date()
      };

      // Ajoute à l'historique
      this.addToHistory(this.scanResult);
      this.stats.successfulScans++;
    } else {
      // Produit non trouvé
      this.scanResult = {
        code: scannedCode,
        found: false,
        timestamp: new Date()
      };

      this.scanError = 'Produit non trouvé dans la base de données';
      this.stats.failedScans++;
    }

    this.stats.totalScans++;
    this.stats.todayScans++;
  }

  /**
   * Génère un code-barre aléatoire (simulation)
   * Dans un cas réel, le code viendrait du scanner
   */
  private generateRandomBarcode(): string {
    const drinks = this.dataService.getDrinks();
    if (drinks.length > 0) {
      // 70% de chance de trouver un produit existant
      if (Math.random() > 0.3) {
        const randomDrink = drinks[Math.floor(Math.random() * drinks.length)];
        return randomDrink.id;
      }
    }
    // Génère un code inexistant
    return 'NOTFOUND_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Réinitialise le scan pour en faire un nouveau
   */
  resetScan(): void {
    this.scanResult = null;
    this.scanError = '';
    this.isScanActive = false;
  }

  /**
   * Ajoute le produit scanné au stock
   */
  addToStock(): void {
    if (this.scanResult && this.scanResult.found) {
      // Redirige vers la page d'entrées avec le produit pré-sélectionné
      this.router.navigate(['/entries'], {
        queryParams: { drinkId: this.scanResult.drinkId }
      });
    }
  }

  /**
   * Affiche les détails du produit scanné
   */
  viewDetails(): void {
    if (this.scanResult && this.scanResult.found) {
      this.router.navigate(['/drinks']);
    }
  }

  /**
   * Modifie les informations du produit
   */
  editProduct(): void {
    if (this.scanResult && this.scanResult.found) {
      this.router.navigate(['/drinks']);
    }
  }

  /**
   * Ajoute un scan à l'historique
   */
  private addToHistory(scan: any): void {
    this.scanHistory.unshift(scan);  // Ajoute au début
    // Garde seulement les 10 derniers
    if (this.scanHistory.length > 10) {
      this.scanHistory = this.scanHistory.slice(0, 10);
    }
  }

  /**
   * Charge l'historique des scans (depuis localStorage par exemple)
   */
  private loadScanHistory(): void {
    const saved = localStorage.getItem('scanHistory');
    if (saved) {
      this.scanHistory = JSON.parse(saved);
    }
  }

  /**
   * Calcule les statistiques
   */
  private calculateStats(): void {
    this.stats.totalScans = this.scanHistory.length;
    this.stats.successfulScans = this.scanHistory.filter(s => s.found).length;
    this.stats.failedScans = this.scanHistory.filter(s => !s.found).length;

    // Scans d'aujourd'hui
    const today = new Date().toDateString();
    this.stats.todayScans = this.scanHistory.filter(s =>
      new Date(s.timestamp).toDateString() === today
    ).length;
  }

  /**
   * Formate un nombre avec séparateurs
   */
  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  /**
   * Formate une date
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    });
  }
}
