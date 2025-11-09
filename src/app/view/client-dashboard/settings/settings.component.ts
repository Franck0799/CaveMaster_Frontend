// ==========================================
// FICHIER: src/app/client/settings/settings.component.ts
// DESCRIPTION: Page des paramètres utilisateur
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  newsletter: boolean;
  promotions: boolean;
  orders: boolean;
  recommendations: boolean;
}

@Component({
  selector: 'app-settings',
  standalone : true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  // Informations utilisateur
  userInfo = {
    name: 'Marie Dupont',
    email: 'marie.dupont@email.com',
    phone: '+234 801 234 5678',
    language: 'fr',
    currency: 'XOF'
  };

  // Paramètres de notification
  notifications: NotificationSettings = {
    email: true,
    sms: false,
    push: true,
    newsletter: true,
    promotions: true,
    orders: true,
    recommendations: false
  };

  // Thème
  theme: 'light' | 'dark' | 'auto' = 'auto';

  // Langues disponibles
  languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  // Devises disponibles
  currencies = [
    { code: 'XOF', label: 'Franc CFA (XOF)', symbol: 'FCFA' },
    { code: 'EUR', label: 'Euro (EUR)', symbol: '€' },
    { code: 'USD', label: 'Dollar US (USD)', symbol: '$' }
  ];

  // État de modification
  isEditing = false;

  constructor() {}

  ngOnInit(): void {
    // Charger le thème sauvegardé
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto';
    if (savedTheme) {
      this.theme = savedTheme;
      this.applyTheme(savedTheme);
    }
  }

  // Sauvegarder les informations
  saveUserInfo(): void {
    console.log('Sauvegarde des informations:', this.userInfo);
    this.isEditing = false;
    // Logique de sauvegarde
  }

  // Annuler l'édition
  cancelEdit(): void {
    this.isEditing = false;
    // Recharger les données originales
  }

  // Changer le thème
  changeTheme(newTheme: 'light' | 'dark' | 'auto'): void {
    this.theme = newTheme;
    this.applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  // Appliquer le thème
  applyTheme(theme: 'light' | 'dark' | 'auto'): void {
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
    body.classList.add(`theme-${theme}`);
  }

  // Sauvegarder les notifications
  saveNotifications(): void {
    console.log('Sauvegarde des notifications:', this.notifications);
    // Logique de sauvegarde
  }

  // Changer la langue
  changeLanguage(): void {
    console.log('Changement de langue:', this.userInfo.language);
    // Logique de changement de langue
  }

  // Changer la devise
  changeCurrency(): void {
    console.log('Changement de devise:', this.userInfo.currency);
    // Logique de changement de devise
  }

  // Supprimer le compte
  deleteAccount(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      console.log('Suppression du compte');
      // Logique de suppression
    }
  }

  // Télécharger les données
  downloadData(): void {
    console.log('Téléchargement des données');
    // Logique de téléchargement RGPD
  }
}
