import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Interface pour définir une action récente
 */
interface RecentAction {
  id: string;
  type: 'add' | 'remove' | 'update' | 'alert'; // Type d'action
  icon: string; // Emoji de l'icône
  title: string; // Titre de l'action
  details: string; // Détails de l'action
  time: string; // Temps relatif (ex: "Il y a 5 min")
  timestamp: Date; // Timestamp exact
  userId?: string; // ID de l'utilisateur qui a fait l'action
  userName?: string; // Nom de l'utilisateur
}

/**
 * Composant RecentActions - Affiche les actions récentes du système
 * Utilisé comme composant réutilisable dans le dashboard
 */
@Component({
  selector: 'app-recent-actions',
   standalone: true,
  // Import des modules nécessaires
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recent-actions.component.html',
  styleUrls: ['./recent-actions.component.scss']
})
export class RecentActionsComponent implements OnInit {

  // Liste des actions récentes
  recentActions: RecentAction[] = [];

  // Nombre d'actions à afficher par défaut
  displayLimit: number = 10;

  // État de chargement
  isLoading: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Chargement initial des actions
    this.loadRecentActions();

    // Mise à jour automatique toutes les 30 secondes
    setInterval(() => {
      this.refreshActions();
    }, 30000);
  }

  /**
   * Charge les actions récentes depuis le backend
   */
  loadRecentActions(): void {
    this.isLoading = true;

    // TODO: Appel API pour charger les actions
    // Simulation avec des données de test
    this.recentActions = this.generateMockActions();

    this.isLoading = false;
    console.log('Actions récentes chargées:', this.recentActions.length);
  }

  /**
   * Rafraîchit la liste des actions
   */
  refreshActions(): void {
    console.log('Rafraîchissement des actions...');
    this.loadRecentActions();
  }

  /**
   * Génère des actions de test pour la démo
   * @returns Liste d'actions simulées
   */
  private generateMockActions(): RecentAction[] {
    const now = new Date();

    return [
      {
        id: '1',
        type: 'add',
        icon: '📦',
        title: 'Nouvelle entrée de stock',
        details: '50 bouteilles de Château Margaux 2015 ajoutées',
        time: 'Il y a 5 min',
        timestamp: new Date(now.getTime() - 5 * 60000),
        userName: 'Jean Kouassi'
      },
      {
        id: '2',
        type: 'remove',
        icon: '📤',
        title: 'Sortie de stock',
        details: '12 bouteilles de Champagne Moët vendues',
        time: 'Il y a 15 min',
        timestamp: new Date(now.getTime() - 15 * 60000),
        userName: 'Marie Diallo'
      },
      {
        id: '3',
        type: 'add',
        icon: '👤',
        title: 'Nouvel employé ajouté',
        details: 'Paul Mensah - Magasinier à Cave Principale',
        time: 'Il y a 1 heure',
        timestamp: new Date(now.getTime() - 60 * 60000),
        userName: 'Admin'
      },
      {
        id: '4',
        type: 'alert',
        icon: '⚠️',
        title: 'Stock faible détecté',
        details: 'Heineken 33cl - Seulement 8 unités restantes',
        time: 'Il y a 2 heures',
        timestamp: new Date(now.getTime() - 120 * 60000)
      },
      {
        id: '5',
        type: 'update',
        icon: '✏️',
        title: 'Produit modifié',
        details: 'Prix du Martini Rosso mis à jour: 8500 FCFA',
        time: 'Il y a 3 heures',
        timestamp: new Date(now.getTime() - 180 * 60000),
        userName: 'Sophie Martin'
      },
      {
        id: '6',
        type: 'add',
        icon: '🛒',
        title: 'Nouvelle commande',
        details: 'Commande #1234 - Client: Amadou Diallo',
        time: 'Il y a 4 heures',
        timestamp: new Date(now.getTime() - 240 * 60000)
      }
    ];
  }

  /**
   * Retourne la classe CSS selon le type d'action
   * @param type - Type d'action
   * @returns Classe CSS correspondante
   */
  getActionTypeClass(type: string): string {
    const classMap: { [key: string]: string } = {
      'add': 'action-type-add',
      'remove': 'action-type-remove',
      'update': 'action-type-update',
      'alert': 'action-type-alert'
    };

    return classMap[type] || 'action-type-default';
  }

  /**
   * Filtre les actions par type
   * @param type - Type d'action à filtrer
   * @returns Actions filtrées
   */
  filterByType(type: string): RecentAction[] {
    if (!type || type === 'all') {
      return this.recentActions;
    }
    return this.recentActions.filter(action => action.type === type);
  }

  /**
   * Retourne les actions limitées au nombre à afficher
   * @returns Actions à afficher
   */
  getDisplayedActions(): RecentAction[] {
    return this.recentActions.slice(0, this.displayLimit);
  }

  /**
   * Charge plus d'actions
   */
  loadMore(): void {
    this.displayLimit += 10;
    console.log('Affichage de', this.displayLimit, 'actions');
  }

  /**
   * Vérifie s'il y a plus d'actions à afficher
   * @returns true s'il reste des actions
   */
  hasMore(): boolean {
    return this.displayLimit < this.recentActions.length;
  }

  /**
   * Calcule le temps relatif depuis une action
   * @param timestamp - Date de l'action
   * @returns Temps relatif formaté
   */
  getRelativeTime(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  }

  /**
   * Supprime une action de la liste
   * @param actionId - ID de l'action à supprimer
   */
  deleteAction(actionId: string): void {
    if (confirm('Voulez-vous vraiment supprimer cette action de l\'historique ?')) {
      this.recentActions = this.recentActions.filter(a => a.id !== actionId);
      console.log('Action supprimée:', actionId);
    }
  }

  /**
   * Efface toutes les actions
   */
  clearAllActions(): void {
    if (confirm('Voulez-vous vraiment effacer tout l\'historique des actions ?')) {
      this.recentActions = [];
      console.log('Historique effacé');
    }
  }

  /**
   * Exporte l'historique des actions
   */
  exportActions(): void {
    console.log('Export de l\'historique...');

    // Dans une vraie app, on créerait un fichier CSV ou JSON
    const dataStr = JSON.stringify(this.recentActions, null, 2);
    console.log('Données exportées:', dataStr);

    alert('Historique exporté avec succès !');
  }
}
