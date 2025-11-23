import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {ClientDashboardComponent} from '../../view/client-dashboard/client-dashboard.component';
//

import { OrdersComponent } from '../../view/client-dashboard/orders/orders.component';
import { NotificationsComponent } from '../../view/client-dashboard/notifications/notifications.component';
import { HomeComponent } from '../../view/client-dashboard/home/home.component';
import { FavorisComponent } from '../../view/client-dashboard/favoris/favoris.component';
import { CatalogueComponent } from '../../view/client-dashboard/catalogue/catalogue.component';
import { AddressesComponent } from '../../view/client-dashboard/addresses/addresses.component';
import { FaqComponent } from '../../view/client-dashboard/faq/faq.component';
import { LoyaltyComponent } from '../../view/client-dashboard/loyalty/loyalty.component';
import { PaymentsComponent } from '../../view/client-dashboard/payments/payments.component';
import { SettingsComponent } from '../../view/client-dashboard/settings/settings.component';
import { SupportComponent } from '../../view/client-dashboard/support/support.component';
import { CaveDetailComponent } from '../../view/client-dashboard/cave-detail/cave-detail.component';
import { CaveComponent } from '../../view/client-dashboard/cave/cave.component';
import { OrderDetailComponent } from '../../view/client-dashboard/order-detail/order-detail.component';
import { WineDetailComponent} from '../../view/client-dashboard/wine-detail/wine-detail.component';
import { CartComponent } from '../../view/client-dashboard/cart/cart.component';
//

//
const routes: Routes = [
    {
      path: '',
      component: ClientDashboardComponent,
      children: [

        {
          path: '',
          redirectTo:'home',
          pathMatch: 'full'
        },

        {
          path:'home',
          component:HomeComponent,
          data: { title:'Tableau de bord'}
        },

        {
          path:'orders',
          component:OrdersComponent,
          data: { title:'Commandes'}
        },

        {
          path:'notifications',
          component:NotificationsComponent,
          data: { title:'Notifications'}
        },

        {
          path:'favoris',
          component:FavorisComponent,
          data: { title:'Favoris'}
        },

        {
          path:'catalogue',
          component:CatalogueComponent,
          data: { title:'Catalogue'}
        },

        {
          path:'addresses',
          component:AddressesComponent,
          data: { title:'Addresses'}
        },

        {
          path:'faq',
          component:FaqComponent,
          data: { title:'Faq'}
        },

        {
          path:'loyalty',
          component:LoyaltyComponent,
          data: { title:'Fidélié'}
        },

        {
          path:'payments',
          component:PaymentsComponent,
          data: { title:'Paiements'}
        },

        {
          path:'settings',
          component:SettingsComponent,
          data: { title:'Paramètres'}
        },

        {
          path:'support',
          component:SupportComponent,
          data: { title:'support'}
        },
////////////////////////////
        {
          path:'order-detail',
          component:OrderDetailComponent,
          data: { title:'detail commande'}
        },

        {
          path:'wine-detail',
          component:WineDetailComponent,
          data: { title:'detail vin'}
        },

        {
          path:'cave',
          component:CaveComponent,
          data: { title:'cave'}
        },

        {
          path:'cave-detail',
          component:CaveDetailComponent,
          data: { title:'detail cave'}
        },

         {
          path:'cart',
          component:CartComponent,
          data: { title:'panier'}
        },

        {
        path: '**',
        redirectTo: 'home'
      }
      ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
