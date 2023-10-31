import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudentmodalPageRoutingModule } from './studentmodal-routing.module';

import { StudentmodalPage } from './studentmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentmodalPageRoutingModule
  ],
  declarations: [StudentmodalPage]
})
export class StudentmodalPageModule {}
