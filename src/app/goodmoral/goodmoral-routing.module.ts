import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GoodmoralPage } from './goodmoral.page';

const routes: Routes = [
  {
    path: '',
    component: GoodmoralPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodmoralPageRoutingModule {}
