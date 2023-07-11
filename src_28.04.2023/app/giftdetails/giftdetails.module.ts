import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GiftdetailsPageRoutingModule } from './giftdetails-routing.module';

import { GiftdetailsPage } from './giftdetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GiftdetailsPageRoutingModule
  ],
  declarations: [GiftdetailsPage]
})
export class GiftdetailsPageModule {}
