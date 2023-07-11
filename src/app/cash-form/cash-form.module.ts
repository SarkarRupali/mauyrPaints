import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CashFormPageRoutingModule } from './cash-form-routing.module';

import { CashFormPage } from './cash-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CashFormPageRoutingModule
  ],
  declarations: [CashFormPage]
})
export class CashFormPageModule { }
