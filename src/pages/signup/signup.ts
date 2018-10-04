import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PubProvider } from './../../providers/pub/pub';
import { GoogleMapsProvider } from './../../providers/google-maps/google-maps';
import { Storage } from '@ionic/storage';

import { HomePage } from './../home/home';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  pubForm : FormGroup;
  submitAttempt: boolean = false;
  addressConfirm: boolean = false;
  pub: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public toastCtrl: ToastController,
              public navParams: NavParams, private formBuilder: FormBuilder,public pubprov:PubProvider, 
              public googleMapsProvider: GoogleMapsProvider, private storage: Storage ) {
    this.pubForm = this.formBuilder.group({
      pubname: ['', Validators.required],
      location: formBuilder.group({
        street: ['', Validators.required],
        hood: [''],
        lat: [''],
        lng: [''],
        city: [''],
        uf: ['']
      }),
      ownername: ['',Validators.required],
      phone: [''],
      celphone: ['', Validators.required],
      info: [''],
      email: ['',Validators.compose([Validators.required, Validators.email]) ],
      password:['',Validators.compose([Validators.required, Validators.minLength(8)])],
      photo: ['']
    });
  }
  // 
  presentConfirmAddress(address) {
    let alert = this.alertCtrl.create({
      title: 'Você confirma este endereço?',
      message:  `<p>Endereço: ${address.street}</p>
                  <p>Bairro: ${address.hood}</p>
                  <p>Cidade: ${address.city}</p>
                  <p>Uf: ${address.uf}</p>`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.pubForm.get("location.street").setErrors({
              'incorrect': true
            });
            this.addressConfirm = false;
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.addressConfirm = true;
            this.pubForm.get("location.street").updateValueAndValidity();
            this.pubForm.get("location").setValue({ 
                street: address.street,
                hood: address.hood,
                lat: address.lat,
                lng: address.lng,
                city: address.city,
                uf: address.uf    
            });
          }
        }
      ]
    });
    alert.present();
  }
  // 
  presentErrorAddress(address) {
    let alert = this.alertCtrl.create({
      title: 'Oops, endereço correto?',
      message:  `<p>Sem resultados!</p>
                <p>Endereço: ${address}</p>
                  <p>Verifique o endereço e tente novamente</p>`,
      buttons: [
        {
          text: 'Voltar',
          role: 'cancel',
          handler: () => {
            this.pubForm.get("location.street").setErrors({
              'incorrect': true
            });
            this.addressConfirm = false;
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  // 
  getPubAddress(){
    let address = this.pubForm.get("location.street").value;
    console.log("Address ->",address)
    this.googleMapsProvider.getAddressGeoCode(address).then((result)=>{
      this.presentConfirmAddress(result);
      console.log("Get Address ->",result);
    }).catch((error)=>{
      this.presentErrorAddress(address);
      console.log("Erro coletando endereço ->",error);
    });
  }
  // 
  save(){
    if(!this.pubForm.valid){
        console.log("Formulário inválido");   
        this.submitAttempt = true; 
    }
    else {
      this.submitAttempt = false;
      console.log("success!")
      console.log("Form ->",this.pubForm.value);
      this.pubprov.register(this.pubForm.value).subscribe(
          (res)=>{
            if(res.status == "success"){
              let message = `${res.message}`;
              this.presentToast(message,"success");
              // this.storage.set('userdata',{
              //   pubid: res.pubid,
              //   isLoggedIn: true
              // })
              setTimeout(() => {
                  this.navCtrl.setRoot(HomePage);
              }, 4000);
            }else{
              let message = `${res.message}`;
              this.presentToast(message,"error");
            }
          }
        );
    }
  }
  
}
