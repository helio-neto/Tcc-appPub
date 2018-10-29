import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BeerEditPage } from './beer-edit';

@NgModule({
  declarations: [
    BeerEditPage,
  ],
  imports: [
    IonicPageModule.forChild(BeerEditPage),
  ],
})
export class BeerEditPageModule {}
