import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ===== INTERFACES =====
// Définition des structures de données TypeScript pour le typage fort

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
  imports: [CommonModule, FormsModule], // Ajout de FormsModule pour ngModel
  templateUrl: './waitress-dashboard.component.html',
  styleUrls: ['./waitress-dashboard.component.scss']
})
export class WaitressDashboardComponent implements OnInit {

  // ===== PROPRIÉTÉS DE NAVIGATION =====
  // Gère quelle page est actuellement active
  activeTab: string = 'orders';

  // ===== PROPRIÉTÉS DE DISPONIBILITÉ =====
  // Gère le statut de disponibilité de la serveuse
  availabilityStatus: string = 'en-service';
  availabilityIcon: string = '🟢';
  availabilityText: string = 'En service';
  availabilityMenuOpen: boolean = false;
  statusMenuOpen: boolean = false;

  // ===== PROPRIÉTÉS DU FORMULAIRE NOUVELLE COMMANDE =====
  selectedTable: string = '';
  guestCount: number = 2;
  orderItems: MenuItem[] = []; // Panier de commande
  orderTotal: number = 0;

  // ===== PROPRIÉTÉS DE FILTRAGE =====
  activeMenuCategory: string = 'all';
  activeHistoryPeriod: string = 'today';

  // ===== DONNÉES STATISTIQUES =====
  stats: Stat[] = [
    { icon: '⏰', label: 'Heure de début', value: '08:00', color: '' },
    { icon: '⏱️', label: 'Temps écoulé', value: '4h 30m', color: '' },
    { icon: '📦', label: 'Commandes servies', value: '18', color: '' },
    { icon: '💰', label: 'Pourboires', value: '12 500 F', color: '' }
  ];

  // ===== DONNÉES DES TABLES =====
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

  // ===== DONNÉES DES COMMANDES =====
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

  // ===== DONNÉES DU MENU =====
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

  // ===== DONNÉES DES POURBOIRES =====
  tips: Tip[] = [
    { date: 'Aujourd\'hui 14:30', table: 5, amount: 5000, details: 'Table VIP - Excellent service' },
    { date: 'Aujourd\'hui 13:15', table: 12, amount: 3500, details: 'Groupe de 8 personnes' },
    { date: 'Aujourd\'hui 12:00', table: 3, amount: 2000, details: 'Couple satisfait' },
    { date: 'Aujourd\'hui 11:30', table: 8, amount: 2000, details: 'Déjeuner d\'affaires' },
    { date: 'Hier 19:45', table: 15, amount: 10000, details: 'Anniversaire - Service impeccable' },
    { date: 'Hier 18:20', table: 7, amount: 4000, details: 'Groupe d\'amis' }
  ];

  // ===== DONNÉES DE L'HISTORIQUE =====
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
    // Initialisation du composant
    this.updateTimeElapsed();

    // Fermer les menus quand on clique ailleurs (gestion globale)
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Fermer le menu de disponibilité si on clique ailleurs
      if (!target.closest('.availability-menu-container')) {
        this.availabilityMenuOpen = false;
      }

      // Fermer le menu de statut si on clique ailleurs
      if (!target.closest('.status-menu-container')) {
        this.statusMenuOpen = false;
      }
    });
  }

  // ===== MÉTHODES DE NAVIGATION =====

  /**
   * Change la page active affichée
   * @param page - Le nom de la page à afficher
   */
  navigateTo(page: string): void {
    this.activeTab = page;
    // Scroll vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Vérifie si un onglet est actif
   * @param tab - Le nom de l'onglet
   */
  isActiveTab(tab: string): boolean {
    return this.activeTab === tab;
  }

  // ===== MÉTHODES DE GESTION DE DISPONIBILITÉ =====

  /**
   * Toggle le menu de disponibilité (header)
   */
  toggleAvailabilityMenu(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Empêche la propagation du clic
    }
    this.availabilityMenuOpen = !this.availabilityMenuOpen;
  }

  /**
   * Toggle le menu de statut (bouton flottant)
   */
  toggleStatusMenu(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.statusMenuOpen = !this.statusMenuOpen;
  }

  /**
   * Change le statut de disponibilité
   */
  changeAvailability(status: string, icon: string, text: string): void {
    this.availabilityStatus = status;
    this.availabilityIcon = icon;
    this.availabilityText = text;

    // Fermer les menus
    this.availabilityMenuOpen = false;
    this.statusMenuOpen = false;

    // Afficher une notification
    this.showNotification(`✓ Votre statut a été changé en: ${text}`);

    // Message spécial si pas en service
    if (status === 'pas-service') {
      setTimeout(() => {
        this.showNotification('⏰ N\'oubliez pas de clôturer votre caisse avant de partir !');
      }, 2000);
    }

    // Ici vous enverriez normalement au backend
    console.log('Nouveau statut:', status);
  }

  /**
   * Retourne la couleur de bordure selon le statut
   */
  getAvailabilityBorderColor(): string {
    const colors: { [key: string]: string } = {
      'en-service': '#22c55e',
      'pause': '#f59e0b',
      'pas-service': '#94a3b8',
      'conge': '#3b82f6'
    };
    return colors[this.availabilityStatus] || '#22c55e';
  }

  // ===== MÉTHODES DE GESTION DES COMMANDES =====

  /**
   * Confirme une commande et l'envoie en cuisine
   */
  confirmOrder(tableNumber: number): void {
    const order = this.orders.find(o => o.table === tableNumber);
    if (order) {
      order.status = 'preparing';
      order.statusText = 'En préparation';
      this.showNotification(`✓ Commande de la Table #${tableNumber} confirmée et envoyée en cuisine !`);

      // Ici vous enverriez au backend
      console.log('Commande confirmée:', order);
    }
  }

  /**
   * Annule une commande
   */
  cancelOrder(tableNumber: number): void {
    if (confirm(`Êtes-vous sûr de vouloir annuler la commande de la Table #${tableNumber} ?`)) {
      // Supprimer la commande du tableau
      this.orders = this.orders.filter(o => o.table !== tableNumber);
      this.showNotification(`✕ Commande de la Table #${tableNumber} annulée`);

      // Ici vous supprimeriez au backend
      console.log('Commande annulée pour table:', tableNumber);
    }
  }

  /**
   * Envoie un rappel à la cuisine
   */
  remindOrder(tableNumber: number): void {
    this.showNotification(`🔔 Rappel envoyé à la cuisine pour la Table #${tableNumber}`);

    // Ici vous enverriez un rappel au backend
    console.log('Rappel envoyé pour table:', tableNumber);
  }

  /**
   * Marque une commande comme servie
   */
  serveOrder(tableNumber: number): void {
    // Supprimer la commande des commandes actives
    this.orders = this.orders.filter(o => o.table !== tableNumber);

    // Incrémenter le compteur de commandes servies
    const servedStat = this.stats.find(s => s.label === 'Commandes servies');
    if (servedStat) {
      const currentValue = parseInt(servedStat.value);
      servedStat.value = (currentValue + 1).toString();
    }

    this.showNotification(`✓ Commande de la Table #${tableNumber} servie avec succès !`);

    // Ici vous mettriez à jour le backend
    console.log('Commande servie pour table:', tableNumber);
  }

  /**
   * Retourne la classe CSS selon le statut de la commande
   */
  getOrderStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'new': 'status-new',
      'preparing': 'status-preparing',
      'ready': 'status-ready'
    };
    return classes[status] || '';
  }

  // ===== MÉTHODES DE GESTION DU MENU =====

  /**
   * Filtre les items du menu par catégorie
   */
  get filteredMenuItems(): MenuItem[] {
    if (this.activeMenuCategory === 'all') {
      return this.menuItems;
    }
    return this.menuItems.filter(item => item.category === this.activeMenuCategory);
  }

  /**
   * Change la catégorie active du menu
   */
  filterMenu(category: string): void {
    this.activeMenuCategory = category;
  }

  /**
   * Vérifie si une catégorie est active
   */
  isActiveCategory(category: string): boolean {
    return this.activeMenuCategory === category;
  }

  /**
   * Ajoute un produit au panier de commande
   */
  addToOrder(itemId: number): void {
    const item = this.menuItems.find(i => i.id === itemId);
    if (item) {
      this.orderItems.push(item);
      this.calculateOrderTotal();
      this.showNotification(`✓ ${item.name} ajouté à la commande !`);
    }
  }

  /**
   * Retire un produit du panier
   */
  removeFromOrder(index: number): void {
    this.orderItems.splice(index, 1);
    this.calculateOrderTotal();
  }

  /**
   * Calcule le total de la commande en cours
   */
  calculateOrderTotal(): void {
    this.orderTotal = this.orderItems.reduce((sum, item) => sum + item.price, 0);
  }

  /**
   * Crée une nouvelle commande
   */
  createOrder(): void {
    if (!this.selectedTable) {
      this.showNotification('⚠️ Veuillez sélectionner une table');
      return;
    }

    if (this.orderItems.length === 0) {
      this.showNotification('⚠️ Veuillez ajouter au moins un produit');
      return;
    }

    // Créer la nouvelle commande
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

    // Réinitialiser le formulaire
    this.selectedTable = '';
    this.guestCount = 2;
    this.orderItems = [];
    this.orderTotal = 0;

    this.showNotification(`✓ Nouvelle commande créée pour la Table #${newOrder.table}`);

    // Retourner à la page des commandes
    this.navigateTo('orders');

    // Ici vous enverriez au backend
    console.log('Nouvelle commande créée:', newOrder);
  }

  // ===== MÉTHODES DE GESTION DES TABLES =====

  /**
   * Retourne la classe CSS selon le statut de la table
   */
  getTableColorClass(status: string): string {
    const classes: { [key: string]: string } = {
      'occupied': 'table-occupied',
      'available': 'table-available',
      'reserved': 'table-reserved',
      'cleaning': 'table-cleaning'
    };
    return classes[status] || '';
  }

  // ===== MÉTHODES DE GESTION DE L'HISTORIQUE =====

  /**
   * Filtre l'historique par période
   */
  get filteredHistory(): HistorySale[] {
    // Pour l'instant retourne tout, mais vous pourriez filtrer par date
    return this.historySales;
  }

  /**
   * Change la période active de l'historique
   */
  filterHistory(period: string): void {
    this.activeHistoryPeriod = period;
    // Ici vous pourriez filtrer les données selon la période
  }

  /**
   * Vérifie si une période est active
   */
  isActivePeriod(period: string): boolean {
    return this.activeHistoryPeriod === period;
  }

  /**
   * Calcule le total des ventes
   */
  get historyTotal(): string {
    const total = this.historySales.reduce((sum, sale) => sum + sale.amount, 0);
    return total.toLocaleString() + ' F';
  }

  /**
   * Calcule le nombre de commandes
   */
  get historyOrdersCount(): number {
    return this.historySales.length;
  }

  /**
   * Calcule la moyenne par commande
   */
  get historyAverage(): string {
    if (this.historySales.length === 0) return '0 F';
    const avg = this.historySales.reduce((sum, sale) => sum + sale.amount, 0) / this.historySales.length;
    return Math.round(avg).toLocaleString() + ' F';
  }

  // ===== MÉTHODES UTILITAIRES =====

  /**
   * Affiche une notification temporaire
   */
  showNotification(message: string): void {
    // Dans une vraie app Angular, vous utiliseriez un service de notification
    // ou une bibliothèque comme ngx-toastr
    alert(message); // Version simple pour démarrer

    // Version plus élaborée avec création d'élément DOM (à améliorer)
    console.log('Notification:', message);
  }

  /**
   * Met à jour le temps écoulé depuis le début du service
   */
  updateTimeElapsed(): void {
    const startTime = new Date();
    startTime.setHours(8, 0, 0); // Heure de début: 08:00

    // Met à jour toutes les minutes
    setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      const timeStat = this.stats.find(s => s.label === 'Temps écoulé');
      if (timeStat) {
        timeStat.value = `${hours}h ${minutes}m`;
      }
    }, 60000); // Toutes les minutes
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.showNotification('👋 À bientôt !');
      // Ici vous déconnecteriez l'utilisateur et redirigeriez vers login
      console.log('Déconnexion...');
    }
  }

  /**
   * Formate un nombre en devise locale
   */
  formatCurrency(amount: number): string {
    return amount.toLocaleString() + ' FCFA';
  }

  /**
   * Retourne le nombre de commandes actives
   */
  get ordersCount(): number {
    return this.orders.length;
  }

  /**
   * Retourne le total des pourboires du jour
   */
  get todayTipsTotal(): string {
    const todayTips = this.tips.filter(t => t.date.includes('Aujourd\'hui'));
    const total = todayTips.reduce((sum, tip) => sum + tip.amount, 0);
    return total.toLocaleString() + ' F';
  }

  /**
   * Retourne les tables disponibles pour la sélection
   */
  get availableTables(): Table[] {
    return this.tables.filter(t => t.status === 'available');
  }
}
