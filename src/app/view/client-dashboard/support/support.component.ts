// ==========================================
// FICHIER: src/app/client/support/support.component.ts
// DESCRIPTION: Page du support client (chat)
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Message {
  id: number;
  sender: 'user' | 'support';
  text: string;
  time: string;
  avatar?: string;
}

interface SupportTopic {
  id: number;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-support',
  standalone : true,
  imports : [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  // Messages du chat
  messages: Message[] = [
    {
      id: 1,
      sender: 'support',
      text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      time: '10:30',
      avatar: '👨‍💼'
    },
    {
      id: 2,
      sender: 'user',
      text: 'Bonjour, j\'ai une question sur ma commande #12457',
      time: '10:31',
      avatar: '👤'
    },
    {
      id: 3,
      sender: 'support',
      text: 'Je vérifie immédiatement pour vous. Un instant s\'il vous plaît.',
      time: '10:31',
      avatar: '👨‍💼'
    },
    {
      id: 4,
      sender: 'support',
      text: 'Votre commande est actuellement en préparation. Elle sera expédiée dans les 24h.',
      time: '10:32',
      avatar: '👨‍💼'
    }
  ];

  // Sujets rapides
  quickTopics: SupportTopic[] = [
    { id: 1, title: 'Statut de commande', icon: '📦' },
    { id: 2, title: 'Retour & Remboursement', icon: '↩️' },
    { id: 3, title: 'Problème de paiement', icon: '💳' },
    { id: 4, title: 'Question sur un produit', icon: '🍷' },
    { id: 5, title: 'Livraison', icon: '🚚' },
    { id: 6, title: 'Autre', icon: '💬' }
  ];

  // Message en cours de saisie
  newMessage = '';

  // État du chat
  isTyping = false;
  chatStarted = true;

  constructor() {}

  ngOnInit(): void {
    // Initialisation
  }

  // Envoyer un message
  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message: Message = {
        id: this.messages.length + 1,
        sender: 'user',
        text: this.newMessage,
        time: this.getCurrentTime(),
        avatar: '👤'
      };

      this.messages.push(message);
      this.newMessage = '';

      // Simuler une réponse du support
      this.simulateSupportResponse();
    }
  }

  // Simuler une réponse du support
  simulateSupportResponse(): void {
    this.isTyping = true;

    setTimeout(() => {
      this.isTyping = false;
      const response: Message = {
        id: this.messages.length + 1,
        sender: 'support',
        text: 'Merci pour votre message. Notre équipe vous répond dans quelques instants.',
        time: this.getCurrentTime(),
        avatar: '👨‍💼'
      };
      this.messages.push(response);
    }, 2000);
  }

  // Sélectionner un sujet rapide
  selectTopic(topic: SupportTopic): void {
    this.newMessage = `Je voudrais des informations sur: ${topic.title}`;
    this.sendMessage();
  }

  // Obtenir l'heure actuelle
  getCurrentTime(): string {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  // Démarrer le chat
  startChat(): void {
    this.chatStarted = true;
  }
}
