import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PubProvider } from './../../providers/pub/pub';
import { GoogleMapsProvider } from './../../providers/google-maps/google-maps';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {
  pubForm : FormGroup;
  submitAttempt: boolean = false;
  addressConfirm: boolean = false;
  pub: any;
  formReady: boolean = false;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public toastCtrl: ToastController,
    public navParams: NavParams, private formBuilder: FormBuilder,public pubprov:PubProvider, 
    public googleMapsProvider: GoogleMapsProvider, private storage: Storage ) {
      this.pub = this.navParams.get('pub');
      console.log("PUB",this.pub);
      
      this.pubForm = this.formBuilder.group({
        id: [this.pub._id],
        pubname: [this.pub.pubname, Validators.required],
        location: formBuilder.group({
          street: [this.pub.location.street, Validators.required],
          hood: [this.pub.location.hood],
          lat: [this.pub.location.lat],
          lng: [this.pub.location.lng],
          city: [this.pub.location.city],
          uf: [this.pub.location.uf]
        }),
        ownername: [this.pub.ownername,Validators.required],
        phone: [this.pub.phone],
        celphone: [this.pub.celphone, Validators.required],
        info: [this.pub.info],
        email: [this.pub.email,Validators.compose([Validators.required, Validators.email]) ],
        photo: [this.pub.photo]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPage');
  }
  // 
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
  edit(){
    if(!this.pubForm.valid){
      console.log("Formulário inválido");   
      this.submitAttempt = true; 
    }else {
      console.log("Formulário",this.pubForm.value);
      this.pubprov.editPub(this.pubForm.value).then((resp)=>{
        if(resp['status']=="success"){
          delete resp["pub"]['hash'];
          delete resp["pub"]['salt'];
          this.presentToast(resp["message"], "success");
          setTimeout(() => {
            this.storage.get("pub_userdata").then((val)=>{
              val.pub = resp["pub"];
              this.storage.set("pub_userdata",val);
              this.navCtrl.setRoot("ProfilePage"); 
            })
          }, 3000);
          
        }else{
          this.presentToast(resp["message"], "error");
        }
      }).catch((error)=>{
        this.presentToast(error,"error");
      }) 
    }
  }
}
