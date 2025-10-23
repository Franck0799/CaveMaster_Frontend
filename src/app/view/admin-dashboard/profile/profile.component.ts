// ==========================================
// FICHIER: src/app/features/profile/profile.component.ts
// DESCRIPTION: Composant pour gérer le profil utilisateur
// ==========================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserProfile } from '../../core/models/models';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  // Profil utilisateur
  userProfile: UserProfile | null = null;

  // Formulaire de modification
  profileForm: Partial<UserProfile> = {};

  // Formulaire de changement de mot de passe
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // États UI
  isLoading: boolean = false;
  isEditing: boolean = false;
  showPasswordSection: boolean = false;

  // Messages
  successMessage: string = '';
  errorMessage: string = '';

  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Chargement du profil
  loadProfile(): void {
    this.isLoading = true;

    this.dataService.userProfile$
      .pipe(takeUntil(this.destroy$))
      .subscribe(profile => {
        if (profile) {
          this.userProfile = profile;
          this.profileForm = { ...profile };
        }
        this.isLoading = false;
      });
  }

  // Mode édition
  enableEditMode(): void {
    this.isEditing = true;
    this.profileForm = { ...this.userProfile };
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.profileForm = { ...this.userProfile };
    this.clearMessages();
  }

  // Sauvegarde du profil
  saveProfile(): void {
    if (!this.profileForm.firstName || !this.profileForm.lastName ||
        !this.profileForm.email) {
      this.showError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.profileForm.email)) {
      this.showError('Email invalide');
      return;
    }

    // Sauvegarde via le service
    this.dataService.updateUserProfile(this.profileForm);
    this.isEditing = false;
    this.showSuccess('Profil mis à jour avec succès');
  }

  // Toggle section mot de passe
  togglePasswordSection(): void {
    this.showPasswordSection = !this.showPasswordSection;
    if (this.showPasswordSection) {
      this.resetPasswordForm();
    }
  }

  // Changement de mot de passe
  changePassword(): void {
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm;

    // Validations
    if (!currentPassword || !newPassword || !confirmPassword) {
      this.showError('Veuillez remplir tous les champs du mot de passe');
      return;
    }

    if (newPassword.length < 8) {
      this.showError('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showError('Les mots de passe ne correspondent pas');
      return;
    }

    // Vérification de la force du mot de passe
    if (!this.isPasswordStrong(newPassword)) {
      this.showError('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre');
      return;
    }

    // Simulation de changement de mot de passe (à remplacer par un appel API)
    // Dans un cas réel, vous enverriez ceci à votre backend
    console.log('Changement de mot de passe...');

    this.resetPasswordForm();
    this.showPasswordSection = false;
    this.showSuccess('Mot de passe modifié avec succès');
  }

  // Validation force du mot de passe
  isPasswordStrong(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasUpperCase && hasLowerCase && hasNumber;
  }

  // Réinitialise le formulaire de mot de passe
  resetPasswordForm(): void {
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  // Gestion des messages
  showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => this.successMessage = '', 5000);
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => this.errorMessage = '', 5000);
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Upload d'avatar (simulation)
  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Vérification du type de fichier
      if (!file.type.startsWith('image/')) {
        this.showError('Veuillez sélectionner une image');
        return;
      }

      // Vérification de la taille (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.showError('L\'image ne doit pas dépasser 2MB');
        return;
      }

      // Simulation de l'upload
      this.showSuccess('Avatar mis à jour (fonctionnalité en développement)');
    }
  }

  // Obtenir les initiales pour l'avatar
  getInitials(): string {
    if (!this.userProfile) return '';
    return `${this.userProfile.firstName.charAt(0)}${this.userProfile.lastName.charAt(0)}`.toUpperCase();
  }
}

