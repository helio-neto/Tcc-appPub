import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BeerAddPage } from './beer-add';

@NgModule({
  declarations: [
    BeerAddPage,
  ],
  imports: [
    IonicPageModule.forChild(BeerAddPage),
  ],
})
export class BeerAddPageModule {}
