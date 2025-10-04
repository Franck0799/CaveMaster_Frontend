import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
interface Stat {
  icon: string;
  label: string;
  value: string;
  color: string;
}

interface Table {
  id: number;
  guests: number;
  status: 'occupied' | 'available' | 'reserved';
  order: string | null;
  total: string | null;
  time: string | null;
}

interface Order {
  id: string;
  table: number;
  items: string[];
  status: string;
  total: string;
}

interface Wine {
  name: string;
  type: string;
  region: string;
  price: string;
  stock: number;
}

@Component({
  selector: 'app-waitress-dashboard',
    standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './waitress-dashboard.component.html',
  styleUrls: ['./waitress-dashboard.component.scss']
})
export class WaitressDashboardComponent implements OnInit {
  activeTab: string = 'tables';

  stats: Stat[] = [
    { icon: 'coffee', label: 'Tables actives', value: '4', color: 'bg-blue-100 text-blue-600' },
    { icon: 'shopping-cart', label: 'Commandes du jour', value: '12', color: 'bg-green-100 text-green-600' },
    { icon: 'euro', label: 'CA réalisé', value: '1,840€', color: 'bg-purple-100 text-purple-600' },
    { icon: 'clock', label: 'Temps moyen', value: '52min', color: 'bg-orange-100 text-orange-600' }
  ];

  tables: Table[] = [
    { id: 5, guests: 4, status: 'occupied', order: 'En cours', total: '245€', time: '45min' },
    { id: 12, guests: 2, status: 'occupied', order: 'Servie', total: '180€', time: '1h20' },
    { id: 3, guests: 6, status: 'occupied', order: 'Commande', total: '420€', time: '25min' },
    { id: 8, guests: 2, status: 'occupied', order: 'Payée', total: '95€', time: '2h10' },
    { id: 15, guests: 0, status: 'available', order: null, total: null, time: null },
    { id: 7, guests: 0, status: 'available', order: null, total: null, time: null },
    { id: 20, guests: 4, status: 'reserved', order: null, total: null, time: '19h00' },
    { id: 11, guests: 0, status: 'available', order: null, total: null, time: null }
  ];

  myOrders: Order[] = [
    {
      id: '#CMD-2156',
      table: 5,
      items: ['Château Margaux 2015', 'Bourgogne Blanc', 'Assortiment fromages'],
      status: 'En préparation',
      total: '245€'
    },
    {
      id: '#CMD-2158',
      table: 3,
      items: ['Champagne Veuve Clicquot x2', 'Côtes du Rhône', 'Plateau charcuterie', 'Desserts x3'],
      status: 'Prête',
      total: '420€'
    }
  ];

  wines: Wine[] = [
    { name: 'Château Margaux 2015', type: 'Rouge', region: 'Bordeaux', price: '125€', stock: 12 },
    { name: 'Bourgogne Blanc', type: 'Blanc', region: 'Bourgogne', price: '45€', stock: 24 },
    { name: 'Champagne Veuve Clicquot', type: 'Champagne', region: 'Champagne', price: '85€', stock: 18 },
    { name: 'Côtes du Rhône', type: 'Rouge', region: 'Rhône', price: '35€', stock: 45 },
    { name: 'Sancerre Blanc', type: 'Blanc', region: 'Loire', price: '38€', stock: 28 }
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialisation du composant
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getTableColor(status: string): string {
    switch(status) {
      case 'occupied': return 'bg-blue-500 border-blue-600';
      case 'available': return 'bg-green-500 border-green-600';
      case 'reserved': return 'bg-orange-500 border-orange-600';
      default: return 'bg-gray-500';
    }
  }

  getStatusLabel(status: string): string {
    switch(status) {
      case 'occupied': return 'Occupée';
      case 'available': return 'Disponible';
      case 'reserved': return 'Réservée';
      default: return '';
    }
  }

  getOrderStatusClass(status: string): string {
    if (status === 'En préparation') return 'bg-orange-100 text-orange-700';
    if (status === 'Prête') return 'bg-green-100 text-green-700';
    return 'bg-blue-100 text-blue-700';
  }
}
