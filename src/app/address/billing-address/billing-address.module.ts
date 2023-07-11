import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillingAddressPageRoutingModule } from './billing-address-routing.module';

import { BillingAddressPage } from './billing-address.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillingAddressPageRoutingModule
  ],
  declarations: [BillingAddressPage]
})
export class BillingAddressPageModule {}
