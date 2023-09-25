import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompletionPageRoutingModule } from './completion-routing.module';

import { CompletionPage } from './completion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompletionPageRoutingModule
  ],
  declarations: [CompletionPage]
})
export class CompletionPageModule {}
