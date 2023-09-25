import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompletionPage } from './completion.page';

const routes: Routes = [
  {
    path: '',
    component: CompletionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompletionPageRoutingModule {}
