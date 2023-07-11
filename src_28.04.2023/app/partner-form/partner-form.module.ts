import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartnerFormPageRoutingModule } from './partner-form-routing.module';

import { PartnerFormPage } from './partner-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PartnerFormPageRoutingModule
  ],
  declarations: [PartnerFormPage]
})
export class PartnerFormPageModule { }
