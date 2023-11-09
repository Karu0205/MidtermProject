import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountReqPageRoutingModule } from './account-req-routing.module';

import { AccountReqPage } from './account-req.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountReqPageRoutingModule
  ],
  declarations: [AccountReqPage]
})
export class AccountReqPageModule {}
