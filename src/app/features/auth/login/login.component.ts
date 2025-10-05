import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  errorMessage = '';
  showError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialisation du formulaire avec validations
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Vérifier si l'utilisateur est déjà connecté
    this.checkExistingSession();
  }

  /**
   * Vérifie si une session existe déjà
   */
  private checkExistingSession(): void {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token && this.authService.isAuthenticated()) {
      const role = this.authService.getUserRole();
      this.redirectBasedOnRole(role);
    }
  }

  /**
   * Toggle la visibilité du mot de passe
   */
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  /**
   * Navigation vers la page de mot de passe oublié
   */
  goToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  /**
   * Navigation vers la page d'inscription
   */
  goToSignup(): void {
    this.router.navigate(['/auth/signup']);
  }

  /**
   * Gestion de la soumission du formulaire
   */
  onSubmit(): void {
    // Réinitialiser les erreurs
    this.showError = false;
    this.errorMessage = '';

    // Vérifier la validité du formulaire
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      this.displayError('Veuillez remplir tous les champs correctement');
      return;
    }

    // Démarrer le chargement
    this.isLoading = true;
    const { email, password, rememberMe } = this.loginForm.value;

    // Appel au service d'authentification
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response && response.token) {
          // Stocker le token selon la préférence rememberMe
          this.storeAuthToken(response.token, rememberMe);

          // Stocker les informations utilisateur
          if (response.user) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }

          // Afficher un message de succès
          this.showSuccessMessage('Connexion réussie!');

          // Redirection après un court délai
          setTimeout(() => {
            const userRole = this.authService.getUserRole();
            this.redirectBasedOnRole(userRole);
          }, 500);
        } else {
          this.displayError('Réponse du serveur invalide');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.handleLoginError(error);
      }
    });
  }

  /**
   * Stocke le token d'authentification
   */
  private storeAuthToken(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem('token', token);
      localStorage.setItem('rememberMe', 'true');
    } else {
      sessionStorage.setItem('token', token);
      localStorage.removeItem('rememberMe');
    }
  }

  /**
   * Gestion des erreurs de connexion
   */
  private handleLoginError(error: any): void {
    console.error('Erreur de connexion:', error);

    let message = 'Une erreur est survenue lors de la connexion';

    if (error.status === 401) {
      message = 'Email ou mot de passe incorrect';
    } else if (error.status === 403) {
      message = 'Accès refusé. Votre compte est peut-être désactivé';
    } else if (error.status === 404) {
      message = 'Service d\'authentification non disponible';
    } else if (error.status === 0) {
      message = 'Impossible de contacter le serveur. Vérifiez votre connexion';
    } else if (error.error?.message) {
      message = error.error.message;
    }

    this.displayError(message);
  }

  /**
   * Redirection basée sur le rôle
   */
  private redirectBasedOnRole(role: string | null): void {
    if (!role) {
      console.warn('Rôle utilisateur non défini, redirection vers admin par défaut');
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    const roleRoutes: Record<string, string> = {
      'admin': '/admin/dashboard',
      'manager': '/manager/dashboard',
      'waitress': '/waitress/dashboard',
      'waiter': '/waitress/dashboard', // Même dashboard que waitress
      'bartender': '/waitress/dashboard'
    };

    const route = roleRoutes[role.toLowerCase()] || '/admin/dashboard';

    this.router.navigate([route]).catch(err => {
      console.error('Erreur de navigation:', err);
      this.displayError('Erreur lors de la redirection');
    });
  }

  /**
   * Affiche un message d'erreur
   */
  private displayError(message: string): void {
    this.errorMessage = message;
    this.showError = true;

    // Auto-hide après 5 secondes
    setTimeout(() => {
      this.showError = false;
    }, 5000);
  }

  /**
   * Affiche un message de succès
   */
  private showSuccessMessage(message: string): void {
    // Créer un élément de notification temporaire
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);

    // Retirer après 3 secondes
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  /**
   * Marque tous les champs du formulaire comme touchés
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Getters pour faciliter l'accès aux contrôles du formulaire
   */
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }

  /**
   * Vérifie si un champ a une erreur et a été touché
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.hasError(errorType) && (field?.dirty || field?.touched));
  }

  /**
   * Nettoyage lors de la destruction du composant
   */
  ngOnDestroy(): void {
    // Nettoyer les subscriptions si nécessaire
  }
}
