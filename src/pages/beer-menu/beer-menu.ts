import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PubProvider } from './../../providers/pub/pub';

@IonicPage()
@Component({
  selector: 'page-beer-menu',
  templateUrl: 'beer-menu.html',
})
export class BeerMenuPage {

  beers: any;
  selectedItem: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private platform:Platform,
              private storage:Storage, private pubProv:PubProvider) {
                this.selectedItem = navParams.get('item');
    this.initMenu();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BeerMenuPage');
  }
  // 
  initMenu(){
    this.platform.ready().then(()=>{
      this.storage.get("pub_userdata").then((val)=>{
        console.log("Pub User Data Val",val.pub.beers);
        this.beers = val.pub.beers;
      });
    });
  }
  // 
  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push("BeerMenuPage", {
      item: item
    });
    // this.checkUser();
    console.log("ITEM TAPPED",item);
  }
  // 
  addBeer(){
    this.navCtrl.push("BeerAddPage");
  }
  // 
  editBeer(beer){
    this.navCtrl.push("BeerEditPage",{beer:beer})
  }
}
