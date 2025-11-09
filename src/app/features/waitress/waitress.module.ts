import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WaitressComponent } from '../../view/waitress-dashboard/waitress-dashboard.component';
import { WaitressRoutingModule } from './waitress-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WaitressRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    WaitressComponent
  ]
})
export class WaitressModule { }
