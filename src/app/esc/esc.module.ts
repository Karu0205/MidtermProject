import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscPageRoutingModule } from './esc-routing.module';

import { EscPage } from './esc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscPageRoutingModule
  ],
  declarations: [EscPage]
})
export class EscPageModule {}
