import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CemiPage } from './cemi.page';

const routes: Routes = [
  {
    path: '',
    component: CemiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CemiPageRoutingModule {}
