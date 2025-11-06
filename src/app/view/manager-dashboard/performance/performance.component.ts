// ==========================================
// PERFORMANCE COMPONENT (Performance équipe)
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface EmployeePerformance {
  id: string;
  name: string;
  avatar: string;
  totalSales: number;
  ordersCompleted: number;
  averageTicket: number;
  rating: number;
  customerReviews: number;
  punctuality: number;
  productivity: number;
}

@Component({
  selector: 'app-performance',
  standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: `./performance.component.html`,
  styleUrls: [`./performance.component.scss`]
})
export class PerformanceComponent implements OnInit {
  selectedPeriod = 'week';

  employees: EmployeePerformance[] = [
    {
      id: '1',
      name: 'Marie Martin',
      avatar: '👩',
      totalSales: 3240,
      ordersCompleted: 45,
      averageTicket: 72,
      rating: 4.8,
      customerReviews: 28,
      punctuality: 95,
      productivity: 92
    },
    {
      id: '2',
      name: 'Pierre Dubois',
      avatar: '👨',
      totalSales: 2890,
      ordersCompleted: 38,
      averageTicket: 76,
      rating: 4.6,
      customerReviews: 22,
      punctuality: 88,
      productivity: 89
    },
    {
      id: '3',
      name: 'Sophie Laurent',
      avatar: '👩',
      totalSales: 2650,
      ordersCompleted: 35,
      averageTicket: 75.71,
      rating: 4.7,
      customerReviews: 25,
      punctuality: 92,
      productivity: 87
    },
    {
      id: '4',
      name: 'Thomas Bernard',
      avatar: '👨',
      totalSales: 2120,
      ordersCompleted: 28,
      averageTicket: 75.71,
      rating: 4.5,
      customerReviews: 18,
      punctuality: 85,
      productivity: 83
    }
  ];

  topPerformers: EmployeePerformance[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadPerformance();
  }

  loadPerformance(): void {
    this.topPerformers = [...this.employees]
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 3);
  }

  getRatingStars(rating: number): string {
    return '⭐'.repeat(Math.floor(rating));
  }

  viewDetails(employee: EmployeePerformance): void {
    console.log('Voir détails performance:', employee);
  }
}
