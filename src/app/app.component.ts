import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any, icon: string}>;
  accountMenuItems: Array<{title: string, component: any, icon: string}>;
  helpMenuItems: Array<{title: string, component: any, icon: string}>;

  isLoggedIn: boolean = false;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              private storage: Storage, public events: Events) {
    this.initializeApp();

    // 
    this.pages = [
      { title: 'Bem-Vindo', component: HomePage, icon: 'images' }
    ];
    // 
    this.accountMenuItems = [
      {title: 'Cadastro', component: "SignupPage", icon: 'ios-contact'},
      {title: 'Login', component: "LoginPage", icon: 'log-in'},
    ];
    // 
    this.helpMenuItems = [
      {title: 'Info', component: ListPage, icon: 'bookmark'},
      {title: 'About', component: ListPage, icon: 'information-circle'},
    ];

    // this.events.subscribe("PubPage", (pub)=>{
    //   this.nav.push("PubPage", {pub : pub});
    // });

    this.events.subscribe("login", ()=>{
      this.isLoggedIn = true;
      this.pages = [
        { title: 'Perfil', component: "ProfilePage", icon: 'information-circle' },
        { title: 'Cervejas', component: "BeerMenuPage", icon: 'beer' }
      ];
    });
  }
  // 
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.checkState();
    });
  }
  // 
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  // 
  checkState(): void {
    this.storage.get('pub_userdata').then((val)=>{
      if(val){
        console.log("Storage ->",val);
        if(val.isLoggedIn){
          this.pages = [
            { title: 'Perfil', component: "ProfilePage", icon: 'information-circle' },
            { title: 'Cervejas', component: "BeerMenuPage", icon: 'beer' }
          ];
          console.log("Already Logged In!");
          this.isLoggedIn = true;
          this.rootPage = "ProfilePage";
          this.splashScreen.hide();
        }else{
          console.log("Not Logged In!");
          this.rootPage = HomePage;
          this.splashScreen.hide();
        }      
      }else{
        this.rootPage = HomePage; 
        console.log("Sem registro prévio no sistema");
        this.splashScreen.hide();
        //this.storage.clear();
      }
    });
  }
  // 
  logout(){
    // 
    this.storage.get('pub_userdata').then((val)=>{
      val.pub = null;
      val.isLoggedIn = false;
      val.token = null;
      this.storage.set('pub_userdata',val).then((result)=>{
        console.log(result);
        this.isLoggedIn = false;
        this.pages = [
          { title: 'Bem-Vindo', component: HomePage, icon: 'images' }
        ];
        this.nav.setRoot(HomePage);
      });
    });
  }
}
