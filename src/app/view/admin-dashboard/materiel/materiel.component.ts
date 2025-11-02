import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Invoice {
  id: string;
  numero: string;
  fournisseur: string;
  dateAchat: Date;
  montantTotal: number;
  fichier?: string;
}

interface Material {
  id: string;
  nom: string;
  categorie: string;
  quantite: number;
  etat: 'Neuf' | 'Bon' | 'Usé' | 'À remplacer';
  dateAcquisition: Date;
  prixUnitaire: number;
  factureId?: string;
  emplacement: string;
  description?: string;
}

@Component({
  selector: 'app-materiel',
  standalone: true,
  // Import des modules nécessaires
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './materiel.component.html',
  styleUrls: ['./materiel.component.scss']
})
export class MaterialComponent implements OnInit {
  materials: Material[] = [];
  invoices: Invoice[] = [];

  // États d'affichage
  showMaterialForm = false;
  showInvoiceForm = false;
  activeTab: 'materials' | 'invoices' = 'materials';

  // Filtres et recherche
  searchTerm = '';
  selectedCategory = '';
  selectedEtat = '';

  // Formulaires
  materialForm: Partial<Material> = this.getEmptyMaterialForm();
  invoiceForm: Partial<Invoice> = this.getEmptyInvoiceForm();

  editingMaterialId: string | null = null;
  editingInvoiceId: string | null = null;

  // Catégories disponibles
  categories = [
    'Couverts',
    'Vaisselle',
    'Verrerie',
    'Mobilier',
    'Équipement cuisine',
    'Matériel de nettoyage',
    'Décoration',
    'Électroménager',
    'Autre'
  ];

  etats = ['Neuf', 'Bon', 'Usé', 'À remplacer'];

  ngOnInit(): void {
    this.loadData();
  }

  // Gestion des données
  loadData(): void {
    const savedMaterials = localStorage.getItem('materials');
    const savedInvoices = localStorage.getItem('invoices');

    if (savedMaterials) {
      this.materials = JSON.parse(savedMaterials).map((m: Material) => ({
        ...m,
        dateAcquisition: new Date(m.dateAcquisition)
      }));
    }

    if (savedInvoices) {
      this.invoices = JSON.parse(savedInvoices).map((i: Invoice) => ({
        ...i,
        dateAchat: new Date(i.dateAchat)
      }));
    }
  }

  saveData(): void {
    localStorage.setItem('materials', JSON.stringify(this.materials));
    localStorage.setItem('invoices', JSON.stringify(this.invoices));
  }

  // Gestion du matériel
  addMaterial(): void {
    const material: Material = {
      id: this.generateId(),
      nom: this.materialForm.nom!,
      categorie: this.materialForm.categorie!,
      quantite: this.materialForm.quantite!,
      etat: this.materialForm.etat as Material['etat'],
      dateAcquisition: this.materialForm.dateAcquisition!,
      prixUnitaire: this.materialForm.prixUnitaire!,
      factureId: this.materialForm.factureId,
      emplacement: this.materialForm.emplacement!,
      description: this.materialForm.description
    };

    this.materials.push(material);
    this.saveData();
    this.resetMaterialForm();
  }

  updateMaterial(): void {
    const index = this.materials.findIndex(m => m.id === this.editingMaterialId);
    if (index !== -1) {
      this.materials[index] = {
        ...this.materials[index],
        ...this.materialForm as Material
      };
      this.saveData();
      this.resetMaterialForm();
    }
  }

  editMaterial(material: Material): void {
    this.materialForm = { ...material };
    this.editingMaterialId = material.id;
    this.showMaterialForm = true;
  }

  deleteMaterial(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce matériel ?')) {
      this.materials = this.materials.filter(m => m.id !== id);
      this.saveData();
    }
  }

  // Gestion des factures
  addInvoice(): void {
    const invoice: Invoice = {
      id: this.generateId(),
      numero: this.invoiceForm.numero!,
      fournisseur: this.invoiceForm.fournisseur!,
      dateAchat: this.invoiceForm.dateAchat!,
      montantTotal: this.invoiceForm.montantTotal!,
      fichier: this.invoiceForm.fichier
    };

    this.invoices.push(invoice);
    this.saveData();
    this.resetInvoiceForm();
  }

  updateInvoice(): void {
    const index = this.invoices.findIndex(i => i.id === this.editingInvoiceId);
    if (index !== -1) {
      this.invoices[index] = {
        ...this.invoices[index],
        ...this.invoiceForm as Invoice
      };
      this.saveData();
      this.resetInvoiceForm();
    }
  }

  editInvoice(invoice: Invoice): void {
    this.invoiceForm = { ...invoice };
    this.editingInvoiceId = invoice.id;
    this.showInvoiceForm = true;
  }

  deleteInvoice(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      this.invoices = this.invoices.filter(i => i.id !== id);
      this.saveData();
    }
  }

  // Fonctions utilitaires
  getFilteredMaterials(): Material[] {
    return this.materials.filter(m => {
      const matchesSearch = !this.searchTerm ||
        m.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategory || m.categorie === this.selectedCategory;
      const matchesEtat = !this.selectedEtat || m.etat === this.selectedEtat;

      return matchesSearch && matchesCategory && matchesEtat;
    });
  }

  getInvoiceByMaterial(factureId?: string): Invoice | undefined {
    return this.invoices.find(i => i.id === factureId);
  }

  getTotalValue(): number {
    return this.materials.reduce((sum, m) => sum + (m.prixUnitaire * m.quantite), 0);
  }

  getMaterialsByCategory(): { [key: string]: number } {
    return this.materials.reduce((acc, m) => {
      acc[m.categorie] = (acc[m.categorie] || 0) + m.quantite;
      return acc;
    }, {} as { [key: string]: number });
  }

  resetMaterialForm(): void {
    this.materialForm = this.getEmptyMaterialForm();
    this.editingMaterialId = null;
    this.showMaterialForm = false;
  }

  resetInvoiceForm(): void {
    this.invoiceForm = this.getEmptyInvoiceForm();
    this.editingInvoiceId = null;
    this.showInvoiceForm = false;
  }

  getEmptyMaterialForm(): Partial<Material> {
    return {
      nom: '',
      categorie: '',
      quantite: 1,
      etat: 'Neuf',
      dateAcquisition: new Date(),
      prixUnitaire: 0,
      emplacement: '',
      description: ''
    };
  }

  getEmptyInvoiceForm(): Partial<Invoice> {
    return {
      numero: '',
      fournisseur: '',
      dateAchat: new Date(),
      montantTotal: 0,
      fichier: ''
    };
  }

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      this.invoiceForm.fichier = file.name;
    }
  }

  exportData(): void {
    const data = {
      materials: this.materials,
      invoices: this.invoices,
      exportDate: new Date()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gestion-materiel-${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
