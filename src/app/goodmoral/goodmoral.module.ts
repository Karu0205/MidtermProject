import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GoodmoralPageRoutingModule } from './goodmoral-routing.module';

import { GoodmoralPage } from './goodmoral.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoodmoralPageRoutingModule
  ],
  declarations: [GoodmoralPage]
})
export class GoodmoralPageModule {}
