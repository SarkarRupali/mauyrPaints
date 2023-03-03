import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartnerFormPage } from './partner-form.page';

const routes: Routes = [
  {
    path: '',
    component: PartnerFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartnerFormPageRoutingModule {}
