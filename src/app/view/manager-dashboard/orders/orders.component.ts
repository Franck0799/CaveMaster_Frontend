// ========================================
// ===== ORDERS COMPONENT =====
// ========================================

// orders.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Order {
  id: string;
  status: 'paye' | 'en-cours' | 'termine';
  statusText: string;
  client: string;
  date: string;
  produits: string;
  total: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  currentOrderFilter: string = 'all';

  ordersData: Order[] = [
    {
      id: '#CMD-2045',
      status: 'paye',
      statusText: 'Payé',
      client: 'Koffi Mensah',
      date: '07/10/2025 13:45',
      produits: '3x Dom Pérignon, 2x Hennessy VSOP',
      total: '185 000 FCFA'
    },
    {
      id: '#CMD-2044',
      status: 'en-cours',
      statusText: 'En cours',
      client: 'Aminata Diallo',
      date: '07/10/2025 13:30',
      produits: '5x Château Margaux, 10x Heineken',
      total: '140 000 FCFA'
    },
    {
      id: '#CMD-2043',
      status: 'termine',
      statusText: 'Terminé',
      client: 'Ibrahim Cisse',
      date: '07/10/2025 12:15',
      produits: '2x Moët & Chandon, 1x Whisky Premium',
      total: '75 000 FCFA'
    },
    {
      id: '#CMD-2042',
      status: 'paye',
      statusText: 'Payé',
      client: 'Fatou Ndiaye',
      date: '07/10/2025 11:50',
      produits: '20x Red Bull, 15x Bières locales',
      total: '28 500 FCFA'
    },
    {
      id: '#CMD-2041',
      status: 'en-cours',
      statusText: 'En cours',
      client: 'Moussa Traore',
      date: '07/10/2025 11:20',
      produits: '8x Vin Rouge, 5x Vin Blanc',
      total: '195 000 FCFA'
    },
    {
      id: '#CMD-2040',
      status: 'termine',
      statusText: 'Terminé',
      client: 'Aisha Bamba',
      date: '07/10/2025 10:45',
      produits: '1x Dom Pérignon, 2x Champagne Rosé',
      total: '98 000 FCFA'
    },
    {
      id: '#CMD-2039',
      status: 'paye',
      statusText: 'Payé',
      client: 'Sekou Keita',
      date: '07/10/2025 10:10',
      produits: '6x Hennessy VSOP, 3x Whisky',
      total: '250 000 FCFA'
    },
    {
      id: '#CMD-2038',
      status: 'en-cours',
      statusText: 'En cours',
      client: 'Mariam Sow',
      date: '07/10/2025 09:30',
      produits: '4x Moët & Chandon, 2x Vin Mousseux',
      total: '112 000 FCFA'
    }
  ];

  ngOnInit(): void {
    console.log('Orders page loaded');
  }

  filterOrders(filter: string): void {
    this.currentOrderFilter = filter;
  }

  get filteredOrders(): Order[] {
    if (this.currentOrderFilter === 'all') {
      return this.ordersData;
    }
    return this.ordersData.filter(order => order.status === this.currentOrderFilter);
  }

  getOrderCount(status: string): number {
    if (status === 'all') {
      return this.ordersData.length;
    }
    return this.ordersData.filter(order => order.status === status).length;
  }
}

