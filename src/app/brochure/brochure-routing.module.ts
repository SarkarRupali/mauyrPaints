import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrochurePage } from './brochure.page';

const routes: Routes = [
  {
    path: '',
    component: BrochurePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrochurePageRoutingModule {}
