import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// Interface pour les produits
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  emoji: string;
  badge?: 'HOT' | 'NEW';
  isFavorite: boolean;
}

// Interface pour les commandes
interface Order {
  id: string;
  title: string;
  quantity: number;
  date: string;
  price: number;
  status: 'delivered' | 'processing' | 'pending' | 'cancelled';
  emoji: string;
}

// Interface pour les statistiques
interface Stat {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  emoji: string;
  color: 'purple' | 'green' | 'blue' | 'orange';
}

@Component({
  selector: 'app-client-dashboard',
    standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  // Variables pour la gestion de l'interface
  currentPage: string = 'dashboard';
  sidebarOpen: boolean = window.innerWidth > 768;
  cartCount: number = 5;
  notificationCount: number = 5;
  loyaltyPoints: number = 1850;
  loyaltyLevel: string = 'GOLD';

  // Données utilisateur
  userName: string = 'Marie Dupont';
  userStatus: string = 'Client Premium';

  // Tableaux de données
  stats: Stat[] = [];
  products: Product[] = [];
  orders: Order[] = [];

  // Modal
  showModal: boolean = false;
  selectedProduct: Product | null = null;
  modalQuantity: number = 1;

  constructor() {}

  ngOnInit(): void {
    // Initialise toutes les données
    this.initializeStats();
    this.initializeProducts();
    this.initializeOrders();

    // Gère le redimensionnement de la fenêtre
    window.addEventListener('resize', () => this.handleResize());
  }

  // ===== INITIALISATION DES DONNÉES =====

  /**
   * Initialise les statistiques du tableau de bord
   * Crée un tableau avec 4 cartes de stats affichant les informations clés
   */
  initializeStats(): void {
    this.stats = [
      {
        label: 'Commandes totales',
        value: 47,
        change: '+12 ce mois',
        isPositive: true,
        emoji: '🛍️',
        color: 'purple'
      },
      {
        label: 'Total dépensé',
        value: '2.8M FCFA',
        change: '+18% ce mois',
        isPositive: true,
        emoji: '💰',
        color: 'green'
      },
      {
        label: 'Points fidélité',
        value: '1,850',
        change: '250 pts pour récompense',
        isPositive: true,
        emoji: '🎁',
        color: 'blue'
      },
      {
        label: 'Favoris',
        value: 23,
        change: '+5 cette semaine',
        isPositive: true,
        emoji: '❤️',
        color: 'orange'
      }
    ];
  }

  /**
   * Initialise le catalogue de produits
   * Chaque produit contient un ID, nom, catégorie, prix, emoji et état favori
   */
  initializeProducts(): void {
    this.products = [
      { id: 1, name: 'Dom Pérignon', category: 'Champagne Premium', price: 45000, emoji: '🥂', badge: 'HOT', isFavorite: false },
      { id: 2, name: 'Heineken Premium', category: 'Bière Blonde', price: 1500, emoji: '🍺', badge: 'NEW', isFavorite: false },
      { id: 3, name: 'Château Margaux', category: 'Vin Rouge Bordeaux', price: 25000, emoji: '🍷', isFavorite: true },
      { id: 4, name: 'Hennessy VSOP', category: 'Cognac', price: 35000, emoji: '🥃', badge: 'HOT', isFavorite: false },
      { id: 5, name: 'Moët & Chandon', category: 'Champagne', price: 15000, emoji: '🍾', isFavorite: true },
      { id: 6, name: 'Bissap Artisanal', category: 'Boisson Locale', price: 500, emoji: '🍹', badge: 'NEW', isFavorite: false }
    ];
  }

  /**
   * Initialise les commandes récentes
   * Affiche les commandes avec leur statut (livré, en traitement, en attente, annulé)
   */
  initializeOrders(): void {
    this.orders = [
      { id: '#12456', title: 'Moët & Chandon Impérial', quantity: 2, date: '15 Sept 2025', price: 30000, status: 'delivered', emoji: '🥂' },
      { id: '#12457', title: 'Château Margaux 2015', quantity: 1, date: 'Aujourd\'hui', price: 25000, status: 'processing', emoji: '🍷' },
      { id: '#12455', title: 'Pack Heineken x12', quantity: 3, date: '12 Sept 2025', price: 18000, status: 'delivered', emoji: '🍺' },
      { id: '#12450', title: 'Hennessy VSOP', quantity: 1, date: '8 Sept 2025', price: 35000, status: 'pending', emoji: '🥃' },
      { id: '#12448', title: 'Dom Pérignon Vintage', quantity: 1, date: '5 Sept 2025', price: 45000, status: 'cancelled', emoji: '🍾' }
    ];
  }

  // ===== NAVIGATION =====

  /**
   * Change la page active en mettant à jour currentPage
   * Ferme aussi la sidebar en mode mobile
   * @param page - Le nom de la page à afficher
   */
  navigateTo(page: string): void {
    this.currentPage = page;

    // Ferme la sidebar sur mobile
    if (window.innerWidth <= 768) {
      this.sidebarOpen = false;
    }

    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Bascule l'état de la sidebar (ouvert/fermé)
   * Utilisé pour le menu burger sur mobile
   */
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  /**
   * Gère le redimensionnement de la fenêtre
   * Ferme la sidebar automatiquement en passant en mode mobile
   */
  private handleResize(): void {
    if (window.innerWidth > 768) {
      this.sidebarOpen = true;
    }
  }

  // ===== GESTION DES FAVORIS =====

  /**
   * Bascule l'état favori d'un produit
   * Met à jour le tableau isFavorite du produit
   * @param product - Le produit dont on change l'état favori
   */
  toggleFavorite(product: Product): void {
    product.isFavorite = !product.isFavorite;
  }

  /**
   * Retourne uniquement les produits marqués en favoris
   * Utilisé pour afficher la page des favoris
   */
  getFavoriteProducts(): Product[] {
    return this.products.filter(p => p.isFavorite);
  }

  // ===== GESTION DU PANIER =====

  /**
   * Ajoute un produit au panier
   * Augmente le compteur du panier et affiche une notification visuelle
   * @param product - Le produit à ajouter
   */
  addToCart(product: Product): void {
    this.cartCount++;
    // Pourrait déclencher une animation ou une notification toast
  }

  // ===== GESTION DES MODALES =====

  /**
   * Ouvre la modal du produit avec ses détails
   * Initialise la quantité à 1
   * @param product - Le produit à afficher dans la modal
   */
  openProductModal(product: Product): void {
    this.selectedProduct = product;
    this.modalQuantity = 1;
    this.showModal = true;
  }

  /**
   * Ferme la modal du produit
   * Réinitialise les données associées
   */
  closeModal(): void {
    this.showModal = false;
    this.selectedProduct = null;
  }

  /**
   * Augmente la quantité dans la modal
   */
  increaseQuantity(): void {
    this.modalQuantity++;
  }

  /**
   * Diminue la quantité dans la modal
   * Ne peut pas aller en dessous de 1
   */
  decreaseQuantity(): void {
    if (this.modalQuantity > 1) {
      this.modalQuantity--;
    }
  }

  /**
   * Ajoute le produit sélectionné au panier depuis la modal
   * Utilise la quantité définie dans la modal
   */
  addProductFromModal(): void {
    if (this.selectedProduct) {
      this.cartCount += this.modalQuantity;
      this.closeModal();
    }
  }

  // ===== GESTION DES NOTIFICATIONS =====

  /**
   * Retourne la classe CSS de statut pour les badges de commande
   * Les couleurs correspondent au statut (vert pour livré, bleu pour traitement, etc)
   * @param status - Le statut de la commande
   */
  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  /**
   * Retourne le texte du statut en minuscules
   * Utilisé pour l'affichage dans les badges
   * @param status - Le statut de la commande
   */
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'delivered': 'Livré',
      'processing': 'En préparation',
      'pending': 'En attente',
      'cancelled': 'Annulé'
    };
    return statusMap[status] || status;
  }

  /**
   * Retourne la classe pour la couleur des stat cards
   * Correspond à l'attribut 'color' de chaque stat
   * @param color - La couleur définie
   */
  getStatCardClass(color: string): string {
    return `stat-card-${color}`;
  }

  /**
   * Marque une notification comme lue
   * Utilisé pour mettre à jour l'interface des notifications
   */
  markNotificationAsRead(): void {
    // Implémentation de la logique de notification
    this.notificationCount--;
  }
}
