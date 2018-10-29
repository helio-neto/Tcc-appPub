import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BeerMenuPage } from './beer-menu';

@NgModule({
  declarations: [
    BeerMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(BeerMenuPage),
  ],
})
export class BeerMenuPageModule {}
