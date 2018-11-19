import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Range} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PubProvider } from './../../providers/pub/pub';
import { Storage } from '@ionic/storage';
import { LoadingProvider } from './../../providers/loading/loading';

@IonicPage()
@Component({
  selector: 'page-beer-edit',
  templateUrl: 'beer-edit.html',
})
export class BeerEditPage {
  beerForm : FormGroup;
  submitAttempt: boolean = false;
  beer: any;
  formReady: boolean = false;
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public alertCtrl: AlertController, public toastCtrl: ToastController, private pubPRov: PubProvider,
    private storage: Storage, public loadProvider: LoadingProvider) {
      this.beer = this.navParams.get('beer');
      console.log("BEER TO EDIT",this.beer);
      this.beerForm = this.formBuilder.group({
        _id: [this.beer._id],
        name: [this.beer.name, Validators.required],
        style: [this.beer.style, Validators.required],
        ibu: [this.beer.ibu, Validators.required],
        abv: [this.beer.abv, Validators.required],
        obs: [this.beer.obs],
        price: formBuilder.group({
          half_pint: [this.beer.price.half_pint, Validators.required],
          pint: [this.beer.price.pint, Validators.required],
          mass: [this.beer.price.mass, Validators.required]
        })
      });
      this.formReady = true;
    }
    ionViewDidLoad() {
      console.log('ionViewDidLoad BeerEditPage');
    }
    // 
    presentConfirmEdit() {
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
              this.edit();
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
    edit(){
      if(!this.beerForm.valid){
        console.log("Formulário inválido");   
        this.submitAttempt = true; 
      }
      else {
        this.loadProvider.presentWithMessage("Cevando informações");
        this.submitAttempt = false;
        console.log("success!")
        console.log("Form ->",this.beerForm.value);
        this.pubPRov.editBeer(this.beerForm.value).then(
          (resp)=>{
            this.loadProvider.dismiss().then(()=>{
              console.log("EDIT BEER RESPONSE ->",resp);
              this.presentToast(resp["message"],"success");
              this.storage.get("pub_userdata").then((val)=>{
                val.pub.beers = resp["beers"];
                this.storage.set("pub_userdata",val);
                console.log("STORAGE UPDATED");
              });
              setTimeout(() => {
                this.navCtrl.setRoot("BeerMenuPage");
              }, 1000);
            })
        }).catch((error)=>{
          this.loadProvider.dismiss().then(()=>{
            console.log("ADD BEER ERROR ->",error);
          this.presentToast(error["message"],"error");
          });
        });
        
      }
    }
  }
  