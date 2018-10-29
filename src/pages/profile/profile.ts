import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  pubdata: any;
  pubReady: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,public platform: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.platform.ready().then(()=>{
      this.loadProfile();
    });
  }
  // 
  loadProfile(){
      this.storage.get("pub_userdata").then((val)=>{
        this.pubdata = val;
        this.pubReady = true;
        console.log("Pub Data ->",this.pubdata);
      });
  }
  // 
  openMenu(){
    this.navCtrl.push("BeerMenuPage");
  }
  // 
  openComments(){
    this.navCtrl.push("CommentsPage",{comments: this.pubdata.pub.comments});
  }
  // 
  goEdit(){
      this.navCtrl.push("EditPage",{pub:this.pubdata.pub});
  }

}
