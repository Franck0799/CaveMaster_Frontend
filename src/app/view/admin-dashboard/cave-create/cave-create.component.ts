// ===== FICHIER: cave-create.component.ts =====
// Ce composant gère la création et la modification d'une cave

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Interface pour représenter une cave
interface Cave {
  id: string;           // Identifiant unique de la cave
  name: string;         // Nom de la cave
  location: string;     // Localisation de la cave
  capacity: number;     // Capacité de stockage en bouteilles
  description: string;  // Description détaillée
  createdDate: string;  // Date de création
  managersCount: number; // Nombre de managers assignés
  employeesCount: number; // Nombre d'employés assignés
}

@Component({
  selector: 'app-cave-create',
  standalone: true,
  // Import des modules nécessaires
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cave-create.component.html',
  styleUrls: ['./cave-create.component..scss']
})
export class CaveCreateComponent implements OnInit {

  // ===== PROPRIÉTÉS DU COMPOSANT =====

  // Formulaire réactif pour la création/modification de cave
  caveForm: FormGroup;

  // Flag pour déterminer si c'est une modification ou création
  isEditing: boolean = false;

  // Liste de toutes les caves
  caves: Cave[] = [];

  // Cave actuellement en édition
  selectedCave: Cave | null = null;

  // Message de succès/erreur
  message: string = '';

  // Type de message (success, error, info)
  messageType: 'success' | 'error' | 'info' = 'info';

  // Liste des régions disponibles pour la localisation
  regions: string[] = [
    'Lekki Phase 1, Lagos',
    'Victoria Island, Lagos',
    'Ikoyi, Lagos',
    'Ajah, Lagos',
    'Ikeja, Lagos',
    'Surulere, Lagos',
    'Bariga, Lagos'
  ];

  // ===== CONSTRUCTEUR AVEC INJECTION DE DÉPENDANCES =====
  constructor(private formBuilder: FormBuilder) {
    // Initialise le formulaire réactif avec FormBuilder
    this.caveForm = this.formBuilder.group({
      // Champ nom : obligatoire, min 3 caractères
      name: ['', [Validators.required, Validators.minLength(3)]],

      // Champ localisation : obligatoire
      location: ['', Validators.required],

      // Champ capacité : obligatoire, doit être un nombre > 0
      capacity: ['', [Validators.required, Validators.min(1)]],

      // Champ description : optionnel
      description: ['']
    });
  }

  // ===== MÉTHODE D'INITIALISATION =====
  ngOnInit(): void {
    // Charge les données des caves au démarrage du composant
    this.loadCaves();
  }

  // ===== MÉTHODE DE CHARGEMENT DES CAVES =====
  /**
   * Charge la liste de toutes les caves depuis les données mockées
   * À remplacer par un appel API backend
   */
  loadCaves(): void {
    // Données mockées - à remplacer par un service API
    this.caves = [
      {
        id: 'principale',
        name: 'Cave Principale',
        location: 'Lekki Phase 1, Lagos',
        capacity: 500,
        description: 'Cave principale avec température contrôlée',
        createdDate: '2023-01-15',
        managersCount: 3,
        employeesCount: 12
      },
      {
        id: 'secondaire',
        name: 'Cave Secondaire',
        location: 'Victoria Island, Lagos',
        capacity: 350,
        description: 'Cave secondaire pour stocks additionnels',
        createdDate: '2023-03-20',
        managersCount: 2,
        employeesCount: 8
      }
    ];
  }

  // ===== MÉTHODE DE CRÉATION DE CAVE =====
  /**
   * Crée une nouvelle cave avec les données du formulaire
   */
  createCave(): void {
    // Vérifie que le formulaire est valide avant de continuer
    if (this.caveForm.invalid) {
      // Affiche un message d'erreur
      this.showMessage('⚠️ Veuillez remplir tous les champs obligatoires correctement', 'error');
      return;
    }

    // Crée une nouvelle cave avec les valeurs du formulaire
    const newCave: Cave = {
      // Génère un ID unique basé sur le timestamp
      id: 'cave_' + Date.now(),

      // Récupère la valeur du champ nom du formulaire
      name: this.caveForm.get('name')?.value,

      // Récupère la valeur du champ localisation
      location: this.caveForm.get('location')?.value,

      // Récupère la capacité et la convertit en nombre
      capacity: parseInt(this.caveForm.get('capacity')?.value),

      // Récupère la description
      description: this.caveForm.get('description')?.value || '',

      // Définit la date de création à aujourd'hui
      createdDate: new Date().toISOString().split('T')[0],

      // Initialise le nombre de managers à 0
      managersCount: 0,

      // Initialise le nombre d'employés à 0
      employeesCount: 0
    };

    // Ajoute la nouvelle cave à la liste
    this.caves.push(newCave);

    // Affiche un message de succès
    this.showMessage('✓ Cave créée avec succès !', 'success');

    // Réinitialise le formulaire
    this.resetForm();
  }

  // ===== MÉTHODE DE MISE À JOUR DE CAVE =====
  /**
   * Met à jour une cave existante
   */
  updateCave(): void {
    // Vérifie que le formulaire est valide
    if (this.caveForm.invalid) {
      // Affiche une erreur
      this.showMessage('⚠️ Veuillez remplir tous les champs obligatoires correctement', 'error');
      return;
    }

    // Vérifie qu'une cave est sélectionnée pour édition
    if (!this.selectedCave) {
      // Affiche une erreur si aucune cave n'est sélectionnée
      this.showMessage('⚠️ Aucune cave sélectionnée', 'error');
      return;
    }

    // Trouve l'index de la cave sélectionnée dans la liste
    const index = this.caves.findIndex(c => c.id === this.selectedCave?.id);

    // Vérifie que la cave a été trouvée
    if (index !== -1) {
      // Met à jour les propriétés de la cave avec les valeurs du formulaire
      this.caves[index].name = this.caveForm.get('name')?.value;
      this.caves[index].location = this.caveForm.get('location')?.value;
      this.caves[index].capacity = parseInt(this.caveForm.get('capacity')?.value);
      this.caves[index].description = this.caveForm.get('description')?.value;
    }

    // Affiche un message de succès
    this.showMessage('✓ Cave mise à jour avec succès !', 'success');

    // Réinitialise le formulaire et le mode édition
    this.resetForm();
  }

  // ===== MÉTHODE POUR ÉDITER UNE CAVE =====
  /**
   * Édite une cave existante
   * @param cave La cave à éditer
   */
  editCave(cave: Cave): void {
    // Active le mode édition
    this.isEditing = true;

    // Stocke la cave sélectionnée
    this.selectedCave = cave;

    // Remplir le formulaire avec les données de la cave
    this.caveForm.patchValue({
      // Remplit le champ nom
      name: cave.name,
      // Remplit le champ localisation
      location: cave.location,
      // Remplit le champ capacité
      capacity: cave.capacity,
      // Remplit le champ description
      description: cave.description
    });
  }

  // ===== MÉTHODE POUR SUPPRIMER UNE CAVE =====
  /**
   * Supprime une cave après confirmation
   * @param caveId L'ID de la cave à supprimer
   */
  deleteCave(caveId: string): void {
    // Demande une confirmation avant la suppression
    if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer cette cave ? Cette action est irréversible.')) {
      // Filtre la cave de la liste (suppression)
      this.caves = this.caves.filter(c => c.id !== caveId);

      // Affiche un message de succès
      this.showMessage('✓ Cave supprimée avec succès !', 'success');
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
      // Si oui, met à jour la cave existante
      this.updateCave();
    } else {
      // Sinon, crée une nouvelle cave
      this.createCave();
    }
  }

  // ===== MÉTHODE DE RÉINITIALISATION =====
  /**
   * Réinitialise le formulaire et les variables d'état
   */
  resetForm(): void {
    // Réinitialise le formulaire aux valeurs par défaut
    this.caveForm.reset();

    // Désactive le mode édition
    this.isEditing = false;

    // Efface la sélection de cave
    this.selectedCave = null;
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

  // ===== MÉTHODE DE CALCUL DE TAUX D'OCCUPATION =====
  /**
   * Calcule le pourcentage d'occupation d'une cave
   * @param cave La cave à calculer
   * @returns Le pourcentage d'occupation
   */
  getOccupancyRate(cave: Cave): number {
    // Retourne un pourcentage entre 0 et 100 (simulation)
    return Math.floor(Math.random() * 100);
  }

  // ===== MÉTHODE DE VÉRIFICATION DE FORMULARITÉ =====
  /**
   * Vérifie si un champ du formulaire est invalide et a été touché
   * @param fieldName Le nom du champ
   * @returns true si le champ est invalide et touché
   */
  isFieldInvalid(fieldName: string): boolean {
    // Récupère le champ du formulaire
    const field = this.caveForm.get(fieldName);

    // Retourne true si le champ est invalide ET a été touché
    return !!(field && field.invalid && field.touched);
  }
}
