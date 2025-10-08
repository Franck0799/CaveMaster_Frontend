import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './core/components/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [authGuard],
    data: {
      requiredRoles: ['admin'],
    },
  },
  {
    path: 'manager',
    loadChildren: () => import('./features/manager/manager.module').then((m) => m.ManagerModule),
    canActivate: [authGuard],
    data: {
      requiredRoles: ['manager'],
    },
  },
  {
    path: 'waitress',
    loadChildren: () => import('./features/waitress/waitress.module').then((m) => m.WaitressModule),
    canActivate: [authGuard],
    data: {
      requiredRoles: ['waitress'],
    },
  },

  { path: '**', component: NotFoundComponent },
];
