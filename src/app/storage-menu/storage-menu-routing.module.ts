import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StorageMenuPage } from './storage-menu.page';

const routes: Routes = [
  {
    path: '',
    component: StorageMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorageMenuPageRoutingModule {}
