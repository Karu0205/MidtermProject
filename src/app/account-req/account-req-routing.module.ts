import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountReqPage } from './account-req.page';

const routes: Routes = [
  {
    path: '',
    component: AccountReqPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountReqPageRoutingModule {}
