import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillingAddressEditPageRoutingModule } from './billing-address-edit-routing.module';

import { BillingAddressEditPage } from './billing-address-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    BillingAddressEditPageRoutingModule
  ],
  declarations: [BillingAddressEditPage]
})
export class BillingAddressEditPageModule { }
