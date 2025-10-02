import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerDashboardComponent } from '../../view/manager-dashboard/manager-dashboard.component';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },
    {
      path: 'dashboard',
      component: ManagerDashboardComponent
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
