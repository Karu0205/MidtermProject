import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditstudentPage } from './editstudent.page';

const routes: Routes = [
  {
    path: '',
    component: EditstudentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditstudentPageRoutingModule {}
