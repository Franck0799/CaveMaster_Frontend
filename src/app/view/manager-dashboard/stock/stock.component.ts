import { Component, OnInit } from '@angular/core';

interface Cave {
  id: string;
  nom: string;
  adresse: string;
  responsable: string;
  capacite: number;
  stockActuel: number;
}

interface Boisson {
  id: string;
  nom: string;
  categorie: string;
  prixUnitaire: number;
  seuilAlerte: number;
  stocks: { [caveId: string]: number };
}

interface Mouvement {
  id: string;
  caveId: string;
  boissonId: string;
  boissonNom: string;
  type: 'entree' | 'sortie' | 'transfert' | 'perte';
  typeText: string;
  quantite: number;
  date: string;
  heure: string;
  motif: string;
  operateur: string;
}

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  selectedCaveId: string = 'cave1';
  currentStockFilter: 'all' | 'alerte' | 'ok' = 'all';
  searchStock: string = '';

  cavesData: Cave[] = [
    {
      id: 'cave1',
      nom: 'Cave Principale - Lekki',
      adresse: 'Lekki Phase 1, Lagos',
      responsable: 'Jean Kouassi',
      capacite: 5000,
      stockActuel: 3420
    },
    {
      id: 'cave2',
      nom: 'Cave Victoria Island',
      adresse: 'Victoria Island, Lagos',
      responsable: 'Aminata Soro',
      capacite: 3000,
      stockActuel: 2150
    },
    {
      id: 'cave3',
      nom: 'Cave Ikeja',
      adresse: 'Ikeja GRA, Lagos',
      responsable: 'Koffi Yao',
      capacite: 4000,
      stockActuel: 2890
    }
  ];

  boissonsData: Boisson[] = [
    {
      id: 'B001',
      nom: 'Hennessy VSOP',
      categorie: 'Cognac',
      prixUnitaire: 15000,
      seuilAlerte: 20,
      stocks: { cave1: 3, cave2: 25, cave3: 18 }
    },
    {
      id: 'B002',
      nom: 'Dom Pérignon',
      categorie: 'Champagne',
      prixUnitaire: 20000,
      seuilAlerte: 15,
      stocks: { cave1: 8, cave2: 12, cave3: 20 }
    },
    {
      id: 'B003',
      nom: 'Château Margaux',
      categorie: 'Vin Rouge',
      prixUnitaire: 14000,
      seuilAlerte: 20,
      stocks: { cave1: 12, cave2: 18, cave3: 22 }
    },
    {
      id: 'B004',
      nom: 'Moët & Chandon',
      categorie: 'Champagne',
      prixUnitaire: 7500,
      seuilAlerte: 30,
      stocks: { cave1: 45, cave2: 52, cave3: 38 }
    },
    {
      id: 'B005',
      nom: 'Heineken',
      categorie: 'Bière',
      prixUnitaire: 1500,
      seuilAlerte: 100,
      stocks: { cave1: 250, cave2: 180, cave3: 320 }
    },
    {
      id: 'B006',
      nom: 'Jack Daniels',
      categorie: 'Whisky',
      prixUnitaire: 19000,
      seuilAlerte: 25,
      stocks: { cave1: 35, cave2: 28, cave3: 42 }
    },
    {
      id: 'B007',
      nom: 'Chivas Regal 18',
      categorie: 'Whisky',
      prixUnitaire: 22000,
      seuilAlerte: 15,
      stocks: { cave1: 8, cave2: 15, cave3: 12 }
    },
    {
      id: 'B008',
      nom: 'Absolut Vodka',
      categorie: 'Vodka',
      prixUnitaire: 8500,
      seuilAlerte: 40,
      stocks: { cave1: 55, cave2: 48, cave3: 62 }
    },
    {
      id: 'B009',
      nom: 'Grey Goose',
      categorie: 'Vodka',
      prixUnitaire: 16000,
      seuilAlerte: 20,
      stocks: { cave1: 18, cave2: 22, cave3: 25 }
    },
    {
      id: 'B010',
      nom: 'Guinness',
      categorie: 'Bière',
      prixUnitaire: 1200,
      seuilAlerte: 150,
      stocks: { cave1: 320, cave2: 280, cave3: 410 }
    }
  ];

  mouvementsData: Mouvement[] = [
    {
      id: 'MV001',
      caveId: 'cave1',
      boissonId: 'B001',
      boissonNom: 'Hennessy VSOP',
      type: 'sortie',
      typeText: 'Sortie',
      quantite: 5,
      date: '26/10/2025',
      heure: '14:30',
      motif: 'Vente - Commande CMD-1234',
      operateur: 'Marie Diop'
    },
    {
      id: 'MV002',
      caveId: 'cave1',
      boissonId: 'B002',
      boissonNom: 'Dom Pérignon',
      type: 'entree',
      typeText: 'Entrée',
      quantite: 20,
      date: '26/10/2025',
      heure: '10:15',
      motif: 'Livraison fournisseur - BL-5678',
      operateur: 'Jean Kouassi'
    },
    {
      id: 'MV003',
      caveId: 'cave1',
      boissonId: 'B005',
      boissonNom: 'Heineken',
      type: 'transfert',
      typeText: 'Transfert',
      quantite: 50,
      date: '26/10/2025',
      heure: '09:00',
      motif: 'Transfert vers Cave Victoria Island',
      operateur: 'Koffi Yao'
    },
    {
      id: 'MV004',
      caveId: 'cave2',
      boissonId: 'B004',
      boissonNom: 'Moët & Chandon',
      type: 'sortie',
      typeText: 'Sortie',
      quantite: 10,
      date: '26/10/2025',
      heure: '13:45',
      motif: 'Vente - Événement VIP',
      operateur: 'Aminata Soro'
    },
    {
      id: 'MV005',
      caveId: 'cave1',
      boissonId: 'B003',
      boissonNom: 'Château Margaux',
      type: 'perte',
      typeText: 'Perte',
      quantite: 2,
      date: '25/10/2025',
      heure: '18:20',
      motif: 'Bouteilles cassées lors du stockage',
      operateur: 'Jean Kouassi'
    },
    {
      id: 'MV006',
      caveId: 'cave3',
      boissonId: 'B006',
      boissonNom: 'Jack Daniels',
      type: 'entree',
      typeText: 'Entrée',
      quantite: 30,
      date: '25/10/2025',
      heure: '11:30',
      motif: 'Livraison fournisseur - BL-5679',
      operateur: 'Koffi Yao'
    }
  ];

  ngOnInit(): void {}

  get selectedCave(): Cave | undefined {
    return this.cavesData.find(c => c.id === this.selectedCaveId);
  }

  selectCave(caveId: string): void {
    this.selectedCaveId = caveId;
    this.currentStockFilter = 'all';
    this.searchStock = '';
  }

  get filteredBoissons(): Boisson[] {
    let filtered = this.boissonsData;

    // Filtre par recherche
    if (this.searchStock.trim()) {
      const search = this.searchStock.toLowerCase();
      filtered = filtered.filter(b =>
        b.nom.toLowerCase().includes(search) ||
        b.categorie.toLowerCase().includes(search)
      );
    }

    // Filtre par statut
    if (this.currentStockFilter === 'alerte') {
      filtered = filtered.filter(b => this.isStockAlerte(b));
    } else if (this.currentStockFilter === 'ok') {
      filtered = filtered.filter(b => !this.isStockAlerte(b));
    }

    return filtered;
  }

  get mouvementsForSelectedCave(): Mouvement[] {
    return this.mouvementsData
      .filter(m => m.caveId === this.selectedCaveId)
      .sort((a, b) => {
        // Tri par date et heure décroissant
        const dateA = new Date(`${a.date} ${a.heure}`);
        const dateB = new Date(`${b.date} ${b.heure}`);
        return dateB.getTime() - dateA.getTime();
      });
  }

  isStockAlerte(boisson: Boisson): boolean {
    return boisson.stocks[this.selectedCaveId] < boisson.seuilAlerte;
  }

  getStockCount(filter: string): number {
    if (filter === 'all') return this.boissonsData.length;
    if (filter === 'alerte') {
      return this.boissonsData.filter(b => this.isStockAlerte(b)).length;
    }
    return this.boissonsData.filter(b => !this.isStockAlerte(b)).length;
  }

  filterStock(filter: 'all' | 'alerte' | 'ok'): void {
    this.currentStockFilter = filter;
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(montant);
  }
}
