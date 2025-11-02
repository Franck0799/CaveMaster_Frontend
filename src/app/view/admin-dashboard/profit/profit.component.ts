// ============================================
// profit-dashboard.component.ts
// ============================================

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface StockData {
  cave: string;
  categorie: string;
  stockInitial: number;
  stockActuel: number;
  vendues: number;
  prixAchat: number;
  prixVente: number;
}

interface BeneficeCalcule {
  categorie: string;
  quantiteVendue: number;
  chiffreAffaires: number;
  coutAchat: number;
  benefice: number;
  margePercent: number;
}

interface Cave {
  id: string;
  nom: string;
}

@Component({
  selector: 'app-profit',
   standalone: true,
  // Import des modules nécessaires
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profit.component.html',
  styleUrls: ['./profit.component.scss']
})
export class ProfitComponent implements OnInit {
  caveControl = new FormControl('toutes');
  periodeControl = new FormControl('mois');
  categorieControl = new FormControl('toutes');

  caves: Cave[] = [
    { id: 'cave1', nom: 'Cave Principale' },
    { id: 'cave2', nom: 'Cave Secondaire' },
    { id: 'cave3', nom: 'Cave Restaurant' }
  ];

  categories: string[] = [
    'Bières',
    'Champagnes',
    'Vins Rouges',
    'Vins Blancs',
    'Vins Rosés',
    'Spiritueux',
    'Mets'
  ];

  periodes = [
    { value: 'semaine', label: 'Semaine' },
    { value: 'mois', label: 'Mois' },
    { value: 'annee', label: 'Année' }
  ];

  stockData: StockData[] = [
    { cave: 'Cave Principale', categorie: 'Bières', stockInitial: 500, stockActuel: 320, vendues: 180, prixAchat: 2.5, prixVente: 5 },
    { cave: 'Cave Principale', categorie: 'Champagnes', stockInitial: 200, stockActuel: 145, vendues: 55, prixAchat: 25, prixVente: 60 },
    { cave: 'Cave Principale', categorie: 'Vins Rouges', stockInitial: 350, stockActuel: 210, vendues: 140, prixAchat: 15, prixVente: 35 },
    { cave: 'Cave Principale', categorie: 'Vins Blancs', stockInitial: 300, stockActuel: 195, vendues: 105, prixAchat: 12, prixVente: 30 },
    { cave: 'Cave Principale', categorie: 'Spiritueux', stockInitial: 150, stockActuel: 98, vendues: 52, prixAchat: 20, prixVente: 45 },
    { cave: 'Cave Principale', categorie: 'Mets', stockInitial: 400, stockActuel: 275, vendues: 125, prixAchat: 8, prixVente: 18 },
    { cave: 'Cave Secondaire', categorie: 'Bières', stockInitial: 300, stockActuel: 210, vendues: 90, prixAchat: 2.5, prixVente: 5 },
    { cave: 'Cave Secondaire', categorie: 'Vins Rouges', stockInitial: 250, stockActuel: 180, vendues: 70, prixAchat: 15, prixVente: 35 },
    { cave: 'Cave Restaurant', categorie: 'Mets', stockInitial: 600, stockActuel: 380, vendues: 220, prixAchat: 8, prixVente: 18 }
  ];

  beneficesCalcules: BeneficeCalcule[] = [];
  totalBenefice: number = 0;
  totalCA: number = 0;
  totalVentes: number = 0;
  stockTotal: number = 0;

  ngOnInit(): void {
    this.calculerBenefices();

    this.caveControl.valueChanges.subscribe(() => this.calculerBenefices());
    this.periodeControl.valueChanges.subscribe(() => this.calculerBenefices());
    this.categorieControl.valueChanges.subscribe(() => this.calculerBenefices());
  }

  calculerBenefices(): void {
    let dataFiltrees = this.stockData;

    if (this.caveControl.value !== 'toutes') {
      const caveSelectionnee = this.caves.find(c => c.id === this.caveControl.value);
      if (caveSelectionnee) {
        dataFiltrees = dataFiltrees.filter(d => d.cave === caveSelectionnee.nom);
      }
    }

    if (this.categorieControl.value !== 'toutes') {
      dataFiltrees = dataFiltrees.filter(d => d.categorie === this.categorieControl.value);
    }

    const beneficesParCategorie = new Map<string, BeneficeCalcule>();

    dataFiltrees.forEach(item => {
      const existing = beneficesParCategorie.get(item.categorie);

      const ca = item.vendues * item.prixVente;
      const cout = item.vendues * item.prixAchat;
      const benefice = ca - cout;
      const marge = ca > 0 ? (benefice / ca) * 100 : 0;

      if (existing) {
        existing.quantiteVendue += item.vendues;
        existing.chiffreAffaires += ca;
        existing.coutAchat += cout;
        existing.benefice += benefice;
        existing.margePercent = existing.chiffreAffaires > 0
          ? (existing.benefice / existing.chiffreAffaires) * 100
          : 0;
      } else {
        beneficesParCategorie.set(item.categorie, {
          categorie: item.categorie,
          quantiteVendue: item.vendues,
          chiffreAffaires: ca,
          coutAchat: cout,
          benefice: benefice,
          margePercent: marge
        });
      }
    });

    this.beneficesCalcules = Array.from(beneficesParCategorie.values())
      .sort((a, b) => b.benefice - a.benefice);

    this.totalBenefice = this.beneficesCalcules.reduce((sum, item) => sum + item.benefice, 0);
    this.totalCA = this.beneficesCalcules.reduce((sum, item) => sum + item.chiffreAffaires, 0);
    this.totalVentes = this.beneficesCalcules.reduce((sum, item) => sum + item.quantiteVendue, 0);
    this.stockTotal = dataFiltrees.reduce((sum, item) => sum + item.stockActuel, 0);
  }

  getStockParCategorie(): { categorie: string, quantite: number }[] {
    let dataFiltrees = this.stockData;

    if (this.caveControl.value !== 'toutes') {
      const caveSelectionnee = this.caves.find(c => c.id === this.caveControl.value);
      if (caveSelectionnee) {
        dataFiltrees = dataFiltrees.filter(d => d.cave === caveSelectionnee.nom);
      }
    }

    const stockParCategorie = new Map<string, number>();

    dataFiltrees.forEach(item => {
      const existing = stockParCategorie.get(item.categorie) || 0;
      stockParCategorie.set(item.categorie, existing + item.stockActuel);
    });

    return Array.from(stockParCategorie.entries())
      .map(([categorie, quantite]) => ({ categorie, quantite }))
      .sort((a, b) => b.quantite - a.quantite);
  }

  exporterDonnees(): void {
    const csvContent = this.genererCSV();
    this.telechargerFichier(csvContent, 'benefices-stocks.csv');
  }

  private genererCSV(): string {
    const headers = ['Catégorie', 'Quantité Vendue', 'CA (FR)', 'Coût Achat (FR)', 'Bénéfice (FR)', 'Marge (%)'];
    const rows = this.beneficesCalcules.map(b => [
      b.categorie,
      b.quantiteVendue,
      b.chiffreAffaires.toFixed(2),
      b.coutAchat.toFixed(2),
      b.benefice.toFixed(2),
      b.margePercent.toFixed(2)
    ]);

    return [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
  }

  private telechargerFichier(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  getCouleurCategorie(index: number): string {
    const couleurs = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#6366f1'];
    return couleurs[index % couleurs.length];
  }

  calculerBeneficeParCave(caveNom: string): number {
    const dataParCave = this.stockData.filter(d => d.cave === caveNom);
    return dataParCave.reduce((sum, item) => {
      const benefice = (item.vendues * item.prixVente) - (item.vendues * item.prixAchat);
      return sum + benefice;
    }, 0);
  }

  calculerStockParCave(caveNom: string): number {
    const dataParCave = this.stockData.filter(d => d.cave === caveNom);
    return dataParCave.reduce((sum, item) => sum + item.stockActuel, 0);
  }
}
