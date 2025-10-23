// ==========================================
// FICHIER: src/app/features/employees/employees.component.ts
// DESCRIPTION: Composant pour gérer tous les employés de l'organisation
// ==========================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Employee, Manager, Cave, NewEmployeeForm } from '../../core/models/models';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit, OnDestroy {

  // Données
  employees: Employee[] = [];
  managers: Manager[] = [];
  caves: Cave[] = [];

  // Filtres
  filteredEmployees: Employee[] = [];
  selectedCaveFilter: string | null = null;
  selectedManagerFilter: string | null = null;
  searchTerm: string = '';

  // UI
  isLoading: boolean = false;
  isAddModalOpen: boolean = false;

  // Formulaire
  employeeForm: NewEmployeeForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    caveId: '',
    managerId: '',
    position: ''
  };

  // Statistiques
  stats = {
    total: 0,
    avgSales: '0K',
    avgHours: '0h',
    newThisMonth: 0
  };

  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Chargement des données
  loadData(): void {
    this.isLoading = true;

    // Charge les employés
    this.dataService.employees$
      .pipe(takeUntil(this.destroy$))
      .subscribe(employees => {
        this.employees = employees;
        this.applyFilters();
        this.calculateStats();
        this.isLoading = false;
      });

    // Charge les managers
    this.dataService.managers$
      .pipe(takeUntil(this.destroy$))
      .subscribe(managers => this.managers = managers);

    // Charge les caves
    this.dataService.caves$
      .pipe(takeUntil(this.destroy$))
      .subscribe(caves => this.caves = caves);
  }

  // Filtrage
  applyFilters(): void {
    let result = [...this.employees];

    if (this.selectedCaveFilter) {
      result = result.filter(e => e.caveId === this.selectedCaveFilter);
    }

    if (this.selectedManagerFilter) {
      result = result.filter(e => e.managerId === this.selectedManagerFilter);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(term) ||
        e.position.toLowerCase().includes(term)
      );
    }

    this.filteredEmployees = result;
  }

  onCaveFilterChange(caveId: string | null): void {
    this.selectedCaveFilter = caveId;
    this.selectedManagerFilter = null; // Reset manager filter
    this.applyFilters();
  }

  onManagerFilterChange(managerId: string | null): void {
    this.selectedManagerFilter = managerId;
    this.applyFilters();
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedCaveFilter = null;
    this.selectedManagerFilter = null;
    this.searchTerm = '';
    this.applyFilters();
  }

  // Statistiques
  calculateStats(): void {
    this.stats.total = this.employees.length;

    // Calcul des moyennes (simulation)
    const totalSales = this.employees.reduce((sum, e) => {
      const sales = parseFloat(e.ventes.replace(/[^\d]/g, '')) || 0;
      return sum + sales;
    }, 0);
    this.stats.avgSales = Math.round(totalSales / this.employees.length) + 'K';

    const totalHours = this.employees.reduce((sum, e) => {
      const hours = parseFloat(e.heures.replace(/[^\d]/g, '')) || 0;
      return sum + hours;
    }, 0);
    this.stats.avgHours = Math.round(totalHours / this.employees.length) + 'h';

    // Employés du mois (simulation)
    this.stats.newThisMonth = Math.floor(this.employees.length * 0.1);
  }

  // Modal
  openAddModal(): void {
    this.employeeForm = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      caveId: '',
      managerId: '',
      position: ''
    };
    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  // Récupère les managers d'une cave spécifique
  getManagersByCave(caveId: string): Manager[] {
    return this.managers.filter(m => m.caveId === caveId);
  }

  saveEmployee(): void {
    if (!this.employeeForm.firstName || !this.employeeForm.lastName ||
        !this.employeeForm.email || !this.employeeForm.caveId ||
        !this.employeeForm.managerId || !this.employeeForm.position) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newEmployee: Employee = {
      id: this.generateId(),
      name: `${this.employeeForm.firstName} ${this.employeeForm.lastName}`,
      avatar: this.employeeForm.firstName.charAt(0).toUpperCase(),
      position: this.employeeForm.position,
      managerId: this.employeeForm.managerId,
      caveId: this.employeeForm.caveId,
      email: this.employeeForm.email,
      phone: this.employeeForm.phone,
      ventes: '0K',
      heures: '0h'
    };

    this.dataService.addEmployee(newEmployee);
    this.closeAddModal();
  }

  deleteEmployee(employee: Employee): void {
    if (confirm(`Supprimer ${employee.name} ?`)) {
      this.dataService.deleteEmployee(employee.id);
    }
  }

  // Utilitaires
  private generateId(): string {
    return `employee_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getManagerName(managerId: string): string {
    const manager = this.managers.find(m => m.name === managerId || m.id === managerId);
    return manager ? manager.name : 'Non assigné';
  }

  getCaveName(caveId: string): string {
    const cave = this.caves.find(c => c.id === caveId);
    return cave ? cave.name : 'Cave inconnue';
  }
}
