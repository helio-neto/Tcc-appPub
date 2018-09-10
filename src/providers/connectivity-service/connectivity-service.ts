import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';

import 'rxjs/add/operator/map';

declare var Connection;

@Injectable()
export class ConnectivityService {

  constructor(public platform: Platform, public network: Network) {
    console.log('ConnectivityService Provider');
  }
  // Check if the app is running on a device or browser
  // True = device, False = Browser
  isDevice(): boolean {
    return this.platform.is('cordova');
  }
  // Check if we have internect connection
  isOnline(): boolean {
    if(this.isDevice() && this.network.type){
      // alert("Network Type :: "+this.network.type);
      return this.network.type !== Connection.NONE;
    } else {
      console.log("Browser online");
      return navigator.onLine;
    }
  }
  // Watch user get Online
  watchOnline(): any {
    return this.network.onConnect();
  }
  // Watch user get offline
  watchOffline(): any {
    return this.network.onDisconnect();
  } 
}
