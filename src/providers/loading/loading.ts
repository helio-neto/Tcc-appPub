import { Injectable } from '@angular/core';
import { Loading, LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingProvider {
  loading: Loading;
  constructor(public loadingCtrl: LoadingController) {
  }

  presentWithGif1() {
      this.loading = this.loadingCtrl.create({
          spinner: 'hide',
          content: `
        <div class="custom-spinner-container">
          <img class="loading" width="120px" height="120px" src="assets/loader1.gif" />
        </div>`
      });
      
      return this.loading.present();
  }
  
  presentWithGif2() {
      this.loading = this.loadingCtrl.create({
          spinner: 'hide',
          content: `
        <div class="custom-spinner-container">
          <img class="loading" width="70px" height="70px" src="assets/loader2.gif" />
        </div>`
      });
      
      return this.loading.present();
  }    

  presentWithMessage(message) {
      this.loading = this.loadingCtrl.create({
          content: message
      });

      return this.loading.present();
  }

  dismiss() {
      return new Promise((resolve, reject) => {
          if (this.loading) {
              return this.loading.dismiss(resolve(true)).catch(error => {
                  console.log('loading error: ', error);
              });
          } else {
              resolve(true);
          }
      });

  }

}
