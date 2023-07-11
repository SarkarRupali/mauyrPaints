import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillingAddressEditPage } from './billing-address-edit.page';

const routes: Routes = [
  {
    path: '',
    component: BillingAddressEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingAddressEditPageRoutingModule {}
