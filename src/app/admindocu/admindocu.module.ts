import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdmindocuPageRoutingModule } from './admindocu-routing.module';

import { AdmindocuPage } from './admindocu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdmindocuPageRoutingModule
  ],
  declarations: [AdmindocuPage]
})
export class AdmindocuPageModule {}
