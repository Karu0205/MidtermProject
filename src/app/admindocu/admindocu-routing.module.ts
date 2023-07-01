import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdmindocuPage } from './admindocu.page';

const routes: Routes = [
  {
    path: '',
    component: AdmindocuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmindocuPageRoutingModule {}
