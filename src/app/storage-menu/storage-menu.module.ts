import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StorageMenuPageRoutingModule } from './storage-menu-routing.module';

import { StorageMenuPage } from './storage-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StorageMenuPageRoutingModule
  ],
  declarations: [StorageMenuPage]
})
export class StorageMenuPageModule {}
