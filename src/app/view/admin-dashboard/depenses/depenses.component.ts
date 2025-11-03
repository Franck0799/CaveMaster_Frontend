// ==========================================
// FICHIER: src/app/view/admin-dashboard/expense-manager/expense-manager.component.ts
// DESCRIPTION: Composant pour gérer l'affichage et la gestion des dépenses
// AVEC FORMULAIRE COMPLET ET DÉTAILLÉ
// ==========================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

/**
 * Énumération des catégories de dépenses
 */
export enum ExpenseCategory {
  SALAIRE = 'Salaire',
  ELECTRICITE = 'Électricité',
  EAU = 'Eau',
  CARBURANT = 'Carburant',
  MATERIEL = 'Matériel',
  AUTRE = 'Autre'
}

/**
 * Interface pour définir une dépense
 */
interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  beneficiary?: string;
  amount: number;
  date: string;
  createdAt?: Date;
}

/**
 * Interface pour le formulaire de dépense
 */
interface ExpenseForm {
  category: ExpenseCategory;
  description: string;
  beneficiary: string;
  amount: number | null;
  date: string;
}

/**
 * Interface pour les statistiques par catégorie
 */
interface CategoryTotal {
  category: ExpenseCategory;
  label: string;
  icon: string;
  color: string;
  total: number;
}

/**
 * Composant de gestion des dépenses
 */
@Component({
  selector: 'app-depenses',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './depenses.component.html',
  styleUrls: ['./depenses.component.scss']
})
export class ExpenseComponent implements OnInit, OnDestroy {

  // ========================================
  // PROPRIÉTÉS
  // ========================================

  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  searchTerm: string = '';
  filterCategory: ExpenseCategory | 'all' = 'all';
  isLoading: boolean = false;
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  selectedExpense: Expense | null = null;
  expenseForm: ExpenseForm = this.getEmptyForm();
  showExportMenu: boolean = false;
  editingExpense: Expense | null = null;

  // Variables pour le template
  openModal: boolean = false;
  formData = this.getEmptyForm();

  // Configuration des catégories
  categories = [
    { value: ExpenseCategory.SALAIRE, label: 'Salaire', color: 'blue', icon: '💰' },
    { value: ExpenseCategory.ELECTRICITE, label: 'Électricité', color: 'yellow', icon: '⚡' },
    { value: ExpenseCategory.EAU, label: 'Eau', color: 'cyan', icon: '💧' },
    { value: ExpenseCategory.CARBURANT, label: 'Carburant', color: 'red', icon: '⛽' },
    { value: ExpenseCategory.MATERIEL, label: 'Matériel', color: 'green', icon: '🔧' },
    { value: ExpenseCategory.AUTRE, label: 'Autre', color: 'gray', icon: '📦' }
  ];

  // Énumérations pour le template
  expenseCategories = Object.values(ExpenseCategory);

  private routeSubscription?: Subscription;

  // ========================================
  // CONSTRUCTEUR
  // ========================================

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // ========================================
  // LIFECYCLE HOOKS
  // ========================================

  ngOnInit(): void {
    this.loadExpenses();
    this.applyFilters();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  // ========================================
  // CHARGEMENT DES DONNÉES
  // ========================================

  loadExpenses(): void {
    this.isLoading = true;

    // Charger depuis localStorage
    const stored = localStorage.getItem('expenses-data');
    if (stored) {
      this.expenses = JSON.parse(stored);
    } else {
      this.expenses = this.generateMockExpenses();
      this.saveExpenses();
    }

    this.filteredExpenses = [...this.expenses];
    this.isLoading = false;
    console.log('✅ Dépenses chargées:', this.expenses.length);
  }

  private generateMockExpenses(): Expense[] {
    return [
      {
        id: this.generateId(),
        category: ExpenseCategory.SALAIRE,
        description: 'Salaire du mois de novembre',
        beneficiary: 'Jean Dupont',
        amount: 250000,
        date: '2024-11-01',
        createdAt: new Date()
      },
      {
        id: this.generateId(),
        category: ExpenseCategory.ELECTRICITE,
        description: 'Facture CIE novembre',
        beneficiary: 'CIE',
        amount: 45000,
        date: '2024-11-05',
        createdAt: new Date()
      }
    ];
  }

  private saveExpenses(): void {
    localStorage.setItem('expenses-data', JSON.stringify(this.expenses));
    console.log('💾 Dépenses sauvegardées');
  }

  // ========================================
  // FILTRAGE ET RECHERCHE
  // ========================================

  applyFilters(): void {
    let result = [...this.expenses];

    // Filtrer par catégorie
    if (this.filterCategory !== 'all') {
      result = result.filter(exp => exp.category === this.filterCategory);
    }

    // Filtrer par recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(exp =>
        exp.description.toLowerCase().includes(term) ||
        exp.beneficiary?.toLowerCase().includes(term) ||
        exp.category.toLowerCase().includes(term)
      );
    }

    // Trier par date (plus récent en premier)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    this.filteredExpenses = result;
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.filterCategory = 'all';
    this.searchTerm = '';
    this.applyFilters();
  }

  // ========================================
  // CALCULS ET STATISTIQUES
  // ========================================

  getTotalByCategory(): CategoryTotal[] {
    return this.categories.map(cat => ({
      category: cat.value,
      label: cat.label,
      icon: cat.icon,
      color: cat.color,
      total: this.expenses
        .filter(exp => exp.category === cat.value)
        .reduce((sum, exp) => sum + exp.amount, 0)
    }));
  }

  get totalByCategory(): CategoryTotal[] {
    return this.getTotalByCategory();
  }

  getGrandTotal(): number {
    return this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }

  get grandTotal(): number {
    return this.getGrandTotal();
  }

  getCategoryInfo(category: ExpenseCategory) {
    return this.categories.find(c => c.value === category);
  }

  getCategoryColor(category: ExpenseCategory): string {
    return this.getCategoryInfo(category)?.color || 'gray';
  }

  getCategoryIcon(category: ExpenseCategory): string {
    return this.getCategoryInfo(category)?.icon || '📦';
  }

  getCategoryLabel(category: ExpenseCategory): string {
    return this.getCategoryInfo(category)?.label || category;
  }

  // ========================================
  // MODAL - AJOUT/MODIFICATION
  // ========================================

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedExpense = null;
    this.editingExpense = null;
    this.expenseForm = this.getEmptyForm();
    this.formData = this.getEmptyForm();
    this.isModalOpen = true;
    this.openModal = true;
  }

  openEditModal(expense: Expense): void {
    this.isEditMode = true;
    this.selectedExpense = expense;
    this.editingExpense = expense;
    this.expenseForm = {
      category: expense.category,
      description: expense.description,
      beneficiary: expense.beneficiary || '',
      amount: expense.amount,
      date: expense.date
    };
    this.formData = { ...this.expenseForm };
    this.isModalOpen = true;
    this.openModal = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.openModal = false;
    this.isEditMode = false;
    this.selectedExpense = null;
    this.editingExpense = null;
    this.expenseForm = this.getEmptyForm();
    this.formData = this.getEmptyForm();
  }

  handleSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.saveExpense();
  }

  saveExpense(): void {
    if (!this.validateForm()) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.isEditMode && (this.selectedExpense || this.editingExpense)) {
      this.updateExpense();
    } else {
      this.addExpense();
    }
  }

  private addExpense(): void {
    const newExpense: Expense = {
      id: this.generateId(),
      category: this.expenseForm.category,
      description: this.expenseForm.description,
      beneficiary: this.expenseForm.beneficiary || undefined,
      amount: this.expenseForm.amount!,
      date: this.expenseForm.date,
      createdAt: new Date()
    };

    this.expenses.unshift(newExpense);
    this.saveExpenses();
    this.applyFilters();

    console.log('✅ Dépense ajoutée:', newExpense);
    alert('✅ Dépense ajoutée avec succès !');
    this.closeModal();
  }

  private updateExpense(): void {
    const expense = this.selectedExpense || this.editingExpense;
    if (!expense) return;

    const index = this.expenses.findIndex(e => e.id === expense.id);
    if (index !== -1) {
      this.expenses[index] = {
        ...expense,
        category: this.expenseForm.category,
        description: this.expenseForm.description,
        beneficiary: this.expenseForm.beneficiary || undefined,
        amount: this.expenseForm.amount!,
        date: this.expenseForm.date
      };

      this.saveExpenses();
      this.applyFilters();
      console.log('✅ Dépense mise à jour:', this.expenses[index]);
      alert('✅ Dépense mise à jour avec succès !');
      this.closeModal();
    }
  }

  // ========================================
  // GESTION DES ACTIONS
  // ========================================

  handleEdit(expense: Expense): void {
    this.openEditModal(expense);
  }

  handleDelete(expenseId: string): void {
    const expense = this.expenses.find(e => e.id === expenseId);
    if (expense) {
      this.deleteExpense(expense);
    }
  }

  editingExpenseValue(expense: Expense): boolean {
    return this.editingExpense?.id === expense.id;
  }

  // ========================================
  // SUPPRESSION
  // ========================================

  deleteExpense(expense: Expense): void {
    if (confirm(`❌ Êtes-vous sûr de vouloir supprimer cette dépense ?\n"${expense.description}"`)) {
      this.expenses = this.expenses.filter(e => e.id !== expense.id);
      this.saveExpenses();
      this.applyFilters();
      console.log('🗑️ Dépense supprimée:', expense.id);
      alert('✅ Dépense supprimée avec succès');
    }
  }

  // ========================================
  // VALIDATION
  // ========================================

  private validateForm(): boolean {
    return !!(
      this.expenseForm.category &&
      this.expenseForm.description &&
      this.expenseForm.amount &&
      this.expenseForm.amount > 0 &&
      this.expenseForm.date
    );
  }

  private getEmptyForm(): ExpenseForm {
    const today = new Date().toISOString().split('T')[0];
    return {
      category: ExpenseCategory.SALAIRE,
      description: '',
      beneficiary: '',
      amount: null,
      date: today
    };
  }

  // ========================================
  // EXPORT
  // ========================================

  toggleExportMenu(): void {
    this.showExportMenu = !this.showExportMenu;
  }

  exportToCSV(): void {
    const headers = ['Date', 'Catégorie', 'Description', 'Bénéficiaire', 'Montant'];
    const rows = this.expenses.map(exp => [
      exp.date,
      this.getCategoryInfo(exp.category)?.label || '',
      exp.description,
      exp.beneficiary || '',
      exp.amount
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    this.downloadFile(csv, 'text/csv', 'depenses.csv');
    this.showExportMenu = false;
  }

  exportToExcel(): void {
    const totalByCategory = this.getTotalByCategory();
    const grandTotal = this.getGrandTotal();

    // Créer les données pour l'export
    let csvContent = 'Date,Catégorie,Description,Bénéficiaire,Montant (FCFA)\n';

    this.expenses.forEach(exp => {
      const cat = this.getCategoryInfo(exp.category);
      csvContent += `${exp.date},"${cat?.label || ''}","${exp.description}","${exp.beneficiary || ''}",${exp.amount}\n`;
    });

    // Ajouter le résumé
    csvContent += '\n\nRÉSUMÉ PAR CATÉGORIE\n';
    totalByCategory.forEach(cat => {
      csvContent += `"${cat.label}",${cat.total}\n`;
    });
    csvContent += `\nTOTAL GÉNÉRAL,${grandTotal}\n`;

    // Télécharger le fichier
    this.downloadFile(csvContent, 'text/csv;charset=utf-8;', 'depenses.csv');
    this.showExportMenu = false;
  }

  exportToPDF(): void {
    const totalByCategory = this.getTotalByCategory();
    const grandTotal = this.getGrandTotal();

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
      alert('⚠️ Veuillez autoriser les popups pour exporter en PDF');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Rapport des Dépenses</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; background: white; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #6366f1; padding-bottom: 20px; }
          h1 { color: #6366f1; font-size: 32px; margin-bottom: 10px; }
          .date { color: #64748b; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin: 30px 0; }
          th { background-color: #f1f5f9; padding: 14px; text-align: left; border-bottom: 2px solid #cbd5e1; font-weight: 600; color: #475569; font-size: 13px; text-transform: uppercase; }
          td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
          tr:hover { background-color: #f8fafc; }
          .amount { text-align: right; font-weight: 600; color: #10b981; }
          .category { display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; }
          .cat-blue { background: #dbeafe; color: #1e40af; }
          .cat-yellow { background: #fef3c7; color: #92400e; }
          .cat-cyan { background: #cffafe; color: #155e75; }
          .cat-red { background: #fee2e2; color: #991b1b; }
          .cat-green { background: #dcfce7; color: #166534; }
          .cat-gray { background: #f3f4f6; color: #374151; }
          .summary { margin-top: 40px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px; border-radius: 12px; border: 2px solid #e2e8f0; }
          .summary h2 { color: #334155; margin-bottom: 20px; font-size: 20px; }
          .summary-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
          .summary-item:last-child { border-bottom: none; }
          .summary-label { font-weight: 500; color: #475569; }
          .summary-value { font-weight: 600; color: #1e293b; }
          .total { margin-top: 20px; padding-top: 20px; border-top: 3px solid #6366f1; font-size: 18px; }
          .total .summary-value { color: #6366f1; font-size: 22px; }
          @media print {
            body { padding: 20px; }
            .header { page-break-after: avoid; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Rapport des Dépenses</h1>
          <p class="date">Généré le ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Catégorie</th>
              <th>Description</th>
              <th>Bénéficiaire</th>
              <th style="text-align: right;">Montant (FCFA)</th>
            </tr>
          </thead>
          <tbody>
            ${this.expenses.map(exp => {
              const cat = this.getCategoryInfo(exp.category);
              return `
                <tr>
                  <td>${new Date(exp.date).toLocaleDateString('fr-FR')}</td>
                  <td><span class="category cat-${cat?.color}">${cat?.icon} ${cat?.label}</span></td>
                  <td>${exp.description}</td>
                  <td>${exp.beneficiary || '-'}</td>
                  <td class="amount">${this.formatNumber(exp.amount)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="summary">
          <h2>📈 Résumé par Catégorie</h2>
          ${totalByCategory.map(cat => `
            <div class="summary-item">
              <span class="summary-label">${cat.icon} ${cat.label}</span>
              <span class="summary-value">${this.formatNumber(cat.total)} FCFA</span>
            </div>
          `).join('')}
          <div class="summary-item total">
            <span class="summary-label">💎 TOTAL GÉNÉRAL</span>
            <span class="summary-value">${this.formatNumber(grandTotal)} FCFA</span>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    this.showExportMenu = false;
  }

  private downloadFile(content: string, mimeType: string, filename: string): void {
    // Ajouter le BOM pour le support UTF-8 dans Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ========================================
  // MÉTHODES UTILITAIRES
  // ========================================

  private generateId(): string {
    return `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  getCategoryClass(category: ExpenseCategory): string {
    const cat = this.getCategoryInfo(category);
    return `cat-${cat?.color || 'gray'}`;
  }
}
