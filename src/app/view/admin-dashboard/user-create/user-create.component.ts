// ===== FICHIER: user-create.component.ts =====
// Ce composant gère la création et la modification d'un utilisateur (employé ou manager)

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Interface pour représenter un utilisateur
interface User {
  id: string;           // Identifiant unique
  firstName: string;    // Prénom
  lastName: string;     // Nom de famille
  email: string;        // Email
  phone: string;        // Téléphone
  role: string;         // Rôle/Poste
  avatar: string;       // Emoji d'avatar
  cave: string;         // Cave d'affectation
  manager?: string;     // Manager de supervision (optionnel)
  status: 'active' | 'inactive' | 'on-leave'; // Statut
  joinDate: string;     // Date d'embauche
}

@Component({
  selector: 'app-user-create',
  standalone: true,
  // Imports des modules nécessaires
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {

  // ===== PROPRIÉTÉS DU COMPOSANT =====

  // Formulaire réactif pour création/modification d'utilisateur
  userForm: FormGroup;

  // Flag indiquant si on est en mode édition
  isEditing: boolean = false;

  // Liste de tous les utilisateurs
  users: User[] = [];

  // Utilisateur actuellement en édition
  selectedUser: User | null = null;

  // Message de succès/erreur
  message: string = '';

  // Type de message (success, error, info)
  messageType: 'success' | 'error' | 'info' = 'info';

  // Liste des rôles disponibles
  roles: string[] = [
    'Manager Principal',
    'Manager Adjoint',
    'Manager Nuit',
    'Caissier(ère)',
    'Vendeur(se)',
    'Magasinier',
    'Livreur',
    'Assistant(e)',
    'Sommelier',
    'Conseiller(ère)'
  ];

  // Liste des caves disponibles
  caves: string[] = [
    'Cave Principale',
    'Cave Secondaire',
    'Cave Premium'
  ];

  // Liste des statuts disponibles
  statuses: string[] = ['active', 'inactive', 'on-leave'];

  // Liste des managers pour supervision (filtrée par cave)
  managers: User[] = [];

  // Avatars disponibles (emojis)
  availableAvatars: string[] = [
    '👨‍💼', '👩‍💼', '👨', '👩', '👨‍🔬', '👩‍💻', '👨‍⚕️', '👩‍⚕️'
  ];

  // Avatar sélectionné pour le nouvel utilisateur
  selectedAvatar: string = '👨';

  // ===== CONSTRUCTEUR AVEC INJECTION DE DÉPENDANCES =====
  constructor(private formBuilder: FormBuilder) {
    // Initialise le formulaire réactif avec validation
    this.userForm = this.formBuilder.group({
      // Champ prénom : obligatoire, min 2 caractères
      firstName: ['', [Validators.required, Validators.minLength(2)]],

      // Champ nom : obligatoire, min 2 caractères
      lastName: ['', [Validators.required, Validators.minLength(2)]],

      // Champ email : obligatoire, doit être un email valide
      email: ['', [Validators.required, Validators.email]],

      // Champ téléphone : optionnel, pattern pour validé le format
      phone: ['', [Validators.pattern(/^\+?[0-9\s\-\(\)]+$/)]],

      // Champ rôle : obligatoire
      role: ['', Validators.required],

      // Champ cave : obligatoire
      cave: ['', Validators.required],

      // Champ manager : optionnel (seulement pour les employés)
      manager: [''],

      // Champ statut : obligatoire, valeur par défaut 'active'
      status: ['active', Validators.required],

      // Champ date d'embauche : obligatoire
      joinDate: ['', Validators.required]
    });
  }

  // ===== MÉTHODE D'INITIALISATION =====
  ngOnInit(): void {
    // Charge les données des utilisateurs au démarrage
    this.loadUsers();
  }

  // ===== MÉTHODE DE CHARGEMENT DES UTILISATEURS =====
  /**
   * Charge la liste de tous les utilisateurs
   * À remplacer par un appel API backend
   */
  loadUsers(): void {
    // Données mockées des utilisateurs
    this.users = [
      {
        id: 'user_1',
        firstName: 'Jean',
        lastName: 'Kouassi',
        email: 'jean.kouassi@caveviking.com',
        phone: '+234 801 234 5678',
        role: 'Manager Principal',
        avatar: '👨‍💼',
        cave: 'Cave Principale',
        status: 'active',
        joinDate: '2023-01-15'
      },
      {
        id: 'user_2',
        firstName: 'Marie',
        lastName: 'Diabate',
        email: 'marie.diabate@caveviking.com',
        phone: '+234 802 345 6789',
        role: 'Manager Adjoint',
        avatar: '👩‍💼',
        cave: 'Cave Principale',
        status: 'active',
        joinDate: '2023-03-20'
      },
      {
        id: 'user_3',
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'alice.martin@caveviking.com',
        phone: '+234 803 456 7890',
        role: 'Caissière',
        avatar: '👩',
        cave: 'Cave Principale',
        manager: 'Jean Kouassi',
        status: 'active',
        joinDate: '2023-02-10'
      }
    ];

    // Met à jour la liste des managers disponibles
    this.updateManagersList();
  }

  // ===== MÉTHODE DE MISE À JOUR DE LA LISTE DES MANAGERS =====
  /**
   * Met à jour la liste des managers basée sur la cave sélectionnée
   */
  updateManagersList(): void {
    // Récupère la cave sélectionnée depuis le formulaire
    const selectedCave = this.userForm.get('cave')?.value;

    // Filtre les managers de la cave sélectionnée
    // (un manager doit avoir "Manager" dans son rôle)
    this.managers = this.users.filter(user =>
      user.cave === selectedCave &&
      (user.role.includes('Manager') || user.role === 'Sommelier' || user.role === 'Conseiller(ère)')
    );
  }

  // ===== MÉTHODE DE CRÉATION D'UTILISATEUR =====
  /**
   * Crée un nouvel utilisateur avec les données du formulaire
   */
  createUser(): void {
    // Vérifie que le formulaire est valide
    if (this.userForm.invalid) {
      // Affiche un message d'erreur
      this.showMessage('⚠️ Veuillez remplir tous les champs obligatoires correctement', 'error');
      return;
    }

    // Crée un nouvel utilisateur avec les valeurs du formulaire
    const newUser: User = {
      // Génère un ID unique basé sur le timestamp
      id: 'user_' + Date.now(),

      // Récupère le prénom
      firstName: this.userForm.get('firstName')?.value,

      // Récupère le nom
      lastName: this.userForm.get('lastName')?.value,

      // Récupère l'email
      email: this.userForm.get('email')?.value,

      // Récupère le téléphone (optionnel)
      phone: this.userForm.get('phone')?.value || '',

      // Récupère le rôle
      role: this.userForm.get('role')?.value,

      // Utilise l'avatar sélectionné
      avatar: this.selectedAvatar,

      // Récupère la cave
      cave: this.userForm.get('cave')?.value,

      // Récupère le manager (optionnel)
      manager: this.userForm.get('manager')?.value || undefined,

      // Récupère le statut (valeur par défaut 'active')
      status: this.userForm.get('status')?.value || 'active',

      // Utilise la date d'embauche fournie ou aujourd'hui
      joinDate: this.userForm.get('joinDate')?.value || new Date().toISOString().split('T')[0]
    };

    // Ajoute le nouvel utilisateur à la liste
    this.users.push(newUser);

    // Affiche un message de succès
    this.showMessage('✓ Utilisateur créé avec succès !', 'success');

    // Réinitialise le formulaire
    this.resetForm();
  }

  // ===== MÉTHODE DE MISE À JOUR D'UTILISATEUR =====
  /**
   * Met à jour un utilisateur existant
   */
  updateUser(): void {
    // Vérifie que le formulaire est valide
    if (this.userForm.invalid) {
      // Affiche une erreur
      this.showMessage('⚠️ Veuillez remplir tous les champs obligatoires correctement', 'error');
      return;
    }

    // Vérifie qu'un utilisateur est sélectionné pour édition
    if (!this.selectedUser) {
      // Affiche une erreur
      this.showMessage('⚠️ Aucun utilisateur sélectionné', 'error');
      return;
    }

    // Trouve l'index de l'utilisateur sélectionné
    const index = this.users.findIndex(u => u.id === this.selectedUser?.id);

    // Vérifie que l'utilisateur a été trouvé
    if (index !== -1) {
      // Met à jour les propriétés de l'utilisateur
      this.users[index].firstName = this.userForm.get('firstName')?.value;
      this.users[index].lastName = this.userForm.get('lastName')?.value;
      this.users[index].email = this.userForm.get('email')?.value;
      this.users[index].phone = this.userForm.get('phone')?.value;
      this.users[index].role = this.userForm.get('role')?.value;
      this.users[index].cave = this.userForm.get('cave')?.value;
      this.users[index].manager = this.userForm.get('manager')?.value;
      this.users[index].status = this.userForm.get('status')?.value;
      this.users[index].joinDate = this.userForm.get('joinDate')?.value;
    }

    // Affiche un message de succès
    this.showMessage('✓ Utilisateur mis à jour avec succès !', 'success');

    // Réinitialise le formulaire
    this.resetForm();
  }

  // ===== MÉTHODE POUR ÉDITER UN UTILISATEUR =====
  /**
   * Édite un utilisateur existant
   * @param user L'utilisateur à éditer
   */
  editUser(user: User): void {
    // Active le mode édition
    this.isEditing = true;

    // Stocke l'utilisateur sélectionné
    this.selectedUser = user;

    // Stocke l'avatar actuel
    this.selectedAvatar = user.avatar;

    // Remplir le formulaire avec les données de l'utilisateur
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      cave: user.cave,
      manager: user.manager || '',
      status: user.status,
      joinDate: user.joinDate
    });

    // Met à jour la liste des managers pour la cave sélectionnée
    this.updateManagersList();
  }

  // ===== MÉTHODE POUR SUPPRIMER UN UTILISATEUR =====
  /**
   * Supprime un utilisateur après confirmation
   * @param userId L'ID de l'utilisateur à supprimer
   */
  deleteUser(userId: string): void {
    // Demande une confirmation avant la suppression
    if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      // Filtre l'utilisateur de la liste (suppression)
      this.users = this.users.filter(u => u.id !== userId);

      // Affiche un message de succès
      this.showMessage('✓ Utilisateur supprimé avec succès !', 'success');
    }
  }

  // ===== MÉTHODE DE SOUMISSION DU FORMULAIRE =====
  /**
   * Gère la soumission du formulaire
   * Crée ou met à jour selon le mode
   */
  submitForm(): void {
    // Vérifie si on est en mode édition
    if (this.isEditing) {
      // Si oui, met à jour l'utilisateur existant
      this.updateUser();
    } else {
      // Sinon, crée un nouvel utilisateur
      this.createUser();
    }
  }

  // ===== MÉTHODE DE RÉINITIALISATION =====
  /**
   * Réinitialise le formulaire et les variables d'état
   */
  resetForm(): void {
    // Réinitialise le formulaire aux valeurs par défaut
    this.userForm.reset({
      status: 'active'  // Statut par défaut
    });

    // Réinitialise l'avatar sélectionné
    this.selectedAvatar = '👨';

    // Désactive le mode édition
    this.isEditing = false;

    // Efface la sélection d'utilisateur
    this.selectedUser = null;

    // Vide la liste des managers
    this.managers = [];
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

  // ===== MÉTHODE DE GESTION DU CHANGEMENT D'AVATAR =====
  /**
   * Change l'avatar sélectionné
   * @param avatar Le nouvel avatar
   */
  selectAvatar(avatar: string): void {
    // Stocke le nouvel avatar
    this.selectedAvatar = avatar;
  }

  // ===== MÉTHODE DE VÉRIFICATION DE VALIDITÉ DU CHAMP =====
  /**
   * Vérifie si un champ du formulaire est invalide et a été touché
   * @param fieldName Le nom du champ
   * @returns true si le champ est invalide et touché
   */
  isFieldInvalid(fieldName: string): boolean {
    // Récupère le champ du formulaire
    const field = this.userForm.get(fieldName);

    // Retourne true si le champ est invalide ET a été touché
    return !!(field && field.invalid && field.touched);
  }

  // ===== MÉTHODE DE GESTION DU CHANGEMENT DE CAVE =====
  /**
   * Réagit aux changements du champ cave
   */
  onCaveChange(): void {
    // Met à jour la liste des managers pour la nouvelle cave
    this.updateManagersList();

    // Réinitialise la sélection du manager
    this.userForm.patchValue({
      manager: ''
    });
  }

  // ===== MÉTHODE DE DÉTERMINATION DU TYPE DE RÔLE =====
  /**
   * Détermine si un rôle est celui d'un manager
   * @param role Le rôle à vérifier
   * @returns true si c'est un manager
   */
  isManagerRole(role: string): boolean {
    // Vérifie si le rôle contient "Manager"
    return role.includes('Manager');
  }
}
