// ==========================================
// FICHIER: src/app/features/managers/managers.component.ts
// DESCRIPTION: Composant pour gérer les managers et leurs équipes
// ==========================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Manager, Cave, NewManagerForm } from '../../core/models/models';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.scss']
})
export class ManagersComponent implements OnInit, OnDestroy {

  // Données
  managers: Manager[] = [];
  caves: Cave[] = [];

  // États UI
  isLoading: boolean = false;
  isAddModalOpen: boolean = false;

  // Formulaire d'ajout
  managerForm: NewManagerForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    caveId: '',
    role: 'Manager'
  };

  // Statistiques
  stats = {
    totalManagers: 0,
    totalTeamMembers: 0,
    avgTeamSize: 0,
    topPerformer: ''
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

    this.dataService.managers$
      .pipe(takeUntil(this.destroy$))
      .subscribe(managers => {
        this.managers = managers;
        this.calculateStats();
        this.isLoading = false;
      });

    this.dataService.caves$
      .pipe(takeUntil(this.destroy$))
      .subscribe(caves => this.caves = caves);
  }

  // Calcul des statistiques
  calculateStats(): void {
    this.stats.totalManagers = this.managers.length;
    this.stats.totalTeamMembers = this.managers.reduce(
      (sum, m) => sum + m.employees.length, 0
    );
    this.stats.avgTeamSize = this.managers.length > 0
      ? Math.round(this.stats.totalTeamMembers / this.managers.length)
      : 0;

    // Trouve le meilleur performeur
    if (this.managers.length > 0) {
      const topManager = this.managers.reduce((prev, current) =>
        parseFloat(prev.performance.ventes.replace(/[^\d.]/g, '')) >
        parseFloat(current.performance.ventes.replace(/[^\d.]/g, ''))
          ? prev
          : current
      );
      this.stats.topPerformer = topManager.name;
    }
  }

  // Toggle affichage employés
  toggleEmployees(manager: Manager): void {
    manager.showEmployees = !manager.showEmployees;
  }

  // Modal d'ajout
  openAddModal(): void {
    this.managerForm = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      caveId: '',
      role: 'Manager'
    };
    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  saveManager(): void {
    if (!this.managerForm.firstName || !this.managerForm.lastName ||
        !this.managerForm.email || !this.managerForm.caveId) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newManager: Manager = {
      id: this.generateId(),
      name: `${this.managerForm.firstName} ${this.managerForm.lastName}`,
      avatar: this.managerForm.firstName.charAt(0).toUpperCase(),
      role: this.managerForm.role,
      caveId: this.managerForm.caveId,
      email: this.managerForm.email,
      phone: this.managerForm.phone,
      performance: {
        ventes: '0 FCFA',
        equipe: 0,
        satisfaction: '0%'
      },
      employees: [],
      showEmployees: false
    };

    this.dataService.addManager(newManager);
    this.closeAddModal();
  }

  // Suppression
  deleteManager(manager: Manager): void {
    const confirmed = confirm(
      `Supprimer ${manager.name} ? Ses ${manager.employees.length} employés seront réassignés.`
    );
    if (confirmed) {
      this.dataService.deleteManager(manager.id);
    }
  }

  // Utilitaires
  private generateId(): string {
    return `manager_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getCaveName(caveId: string): string {
    const cave = this.caves.find(c => c.id === caveId);
    return cave ? cave.name : 'Cave inconnue';
  }
}

