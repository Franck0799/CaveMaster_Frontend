// ===== FICHIER: user-profile.component.ts =====
// Ce composant gère l'affichage et la modification du profil utilisateur

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Interface pour l'activité récente
interface Activity {
  id: string;           // Identifiant unique
  title: string;        // Titre de l'activité
  description: string;  // Description détaillée
  timestamp: string;    // Date et heure de l'activité
  type: 'login' | 'update' | 'sale' | 'stock' | 'system'; // Type d'activité
  icon: string;         // Emoji d'icône
}

// Interface pour les statistiques utilisateur
interface UserStatistics {
  totalSales: number;         // Total des ventes
  totalHours: number;         // Total des heures travaillées
  averageSalesPerDay: number; // Moyenne de ventes par jour
  monthlyBonus: number;       // Bonus mensuel
  performanceRating: number;  // Note de performance (0-100)
  attendanceRate: number;     // Taux de présence (0-100%)
}

// Interface pour le profil utilisateur
interface UserProfile {
  id: string;                  // Identifiant unique
  firstName: string;           // Prénom
  lastName: string;            // Nom de famille
  email: string;               // Email
  phone: string;               // Téléphone
  role: string;                // Rôle/Poste
  avatar: string;              // Emoji d'avatar
  cave: string;                // Cave d'affectation
  department: string;          // Département
  manager: string;             // Manager de supervision
  status: 'active' | 'inactive' | 'on-leave'; // Statut
  joinDate: string;            // Date d'embauche
  birthDate: string;           // Date de naissance
  address: string;             // Adresse personnelle
  emergencyContact: string;    // Contact d'urgence
  emergencyPhone: string;      // Téléphone d'urgence
  bankAccount: string;         // Numéro de compte bancaire
  bankName: string;            // Nom de la banque
  socialSecurityNumber: string; // Numéro de sécurité sociale
  lastUpdateDate: string;      // Date de dernière mise à jour
  profileComplete: boolean;    // Profil complété à 100%
  statistics: UserStatistics;  // Statistiques de l'utilisateur
  activities: Activity[];      // Activités récentes
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  // Imports des modules nécessaires
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  // ===== PROPRIÉTÉS DU COMPOSANT =====

  // Profil utilisateur actuellement affichée
  userProfile: UserProfile | null = null;

  // Formulaire réactif pour modifier le profil
  profileForm: FormGroup;

  // Formulaire pour changer le mot de passe
  passwordForm: FormGroup;

  // Flag indiquant si on est en mode édition du profil
  isEditingProfile: boolean = false;

  // Flag indiquant si on modifie le mot de passe
  isChangingPassword: boolean = false;

  // Message de succès/erreur
  message: string = '';

  // Type de message (success, error, info)
  messageType: 'success' | 'error' | 'info' = 'info';

  // Mot de passe actuel pour vérification
  currentPasswordInput: string = '';

  // Indicateur de résistance du mot de passe
  passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';

  // Flag pour afficher/masquer les mots de passe
  showPasswords: boolean = false;

  // Liste des activités récentes (complète)
  allActivities: Activity[] = [];

  // Nombre d'activités à afficher par défaut
  activitiesDisplayCount: number = 5;

  // Onglet actif dans le profil (infos, stats, activités)
  activeTab: 'info' | 'stats' | 'activities' | 'security' = 'info';

  // Avatar sélectionné pour changement
  selectedAvatar: string = '';

  // ===== CONSTRUCTEUR AVEC INJECTION DE DÉPENDANCES =====
  constructor(private formBuilder: FormBuilder) {
    // Initialise le formulaire de profil avec validation
    this.profileForm = this.formBuilder.group({
      // Champ prénom : obligatoire
      firstName: ['', [Validators.required, Validators.minLength(2)]],

      // Champ nom : obligatoire
      lastName: ['', [Validators.required, Validators.minLength(2)]],

      // Champ email : obligatoire et doit être un email valide
      email: ['', [Validators.required, Validators.email]],

      // Champ téléphone : optionnel mais avec pattern
      phone: ['', [Validators.pattern(/^\+?[0-9\s\-\(\)]+$/)]],

      // Champ date de naissance : optionnel
      birthDate: [''],

      // Champ adresse : optionnel
      address: [''],

      // Champ contact d'urgence : optionnel
      emergencyContact: [''],

      // Champ téléphone d'urgence : optionnel
      emergencyPhone: ['', [Validators.pattern(/^\+?[0-9\s\-\(\)]+$/)]],

      // Champ numéro de compte bancaire : optionnel
      bankAccount: [''],

      // Champ nom de la banque : optionnel
      bankName: [''],

      // Champ numéro de sécurité sociale : optionnel
      socialSecurityNumber: ['']
    });

    // Initialise le formulaire de changement de mot de passe
    this.passwordForm = this.formBuilder.group({
      // Mot de passe actuel : obligatoire
      currentPassword: ['', Validators.required],

      // Nouveau mot de passe : obligatoire, min 8 caractères
      newPassword: ['', [Validators.required, Validators.minLength(8)]],

      // Confirmation du nouveau mot de passe : obligatoire
      confirmPassword: ['', Validators.required]
    });
  }

  // ===== MÉTHODE D'INITIALISATION =====
  ngOnInit(): void {
    // Charge le profil utilisateur au démarrage
    this.loadUserProfile();

    // Charge les activités récentes
    this.loadActivities();
  }

  // ===== MÉTHODE DE CHARGEMENT DU PROFIL =====
  /**
   * Charge les données du profil utilisateur
   * À remplacer par un appel API backend
   */
  loadUserProfile(): void {
    // Données mockées du profil utilisateur
    this.userProfile = {
      id: 'user_1',
      firstName: 'Jean',
      lastName: 'Kouassi',
      email: 'jean.kouassi@drinkstore.com',
      phone: '+234 801 234 5678',
      role: 'Manager Principal',
      avatar: '👨‍💼',
      cave: 'Cave Principale',
      department: 'Management',
      manager: 'Franck KONGO',
      status: 'active',
      joinDate: '2023-01-15',
      birthDate: '1985-06-20',
      address: '123 Rue de Lekki, Lagos',
      emergencyContact: 'Marie Kouassi',
      emergencyPhone: '+234 805 678 9012',
      bankAccount: '******* 4567',
      bankName: 'GTBank',
      socialSecurityNumber: '****-****-****',
      lastUpdateDate: '2025-09-15',
      profileComplete: true,
      statistics: {
        totalSales: 2500000,
        totalHours: 160,
        averageSalesPerDay: 83333,
        monthlyBonus: 50000,
        performanceRating: 96,
        attendanceRate: 98
      },
      activities: []
    };

    // Stocke l'avatar actuel
    this.selectedAvatar = this.userProfile.avatar;

    // Remplit le formulaire avec les données du profil
    this.profileForm.patchValue({
      firstName: this.userProfile.firstName,
      lastName: this.userProfile.lastName,
      email: this.userProfile.email,
      phone: this.userProfile.phone,
      birthDate: this.userProfile.birthDate,
      address: this.userProfile.address,
      emergencyContact: this.userProfile.emergencyContact,
      emergencyPhone: this.userProfile.emergencyPhone,
      bankAccount: this.userProfile.bankAccount,
      bankName: this.userProfile.bankName,
      socialSecurityNumber: this.userProfile.socialSecurityNumber
    });
  }

  // ===== MÉTHODE DE CHARGEMENT DES ACTIVITÉS =====
  /**
   * Charge la liste des activités récentes
   */
  loadActivities(): void {
    // Données mockées des activités récentes
    this.allActivities = [
      {
        id: '1',
        title: 'Connexion au système',
        description: 'Connexion à DrinkStore Pro',
        timestamp: '2025-10-18 08:30:00',
        type: 'login',
        icon: '🔓'
      },
      {
        id: '2',
        title: 'Mise à jour de profil',
        description: 'Modification du numéro de téléphone',
        timestamp: '2025-10-17 14:15:00',
        type: 'update',
        icon: '✏️'
      },
      {
        id: '3',
        title: 'Vente enregistrée',
        description: '5 bouteilles de Château Margaux - 125 000 FCFA',
        timestamp: '2025-10-17 11:45:00',
        type: 'sale',
        icon: '💰'
      },
      {
        id: '4',
        title: 'Mise à jour de stock',
        description: '50 bouteilles ajoutées - Cave Principale',
        timestamp: '2025-10-16 09:20:00',
        type: 'stock',
        icon: '📥'
      },
      {
        id: '5',
        title: 'Rapport mensuel généré',
        description: 'Rapport de performance de septembre 2025',
        timestamp: '2025-10-15 16:00:00',
        type: 'system',
        icon: '📊'
      },
      {
        id: '6',
        title: 'Vente enregistrée',
        description: '2 bouteilles de Dom Pérignon - 90 000 FCFA',
        timestamp: '2025-10-15 13:30:00',
        type: 'sale',
        icon: '💰'
      },
      {
        id: '7',
        title: 'Changement de mot de passe',
        description: 'Mise à jour du mot de passe de sécurité',
        timestamp: '2025-10-14 10:00:00',
        type: 'system',
        icon: '🔐'
      },
      {
        id: '8',
        title: 'Connexion au système',
        description: 'Connexion à DrinkStore Pro',
        timestamp: '2025-10-14 08:00:00',
        type: 'login',
        icon: '🔓'
      }
    ];

    // Ajoute les activités au profil utilisateur
    if (this.userProfile) {
      this.userProfile.activities = this.allActivities;
    }
  }

  // ===== MÉTHODE D'ACTIVATION DU MODE ÉDITION =====
  /**
   * Active le mode édition du profil
   */
  startEditingProfile(): void {
    // Active le flag de mode édition
    this.isEditingProfile = true;
  }

  // ===== MÉTHODE D'ANNULATION DE L'ÉDITION =====
  /**
   * Annule les modifications et quitte le mode édition
   */
  cancelEditingProfile(): void {
    // Désactive le mode édition
    this.isEditingProfile = false;

    // Récharge le profil depuis les données (annule les changements)
    this.loadUserProfile();
  }

  // ===== MÉTHODE DE SAUVEGARDE DU PROFIL =====
  /**
   * Sauvegarde les modifications du profil
   */
  saveProfile(): void {
    // Vérifie que le formulaire est valide
    if (this.profileForm.invalid) {
      // Affiche une erreur
      this.showMessage('⚠️ Veuillez remplir tous les champs obligatoires correctement', 'error');
      return;
    }

    // Vérifie que le profil utilisateur existe
    if (!this.userProfile) {
      this.showMessage('⚠️ Erreur: profil utilisateur non trouvé', 'error');
      return;
    }

    // Met à jour le profil avec les valeurs du formulaire
    this.userProfile.firstName = this.profileForm.get('firstName')?.value;
    this.userProfile.lastName = this.profileForm.get('lastName')?.value;
    this.userProfile.email = this.profileForm.get('email')?.value;
    this.userProfile.phone = this.profileForm.get('phone')?.value;
    this.userProfile.birthDate = this.profileForm.get('birthDate')?.value;
    this.userProfile.address = this.profileForm.get('address')?.value;
    this.userProfile.emergencyContact = this.profileForm.get('emergencyContact')?.value;
    this.userProfile.emergencyPhone = this.profileForm.get('emergencyPhone')?.value;
    this.userProfile.bankAccount = this.profileForm.get('bankAccount')?.value;
    this.userProfile.bankName = this.profileForm.get('bankName')?.value;
    this.userProfile.socialSecurityNumber = this.profileForm.get('socialSecurityNumber')?.value;

    // Met à jour la date de dernière modification
    this.userProfile.lastUpdateDate = new Date().toISOString().split('T')[0];

    // Désactive le mode édition
    this.isEditingProfile = false;

    // Affiche un message de succès
    this.showMessage('✓ Profil mis à jour avec succès !', 'success');
  }

  // ===== MÉTHODE DE CHANGEMENT DE MOT DE PASSE =====
  /**
   * Change le mot de passe utilisateur
   */
  changePassword(): void {
    // Vérifie que le formulaire de mot de passe est valide
    if (this.passwordForm.invalid) {
      // Affiche une erreur
      this.showMessage('⚠️ Veuillez remplir tous les champs correctement', 'error');
      return;
    }

    // Récupère le nouveau mot de passe
    const newPassword = this.passwordForm.get('newPassword')?.value;

    // Récupère la confirmation du mot de passe
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;

    // Vérifie que les deux mots de passe correspondent
    if (newPassword !== confirmPassword) {
      // Affiche une erreur
      this.showMessage('⚠️ Les mots de passe ne correspondent pas', 'error');
      return;
    }

    // En production, on enverrait une requête au serveur
    // Ici on simule juste la réussite
    this.showMessage('✓ Mot de passe changé avec succès !', 'success');

    // Réinitialise le formulaire de mot de passe
    this.passwordForm.reset();

    // Désactive le mode changement de mot de passe
    this.isChangingPassword = false;
  }

  // ===== MÉTHODE D'ÉVALUATION DE LA RÉSISTANCE DU MOT DE PASSE =====
  /**
   * Évalue la résistance du mot de passe saisi
   */
  evaluatePasswordStrength(): void {
    // Récupère le nouveau mot de passe
    const password = this.passwordForm.get('newPassword')?.value || '';

    // Initilialise le score à 0
    let strength = 0;

    // Ajoute 1 point si le mot de passe contient au moins 8 caractères
    if (password.length >= 8) strength++;

    // Ajoute 1 point s'il contient des lettres majuscules
    if (/[A-Z]/.test(password)) strength++;

    // Ajoute 1 point s'il contient des lettres minuscules
    if (/[a-z]/.test(password)) strength++;

    // Ajoute 1 point s'il contient des chiffres
    if (/\d/.test(password)) strength++;

    // Ajoute 1 point s'il contient des caractères spéciaux
    if (/[!@#$%^&*]/.test(password)) strength++;

    // Détermine le niveau de résistance basé sur le score
    if (strength <= 2) {
      this.passwordStrength = 'weak';
    } else if (strength <= 4) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  // ===== MÉTHODE D'AFFICHAGE/MASQUAGE DES MOTS DE PASSE =====
  /**
   * Bascule l'affichage des mots de passe
   */
  togglePasswordVisibility(): void {
    // Inverse le flag d'affichage
    this.showPasswords = !this.showPasswords;
  }

  // ===== MÉTHODE DE CALCUL DE POURCENTAGE DE PROFIL COMPLET =====
  /**
   * Calcule le pourcentage de complétude du profil
   * @returns Le pourcentage entre 0 et 100
   */
  getProfileCompletion(): number {
    // Vérifie que le profil existe
    if (!this.userProfile) return 0;

    // Initialise le compteur de champs
    let completedFields = 0;
    const totalFields = 10; // Nombre de champs à considérer

    // Vérifie chaque champ obligatoire
    if (this.userProfile.firstName) completedFields++;
    if (this.userProfile.lastName) completedFields++;
    if (this.userProfile.email) completedFields++;
    if (this.userProfile.phone) completedFields++;
    if (this.userProfile.birthDate) completedFields++;
    if (this.userProfile.address) completedFields++;
    if (this.userProfile.emergencyContact) completedFields++;
    if (this.userProfile.emergencyPhone) completedFields++;
    if (this.userProfile.bankAccount) completedFields++;
    if (this.userProfile.bankName) completedFields++;

    // Retourne le pourcentage
    return Math.round((completedFields / totalFields) * 100);
  }

  // ===== MÉTHODE D'AFFICHAGE DE MESSAGE =====
  /**
   * Affiche un message temporaire (succès, erreur, info)
   * @param msg Le message à afficher
   * @param type Le type de message
   */
  showMessage(msg: string, type: 'success' | 'error' | 'info'): void {
    // Stocke le message
    this.message = msg;

    // Stocke le type de message
    this.messageType = type;

    // Efface le message après 3 secondes
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  // ===== MÉTHODE DE CHANGEMENT D'AVATAR =====
  /**
   * Change l'avatar sélectionné
   * @param avatar Le nouvel avatar (emoji)
   */
  selectAvatar(avatar: string): void {
    // Stocke le nouvel avatar
    this.selectedAvatar = avatar;

    // Met à jour le profil avec le nouvel avatar
    if (this.userProfile) {
      this.userProfile.avatar = avatar;
    }
  }

  // ===== MÉTHODE DE DÉTERMINATION DE LA CLASSE DE BADGE D'ACTIVITÉ =====
  /**
   * Retourne la classe CSS pour le badge du type d'activité
   * @param type Le type d'activité
   * @returns La classe CSS correspondante
   */
  getActivityBadgeClass(type: string): string {
    // Retourne une classe différente selon le type d'activité
    switch (type) {
      case 'login':
        return 'badge-login';
      case 'update':
        return 'badge-update';
      case 'sale':
        return 'badge-sale';
      case 'stock':
        return 'badge-stock';
      case 'system':
        return 'badge-system';
      default:
        return 'badge-default';
    }
  }

  // ===== MÉTHODE DE FORMATAGE DE DATE =====
  /**
   * Formate une date en format lisible
   * @param dateString La date en string
   * @returns La date formatée
   */
  formatDate(dateString: string): string {
    // Crée un objet Date à partir du string
    const date = new Date(dateString);

    // Retourne la date formatée en français
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
  return amount.toLocaleString('fr-FR') + ' FCFA';
}

  // ===== MÉTHODE D'OBTENTION DES ACTIVITÉS À AFFICHER =====
  /**
   * Retourne les activités à afficher (avec limite)
   * @returns Les activités filtrées
   */
  getDisplayedActivities(): Activity[] {
    // Retourne les X premières activités (où X = activitiesDisplayCount)
    return this.allActivities.slice(0, this.activitiesDisplayCount);
  }

  // ===== MÉTHODE D'AFFICHAGE DE PLUS D'ACTIVITÉS =====
  /**
   * Charge et affiche plus d'activités
   */
  loadMoreActivities(): void {
    // Augmente le nombre d'activités à afficher (par 5)
    this.activitiesDisplayCount += 5;

    // Limite à la taille maximum de la liste
    if (this.activitiesDisplayCount > this.allActivities.length) {
      this.activitiesDisplayCount = this.allActivities.length;
    }
  }

  // ===== MÉTHODE DE CHANGEMENT D'ONGLET =====
  /**
   * Change l'onglet actif
   * @param tab Le nom de l'onglet à afficher
   */
  switchTab(tab: 'info' | 'stats' | 'activities' | 'security'): void {
    // Met à jour l'onglet actif
    this.activeTab = tab;
  }

  // ===== MÉTHODE DE VÉRIFICATION DE VALIDITÉ DE CHAMP =====
  /**
   * Vérifie si un champ du formulaire est invalide et a été touché
   * @param fieldName Le nom du champ
   * @returns true si le champ est invalide et touché
   */
  isFieldInvalid(fieldName: string): boolean {
    // Récupère le champ du formulaire de profil
    const field = this.profileForm.get(fieldName);

    // Retourne true si le champ est invalide ET a été touché
    return !!(field && field.invalid && field.touched);
  }

  // ===== MÉTHODE DE TÉLÉCHARGEMENT DE RAPPORT =====
  /**
   * Télécharge un rapport du profil utilisateur
   */
  downloadReport(): void {
    // Affiche un message d'information
    this.showMessage('📥 Rapport en cours de téléchargement...', 'info');

    // Simule le téléchargement (en production, ce serait un appel API)
    setTimeout(() => {
      // Affiche un message de succès
      this.showMessage('✓ Rapport téléchargé avec succès !', 'success');
    }, 2000);
  }

  // ===== MÉTHODE D'EXPORT DES DONNÉES =====
  /**
   * Exporte les données du profil en JSON
   */
  exportProfileData(): void {
    // Vérifie que le profil existe
    if (!this.userProfile) {
      this.showMessage('⚠️ Erreur: profil utilisateur non trouvé', 'error');
      return;
    }

    // Crée une chaîne JSON du profil
    const dataString = JSON.stringify(this.userProfile, null, 2);

    // Crée un blob à partir de la chaîne
    const blob = new Blob([dataString], { type: 'application/json' });

    // Crée une URL pour le blob
    const url = URL.createObjectURL(blob);

    // Crée un élément <a> pour télécharger
    const link = document.createElement('a');
    link.href = url;
    link.download = `profil_${this.userProfile.firstName}_${this.userProfile.lastName}.json`;

    // Déclenche le téléchargement
    link.click();

    // Libère l'URL
    URL.revokeObjectURL(url);

    // Affiche un message de succès
    this.showMessage('✓ Données exportées avec succès !', 'success');
  }

  // ===== MÉTHODE DE DÉCONNEXION =====
  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    // Demande une confirmation
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      // Affiche un message d'information
      this.showMessage('👋 Déconnexion en cours...', 'info');

      // Redirige vers la page de connexion après 1 seconde
      setTimeout(() => {
        // En production: this.router.navigate(['/login']);
        console.log('Redirection vers la page de connexion');
      }, 1000);
    }
  }
}
