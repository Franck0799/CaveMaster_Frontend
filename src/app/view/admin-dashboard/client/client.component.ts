import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * Interface définissant la structure d'un client
 */
interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  pays: string;
  typeClient: 'presentiel' | 'en ligne' | 'evenementiel';
  dateInscription: Date;
  statut: 'actif' | 'inactif' | 'vip';
  nombreCommandes: number;
  totalDepense: number;

  // Nouvelles propriétés spécifiques à la cave
  categoriePreferee?: 'Vins' | 'Champagnes' | 'Spiritueux' | 'Bières' | 'Mixte';
  programFidelite?: 'Bronze' | 'Argent' | 'Or' | 'Platine';
  pointsFidelite?: number;
  derniereVisite?: Date;
  anniversaire?: Date;
  preferences?: {
    vinsRouges?: boolean;
    vinsBlancs?: boolean;
    vinsRoses?: boolean;
    champagnes?: boolean;
    spiritueux?: boolean;
    bieres?: boolean;
  };
  notes?: string;
  connaissanceVin?: 'Débutant' | 'Amateur' | 'Connaisseur' | 'Expert' | 'Sommelier';
  budgetMoyen?: 'Économique' | 'Standard' | 'Premium' | 'Luxe';
  occasionAchat?: string[];
  accordsPreferees?: string[];
}

/**
 * Interface pour les statistiques détaillées
 */
interface ClientStats {
  totalClients: number;
  clientsActifs: number;
  clientsVIP: number;
  clientsPresentiel: number;
  clientsEnLigne: number;
  clientsEvenementiel: number;
  chiffreAffairesTotal: number;
  panierMoyen: number;
}

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientsComponent implements OnInit {

  // ==================== VARIABLES DE DONNÉES ====================
  clients: Client[] = [];
  clientsFiltres: Client[] = [];
  clientSelectionne: Client | null = null;
  clientEnEdition: Client | null = null;
  stats: ClientStats = {
    totalClients: 0,
    clientsActifs: 0,
    clientsVIP: 0,
    clientsPresentiel: 0,
    clientsEnLigne: 0,
    clientsEvenementiel: 0,
    chiffreAffairesTotal: 0,
    panierMoyen: 0
  };

  // ==================== VARIABLES DE RECHERCHE / FILTRES ====================
  recherche: string = '';
  filtreType: string = 'tous';
  filtreStatut: string = 'tous';
  filtreFidelite: string = 'tous';
  filtreCategorie: string = 'tous';

  // ==================== VARIABLES DES MODALS ====================
  isAddModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  isDetailsModalOpen: boolean = false;

  // ==================== FORMULAIRES ====================
  clientForm!: FormGroup;
  editForm!: FormGroup;
  submitted = false;

  // ==================== LISTES DE RÉFÉRENCE ====================
  pays: string[] = [
    'Côte d\'Ivoire', 'France', 'Sénégal', 'Mali', 'Burkina Faso',
    'Ghana', 'Togo', 'Bénin', 'Niger', 'Guinée'
  ];

  typesClient = ['presentiel', 'en ligne', 'evenementiel'];
  statutsClient = ['actif', 'inactif', 'vip'];
  categoriesPreferees = ['Vins', 'Champagnes', 'Spiritueux', 'Bières', 'Mixte'];
  niveauxFidelite = ['Bronze', 'Argent', 'Or', 'Platine'];
  niveauxConnaissance = ['Débutant', 'Amateur', 'Connaisseur', 'Expert', 'Sommelier'];
  budgetsMoyens = ['Économique', 'Standard', 'Premium', 'Luxe'];

  occasionsAchat = [
    'Usage personnel',
    'Cadeaux',
    'Événements',
    'Repas festifs',
    'Collection',
    'Investissement',
    'Restaurant/Bar'
  ];

  accordsMetsVins = [
    'Viandes rouges',
    'Viandes blanches',
    'Poissons',
    'Fruits de mer',
    'Fromages',
    'Desserts',
    'Apéritifs',
    'Plats végétariens',
    'Plats épicés',
    'Charcuterie'
  ];

  // ==================== CONSTRUCTEUR ====================
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  // ==================== INITIALISATION ====================
  ngOnInit(): void {
    this.initForms();
    this.chargerClients();
    this.calculerStatistiques();
  }

  // ==================== INITIALISATION DES FORMULAIRES ====================
  initForms(): void {
    this.clientForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s-()]+$/)]],
      adresse: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      ville: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      pays: ['', Validators.required],
      typeClient: ['', Validators.required],
      statut: ['actif', Validators.required],
      categoriePreferee: [''],
      programFidelite: ['Bronze'],
      connaissanceVin: [''],
      budgetMoyen: [''],
      anniversaire: [''],
      notes: ['']
    });

    this.editForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s-()]+$/)]],
      adresse: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      ville: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      pays: ['', Validators.required],
      typeClient: ['', Validators.required],
      statut: ['actif', Validators.required],
      categoriePreferee: [''],
      programFidelite: [''],
      connaissanceVin: [''],
      budgetMoyen: [''],
      anniversaire: [''],
      notes: ['']
    });
  }

  // ==================== CHARGEMENT DES DONNÉES ====================
  chargerClients(): void {
    this.clients = [
      {
        id: 1,
        nom: 'Kouassi',
        prenom: 'Yao',
        email: 'yao.kouassi@email.ci',
        telephone: '+225 27 20 12 34 56',
        adresse: 'Cocody Riviera 2',
        ville: 'Abidjan',
        pays: 'Côte d\'Ivoire',
        typeClient: 'presentiel',
        dateInscription: new Date('2023-01-15'),
        statut: 'vip',
        nombreCommandes: 45,
        totalDepense: 2850000,
        categoriePreferee: 'Vins',
        programFidelite: 'Or',
        pointsFidelite: 2850,
        derniereVisite: new Date('2024-10-25'),
        anniversaire: new Date('1985-06-15'),
        preferences: {
          vinsRouges: true,
          champagnes: true,
          spiritueux: false
        },
        connaissanceVin: 'Connaisseur',
        budgetMoyen: 'Premium',
        occasionAchat: ['Usage personnel', 'Événements', 'Cadeaux'],
        accordsPreferees: ['Viandes rouges', 'Fromages'],
        notes: 'Client régulier, apprécie les grands crus de Bordeaux'
      },
      {
        id: 2,
        nom: 'Traoré',
        prenom: 'Aminata',
        email: 'aminata.traore@email.ci',
        telephone: '+225 27 21 98 76 54',
        adresse: 'Marcory Zone 4',
        ville: 'Abidjan',
        pays: 'Côte d\'Ivoire',
        typeClient: 'en ligne',
        dateInscription: new Date('2023-03-22'),
        statut: 'actif',
        nombreCommandes: 32,
        totalDepense: 1950000,
        categoriePreferee: 'Champagnes',
        programFidelite: 'Argent',
        pointsFidelite: 1950,
        derniereVisite: new Date('2024-10-20'),
        anniversaire: new Date('1990-03-10'),
        preferences: {
          champagnes: true,
          vinsRoses: true,
          vinsBlancs: true
        },
        connaissanceVin: 'Amateur',
        budgetMoyen: 'Standard',
        occasionAchat: ['Événements', 'Repas festifs'],
        accordsPreferees: ['Apéritifs', 'Desserts'],
        notes: 'Préfère les commandes en ligne, livraison rapide souhaitée'
      },
      {
        id: 3,
        nom: 'Bamba',
        prenom: 'Mamadou',
        email: 'mamadou.bamba@email.ci',
        telephone: '+225 27 22 45 67 89',
        adresse: 'Yopougon Selmer',
        ville: 'Abidjan',
        pays: 'Côte d\'Ivoire',
        typeClient: 'evenementiel',
        dateInscription: new Date('2022-11-10'),
        statut: 'vip',
        nombreCommandes: 67,
        totalDepense: 4120000,
        categoriePreferee: 'Mixte',
        programFidelite: 'Platine',
        pointsFidelite: 4120,
        derniereVisite: new Date('2024-10-28'),
        anniversaire: new Date('1982-08-22'),
        preferences: {
          vinsRouges: true,
          vinsBlancs: true,
          champagnes: true,
          spiritueux: true,
          bieres: true
        },
        connaissanceVin: 'Expert',
        budgetMoyen: 'Luxe',
        occasionAchat: ['Événements', 'Restaurant/Bar'],
        accordsPreferees: ['Viandes rouges', 'Poissons', 'Fromages', 'Desserts'],
        notes: 'Propriétaire de restaurant, commandes en gros régulières'
      },
      {
        id: 4,
        nom: 'Koné',
        prenom: 'Mariam',
        email: 'mariam.kone@email.ci',
        telephone: '+225 27 23 01 23 45',
        adresse: 'Plateau',
        ville: 'Abidjan',
        pays: 'Côte d\'Ivoire',
        typeClient: 'en ligne',
        dateInscription: new Date('2024-01-05'),
        statut: 'actif',
        nombreCommandes: 18,
        totalDepense: 980000,
        categoriePreferee: 'Vins',
        programFidelite: 'Bronze',
        pointsFidelite: 980,
        derniereVisite: new Date('2024-10-15'),
        anniversaire: new Date('1995-12-05'),
        preferences: {
          vinsRoses: true,
          vinsBlancs: true
        },
        connaissanceVin: 'Débutant',
        budgetMoyen: 'Économique',
        occasionAchat: ['Usage personnel', 'Cadeaux'],
        accordsPreferees: ['Poissons', 'Fruits de mer'],
        notes: 'Nouvelle cliente, intéressée par les vins légers'
      },
      {
        id: 5,
        nom: 'Diallo',
        prenom: 'Ibrahim',
        email: 'ibrahim.diallo@email.ci',
        telephone: '+225 27 24 11 22 33',
        adresse: 'Abobo Pk18',
        ville: 'Abidjan',
        pays: 'Côte d\'Ivoire',
        typeClient: 'presentiel',
        dateInscription: new Date('2023-06-18'),
        statut: 'inactif',
        nombreCommandes: 5,
        totalDepense: 215000,
        categoriePreferee: 'Bières',
        programFidelite: 'Bronze',
        pointsFidelite: 215,
        derniereVisite: new Date('2024-05-10'),
        connaissanceVin: 'Débutant',
        budgetMoyen: 'Économique',
        occasionAchat: ['Usage personnel'],
        notes: 'Client inactif depuis 6 mois'
      },
      {
        id: 6,
        nom: 'Camara',
        prenom: 'Fatoumata',
        email: 'fatoumata.camara@email.ci',
        telephone: '+225 27 25 33 44 55',
        adresse: 'Angré 7ème Tranche',
        ville: 'Abidjan',
        pays: 'Côte d\'Ivoire',
        typeClient: 'en ligne',
        dateInscription: new Date('2023-08-25'),
        statut: 'actif',
        nombreCommandes: 28,
        totalDepense: 1650000,
        categoriePreferee: 'Champagnes',
        programFidelite: 'Argent',
        pointsFidelite: 1650,
        derniereVisite: new Date('2024-10-22'),
        anniversaire: new Date('1988-11-30'),
        preferences: {
          champagnes: true,
          vinsRoses: true
        },
        connaissanceVin: 'Amateur',
        budgetMoyen: 'Premium',
        occasionAchat: ['Cadeaux', 'Événements'],
        accordsPreferees: ['Apéritifs', 'Desserts'],
        notes: 'Achète principalement pour offrir'
      },
      {
        id: 7,
        nom: 'Ouattara',
        prenom: 'Seydou',
        email: 'seydou.ouattara@email.ci',
        telephone: '+225 27 26 55 66 77',
        adresse: 'Adjamé Bracodi',
        ville: 'Abidjan',
        pays: 'Côte d\'Ivoire',
        typeClient: 'presentiel',
        dateInscription: new Date('2022-09-12'),
        statut: 'vip',
        nombreCommandes: 89,
        totalDepense: 5780000,
        categoriePreferee: 'Vins',
        programFidelite: 'Platine',
        pointsFidelite: 5780,
        derniereVisite: new Date('2024-10-29'),
        anniversaire: new Date('1975-04-18'),
        preferences: {
          vinsRouges: true,
          champagnes: true,
          spiritueux: true
        },
        connaissanceVin: 'Sommelier',
        budgetMoyen: 'Luxe',
        occasionAchat: ['Collection', 'Investissement', 'Usage personnel'],
        accordsPreferees: ['Viandes rouges', 'Fromages', 'Charcuterie'],
        notes: 'Collectionneur de vins, intéressé par les millésimes rares'
      },
      {
        id: 8,
        nom: 'Sanogo',
        prenom: 'Marie',
        email: 'marie.sanogo@email.ci',
        telephone: '+225 27 27 88 99 00',
        adresse: 'Treichville',
        ville: 'Abidjan',
        pays: 'Côte d\'Ivoire',
        typeClient: 'en ligne',
        dateInscription: new Date('2023-12-03'),
        statut: 'actif',
        nombreCommandes: 12,
        totalDepense: 720000,
        categoriePreferee: 'Spiritueux',
        programFidelite: 'Bronze',
        pointsFidelite: 720,
        derniereVisite: new Date('2024-10-18'),
        anniversaire: new Date('1992-07-25'),
        preferences: {
          spiritueux: true,
          bieres: true
        },
        connaissanceVin: 'Amateur',
        budgetMoyen: 'Standard',
        occasionAchat: ['Repas festifs', 'Cadeaux'],
        accordsPreferees: ['Desserts', 'Apéritifs'],
        notes: 'Préfère les spiritueux premium'
      }
    ];

    this.clientsFiltres = [...this.clients];
  }

  // ==================== STATISTIQUES ====================
  calculerStatistiques(): void {
    this.stats = {
      totalClients: this.clients.length,
      clientsActifs: this.clients.filter(c => c.statut === 'actif').length,
      clientsVIP: this.clients.filter(c => c.statut === 'vip').length,
      clientsPresentiel: this.clients.filter(c => c.typeClient === 'presentiel').length,
      clientsEnLigne: this.clients.filter(c => c.typeClient === 'en ligne').length,
      clientsEvenementiel: this.clients.filter(c => c.typeClient === 'evenementiel').length,
      chiffreAffairesTotal: this.clients.reduce((sum, c) => sum + c.totalDepense, 0),
      panierMoyen: this.clients.length > 0
        ? this.clients.reduce((sum, c) => sum + c.totalDepense, 0) / this.clients.reduce((sum, c) => sum + c.nombreCommandes, 0)
        : 0
    };
  }

  // ==================== FILTRAGE / RECHERCHE ====================
  filtrerClients(): void {
    const rechercheLower = this.recherche.toLowerCase();

    this.clientsFiltres = this.clients.filter(client => {
      const matchRecherche =
        client.nom.toLowerCase().includes(rechercheLower) ||
        client.prenom.toLowerCase().includes(rechercheLower) ||
        client.email.toLowerCase().includes(rechercheLower) ||
        client.telephone.toLowerCase().includes(rechercheLower) ||
        client.ville.toLowerCase().includes(rechercheLower);

      const matchType = this.filtreType === 'tous' || client.typeClient === this.filtreType;
      const matchStatut = this.filtreStatut === 'tous' || client.statut === this.filtreStatut;
      const matchFidelite = this.filtreFidelite === 'tous' || client.programFidelite === this.filtreFidelite;
      const matchCategorie = this.filtreCategorie === 'tous' || client.categoriePreferee === this.filtreCategorie;

      return matchRecherche && matchType && matchStatut && matchFidelite && matchCategorie;
    });
  }

  changerFiltreType(type: string): void {
    this.filtreType = type;
    this.filtrerClients();
  }

  changerFiltreStatut(statut: string): void {
    this.filtreStatut = statut;
    this.filtrerClients();
  }

  changerFiltreFidelite(fidelite: string): void {
    this.filtreFidelite = fidelite;
    this.filtrerClients();
  }

  changerFiltreCategorie(categorie: string): void {
    this.filtreCategorie = categorie;
    this.filtrerClients();
  }

  // ==================== GESTION DES MODALS ====================
  openAddModal(): void {
    this.isAddModalOpen = true;
    this.submitted = false;
    this.clientForm.reset({ statut: 'actif', programFidelite: 'Bronze' });
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  openEditModal(client: Client): void {
    this.clientEnEdition = client;
    this.isEditModalOpen = true;
    this.submitted = false;

    this.editForm.patchValue({
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      adresse: client.adresse,
      ville: client.ville,
      pays: client.pays,
      typeClient: client.typeClient,
      statut: client.statut,
      categoriePreferee: client.categoriePreferee,
      programFidelite: client.programFidelite,
      connaissanceVin: client.connaissanceVin,
      budgetMoyen: client.budgetMoyen,
      anniversaire: client.anniversaire ? this.formatDateForInput(client.anniversaire) : '',
      notes: client.notes
    });
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.clientEnEdition = null;
  }

  openDetailsModal(client: Client): void {
    this.clientSelectionne = client;
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
    this.clientSelectionne = null;
  }

  // ==================== GESTION DES CLIENTS ====================
  get f() {
    return this.clientForm.controls;
  }

  get ef() {
    return this.editForm.controls;
  }

  ajouterClient(): void {
    this.submitted = true;

    if (this.clientForm.invalid) {
      alert('⚠️ Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    const nouveauClient: Client = {
      ...this.clientForm.value,
      id: Date.now(),
      dateInscription: new Date(),
      nombreCommandes: 0,
      totalDepense: 0,
      pointsFidelite: 0,
      preferences: {}
    };

    this.clients.push(nouveauClient);
    this.clientsFiltres = [...this.clients];
    this.calculerStatistiques();

    console.log('✅ Nouveau client ajouté:', nouveauClient);
    alert('✅ Client créé avec succès !');
    this.closeAddModal();
  }

  modifierClient(): void {
    this.submitted = true;

    if (this.editForm.invalid || !this.clientEnEdition) {
      alert('⚠️ Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    const index = this.clients.findIndex(c => c.id === this.clientEnEdition!.id);

    if (index !== -1) {
      this.clients[index] = {
        ...this.clientEnEdition,
        ...this.editForm.value
      };

      this.clientsFiltres = [...this.clients];
      this.calculerStatistiques();

      console.log('✅ Client modifié:', this.clients[index]);
      alert('✅ Client modifié avec succès !');
      this.closeEditModal();
    }
  }

  supprimerClient(id: number): void {
    if (confirm('❌ Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clients = this.clients.filter(c => c.id !== id);
      this.clientsFiltres = this.clientsFiltres.filter(c => c.id !== id);
      this.calculerStatistiques();

      alert('✅ Client supprimé avec succès');
      console.log('🗑️ Client supprimé, ID:', id);
    }
  }

  // ==================== UTILITAIRES ====================
  getInitiales(nom: string, prenom: string): string {
    return `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase();
  }

  getPanierMoyen(client: Client): number {
    if (client.nombreCommandes === 0) return 0;
    return client.totalDepense / client.nombreCommandes;
  }

  getJoursDepuisInscription(client: Client): number {
    const now = new Date();
    const dateInscription = new Date(client.dateInscription);
    const diffTime = Math.abs(now.getTime() - dateInscription.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getJoursDepuisDerniereVisite(client: Client): number {
    if (!client.derniereVisite) return 0;
    const now = new Date();
    const derniereVisite = new Date(client.derniereVisite);
    const diffTime = Math.abs(now.getTime() - derniereVisite.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getTypeClass(type: string): string {
    return `type-${type.replace(' ', '-')}`;
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'presentiel': 'fas fa-store',
      'en ligne': 'fas fa-globe',
      'evenementiel': 'fas fa-calendar-check'
    };
    return icons[type] || 'fas fa-user';
  }

  getStatutClass(statut: string): string {
    return `statut-${statut}`;
  }

  getStatutIcon(statut: string): string {
    const icons: { [key: string]: string } = {
      'actif': 'fas fa-check-circle',
      'inactif': 'fas fa-times-circle',
      'vip': 'fas fa-crown'
    };
    return icons[statut] || 'fas fa-user';
  }

  getFideliteClass(fidelite?: string): string {
    if (!fidelite) return '';
    return `fidelite-${fidelite.toLowerCase()}`;
  }

  getFideliteIcon(fidelite?: string): string {
    const icons: { [key: string]: string } = {
      'Bronze': '🥉',
      'Argent': '🥈',
      'Or': '🥇',
      'Platine': '💎'
    };
    return icons[fidelite || ''] || '🏅';
  }

  getConnaissanceIcon(connaissance?: string): string {
    const icons: { [key: string]: string } = {
      'Débutant': '🌱',
      'Amateur': '🍷',
      'Connaisseur': '🎓',
      'Expert': '⭐',
      'Sommelier': '👨‍🍳'
    };
    return icons[connaissance || ''] || '🍷';
  }

  formatDateForInput(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  exporterClients(): void {
    const csv = this.genererCSV();
    this.telechargerFichier(csv, `clients-${Date.now()}.csv`);
  }

  private genererCSV(): string {
    const headers = [
      'ID', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Type', 'Statut',
      'Catégorie Préférée', 'Programme Fidélité', 'Points', 'Commandes',
      'Total Dépensé', 'Panier Moyen'
    ];

    const rows = this.clientsFiltres.map(c => [
      c.id,
      c.nom,
      c.prenom,
      c.email,
      c.telephone,
      c.typeClient,
      c.statut,
      c.categoriePreferee || '-',
      c.programFidelite || '-',
      c.pointsFidelite || 0,
      c.nombreCommandes,
      c.totalDepense,
      this.getPanierMoyen(c).toFixed(0)
    ]);

    return [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
  }

  private telechargerFichier(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
