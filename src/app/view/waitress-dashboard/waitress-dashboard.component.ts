// ===== IMPORTS =====
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ===== INTERFACES =====
interface Stat {
  icon: string;
  label: string;
  value: string;
  color: string;
}

interface Table {
  number: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  guests: number;
  statusText: string;
  color: string;
}

interface OrderItem {
  name: string;
  price: number;
}

interface Order {
  table: number;
  status: 'new' | 'preparing' | 'ready';
  statusText: string;
  time: string;
  items: OrderItem[];
  total: number;
}

interface MenuItem {
  id: number;
  name: string;
  category: 'champagne' | 'vin' | 'biere' | 'spiritueux' | 'soft';
  icon: string;
  desc: string;
  price: number;
}

interface Tip {
  date: string;
  table: number;
  amount: number;
  details: string;
}

interface HistorySale {
  time: string;
  table: number;
  amount: number;
  items: number;
  status: string;
}

@Component({
  selector: 'app-waitress-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './waitress-dashboard.component.html',
  styleUrls: ['./waitress-dashboard.component.scss']
})
export class WaitressDashboardComponent implements OnInit {

  // ===== PROPRIÉTÉS =====
  activeTab: string = 'orders';
  availabilityStatus: string = 'en-service';
  availabilityIcon: string = '🟢';
  availabilityText: string = 'En service';
  availabilityMenuOpen: boolean = false;
  statusMenuOpen: boolean = false;
  selectedTable: string = '';
  guestCount: number = 2;
  orderItems: MenuItem[] = [];
  orderTotal: number = 0;
  activeMenuCategory: string = 'all';
  activeHistoryPeriod: string = 'today';

  stats: Stat[] = [
    { icon: '⏰', label: 'Heure de début', value: '08:00', color: '' },
    { icon: '⏱️', label: 'Temps écoulé', value: '4h 30m', color: '' },
    { icon: '📦', label: 'Commandes servies', value: '18', color: '' },
    { icon: '💰', label: 'Pourboires', value: '12 500 F', color: '' }
  ];

  tables: Table[] = [
    { number: 1, status: 'available', guests: 0, statusText: 'Libre', color: '#22c55e' },
    { number: 2, status: 'available', guests: 0, statusText: 'Libre', color: '#22c55e' },
    { number: 3, status: 'occupied', guests: 4, statusText: 'Occupée', color: '#ef4444' },
    { number: 4, status: 'available', guests: 0, statusText: 'Libre', color: '#22c55e' },
    { number: 5, status: 'occupied', guests: 2, statusText: 'Occupée', color: '#ef4444' },
    { number: 6, status: 'reserved', guests: 0, statusText: 'Réservée', color: '#f59e0b' },
    { number: 7, status: 'occupied', guests: 6, statusText: 'Occupée', color: '#ef4444' },
    { number: 8, status: 'occupied', guests: 3, statusText: 'Occupée', color: '#ef4444' },
    { number: 9, status: 'available', guests: 0, statusText: 'Libre', color: '#22c55e' },
    { number: 10, status: 'cleaning', guests: 0, statusText: 'Nettoyage', color: '#3b82f6' }
  ];

  orders: Order[] = [
    {
      table: 5,
      status: 'new',
      statusText: 'Nouvelle',
      time: '2 min',
      items: [
        { name: '2x Champagne Moët', price: 30000 },
        { name: '1x Heineken', price: 1500 }
      ],
      total: 31500
    },
    {
      table: 12,
      status: 'preparing',
      statusText: 'En préparation',
      time: '8 min',
      items: [
        { name: '3x Jack Daniel\'s', price: 36000 },
        { name: '2x Coca Cola', price: 1000 }
      ],
      total: 37000
    },
    {
      table: 8,
      status: 'ready',
      statusText: 'Prête',
      time: '1 min',
      items: [
        { name: '1x Château Margaux', price: 35000 },
        { name: '4x Verre à vin', price: 0 }
      ],
      total: 35000
    },
    {
      table: 3,
      status: 'new',
      statusText: 'Nouvelle',
      time: '1 min',
      items: [
        { name: '6x Heineken', price: 9000 },
        { name: '2x Red Bull', price: 3000 }
      ],
      total: 12000
    },
    {
      table: 15,
      status: 'preparing',
      statusText: 'En préparation',
      time: '5 min',
      items: [
        { name: '2x Grey Goose', price: 24000 },
        { name: '1x Jus d\'orange', price: 1500 }
      ],
      total: 25500
    },
    {
      table: 7,
      status: 'ready',
      statusText: 'Prête',
      time: '3 min',
      items: [
        { name: '4x Vin Rosé', price: 20000 },
        { name: '1x Plateau fromage', price: 5000 }
      ],
      total: 25000
    }
  ];

  menuItems: MenuItem[] = [
    { id: 1, name: 'Moët & Chandon', category: 'champagne', icon: '🥂', desc: 'Champagne prestige', price: 15000 },
    { id: 2, name: 'Dom Pérignon', category: 'champagne', icon: '🍾', desc: 'Champagne de luxe', price: 25000 },
    { id: 3, name: 'Château Margaux', category: 'vin', icon: '🍷', desc: 'Vin rouge premium', price: 35000 },
    { id: 4, name: 'Vin Blanc Sec', category: 'vin', icon: '🍾', desc: 'Vin blanc raffiné', price: 18000 },
    { id: 5, name: 'Vin Rosé', category: 'vin', icon: '🍷', desc: 'Rosé fruité', price: 12000 },
    { id: 6, name: 'Heineken', category: 'biere', icon: '🍺', desc: 'Bière blonde', price: 1500 },
    { id: 7, name: 'Guinness', category: 'biere', icon: '🍺', desc: 'Bière brune', price: 2000 },
    { id: 8, name: 'Jack Daniel\'s', category: 'spiritueux', icon: '🥃', desc: 'Whisky Tennessee', price: 12000 },
    { id: 9, name: 'Grey Goose', category: 'spiritueux', icon: '🍸', desc: 'Vodka premium', price: 14000 },
    { id: 10, name: 'Hennessy VSOP', category: 'spiritueux', icon: '🥃', desc: 'Cognac classique', price: 18000 },
    { id: 11, name: 'Coca Cola', category: 'soft', icon: '🥤', desc: 'Soda classique', price: 500 },
    { id: 12, name: 'Red Bull', category: 'soft', icon: '⚡', desc: 'Boisson énergisante', price: 1500 }
  ];

  tips: Tip[] = [
    { date: 'Aujourd\'hui 14:30', table: 5, amount: 5000, details: 'Table VIP - Excellent service' },
    { date: 'Aujourd\'hui 13:15', table: 12, amount: 3500, details: 'Groupe de 8 personnes' },
    { date: 'Aujourd\'hui 12:00', table: 3, amount: 2000, details: 'Couple satisfait' },
    { date: 'Aujourd\'hui 11:30', table: 8, amount: 2000, details: 'Déjeuner d\'affaires' },
    { date: 'Hier 19:45', table: 15, amount: 10000, details: 'Anniversaire - Service impeccable' },
    { date: 'Hier 18:20', table: 7, amount: 4000, details: 'Groupe d\'amis' }
  ];

  historySales: HistorySale[] = [
    { time: '14:45', table: 5, amount: 31500, items: 3, status: 'Payée' },
    { time: '14:20', table: 12, amount: 37000, items: 5, status: 'Payée' },
    { time: '13:55', table: 3, amount: 12000, items: 8, status: 'Payée' },
    { time: '13:30', table: 8, amount: 35000, items: 5, status: 'Payée' },
    { time: '12:45', table: 15, amount: 25500, items: 3, status: 'Payée' },
    { time: '12:10', table: 7, amount: 25000, items: 5, status: 'Payée' },
    { time: '11:30', table: 2, amount: 18000, items: 2, status: 'Payée' },
    { time: '11:00', table: 9, amount: 22000, items: 4, status: 'Payée' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.updateTimeElapsed();
    this.initializeAvailabilityOptions();

    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.availability-menu-container')) {
        this.availabilityMenuOpen = false;
      }
      if (!target.closest('.status-menu-container')) {
        this.statusMenuOpen = false;
      }
    });
  }

  private initializeAvailabilityOptions(): void {
    setTimeout(() => {
      const options = document.querySelectorAll('.availability-option');
      options.forEach(option => {
        option.addEventListener('click', () => {
          const status = option.getAttribute('data-status') || '';
          const icon = option.getAttribute('data-icon') || '';
          const text = option.getAttribute('data-text') || '';
          this.changeAvailability(status, icon, text);
        });
      });
    }, 0);
  }

  // Navigation
  navigateTo(page: string): void {
    this.activeTab = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  isActiveTab(tab: string): boolean {
    return this.activeTab === tab;
  }

  // Disponibilité
  toggleAvailabilityMenu(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.availabilityMenuOpen = !this.availabilityMenuOpen;
  }

  toggleStatusMenu(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.statusMenuOpen = !this.statusMenuOpen;
  }

  changeAvailability(status: string, icon: string, text: string): void {
    this.availabilityStatus = status;
    this.availabilityIcon = icon;
    this.availabilityText = text;
    this.availabilityMenuOpen = false;
    this.statusMenuOpen = false;
    this.showNotification(`✓ Votre statut a été changé en: ${text}`);

    if (status === 'pas-service') {
      setTimeout(() => {
        this.showNotification('⏰ N\'oubliez pas de clôturer votre caisse avant de partir !');
      }, 2000);
    }
    console.log('Nouveau statut:', status);
  }

  getAvailabilityBorderColor(): string {
    const colors: { [key: string]: string } = {
      'en-service': '#22c55e',
      'pause': '#f59e0b',
      'pas-service': '#94a3b8',
      'conge': '#3b82f6'
    };
    return colors[this.availabilityStatus] || '#22c55e';
  }

  getAvailabilityMenuStyle(): { [key: string]: string } {
    return {
      'display': this.availabilityMenuOpen ? 'block' : 'none',
      'position': 'absolute',
      'top': '110%',
      'right': '0',
      'background': 'var(--card)',
      'border': `2px solid ${this.getAvailabilityBorderColor()}`,
      'border-radius': '0.75rem',
      'padding': '0.5rem',
      'min-width': '220px',
      'box-shadow': '0 10px 30px rgba(0, 0, 0, 0.5)',
      'z-index': '1000'
    };
  }

  getAvailabilityButtonStyle(): { [key: string]: string } {
    return {
      'display': 'flex',
      'align-items': 'center',
      'gap': '0.5rem',
      'padding': '0.75rem 1.25rem',
      'background': 'var(--card)',
      'border': `2px solid ${this.getAvailabilityBorderColor()}`,
      'border-radius': '0.75rem',
      'color': 'var(--text)',
      'cursor': 'pointer',
      'transition': 'all 0.3s',
      'font-size': '0.95rem',
      'font-weight': '600'
    };
  }

  getStatusMenuStyle(): { [key: string]: string } {
    return {
      'display': this.statusMenuOpen ? 'block' : 'none',
      'position': 'absolute',
      'bottom': '80px',
      'right': '0',
      'background': 'var(--card)',
      'border': '1px solid var(--border)',
      'border-radius': '1rem',
      'padding': '1rem',
      'min-width': '200px',
      'box-shadow': '0 10px 30px rgba(0, 0, 0, 0.5)'
    };
  }

  // Commandes
  confirmOrder(tableNumber: number): void {
    const order = this.orders.find(o => o.table === tableNumber);
    if (order) {
      order.status = 'preparing';
      order.statusText = 'En préparation';
      this.showNotification(`✓ Commande de la Table #${tableNumber} confirmée !`);
      console.log('Commande confirmée:', order);
    }
  }

  cancelOrder(tableNumber: number): void {
    if (confirm(`Êtes-vous sûr de vouloir annuler la commande de la Table #${tableNumber} ?`)) {
      this.orders = this.orders.filter(o => o.table !== tableNumber);
      this.showNotification(`✕ Commande de la Table #${tableNumber} annulée`);
      console.log('Commande annulée pour table:', tableNumber);
    }
  }

  remindOrder(tableNumber: number): void {
    this.showNotification(`🔔 Rappel envoyé à la cuisine pour la Table #${tableNumber}`);
    console.log('Rappel envoyé pour table:', tableNumber);
  }

  serveOrder(tableNumber: number): void {
    this.orders = this.orders.filter(o => o.table !== tableNumber);
    const servedStat = this.stats.find(s => s.label === 'Commandes servies');
    if (servedStat) {
      const currentValue = parseInt(servedStat.value);
      servedStat.value = (currentValue + 1).toString();
    }
    this.showNotification(`✓ Commande de la Table #${tableNumber} servie avec succès !`);
    console.log('Commande servie pour table:', tableNumber);
  }

  getOrderStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'new': 'status-new',
      'preparing': 'status-preparing',
      'ready': 'status-ready'
    };
    return classes[status] || '';
  }

  // Menu
  get filteredMenuItems(): MenuItem[] {
    if (this.activeMenuCategory === 'all') {
      return this.menuItems;
    }
    return this.menuItems.filter(item => item.category === this.activeMenuCategory);
  }

  filterMenu(category: string): void {
    this.activeMenuCategory = category;
  }

  isActiveCategory(category: string): boolean {
    return this.activeMenuCategory === category;
  }

  addToOrder(itemId: number): void {
    const item = this.menuItems.find(i => i.id === itemId);
    if (item) {
      this.orderItems.push(item);
      this.calculateOrderTotal();
      this.updateOrderItemsList();
      this.showNotification(`✓ ${item.name} ajouté à la commande !`);
    }
  }

  removeFromOrder(index: number): void {
    this.orderItems.splice(index, 1);
    this.calculateOrderTotal();
    this.updateOrderItemsList();
  }

  calculateOrderTotal(): void {
    this.orderTotal = this.orderItems.reduce((sum, item) => sum + item.price, 0);
  }

  createOrder(): void {
    if (!this.selectedTable) {
      this.showNotification('⚠️ Veuillez sélectionner une table');
      return;
    }

    if (this.orderItems.length === 0) {
      this.showNotification('⚠️ Veuillez ajouter au moins un produit');
      return;
    }

    const newOrder: Order = {
      table: parseInt(this.selectedTable),
      status: 'new',
      statusText: 'Nouvelle',
      time: '0 min',
      items: this.orderItems.map(item => ({
        name: item.name,
        price: item.price
      })),
      total: this.orderTotal
    };

    this.orders.push(newOrder);
    this.selectedTable = '';
    this.guestCount = 2;
    this.orderItems = [];
    this.orderTotal = 0;
    this.showNotification(`✓ Nouvelle commande créée pour la Table #${newOrder.table}`);
    this.navigateTo('orders');
    console.log('Nouvelle commande créée:', newOrder);
  }

  // Tables
  getTableCardStyle(status: string): { [key: string]: string } {
    const colorMap: { [key: string]: string } = {
      'available': '#22c55e',
      'occupied': '#ef4444',
      'reserved': '#f59e0b',
      'cleaning': '#3b82f6'
    };
    const color = colorMap[status] || '#94a3b8';

    return {
      'background': 'var(--card)',
      'border': `2px solid ${color}`,
      'border-radius': '1rem',
      'padding': '1.5rem',
      'text-align': 'center',
      'transition': 'all 0.3s',
      'cursor': 'pointer'
    };
  }

  updateOrderItemsList(): void {
    setTimeout(() => {
      const listElement = document.getElementById('orderItemsList');
      if (listElement) {
        listElement.innerHTML = this.getOrderItemsListHTML();
      }
      const totalElement = document.getElementById('orderTotal');
      if (totalElement) {
        totalElement.textContent = this.formatCurrency(this.orderTotal);
      }
    }, 0);
  }

  getOrderItemsListHTML(): string {
    if (this.orderItems.length === 0) {
      return '<p style="color: var(--text-muted); text-align: center;">Aucun produit ajouté</p>';
    }
    return this.orderItems.map((item, index) =>
      `<div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--card); border-radius: 0.5rem; margin-bottom: 0.5rem;">
        <div>
          <div style="font-weight: 600;">${item.name}</div>
          <div style="color: var(--text-muted); font-size: 0.85rem;">${this.formatCurrency(item.price)}</div>
        </div>
        <button onclick="window.dispatchEvent(new CustomEvent('removeItem', {detail: ${index}}))" style="background: var(--danger); color: white; border: none; padding: 0.5rem; border-radius: 0.375rem; cursor: pointer;">
          ✕
        </button>
      </div>`
    ).join('');
  }

  // Historique
  get filteredHistory(): HistorySale[] {
    return this.historySales;
  }

  filterHistory(period: string): void {
    this.activeHistoryPeriod = period;
  }

  isActivePeriod(period: string): boolean {
    return this.activeHistoryPeriod === period;
  }

  get historyTotal(): string {
    const total = this.historySales.reduce((sum, sale) => sum + sale.amount, 0);
    return total.toLocaleString() + ' F';
  }

  get historyOrdersCount(): number {
    return this.historySales.length;
  }

  get historyAverage(): string {
    if (this.historySales.length === 0) return '0 F';
    const avg = this.historySales.reduce((sum, sale) => sum + sale.amount, 0) / this.historySales.length;
    return Math.round(avg).toLocaleString() + ' F';
  }

  // Utilitaires
  showNotification(message: string): void {
    alert(message);
    console.log('Notification:', message);
  }

  updateTimeElapsed(): void {
    const startTime = new Date();
    startTime.setHours(8, 0, 0);

    setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const timeStat = this.stats.find(s => s.label === 'Temps écoulé');
      if (timeStat) {
        timeStat.value = `${hours}h ${minutes}m`;
      }
    }, 60000);
  }

  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.showNotification('👋 À bientôt !');
      console.log('Déconnexion...');
    }
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString() + ' FCFA';
  }

  get ordersCount(): number {
    return this.orders.length;
  }

  get todayTipsTotal(): string {
    const todayTips = this.tips.filter(t => t.date.includes('Aujourd\'hui'));
    const total = todayTips.reduce((sum, tip) => sum + tip.amount, 0);
    return total.toLocaleString() + ' F';
  }

  get availableTables(): Table[] {
    return this.tables.filter(t => t.status === 'available');
  }
}
