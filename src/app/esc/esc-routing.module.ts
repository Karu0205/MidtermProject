import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscPage } from './esc.page';

const routes: Routes = [
  {
    path: '',
    component: EscPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscPageRoutingModule {}
