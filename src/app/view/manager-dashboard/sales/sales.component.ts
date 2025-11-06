// SALES COMPONENT (Historique des ventes)
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


interface Sale {
  id: string;
  date: Date;
  server: string;
  tableNumber: string;
  items: number;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'mixed';
  tip?: number;
}

interface SalesStats {
  totalSales: number;
  totalOrders: number;
  averageTicket: number;
  cashSales: number;
  cardSales: number;
}

@Component({
  selector: 'app-sales',
  standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: `./sales.component.html`,
  styleUrls: [`./sales.component.scss`]
})
export class SalesComponent implements OnInit {
  selectedPeriod = 'today';

  stats: SalesStats = {
    totalSales: 8450,
    totalOrders: 156,
    averageTicket: 54.17,
    cashSales: 3240,
    cardSales: 5210
  };

  sales: Sale[] = [
    {
      id: 'VNT001',
      date: new Date('2025-01-06T14:30:00'),
      server: 'Marie M.',
      tableNumber: 'T12',
      items: 3,
      amount: 506,
      paymentMethod: 'card',
      tip: 20
    },
    {
      id: 'VNT002',
      date: new Date('2025-01-06T14:15:00'),
      server: 'Pierre D.',
      tableNumber: 'T05',
      items: 2,
      amount: 275,
      paymentMethod: 'cash'
    },
    {
      id: 'VNT003',
      date: new Date('2025-01-06T13:45:00'),
      server: 'Sophie L.',
      tableNumber: 'T08',
      items: 2,
      amount: 130,
      paymentMethod: 'card',
      tip: 10
    },
    {
      id: 'VNT004',
      date: new Date('2025-01-06T13:30:00'),
      server: 'Marie M.',
      tableNumber: 'T15',
      items: 4,
      amount: 171,
      paymentMethod: 'mixed'
    },
    {
      id: 'VNT005',
      date: new Date('2025-01-06T13:00:00'),
      server: 'Thomas B.',
      tableNumber: 'T03',
      items: 5,
      amount: 425,
      paymentMethod: 'card',
      tip: 25
    },
    {
      id: 'VNT006',
      date: new Date('2025-01-06T12:45:00'),
      server: 'Pierre D.',
      tableNumber: 'T10',
      items: 3,
      amount: 198,
      paymentMethod: 'cash'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    console.log('Chargement des ventes:', this.selectedPeriod);
    // TODO: Appel API
  }

  getCashPercentage(): number {
    return Math.round((this.stats.cashSales / this.stats.totalSales) * 100);
  }

  getCardPercentage(): number {
    return Math.round((this.stats.cardSales / this.stats.totalSales) * 100);
  }

  getSalesByServer(): Array<{name: string, amount: number}> {
    const serverSales = new Map<string, number>();

    this.sales.forEach(sale => {
      const current = serverSales.get(sale.server) || 0;
      serverSales.set(sale.server, current + sale.amount);
    });

    return Array.from(serverSales.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }

  getPaymentLabel(method: string): string {
    const labels: { [key: string]: string } = {
      'cash': '💵 Espèces',
      'card': '💳 Carte',
      'mixed': '💰 Mixte'
    };
    return labels[method] || method;
  }

  viewSale(sale: Sale): void {
    console.log('Voir vente:', sale);
  }

  printReceipt(sale: Sale): void {
    console.log('Imprimer reçu:', sale.id);
  }

  exportSales(): void {
    console.log('Exporter les ventes');
  }
}
