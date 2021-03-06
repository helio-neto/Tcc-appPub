import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PubProvider } from './../../providers/pub/pub';
import { Storage } from '@ionic/storage';
import { LoadingProvider } from './../../providers/loading/loading';

@IonicPage()
@Component({
  selector: 'page-beer-add',
  templateUrl: 'beer-add.html',
})
export class BeerAddPage {
  beerForm : FormGroup;
  submitAttempt: boolean = false;
  beer: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
              public alertCtrl: AlertController, public toastCtrl: ToastController, private pubPRov: PubProvider,
              private storage: Storage, public loadProvider: LoadingProvider) {
                this.beerForm = this.formBuilder.group({
                  pub_id:[''],
                  name: ['', Validators.required],
                  style: ['', Validators.required],
                  ibu: ['', Validators.required],
                  abv: ['', Validators.required],
                  obs: [''],
                  price: formBuilder.group({
                    half_pint: ['', Validators.required],
                    pint: ['', Validators.required],
                    mass: ['', Validators.required]
                  })
                });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BeerAddPage');
  }
  // 
  presentConfirmAdd() {
    let alert = this.alertCtrl.create({
      title: 'Você confirma estes dados?',
      message:  `<p>Nome: ${this.beerForm.get("name").value}</p>
      <p>Style: ${this.beerForm.get("style").value}</p>
      <p>Ibu: ${this.beerForm.get("ibu").value}</p>
      <p>Abv: ${this.beerForm.get("abv").value}</p>
      <p>Obs: ${this.beerForm.get("obs").value}</p>
      <p>Preço: </p>
      <p>Half-Pint: ${this.beerForm.get("price.half_pint").value}<p>
      <p>Pint: ${this.beerForm.get("price.pint").value}<p>
      <p>Mass: ${this.beerForm.get("price.mass").value}</p>`,
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
            this.addBeer();
          }
        }
      ]
    });
    alert.present();
  }
  // 
  addBeer(){
    if(!this.beerForm.valid){
      console.log("Formulário inválido");   
      this.submitAttempt = true; 
    }
    else {
      this.loadProvider.presentWithMessage("Adicionando cevada e lúpulo...");
      this.submitAttempt = false;
      console.log("success!")
      console.log("Form ->",this.beerForm.value);
      this.pubPRov.addBeer(this.beerForm.value).then(
        (resp)=>{
          this.loadProvider.dismiss().then(()=>{
            console.log("ADD BEER RESPONSE ->",resp);
            this.presentToast(resp["message"],"success");
            this.storage.get("pub_userdata").then((val)=>{
              val.pub.beers = resp["beers"];
              this.storage.set("pub_userdata",val);
              console.log("STORAGE UPDATED");
            });
            setTimeout(() => {
              this.navCtrl.setRoot("BeerMenuPage");
            }, 1000);
          });
      }).catch((error)=>{
        this.loadProvider.dismiss().then(()=>{
          console.log("ADD BEER ERROR ->",error);
          this.presentToast(error["message"],"error");
        });
      });
    }
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


}
