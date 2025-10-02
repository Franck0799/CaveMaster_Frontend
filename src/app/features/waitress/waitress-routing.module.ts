import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WaitressDashboardComponent } from '../../view/waitress-dashboard/waitress-dashboard.component';

const routes: Routes = [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: WaitressDashboardComponent
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaitressRoutingModule { }
