import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Interface pour le profil utilisateur
 */
interface UserProfile {
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  joinDate: string;
  stats: {
    caves: number;
    managers: number;
    employees: number;
    totalSales: string;
  };
}

/**
 * Interface pour le formulaire de changement de mot de passe
 */
interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Composant Profile - Profil utilisateur
 * Permet de consulter et modifier les informations du compte
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  // Import des modules nécessaires
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  // Profil de l'utilisateur
  userProfile: UserProfile = {
    avatar: '👨‍💼',
    firstName: 'Amadou',
    lastName: 'Diallo',
    email: 'franck.kongo@caveviking.com',
    phone: '+225 0799025494',
    role: 'Administrateur',
    joinDate: '15 janvier 2024',
    stats: {
      caves: 3,
      managers: 6,
      employees: 25,
      totalSales: '9.85M'
    }
  };

  // Sauvegarde du profil original (pour annulation)
  private originalProfile: UserProfile;

  // Formulaire de changement de mot de passe
  passwordForm: PasswordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // États des sections
  isEditMode: boolean = false;
  isPasswordSectionOpen: boolean = false;

  constructor() {
    // Sauvegarde du profil original
    this.originalProfile = { ...this.userProfile };
  }

  ngOnInit(): void {
    // Chargement du profil depuis le backend
    this.loadUserProfile();
  }

  /**
   * Charge le profil utilisateur depuis le backend
   */
  loadUserProfile(): void {
    // TODO: Appel API pour charger le profil
    console.log('Chargement du profil utilisateur...');
  }

  /**
   * Active le mode édition du profil
   */
  enableEditMode(): void {
    this.isEditMode = true;
    // Sauvegarde pour annulation
    this.originalProfile = { ...this.userProfile };
  }

  /**
   * Annule les modifications et restaure le profil original
   */
  cancelEdit(): void {
    this.isEditMode = false;
    // Restauration du profil original
    this.userProfile = { ...this.originalProfile };
  }

  /**
   * Enregistre les modifications du profil
   */
  saveProfile(): void {
    // Validation des données
    if (!this.validateProfile()) {
      alert('Veuillez remplir tous les champs obligatoires correctement');
      return;
    }

    // TODO: Appel API pour sauvegarder
    console.log('Sauvegarde du profil:', this.userProfile);

    // Simulation de sauvegarde
    this.isEditMode = false;
    alert('Profil mis à jour avec succès !');

    // Mise à jour du profil original
    this.originalProfile = { ...this.userProfile };
  }

  /**
   * Valide les données du profil
   * @returns true si le profil est valide
   */
  validateProfile(): boolean {
    // Vérification des champs obligatoires
    if (!this.userProfile.firstName || !this.userProfile.lastName) {
      return false;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userProfile.email)) {
      return false;
    }

    return true;
  }

  /**
   * Toggle l'affichage de la section changement de mot de passe
   */
  togglePasswordSection(): void {
    this.isPasswordSectionOpen = !this.isPasswordSectionOpen;

    // Réinitialise le formulaire si on ferme la section
    if (!this.isPasswordSectionOpen) {
      this.resetPasswordForm();
    }
  }

  /**
   * Change le mot de passe de l'utilisateur
   */
  changePassword(): void {
    // Validation du formulaire
    if (!this.validatePasswordForm()) {
      return;
    }

    // TODO: Appel API pour changer le mot de passe
    console.log('Changement de mot de passe...');

    // Simulation de succès
    alert('Mot de passe modifié avec succès !');

    // Réinitialisation du formulaire
    this.resetPasswordForm();
    this.isPasswordSectionOpen = false;
  }

  /**
   * Valide le formulaire de changement de mot de passe
   * @returns true si le formulaire est valide
   */
  validatePasswordForm(): boolean {
    // Vérification que tous les champs sont remplis
    if (!this.passwordForm.currentPassword ||
        !this.passwordForm.newPassword ||
        !this.passwordForm.confirmPassword) {
      alert('Veuillez remplir tous les champs');
      return false;
    }

    // Vérification que les nouveaux mots de passe correspondent
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      alert('Les nouveaux mots de passe ne correspondent pas');
      return false;
    }

    // Vérification de la longueur minimale
    if (this.passwordForm.newPassword.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }

    return true;
  }

  /**
   * Réinitialise le formulaire de mot de passe
   */
  resetPasswordForm(): void {
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  /**
   * Retourne les initiales de l'utilisateur
   * @returns Initiales (ex: "AD")
   */
  getUserInitials(): string {
    return `${this.userProfile.firstName.charAt(0)}${this.userProfile.lastName.charAt(0)}`.toUpperCase();
  }

  /**
   * Calcule le nombre de jours depuis l'inscription
   * @returns Nombre de jours
   */
  getDaysSinceJoin(): number {
    // TODO: Calcul réel basé sur la date d'inscription
    return 280; // Exemple
  }

  /**
   * Ouvre le sélecteur d'avatar
   */
  changeAvatar(): void {
    // Liste d'avatars disponibles
    const avatars = ['👨‍💼', '👩‍💼', '👨‍🏫', '👩‍🏫', '👨‍💻', '👩‍💻', '🧑‍💼', '🧑‍🏫'];

    // Simulation de sélection aléatoire (dans une vraie app, ouvrir un modal)
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    this.userProfile.avatar = randomAvatar;

    console.log('Avatar changé:', randomAvatar);
  }

  /**
   * Supprime le compte utilisateur
   */
  deleteAccount(): void {
    const confirmation = confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ?\n' +
      'Cette action est irréversible et toutes vos données seront supprimées.'
    );

    if (confirmation) {
      const doubleConfirmation = confirm(
        'Dernière confirmation : voulez-vous vraiment supprimer définitivement votre compte ?'
      );

      if (doubleConfirmation) {
        // TODO: Appel API pour supprimer le compte
        console.log('Suppression du compte...');
        alert('Votre compte sera supprimé. Vous allez être déconnecté.');
        // Redirection vers la page de connexion
      }
    }
  }

  /**
   * Exporte les données du compte
   */
  exportAccountData(): void {
    console.log('Export des données du compte...');

    // Simulation de téléchargement de données
    alert('Vos données ont été exportées et téléchargées au format JSON');

    // Dans une vraie app:
    // const dataStr = JSON.stringify(this.userProfile, null, 2);
    // const dataBlob = new Blob([dataStr], { type: 'application/json' });
    // const url = URL.createObjectURL(dataBlob);
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = 'mon-compte-caveviking.json';
    // link.click();
  }
}
