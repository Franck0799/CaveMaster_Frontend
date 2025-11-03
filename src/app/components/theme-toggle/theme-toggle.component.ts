// ==========================================
// FICHIER: src/app/components/theme-toggle/theme-toggle.component.ts
// ==========================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  currentTheme: Theme = 'dark';
  private themeSubscription?: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Récupère le thème actuel
    this.currentTheme = this.themeService.getCurrentTheme();

    // S'abonne aux changements de thème
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  /**
   * Toggle entre les thèmes dark et light
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Retourne le tooltip selon le thème actuel
   */
  getTooltip(): string {
    switch (this.currentTheme) {
      case 'light':
        return 'Passer en mode sombre';
      case 'dark':
        return 'Passer en mode clair';
      case 'auto':
        return 'Mode automatique (système)';
      default:
        return 'Changer de thème';
    }
  }
}
