import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CashFormPage } from './cash-form.page';

const routes: Routes = [
  {
    path: '',
    component: CashFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashFormPageRoutingModule {}
