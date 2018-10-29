import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PubProvider } from './../../providers/pub/pub';
import { Storage } from '@ionic/storage';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
              public alertCtrl: AlertController, public toastCtrl: ToastController, private pubPRov: PubProvider,
              private storage: Storage) {
      this.beer = this.navParams.get('beer');
      console.log("BEER TO EDIT",this.beer);
      this.beerForm = this.formBuilder.group({
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
        this.submitAttempt = false;
        console.log("success!")
        console.log("Form ->",this.beerForm.value);
        
      }
    }
  }
  