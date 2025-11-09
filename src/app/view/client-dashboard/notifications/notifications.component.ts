// ==========================================
// FICHIER: src/app/client/notifications/notifications.component.ts
// DESCRIPTION: Page des notifications
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Notification {
  id: number;
  type: 'reward' | 'delivery' | 'promo' | 'payment' | 'level';
  icon: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-notifications',
    standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notifications: Notification[] = [
    {
      id: 1,
      type: 'reward',
      icon: '🎉',
      title: 'Récompense débloquée !',
      message: 'Vous avez gagné 150 points de fidélité pour votre dernière commande.',
      time: 'Il y a 2h',
      read: false
    },
    {
      id: 2,
      type: 'delivery',
      icon: '📦',
      title: 'Commande livrée',
      message: 'Votre commande #12456 (Moët & Chandon) a été livrée avec succès.',
      time: 'Hier',
      read: false
    },
    {
      id: 3,
      type: 'promo',
      icon: '🔥',
      title: 'Promotion spéciale',
      message: '-20% sur tous les champagnes premium ce week-end !',
      time: 'Il y a 2 jours',
      read: false
    },
    {
      id: 4,
      type: 'payment',
      icon: '💳',
      title: 'Paiement confirmé',
      message: 'Votre paiement de 25,000 FCFA pour la commande #12457 a été confirmé.',
      time: 'Il y a 3 jours',
      read: true
    },
    {
      id: 5,
      type: 'level',
      icon: '🎁',
      title: 'Nouveau niveau atteint',
      message: 'Félicitations ! Vous êtes maintenant membre GOLD.',
      time: 'Il y a 1 semaine',
      read: true
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Initialisation
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead(): void {
    this.notifications.forEach(notif => notif.read = true);
  }

  // Marquer une notification comme lue
  markAsRead(notification: Notification): void {
    notification.read = true;
  }

  // Supprimer une notification
  deleteNotification(notification: Notification, event: Event): void {
    event.stopPropagation();
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
  }

  // Obtenir la classe CSS selon le type
  getTypeClass(type: string): string {
    return `notification-${type}`;
  }

  // Compter les notifications non lues
  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
}
