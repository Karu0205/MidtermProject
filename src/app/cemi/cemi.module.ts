import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CemiPageRoutingModule } from './cemi-routing.module';

import { CemiPage } from './cemi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CemiPageRoutingModule
  ],
  declarations: [CemiPage]
})
export class CemiPageModule {}
