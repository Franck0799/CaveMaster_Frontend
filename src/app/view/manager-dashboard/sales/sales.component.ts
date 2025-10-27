// ===== sales.component.ts =====
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface VenteProduit {
  nom: string;
  quantite: number;
  ca: number;
  evolution: number;
}

interface VenteParPeriode {
  jour: string;
  montant: number;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  selectedPeriode: string = 'jour';
  selectedCave: string = 'all';

  ventesStats = {
    caJour: 850000,
    caObjectif: 1000000,
    nombreVentes: 34,
    panierMoyen: 25000,
    tauxConversion: 78,
    evolutionCA: 12
  };

  topProduits: VenteProduit[] = [
    { nom: 'Hennessy VSOP', quantite: 45, ca: 1260000, evolution: 15 },
    { nom: 'Dom Pérignon', quantite: 32, ca: 1440000, evolution: 8 },
    { nom: 'Moët & Chandon', quantite: 28, ca: 980000, evolution: -5 },
    { nom: 'Heineken', quantite: 250, ca: 200000, evolution: 22 },
    { nom: 'Château Margaux', quantite: 18, ca: 324000, evolution: 3 }
  ];

  ventesParJour: VenteParPeriode[] = [
    { jour: 'Lun', montant: 720000 },
    { jour: 'Mar', montant: 850000 },
    { jour: 'Mer', montant: 680000 },
    { jour: 'Jeu', montant: 920000 },
    { jour: 'Ven', montant: 1150000 },
    { jour: 'Sam', montant: 1380000 },
    { jour: 'Dim', montant: 950000 }
  ];

  ngOnInit(): void {
    this.loadSalesData();
  }

  loadSalesData(): void {
    console.log('Loading sales data...');
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  }

  getProgressPercent(): number {
    return (this.ventesStats.caJour / this.ventesStats.caObjectif) * 100;
  }

  getMaxVente(): number {
    return Math.max(...this.ventesParJour.map(v => v.montant));
  }

  getBarHeight(montant: number): number {
    return (montant / this.getMaxVente()) * 100;
  }
}
