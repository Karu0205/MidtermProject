import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditstudentPageRoutingModule } from './editstudent-routing.module';

import { EditstudentPage } from './editstudent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditstudentPageRoutingModule
  ],
  declarations: [EditstudentPage]
})
export class EditstudentPageModule {}
