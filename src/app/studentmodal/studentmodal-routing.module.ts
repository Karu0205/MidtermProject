import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentmodalPage } from './studentmodal.page';

const routes: Routes = [
  {
    path: '',
    component: StudentmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentmodalPageRoutingModule {}
