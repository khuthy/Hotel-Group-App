import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmedMessagePage } from './confirmed-message';

@NgModule({
  declarations: [
    ConfirmedMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmedMessagePage),
  ],
})
export class ConfirmedMessagePageModule {}
