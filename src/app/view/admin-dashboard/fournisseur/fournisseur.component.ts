import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * Interface définissant la structure d'un fournisseur
 */
interface Fournisseur {
  id: number;
  nomEntreprise: string;
  categorie: 'Vins & Spiritueux' | 'Mets et Vin' | 'Matériel';
  typeActivite: string;
  contact: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  pays: string;
  siteWeb?: string;
  numeroTVA: string;
  datePartenariat: Date;
  statut: 'actif' | 'inactif' | 'suspendu';
  noteFournisseur?: number;
}

@Component({
  selector: 'app-fournisseur',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.scss']
})
export class FournisseursComponent implements OnInit {

  // ==================== VARIABLES DE DONNÉES ====================
  fournisseurs: Fournisseur[] = [];
  fournisseursFiltres: Fournisseur[] = [];
  fournisseurSelectionne: Fournisseur | null = null;
  fournisseurEnEdition: Fournisseur | null = null;

  // ==================== VARIABLES DE RECHERCHE / FILTRES ====================
  recherche: string = '';
  filtreCategorie: string = 'tous';
  filtreStatut: string = 'tous';

  // ==================== VARIABLES DES MODALS ====================
  isAddModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  isDetailsModalOpen: boolean = false;

  // ==================== FORMULAIRES ====================
  fournisseurForm!: FormGroup;
  editForm!: FormGroup;
  submitted = false;

  // ==================== LISTES DE RÉFÉRENCE ====================
  pays: string[] = [
    'Côte d\'Ivoire', 'France', 'Sénégal', 'Mali', 'Burkina Faso',
    'Ghana', 'Togo', 'Bénin', 'Niger', 'Guinée'
  ];

  categories: string[] = [
    'Vins & Spiritueux',
    'Mets et Vin',
    'Matériel'
  ];

  // Tous les types d'activité par catégorie
  typesActiviteParCategorie: { [key: string]: string[] } = {
    'Vins & Spiritueux': [
      'Vins',
      'Spiritueux',
      'Bières',
      'Champagnes',
      'Vins & Spiritueux',
      'Vins & Champagnes',
      'Bières & Spiritueux',
      'Tous Alcools'
    ],
    'Mets et Vin': [
      'Traiteur',
      'Charcuterie Fine',
      'Fromages',
      'Chocolats',
      'Pâtisserie',
      'Produits du Terroir',
      'Épicerie Fine',
      'Produits Gastronomiques'
    ],
    'Matériel': [
      'Verres & Carafes',
      'Tire-bouchons & Accessoires',
      'Caves à Vin',
      'Mobilier',
      'Équipement Bar',
      'Matériel de Service',
      'Décoration',
      'Matériel Professionnel'
    ]
  };

  // Types d'activité filtrés selon la catégorie sélectionnée
  typesActiviteFiltered: string[] = [];
  typesActiviteFilteredEdit: string[] = [];

  // ==================== CONSTRUCTEUR ====================
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  // ==================== INITIALISATION ====================
  ngOnInit(): void {
    this.initForms();
    this.chargerFournisseurs();
  }

  // ==================== INITIALISATION DES FORMULAIRES ====================
  initForms(): void {
    this.fournisseurForm = this.fb.group({
      nomEntreprise: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      categorie: ['', Validators.required],
      typeActivite: ['', Validators.required],
      contact: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s-()]+$/)]],
      adresse: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      ville: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      pays: ['', Validators.required],
      siteWeb: ['', [Validators.pattern(/^(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)]],
      numeroTVA: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      statut: ['actif', Validators.required],
      noteFournisseur: ['', [Validators.min(0), Validators.max(5)]]
    });

    this.editForm = this.fb.group({
      nomEntreprise: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      categorie: ['', Validators.required],
      typeActivite: ['', Validators.required],
      contact: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s-()]+$/)]],
      adresse: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      ville: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      pays: ['', Validators.required],
      siteWeb: ['', [Validators.pattern(/^(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)]],
      numeroTVA: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      statut: ['actif', Validators.required],
      noteFournisseur: ['', [Validators.min(0), Validators.max(5)]]
    });
  }

  // ==================== GESTION DYNAMIQUE DES TYPES D'ACTIVITÉ ====================
  onCategorieChange(): void {
    const categorie = this.fournisseurForm.get('categorie')?.value;
    if (categorie && this.typesActiviteParCategorie[categorie]) {
      this.typesActiviteFiltered = this.typesActiviteParCategorie[categorie];
      this.fournisseurForm.patchValue({ typeActivite: '' });
    } else {
      this.typesActiviteFiltered = [];
    }
  }

  onCategorieChangeEdit(): void {
    const categorie = this.editForm.get('categorie')?.value;
    if (categorie && this.typesActiviteParCategorie[categorie]) {
      this.typesActiviteFilteredEdit = this.typesActiviteParCategorie[categorie];
      // Ne pas réinitialiser typeActivite lors de l'édition si c'est valide
      const currentType = this.editForm.get('typeActivite')?.value;
      if (!this.typesActiviteFilteredEdit.includes(currentType)) {
        this.editForm.patchValue({ typeActivite: '' });
      }
    } else {
      this.typesActiviteFilteredEdit = [];
    }
  }

  // ==================== CHARGEMENT DES DONNÉES ====================
  chargerFournisseurs(): void {
    this.fournisseurs = [
      {
        id: 1,
        nomEntreprise: 'Domaine Kouassi Vins',
        categorie: 'Vins & Spiritueux',
        typeActivite: 'Vins',
        contact: 'Yao Kouassi',
        email: 'contact@domainekouassi.ci',
        telephone: '+225 27 20 12 34 56',
        adresse: 'Zone Industrielle PK24',
        ville: 'Abidjan',
        pays: 'Côte d\'Ivoire',
        siteWeb: 'www.domainekouassi.ci',
        numeroTVA: 'CI123456789',
        datePartenariat: new Date('2023-01-15'),
        statut: 'actif',
        noteFournisseur: 4.5
      },
      {
        id: 2,
        nomEntreprise: 'Spiritueux Traoré & Fils',
        categorie: 'Vins & Spiritueux',
        typeActivite: 'Spiritueux',
        contact: 'Aminata Traoré',
        email: 'info@traore-spiritueux.ci',
        telephone: '+225 27 21 98 76 54',
        adresse: 'Boulevard Latrille',
        ville: 'Abidjan',
        pays: 'Côte d\'Ivoire',
        siteWeb: 'www.traore-spiritueux.ci',
        numeroTVA: 'CI987654321',
        datePartenariat: new Date('2022-06-20'),
        statut: 'actif',
        noteFournisseur: 4.8
      },
      {
        id: 3,
        nomEntreprise: 'Traiteur La Bonne Table',
        categorie: 'Mets et Vin',
        typeActivite: 'Traiteur',
        contact: 'Mariam Koné',
        email: 'contact@bonnatable.ci',
        telephone: '+225 27 22 45 67 89',
        adresse: 'Cocody Riviera',
        ville: 'Abidjan',
        pays: 'Côte d\'Ivoire',
        siteWeb: 'www.bonnatable.ci',
        numeroTVA: 'CI456789123',
        datePartenariat: new Date('2023-09-10'),
        statut: 'actif',
        noteFournisseur: 4.7
      },
      {
        id: 4,
        nomEntreprise: 'Fromagerie du Plateau',
        categorie: 'Mets et Vin',
        typeActivite: 'Fromages',
        contact: 'Jean-Pierre Kouadio',
        email: 'jp@fromagerie-plateau.ci',
        telephone: '+225 27 23 01 23 45',
        adresse: 'Plateau, Avenue Chardy',
        ville: 'Abidjan',
        pays: 'Côte d\'Ivoire',
        numeroTVA: 'CI789123456',
        datePartenariat: new Date('2024-02-01'),
        statut: 'actif',
        noteFournisseur: 4.9
      },
      {
        id: 5,
        nomEntreprise: 'Équipements Vinicoles CI',
        categorie: 'Matériel',
        typeActivite: 'Caves à Vin',
        contact: 'Ibrahim Diallo',
        email: 'contact@equipements-vinicoles.ci',
        telephone: '+225 27 24 11 22 33',
        adresse: 'Zone Industrielle Yopougon',
        ville: 'Abidjan',
        pays: 'Côte d\'Ivoire',
        siteWeb: 'www.equipements-vinicoles.ci',
        numeroTVA: 'CI321654987',
        datePartenariat: new Date('2023-05-15'),
        statut: 'actif',
        noteFournisseur: 4.3
      },
      {
        id: 6,
        nomEntreprise: 'Accessoires du Sommelier',
        categorie: 'Matériel',
        typeActivite: 'Tire-bouchons & Accessoires',
        contact: 'Fatou Camara',
        email: 'info@sommelier-access.ci',
        telephone: '+225 27 25 33 44 55',
        adresse: 'Marcory Zone 4',
        ville: 'Abidjan',
        pays: 'Côte d\'Ivoire',
        numeroTVA: 'CI654321789',
        datePartenariat: new Date('2023-11-20'),
        statut: 'actif',
        noteFournisseur: 4.6
      },
      {
        id: 7,
        nomEntreprise: 'Épicerie Fine Bamba',
        categorie: 'Mets et Vin',
        typeActivite: 'Épicerie Fine',
        contact: 'Mamadou Bamba',
        email: 'contact@epicerie-bamba.ci',
        telephone: '+225 27 26 55 66 77',
        adresse: 'Deux Plateaux',
        ville: 'Abidjan',
        pays: 'Côte d\'Ivoire',
        numeroTVA: 'CI147258369',
        datePartenariat: new Date('2022-08-12'),
        statut: 'suspendu',
        noteFournisseur: 3.2
      },
      {
        id: 8,
        nomEntreprise: 'Mobilier Premium CI',
        categorie: 'Matériel',
        typeActivite: 'Mobilier',
        contact: 'Seydou Ouattara',
        email: 'contact@mobilier-premium.ci',
        telephone: '+225 27 27 88 99 00',
        adresse: 'Abobo Pk18',
        ville: 'Abidjan',
        pays: 'Côte d\'Ivoire',
        siteWeb: 'www.mobilier-premium.ci',
        numeroTVA: 'CI963852741',
        datePartenariat: new Date('2024-01-10'),
        statut: 'actif',
        noteFournisseur: 4.4
      }
    ];

    this.fournisseursFiltres = [...this.fournisseurs];
  }

  // ==================== FILTRAGE / RECHERCHE ====================
  filtrerFournisseurs(): void {
    const rechercheLower = this.recherche.toLowerCase();

    this.fournisseursFiltres = this.fournisseurs.filter(fournisseur => {
      const matchRecherche =
        fournisseur.nomEntreprise.toLowerCase().includes(rechercheLower) ||
        fournisseur.categorie.toLowerCase().includes(rechercheLower) ||
        fournisseur.typeActivite.toLowerCase().includes(rechercheLower) ||
        fournisseur.contact.toLowerCase().includes(rechercheLower) ||
        fournisseur.email.toLowerCase().includes(rechercheLower) ||
        fournisseur.ville.toLowerCase().includes(rechercheLower);

      const matchCategorie = this.filtreCategorie === 'tous' || fournisseur.categorie === this.filtreCategorie;
      const matchStatut = this.filtreStatut === 'tous' || fournisseur.statut === this.filtreStatut;

      return matchRecherche && matchCategorie && matchStatut;
    });
  }

  changerFiltreCategorie(categorie: string): void {
    this.filtreCategorie = categorie;
    this.filtrerFournisseurs();
  }

  changerFiltreStatut(statut: string): void {
    this.filtreStatut = statut;
    this.filtrerFournisseurs();
  }

  // ==================== GESTION DES MODALS ====================
  openAddModal(): void {
    this.isAddModalOpen = true;
    this.submitted = false;
    this.fournisseurForm.reset({ statut: 'actif' });
    this.typesActiviteFiltered = [];
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  openEditModal(fournisseur: Fournisseur): void {
    this.fournisseurEnEdition = fournisseur;
    this.isEditModalOpen = true;
    this.submitted = false;

    // Charger les types d'activité pour la catégorie du fournisseur
    if (this.typesActiviteParCategorie[fournisseur.categorie]) {
      this.typesActiviteFilteredEdit = this.typesActiviteParCategorie[fournisseur.categorie];
    }

    this.editForm.patchValue({
      nomEntreprise: fournisseur.nomEntreprise,
      categorie: fournisseur.categorie,
      typeActivite: fournisseur.typeActivite,
      contact: fournisseur.contact,
      email: fournisseur.email,
      telephone: fournisseur.telephone,
      adresse: fournisseur.adresse,
      ville: fournisseur.ville,
      pays: fournisseur.pays,
      siteWeb: fournisseur.siteWeb || '',
      numeroTVA: fournisseur.numeroTVA,
      statut: fournisseur.statut,
      noteFournisseur: fournisseur.noteFournisseur || ''
    });
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.fournisseurEnEdition = null;
  }

  openDetailsModal(fournisseur: Fournisseur): void {
    this.fournisseurSelectionne = fournisseur;
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
    this.fournisseurSelectionne = null;
  }

  // ==================== GESTION DES FOURNISSEURS ====================
  get f() {
    return this.fournisseurForm.controls;
  }

  get ef() {
    return this.editForm.controls;
  }

  ajouterFournisseur(): void {
    this.submitted = true;

    if (this.fournisseurForm.invalid) {
      alert('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    const nouveauFournisseur: Fournisseur = {
      ...this.fournisseurForm.value,
      id: Date.now(),
      datePartenariat: new Date()
    };

    this.fournisseurs.push(nouveauFournisseur);
    this.fournisseursFiltres = [...this.fournisseurs];

    console.log('Nouveau fournisseur ajouté:', nouveauFournisseur);
    alert('Fournisseur créé avec succès !');
    this.closeAddModal();
  }

  modifierFournisseur(): void {
    this.submitted = true;

    if (this.editForm.invalid || !this.fournisseurEnEdition) {
      alert('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    const index = this.fournisseurs.findIndex(f => f.id === this.fournisseurEnEdition!.id);

    if (index !== -1) {
      this.fournisseurs[index] = {
        ...this.fournisseurEnEdition,
        ...this.editForm.value
      };

      this.fournisseursFiltres = [...this.fournisseurs];

      console.log('Fournisseur modifié:', this.fournisseurs[index]);
      alert('Fournisseur modifié avec succès !');
      this.closeEditModal();
    }
  }

  supprimerFournisseur(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      this.fournisseurs = this.fournisseurs.filter(f => f.id !== id);
      this.fournisseursFiltres = this.fournisseursFiltres.filter(f => f.id !== id);

      alert('Fournisseur supprimé avec succès');
      console.log('Fournisseur supprimé, ID:', id);
    }
  }

  // ==================== STATISTIQUES ====================
  getTotalFournisseurs(): number {
    return this.fournisseurs.length;
  }

  getFournisseursByCategory(categorie: string): number {
    return this.fournisseurs.filter(f => f.categorie === categorie).length;
  }

  // ==================== UTILITAIRES ====================
  getJoursDepuisPartenariat(fournisseur: Fournisseur): number {
    const now = new Date();
    const datePartenariat = new Date(fournisseur.datePartenariat);
    const diffTime = Math.abs(now.getTime() - datePartenariat.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getStatutClass(statut: string): string {
    switch(statut) {
      case 'actif':
        return 'statut-actif';
      case 'inactif':
        return 'statut-inactif';
      case 'suspendu':
        return 'statut-suspendu';
      default:
        return '';
    }
  }

  getCategoryClass(categorie: string): string {
    switch(categorie) {
      case 'Vins & Spiritueux':
        return 'category-vins';
      case 'Mets et Vin':
        return 'category-mets';
      case 'Matériel':
        return 'category-materiel';
      default:
        return '';
    }
  }

  getCategoryIcon(categorie: string): string {
    switch(categorie) {
      case 'Vins & Spiritueux':
        return 'fas fa-wine-bottle';
      case 'Mets et Vin':
        return 'fas fa-utensils';
      case 'Matériel':
        return 'fas fa-tools';
      default:
        return 'fas fa-box';
    }
  }

  getEtoiles(note?: number): boolean[] {
    const noteValue = note || 0;
    return Array(5).fill(false).map((_, i) => i < Math.floor(noteValue));
  }
}
