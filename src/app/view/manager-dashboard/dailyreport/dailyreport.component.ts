// ==========================================
// DAILY REPORT COMPONENT
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface DailyReportData {
  date: Date;
  openingCash: number;
  closingCash: number;
  totalSales: number;
  totalOrders: number;
  cashPayments: number;
  cardPayments: number;
  teamPresent: number;
  incidents: string[];
  notes: string;
}

@Component({
  selector: 'app-dailyreport',
   standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: `./dailyreport.component.html`,
  styleUrls: [`./dailyreport.component.scss`]
})
export class DailyReportComponent implements OnInit {
  reportDate = new Date();
  canSubmit = true;

  report: DailyReportData = {
    date: new Date(),
    openingCash: 500,
    closingCash: 3740,
    totalSales: 3240,
    totalOrders: 45,
    cashPayments: 1240,
    cardPayments: 2000,
    teamPresent: 4,
    incidents: [],
    notes: ''
  };

  get cashDifference(): number {
    return this.report.closingCash - this.report.openingCash - (this.report.cashPayments + this.report.cardPayments);
  }

  constructor() {}

  ngOnInit(): void {}

  addIncident(): void {
    this.report.incidents.push('');
  }

  removeIncident(index: number): void {
    this.report.incidents.splice(index, 1);
  }

  submitReport(): void {
    console.log('Enregistrer rapport:', this.report);
    alert('Rapport enregistré avec succès!');
  }

  viewHistory(): void {
    console.log('Voir l\'historique des rapports');
  }
}
