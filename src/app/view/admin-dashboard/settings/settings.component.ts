import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Interface pour les paramètres de l'application
 */
interface AppSettings {
  general: {
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    lowStock: boolean;
    newOrders: boolean;
    employeeActivity: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
    sidebarCollapsed: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number; // en minutes
    loginNotifications: boolean;
  };
  business: {
    taxRate: number;
    lowStockThreshold: number;
    autoBackup: boolean;
    backupFrequency: string;
  };
}

/**
 * Composant Settings - Paramètres de l'application
 * Permet de configurer tous les aspects de l'application
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  // Import des modules nécessaires
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  // Onglet actif
  activeTab: string = 'general';

  // Paramètres de l'application
  settings: AppSettings = {
    general: {
      language: 'fr',
      timezone: 'Africa/Lagos',
      dateFormat: 'DD/MM/YYYY',
      currency: 'FCFA'
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
      lowStock: true,
      newOrders: true,
      employeeActivity: false
    },
    display: {
      theme: 'light',
      fontSize: 'medium',
      sidebarCollapsed: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginNotifications: true
    },
    business: {
      taxRate: 18,
      lowStockThreshold: 10,
      autoBackup: true,
      backupFrequency: 'daily'
    }
  };

  // Sauvegarde des paramètres originaux
  private originalSettings: AppSettings;

  // État des modifications
  hasUnsavedChanges: boolean = false;

  constructor() {
    // Sauvegarde des paramètres originaux
    this.originalSettings = JSON.parse(JSON.stringify(this.settings));
  }

  ngOnInit(): void {
    // Chargement des paramètres depuis le backend
    this.loadSettings();
  }

  /**
   * Charge les paramètres depuis le backend
   */
  loadSettings(): void {
    // TODO: Appel API pour charger les paramètres
    console.log('Chargement des paramètres...');
  }

  /**
   * Change l'onglet actif
   * @param tab - Nom de l'onglet
   */
  switchTab(tab: string): void {
    this.activeTab = tab;
    console.log('Onglet actif:', tab);
  }

  /**
   * Détecte les changements dans les paramètres
   */
  onSettingsChange(): void {
    // Compare les paramètres actuels avec les originaux
    this.hasUnsavedChanges = JSON.stringify(this.settings) !== JSON.stringify(this.originalSettings);
  }

  /**
   * Enregistre les paramètres
   */
  saveSettings(): void {
    // Validation
    if (!this.validateSettings()) {
      alert('Veuillez corriger les erreurs avant de sauvegarder');
      return;
    }

    // TODO: Appel API pour sauvegarder
    console.log('Sauvegarde des paramètres:', this.settings);

    // Simulation de sauvegarde
    alert('Paramètres enregistrés avec succès !');

    // Mise à jour des paramètres originaux
    this.originalSettings = JSON.parse(JSON.stringify(this.settings));
    this.hasUnsavedChanges = false;
  }

  /**
   * Annule les modifications
   */
  cancelChanges(): void {
    if (confirm('Êtes-vous sûr de vouloir annuler les modifications ?')) {
      // Restauration des paramètres originaux
      this.settings = JSON.parse(JSON.stringify(this.originalSettings));
      this.hasUnsavedChanges = false;
    }
  }

  /**
   * Valide les paramètres
   * @returns true si les paramètres sont valides
   */
  validateSettings(): boolean {
    // Validation du taux de taxe
    if (this.settings.business.taxRate < 0 || this.settings.business.taxRate > 100) {
      alert('Le taux de taxe doit être entre 0 et 100');
      return false;
    }

    // Validation du seuil de stock faible
    if (this.settings.business.lowStockThreshold < 0) {
      alert('Le seuil de stock faible doit être positif');
      return false;
    }

    // Validation du timeout de session
    if (this.settings.security.sessionTimeout < 5 || this.settings.security.sessionTimeout > 120) {
      alert('Le timeout de session doit être entre 5 et 120 minutes');
      return false;
    }

    return true;
  }

  /**
   * Réinitialise tous les paramètres aux valeurs par défaut
   */
  resetToDefaults(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres aux valeurs par défaut ?')) {
      // Réinitialisation aux valeurs par défaut
      this.settings = {
        general: {
          language: 'fr',
          timezone: 'Africa/Lagos',
          dateFormat: 'DD/MM/YYYY',
          currency: 'FCFA'
        },
        notifications: {
          email: true,
          sms: false,
          push: true,
          lowStock: true,
          newOrders: true,
          employeeActivity: false
        },
        display: {
          theme: 'light',
          fontSize: 'medium',
          sidebarCollapsed: false
        },
        security: {
          twoFactorAuth: false,
          sessionTimeout: 30,
          loginNotifications: true
        },
        business: {
          taxRate: 18,
          lowStockThreshold: 10,
          autoBackup: true,
          backupFrequency: 'daily'
        }
      };

      this.onSettingsChange();
      alert('Paramètres réinitialisés aux valeurs par défaut');
    }
  }

  /**
   * Exporte les paramètres
   */
  exportSettings(): void {
    const dataStr = JSON.stringify(this.settings, null, 2);
    console.log('Export des paramètres:', dataStr);

    // Dans une vraie app, créer un fichier téléchargeable
    alert('Paramètres exportés avec succès !');
  }

  /**
   * Importe des paramètres depuis un fichier
   */
  importSettings(): void {
    // Dans une vraie app, ouvrir un sélecteur de fichier
    console.log('Import de paramètres...');
    alert('Fonctionnalité d\'import à implémenter');
  }

  /**
   * Teste les notifications email
   */
  testEmailNotification(): void {
    console.log('Test de notification email...');
    alert('Email de test envoyé !');
  }

  /**
   * Teste les notifications SMS
   */
  testSMSNotification(): void {
    console.log('Test de notification SMS...');
    alert('SMS de test envoyé !');
  }

  /**
   * Active/désactive l'authentification à deux facteurs
   */
  toggleTwoFactorAuth(): void {
    if (this.settings.security.twoFactorAuth) {
      // Configuration de 2FA
      console.log('Configuration de l\'authentification à deux facteurs...');
      alert('Scannez le QR code avec votre application d\'authentification');
    } else {
      // Désactivation de 2FA
      if (confirm('Êtes-vous sûr de vouloir désactiver l\'authentification à deux facteurs ?')) {
        console.log('2FA désactivée');
      } else {
        // Annulation
        this.settings.security.twoFactorAuth = true;
      }
    }
    this.onSettingsChange();
  }

  /**
   * Lance une sauvegarde manuelle
   */
  performManualBackup(): void {
    console.log('Sauvegarde manuelle en cours...');

    // Simulation de sauvegarde
    setTimeout(() => {
      alert('Sauvegarde effectuée avec succès !');
    }, 1000);
  }

  /**
   * Change le thème de l'application
   * @param theme - Nouveau thème
   */
  changeTheme(theme: 'light' | 'dark' | 'auto'): void {
    this.settings.display.theme = theme;

    // Application du thème (dans une vraie app)
    document.body.setAttribute('data-theme', theme);

    this.onSettingsChange();
    console.log('Thème changé:', theme);
  }

  /**
   * Change la taille de police
   * @param size - Nouvelle taille
   */
  changeFontSize(size: 'small' | 'medium' | 'large'): void {
    this.settings.display.fontSize = size;

    // Application de la taille (dans une vraie app)
    document.body.setAttribute('data-font-size', size);

    this.onSettingsChange();
    console.log('Taille de police changée:', size);
  }
}
