import { Component, OnInit } from '@angular/core';

interface Transaction {
  id: string;
  type: 'vente' | 'remboursement' | 'ouverture' | 'fermeture';
  typeText: string;
  montant: number;
  moyenPaiement: 'especes' | 'carte' | 'mobile';
  moyenPaiementText: string;
  date: string;
  heure: string;
  client?: string;
  reference?: string;
  details: string;
  caissier: string;
}

@Component({
  selector: 'app-caisse',
  templateUrl: './caisse.component.html',
  styleUrls: ['./caisse.component.scss']
})
export class CaisseComponent implements OnInit {
  selectedDate: string = '2025-10-26';
  currentCaisseFilter: 'all' | 'vente' | 'remboursement' | 'ouverture' | 'fermeture' = 'all';

  transactions: Transaction[] = [
    {
      id: 'TRX-001',
      type: 'ouverture',
      typeText: 'Ouverture de caisse',
      montant: 50000,
      moyenPaiement: 'especes',
      moyenPaiementText: 'Espèces',
      date: '26/10/2025',
      heure: '08:00',
      details: 'Ouverture de caisse - Fond de caisse initial',
      caissier: 'Jean Kouassi',
      reference: 'OUV-001'
    },
    {
      id: 'TRX-002',
      type: 'vente',
      typeText: 'Vente',
      montant: 125000,
      moyenPaiement: 'carte',
      moyenPaiementText: 'Carte bancaire',
      date: '26/10/2025',
      heure: '14:30',
      client: 'Jean Kouassi',
      details: 'Commande CMD-1234 - 2x Hennessy VSOP, 1x Dom Pérignon',
      caissier: 'Marie Diop',
      reference: 'CMD-1234'
    },
    {
      id: 'TRX-003',
      type: 'vente',
      typeText: 'Vente',
      montant: 85000,
      moyenPaiement: 'especes',
      moyenPaiementText: 'Espèces',
      date: '26/10/2025',
      heure: '14:15',
      client: 'Ama Mensah',
      details: 'Commande CMD-1235 - 5x Heineken, 2x Moët & Chandon',
      caissier: 'Jean Kouadio',
      reference: 'CMD-1235'
    },
    {
      id: 'TRX-004',
      type: 'vente',
      typeText: 'Vente',
      montant: 105000,
      moyenPaiement: 'mobile',
      moyenPaiementText: 'Paiement mobile',
      date: '26/10/2025',
      heure: '14:00',
      client: 'Client en ligne #456',
      details: 'Commande CMD-1236 - 3x Château Margaux',
      caissier: 'Fatou Traoré',
      reference: 'CMD-1236'
    },
    {
      id: 'TRX-005',
      type: 'vente',
      typeText: 'Vente',
      montant: 45000,
      moyenPaiement: 'especes',
      moyenPaiementText: 'Espèces',
      date: '26/10/2025',
      heure: '13:45',
      client: 'Kofi Mensah',
      details: 'Commande CMD-1237 - 10x Heineken, 5x Vin Rouge',
      caissier: 'Marie Diop',
      reference: 'CMD-1237'
    },
    {
      id: 'TRX-006',
      type: 'vente',
      typeText: 'Vente',
      montant: 198000,
      moyenPaiement: 'carte',
      moyenPaiementText: 'Carte bancaire',
      date: '26/10/2025',
      heure: '13:30',
      client: 'Aissatou Diallo',
      details: 'Commande CMD-1238 - 1x Dom Pérignon Rosé, 3x Champagne',
      caissier: 'Jean Kouadio',
      reference: 'CMD-1238'
    },
    {
      id: 'TRX-007',
      type: 'remboursement',
      typeText: 'Remboursement',
      montant: -15000,
      moyenPaiement: 'carte',
      moyenPaiementText: 'Carte bancaire',
      date: '26/10/2025',
      heure: '13:00',
      client: 'Yao Koffi',
      details: 'Remboursement commande CMD-1220 - Article défectueux',
      caissier: 'Jean Kouassi',
      reference: 'RMB-001'
    },
    {
      id: 'TRX-008',
      type: 'vente',
      typeText: 'Vente',
      montant: 28000,
      moyenPaiement: 'mobile',
      moyenPaiementText: 'Paiement mobile',
      date: '26/10/2025',
      heure: '12:45',
      client: 'Ibrahim Touré',
      details: 'Commande CMD-1239 - 6x Bière locale, 2x Vodka',
      caissier: 'Koffi Yao',
      reference: 'CMD-1239'
    },
    {
      id: 'TRX-009',
      type: 'vente',
      typeText: 'Vente',
      montant: 76000,
      moyenPaiement: 'carte',
      moyenPaiementText: 'Carte bancaire',
      date: '26/10/2025',
      heure: '12:30',
      client: 'Client à emporter #789',
      details: 'Commande CMD-1240 - 4x Whisky Jack Daniels',
      caissier: 'Aminata Soro',
      reference: 'CMD-1240'
    },
    {
      id: 'TRX-010',
      type: 'vente',
      typeText: 'Vente',
      montant: 52000,
      moyenPaiement: 'especes',
      moyenPaiementText: 'Espèces',
      date: '26/10/2025',
      heure: '12:15',
      client: 'Marie Koné',
      details: 'Commande CMD-1241 - 8x Guinness, 3x Vin Blanc',
      caissier: 'Marie Diop',
      reference: 'CMD-1241'
    },
    {
      id: 'TRX-011',
      type: 'vente',
      typeText: 'Vente',
      montant: 92000,
      moyenPaiement: 'mobile',
      moyenPaiementText: 'Paiement mobile',
      date: '26/10/2025',
      heure: '11:45',
      client: 'Kwame Asante',
      details: 'Commande CMD-1242 - 2x Hennessy XO, 3x Heineken',
      caissier: 'Jean Kouadio',
      reference: 'CMD-1242'
    }
  ];

  ngOnInit(): void {
    // Initialiser avec la date du jour
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
  }

  get filteredTransactions(): Transaction[] {
    if (this.currentCaisseFilter === 'all') {
      return this.transactions;
    }
    return this.transactions.filter(t => t.type === this.currentCaisseFilter);
  }

  get totalCaisse(): number {
    return this.transactions
      .filter(t => t.type !== 'ouverture' && t.type !== 'fermeture')
      .reduce((sum, t) => sum + t.montant, 0);
  }

  getTotalByPaymentMethod(method: 'especes' | 'carte' | 'mobile'): number {
    return this.transactions
      .filter(t => t.moyenPaiement === method && t.type !== 'ouverture' && t.type !== 'fermeture')
      .reduce((sum, t) => sum + t.montant, 0);
  }

  getCaisseCount(filter: string): number {
    if (filter === 'all') return this.transactions.length;
    return this.transactions.filter(t => t.type === filter).length;
  }

  filterCaisse(filter: 'all' | 'vente' | 'remboursement' | 'ouverture' | 'fermeture'): void {
    this.currentCaisseFilter = filter;
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(montant);
  }
}
