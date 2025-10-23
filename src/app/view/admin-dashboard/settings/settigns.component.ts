// ==========================================
// FICHIER: src/app/features/settings/settings.component.ts
// DESCRIPTION: Composant pour gérer les paramètres de l'application
// ==========================================

import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  // Section active des paramètres
  activeSection: string = 'general';

  // Paramètres de l'application
  settings = {
    // Général
    language: 'fr',
    currency: 'FCFA',
    timezone: 'Africa/Lagos',
    dateFormat: 'DD/MM/YYYY',

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    stockAlerts: true,
    lowStockThreshold: 10,
    orderNotifications: true,
    weeklyReports: true,

    // Affichage
    theme: 'light',  // 'light' | 'dark' | 'auto'
    sidebarCollapsed: false,
    compactMode: false,
    showAnimations: true,
    itemsPerPage: 20,

    // Données et sauvegarde
    autoBackup: true,
    backupFrequency: 'daily',  // 'daily' | 'weekly' | 'monthly'
    lastBackup: new Date(),

    // Sécurité
    twoFactorAuth: false,
    sessionTimeout: 30,  // minutes
    passwordExpiry: 90,   // jours
    loginAlerts: true,

    // Impressions
    includeLogo: true,
    paperSize: 'A4',
    orientation: 'portrait'
  };

  // Messages
  successMessage: string = '';
  errorMessage: string = '';

  // Options
  languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  currencies = ['FCFA', 'EUR', 'USD', 'GBP'];

  timezones = [
    'Africa/Lagos',
    'Africa/Abidjan',
    'Africa/Dakar',
    'Europe/Paris'
  ];

  themes = [
    { value: 'light', label: 'Clair', icon: '☀️' },
    { value: 'dark', label: 'Sombre', icon: '🌙' },
    { value: 'auto', label: 'Automatique', icon: '🔄' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.loadSettings();
  }

  /**
   * Charge les paramètres depuis le localStorage
   */
  loadSettings(): void {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        this.settings = { ...this.settings, ...parsed };
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres', error);
      }
    }
  }

  /**
   * Sauvegarde les paramètres
   */
  saveSettings(): void {
    try {
      // Sauvegarde locale
      localStorage.setItem('appSettings', JSON.stringify(this.settings));

      // Applique le thème
      this.applyTheme();

      // Applique le mode compact
      this.applyCompactMode();

      this.showSuccess('Paramètres enregistrés avec succès');
    } catch (error) {
      this.show
      this.showSuccess('Paramètres enregistrés avec succès');
    } catch (error) {
      this.showError('Erreur lors de la sauvegarde des paramètres');
    }
  }

  /**
   * Réinitialise tous les paramètres par défaut
   */
  resetToDefaults(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres par défaut ?')) {
      this.settings = {
        language: 'fr',
        currency: 'FCFA',
        timezone: 'Africa/Lagos',
        dateFormat: 'DD/MM/YYYY',
        emailNotifications: true,
        pushNotifications: true,
        stockAlerts: true,
        lowStockThreshold: 10,
        orderNotifications: true,
        weeklyReports: true,
        theme: 'light',
        sidebarCollapsed: false,
        compactMode: false,
        showAnimations: true,
        itemsPerPage: 20,
        autoBackup: true,
        backupFrequency: 'daily',
        lastBackup: new Date(),
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiry: 90,
        loginAlerts: true,
        includeLogo: true,
        paperSize: 'A4',
        orientation: 'portrait'
      };

      this.saveSettings();
      this.showSuccess('Paramètres réinitialisés');
    }
  }

  /**
   * Change la section active
   */
  switchSection(section: string): void {
    this.activeSection = section;
  }

  /**
   * Applique le thème sélectionné
   */
  applyTheme(): void {
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark');

    if (this.settings.theme === 'auto') {
      // Détecte le thème système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
    } else {
      body.classList.add(`theme-${this.settings.theme}`);
    }
  }

  /**
   * Applique le mode compact
   */
  applyCompactMode(): void {
    const body = document.body;
    if (this.settings.compactMode) {
      body.classList.add('compact-mode');
    } else {
      body.classList.remove('compact-mode');
    }
  }

  /**
   * Export des données de l'application
   */
  exportData(): void {
    const data = {
      caves: this.dataService.getCaves(),
      drinks: this.dataService.getDrinks(),
      managers: this.dataService.getManagers(),
      employees: this.dataService.getEmployees(),
      settings: this.settings,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)],
      { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `drinkstore-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
    this.showSuccess('Données exportées avec succès');
  }

  /**
   * Import des données
   */
  importData(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        if (confirm('Cette action remplacera toutes vos données actuelles. Continuer ?')) {
          // Validation basique
          if (!data.caves || !data.drinks) {
            throw new Error('Fichier invalide');
          }

          // Import (à implémenter selon votre logique)
          console.log('Import des données:', data);

          this.showSuccess('Données importées avec succès. Veuillez recharger la page.');
        }
      } catch (error) {
        this.showError('Fichier invalide ou corrompu');
      }
    };

    reader.readAsText(file);
  }

  /**
   * Créer une sauvegarde manuelle
   */
  createBackup(): void {
    this.exportData();
    this.settings.lastBackup = new Date();
    localStorage.setItem('appSettings', JSON.stringify(this.settings));
  }

  /**
   * Test des notifications
   */
  testNotification(): void {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('DrinkStore Pro', {
            body: 'Les notifications fonctionnent correctement !',
            icon: '/assets/logo.png'
          });
          this.showSuccess('Notification envoyée');
        } else {
          this.showError('Notifications bloquées par le navigateur');
        }
      });
    } else {
      this.showError('Notifications non supportées');
    }
  }

  /**
   * Efface toutes les données
   */
  clearAllData(): void {
    const confirmation = prompt(
      'ATTENTION : Cette action est irréversible. Tapez "SUPPRIMER" pour confirmer'
    );

    if (confirmation === 'SUPPRIMER') {
      localStorage.clear();
      sessionStorage.clear();
      this.showSuccess('Toutes les données ont été effacées. Rechargement...');
      setTimeout(() => window.location.reload(), 2000);
    }
  }

  /**
   * Affiche un message de succès
   */
  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => this.successMessage = '', 5000);
  }

  /**
   * Affiche un message d'erreur
   */
  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => this.errorMessage = '', 5000);
  }

  /**
   * Formate une date
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
