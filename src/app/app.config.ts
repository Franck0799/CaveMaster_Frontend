import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ThemeService } from './core/services/theme.service';

// Import Lucide Icons
import {
  LucideAngularModule,
  Users,
  Package,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  AlertCircle,
  Award,
  Euro,
  Coffee,
  ShoppingCart,
  CheckCircle,
  Wine,
  Heart,
  Star,
  MapPin,
  Search,
  Plus,
  LayoutDashboard,
  UserCircle,
  Settings,
  LogOut,
  Bell,
  Download,
  Activity,
  UserPlus,
  Edit,
  Trash2,
  Trophy,
  X
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(), provideAnimationsAsync(), provideHttpClient(), provideHttpClient(withFetch()), ThemeService, LucideAngularModule]
};

// Export pour utiliser les icônes dans les composants
export const lucideIcons = {
  Users,
  Package,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  AlertCircle,
  Award,
  Euro,
  Coffee,
  ShoppingCart,
  CheckCircle,
  Wine,
  Heart,
  Star,
  MapPin,
  Search,
  Plus,
  LayoutDashboard,
  UserCircle,
  Settings,
  LogOut,
  Bell,
  Download,
  Activity,
  UserPlus,
  Edit,
  Trash2,
  Trophy,
  X
};
