import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { PubProvider } from './../../providers/pub/pub';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm : FormGroup;
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
              public pubprov:PubProvider, private storage: Storage, public toastCtrl: ToastController,
              public events: Events) {

              this.loginForm = this.formBuilder.group({
                  email: ['',Validators.compose([Validators.required, Validators.email]) ],
                  password:['',Validators.compose([Validators.required, Validators.minLength(8)])]
              });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
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
  login(){
    if(!this.loginForm.valid){
      console.log("Formulário inválido");   
      this.submitAttempt = true; 
    }
    else {
      this.submitAttempt = false;
      console.log("success!")
      console.log("Form ->",this.loginForm.value);
      this.pubprov.login(this.loginForm.value).subscribe((login)=>{
        if(login.status == "error"){
          this.presentToast(login.message,"error");
        }else{
          this.presentToast(login.message,"success");
          this.storage.set('pub_userdata',Object.assign({
              pub: login.pub,
              isLoggedIn: true,
              token: login.token
            })
          );
          setTimeout(() => {
            this.events.publish("login");
            this.navCtrl.setRoot("ProfilePage");
          }, 4000);
        }
        console.log("Login response ->",login);
      });
    }

  }
}
