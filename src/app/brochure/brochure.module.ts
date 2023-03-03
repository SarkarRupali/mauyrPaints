import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrochurePageRoutingModule } from './brochure-routing.module';

import { BrochurePage } from './brochure.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrochurePageRoutingModule
  ],
  declarations: [BrochurePage]
})
export class BrochurePageModule {}
