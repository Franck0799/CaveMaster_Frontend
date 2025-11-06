import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagerDashboardComponent } from '../../view/manager-dashboard/manager-dashboard.component';
import { ManagerRoutingModule } from './manager-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ManagerDashboardComponent // Import du composant standalone

  ]
})
export class ManagerModule { }
