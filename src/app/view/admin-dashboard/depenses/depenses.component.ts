import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Expense {
  id: string;
  category: 'salaire' | 'electricite' | 'eau' | 'carburant' | 'materiel' | 'autre';
  description: string;
  amount: number;
  date: string;
  beneficiary?: string;
}

interface Category {
  value: string;
  label: string;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-depenses',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './depenses.component.html',
  styleUrls: ['./depenses.component.scss']
})
export class ExpenseComponent implements OnInit {
  expenses: Expense[] = [];
  isModalOpen = false;
  editingExpense: Expense | null = null;
  searchTerm = '';
  filterCategory = 'all';
  showExportMenu = false;

  formData = {
    category: 'salaire' as Expense['category'],
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    beneficiary: ''
  };

  categories: Category[] = [
    { value: 'salaire', label: 'Salaire', color: 'blue', icon: '💰' },
    { value: 'electricite', label: 'Électricité', color: 'yellow', icon: '⚡' },
    { value: 'eau', label: 'Eau', color: 'cyan', icon: '💧' },
    { value: 'carburant', label: 'Carburant', color: 'red', icon: '⛽' },
    { value: 'materiel', label: 'Matériel', color: 'green', icon: '🔧' },
    { value: 'autre', label: 'Autre', color: 'gray', icon: '📦' }
  ];

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    const stored = localStorage.getItem('expenses-data');
    if (stored) {
      this.expenses = JSON.parse(stored);
    }
  }

  saveExpenses(): void {
    localStorage.setItem('expenses-data', JSON.stringify(this.expenses));
  }

  get filteredExpenses(): Expense[] {
    return this.expenses.filter(exp => {
      const matchesSearch = exp.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           exp.beneficiary?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.filterCategory === 'all' || exp.category === this.filterCategory;
      return matchesSearch && matchesCategory;
    });
  }

  get totalByCategory() {
    return this.categories.map(cat => ({
      ...cat,
      total: this.expenses
        .filter(exp => exp.category === cat.value)
        .reduce((sum, exp) => sum + exp.amount, 0)
    }));
  }

  get grandTotal(): number {
    return this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.resetForm();
  }

  handleSubmit(): void {
    if (!this.formData.description || !this.formData.amount || !this.formData.date) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.editingExpense) {
      const index = this.expenses.findIndex(exp => exp.id === this.editingExpense!.id);
      if (index !== -1) {
        this.expenses[index] = {
          ...this.editingExpense,
          ...this.formData,
          amount: parseFloat(this.formData.amount)
        };
      }
    } else {
      const newExpense: Expense = {
        id: Date.now().toString(),
        category: this.formData.category,
        description: this.formData.description,
        amount: parseFloat(this.formData.amount),
        date: this.formData.date,
        beneficiary: this.formData.beneficiary
      };
      this.expenses.push(newExpense);
    }

    this.saveExpenses();
    this.resetForm();
  }

  handleEdit(expense: Expense): void {
    this.editingExpense = expense;
    this.formData = {
      category: expense.category,
      description: expense.description,
      amount: expense.amount.toString(),
      date: expense.date,
      beneficiary: expense.beneficiary || ''
    };
    this.isModalOpen = true;
  }

  handleDelete(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      this.expenses = this.expenses.filter(exp => exp.id !== id);
      this.saveExpenses();
    }
  }

  resetForm(): void {
    this.formData = {
      category: 'salaire',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      beneficiary: ''
    };
    this.editingExpense = null;
    this.isModalOpen = false;
  }

  toggleExportMenu(): void {
    this.showExportMenu = !this.showExportMenu;
  }

  exportToCSV(): void {
    const headers = ['Date', 'Catégorie', 'Description', 'Bénéficiaire', 'Montant'];
    const rows = this.expenses.map(exp => [
      exp.date,
      this.categories.find(c => c.value === exp.category)?.label,
      exp.description,
      exp.beneficiary || '',
      exp.amount.toString()
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    this.downloadFile(csv, 'text/csv', 'depenses.csv');
    this.showExportMenu = false;
  }

  exportToExcel(): void {
    // Utiliser une bibliothèque comme xlsx pour l'export Excel
    console.log('Export Excel - Nécessite la bibliothèque xlsx');
    this.showExportMenu = false;
  }

  exportToPDF(): void {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const html = this.generatePDFHTML();
    printWindow.document.write(html);
    printWindow.document.close();
    this.showExportMenu = false;
  }

  private generatePDFHTML(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rapport des Dépenses</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          h1 { color: #6366f1; border-bottom: 3px solid #6366f1; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background-color: #f1f5f9; padding: 12px; text-align: left; border-bottom: 2px solid #cbd5e1; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          .amount { text-align: right; font-weight: 600; }
          .summary { margin-top: 30px; background-color: #f8fafc; padding: 20px; border-radius: 8px; }
          .total { font-size: 18px; font-weight: bold; color: #6366f1; margin-top: 10px; padding-top: 10px; border-top: 2px solid #6366f1; }
        </style>
      </head>
      <body>
        <h1>Rapport des Dépenses</h1>
        <p>Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Catégorie</th>
              <th>Description</th>
              <th>Bénéficiaire</th>
              <th>Montant (FCFA)</th>
            </tr>
          </thead>
          <tbody>
            ${this.expenses.map(exp => `
              <tr>
                <td>${new Date(exp.date).toLocaleDateString('fr-FR')}</td>
                <td>${this.categories.find(c => c.value === exp.category)?.label}</td>
                <td>${exp.description}</td>
                <td>${exp.beneficiary || '-'}</td>
                <td class="amount">${exp.amount.toLocaleString('fr-FR')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="summary">
          <h2>Résumé par Catégorie</h2>
          ${this.totalByCategory.map(cat => `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
              <span>${cat.label}</span>
              <strong>${cat.total.toLocaleString('fr-FR')} FCFA</strong>
            </div>
          `).join('')}
          <div class="total" style="display: flex; justify-content: space-between;">
            <span>TOTAL GÉNÉRAL</span>
            <span>${this.grandTotal.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 100);
          }
        </script>
      </body>
      </html>
    `;
  }

  private downloadFile(content: string, mimeType: string, filename: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  getCategoryIcon(categoryValue: string): string {
    return this.categories.find(c => c.value === categoryValue)?.icon || '📦';
  }

  getCategoryLabel(categoryValue: string): string {
    return this.categories.find(c => c.value === categoryValue)?.label || 'Autre';
  }

  getCategoryColor(categoryValue: string): string {
    return this.categories.find(c => c.value === categoryValue)?.color || 'gray';
  }
}
