import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar ,NavController, NavParams, Platform, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PubProvider } from './../../providers/pub/pub';

@IonicPage()
@Component({
  selector: 'page-beer-menu',
  templateUrl: 'beer-menu.html',
})
export class BeerMenuPage {
  @ViewChild('navbar') navBar: Navbar;
  beers: any;
  selectedItem: any;
  icons = {
    "Pilsen": "assets/icon/mapicons/beer-icon1-1.png",
    "Lager": "assets/icon/mapicons/beer-cup-1-2.png",
    "Ipa": "assets/icon/mapicons/beer-icon1-2.png",
    "Apa": "assets/icon/mapicons/beer-icon1-2.png",
    "Saison": "assets/icon/mapicons/beer-icon1-1.png",
    "Stout": "assets/icon/mapicons/icons8-guinness-beer-48.png",
    "Bock": "assets/icon/mapicons/icons8-guinness-beer-48.png",
    "Doppelbock": "assets/icon/mapicons/icons8-guinness-beer-48.png",
    "ibu": "assets/icon/mapicons/icons8-hops-40.png",
    "abv": "assets/icon/mapicons/percent.png",
    "styles": "assets/icon/mapicons/styles.png",
    "Default": "assets/icon/mapicons/beer.png"
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, private platform:Platform,
              private storage:Storage, private pubProv:PubProvider, public alertCtrl: AlertController,
              public toastCtrl: ToastController) {
                this.selectedItem = navParams.get('item');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BeerMenuPage');
    this.initMenu();
    
  }
  ionViewWillUnload(){
   console.log("WILL LEAVE?");
   
  }
  // 
  initMenu(){
    this.platform.ready().then(()=>{
      this.storage.get("pub_userdata").then((val)=>{
        console.log("Pub User Data Val",val.pub.beers);
        this.beers = val.pub.beers;
        this.setIcons();
      });
    });
  }
  // 
  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push("BeerMenuPage", {
      item: item
    });
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
  // 
  presentConfirmDelete(beer) {
    let alert = this.alertCtrl.create({
      title: 'Você deseja remover esta cerveja?',
      message:  `<p>Nome: ${beer.name}</p>
                <p></p>`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.deleteBeer(this.selectedItem);
          }
        }
      ]
    });
    alert.present();
  }
  // 
  presentToast(message,cssStyle) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'bottom',
      cssClass: cssStyle
    });
    
    toast.onDidDismiss(() => {
      
    });
    
    toast.present();
  }
  // 
  deleteBeer(beer){
    console.log("Delete Beer ->",beer);
    this.pubProv.deleteBeer(beer).then((resp)=>{
      console.log("DELETE BEER RESPONSE ->",resp);
      if(resp["status"] == "success"){
        this.presentToast(resp["message"],"success");
        if(resp["beers"]["nModified"] == 1){
          this.storage.get("pub_userdata").then((val)=>{
            val.pub.beers = val.pub.beers.filter(beerF => beerF._id !== beer._id);
            this.storage.set("pub_userdata",val);
            console.log("STORAGE UPDATED");
          });
          setTimeout(() => {
            this.navCtrl.setRoot("BeerMenuPage");
          }, 1000);
        }
      }
    }).catch((error)=>{
      console.log("ADD BEER ERROR ->",error);
      this.presentToast(error["message"],"error");
    });
  }
  // 
  setIcons(){
    console.log("SET ICONS",this.beers);
    this.beers.forEach(beer => {
      let funIcon = (this.icons[beer.style]) ? this.icons[beer.style] : this.icons.Default;
      beer.icon = funIcon;
    });
  }
}
