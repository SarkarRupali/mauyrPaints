import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GiftdetailsPage } from './giftdetails.page';

const routes: Routes = [
  {
    path: '',
    component: GiftdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiftdetailsPageRoutingModule {}
