import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { ToastController, NavController, Events } from 'ionic-angular';
import { App } from 'ionic-angular';

import { ConnectivityService } from './../connectivity-service/connectivity-service';
import { LocationsProvider } from '../locations/locations';
import { PubProvider } from '../../providers/pub/pub';

declare var google;

@Injectable()
export class GoogleMapsProvider {
  
  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  erro: any;
  
  userMarker: any = [];
  userPos: any = null;

  pubmarkers: any = [];
  pubs: any[];
  
  pubsAfter: any[];
  
  constructor(public http: HttpClient, public connectivityService: ConnectivityService, 
              public locationProv: LocationsProvider, public geoLocation: Geolocation, 
              public app: App, public events: Events, private toastCtrl: ToastController,
              public pubProv: PubProvider) {

  }
    // INITIALIZE GOOGLE MAPS SERVICES
    // Receives screen elements and initialize procedures to load google maps on screen
    init(mapElement: any, pleaseConnect: any): Promise<any> {   
      this.mapElement = mapElement;
      this.pleaseConnect = pleaseConnect;
      
      return this.loadGoogleMaps();
    }
    // PROMISSE to LOAD GOOGLE MAPS
    // CHECK user connectivity to initialize MAP
    // ADD connectivity listeners
    loadGoogleMaps(): Promise<any> {   
      return new Promise((resolve) => {
        
        if(this.connectivityService.isOnline()){
          this.initMap().then(() => {
            resolve(true);
          });
          this.enableMap();
        }else {
          this.disableMap();
          resolve(true);
        }       
        this.addConnectivityListeners();   
      });  
    }
    // PROMISE to initialize MAP 
    // GET USER POSITION
    // PIN USER ON MAP
    initMap(): Promise<any> {    
      this.mapInitialised = true;
      return new Promise((resolve) => {

          this.locationProv.getUserLocation().then((data)=>{
            this.userPos = new google.maps.LatLng(data['lat'], data['lng']);
            let mapOptions = {
              center: this.userPos,
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  
            let image = {
              url: 'assets/icon/mapicons/user.png',
              scaledSize: new google.maps.Size(40, 40)
            };
            let meMarker = new google.maps.Marker({
              position: this.userPos,
              title: "Eu",
              map: this.map,
              icon: image
            });
            this.userMarker.push(meMarker);
            let infoMe = new google.maps.InfoWindow({
              content: "Estou aqui!"
            });
            google.maps.event.addListener(meMarker, 'click', () => {
              infoMe.open(this.map, meMarker);
            });
            
            resolve(true);
          });
      
        }).catch((error) => {
          
          console.log('Not possible get geolocation - reason -> - '+ error);
        });
    }
    // Enable MAP on screen, 
    enableMap(): void {
      if(this.pleaseConnect){
        this.pleaseConnect.nativeElement.style.display = "none";
      }
    }
    // Disable MAP on screen
    disableMap(): void {
      if(this.pleaseConnect){
        this.pleaseConnect.nativeElement.style.display = "block";
      } 
    }
    // Add connectivity Listeners to check if User is Online/Offline
    addConnectivityListeners(): void { 
      // 
      this.connectivityService.watchOnline().subscribe(() => { 
        setTimeout(() => {
          this.displayNetworkUpdate("Online");
          if(typeof google == "undefined" || typeof google.maps == "undefined"){
            this.loadGoogleMaps();
          }else {
            if(!this.mapInitialised){
              this.initMap();
            }   
            this.enableMap();
          }
        }, 3000);
      });
      // 
      this.connectivityService.watchOffline().subscribe(() => {    
        this.displayNetworkUpdate("Offline");
        this.disableMap();      
      });     
    }
    // Display Network Updates on the Screen
    // Params :
    // Message - 
    displayNetworkUpdate(message){     
      this.toastCtrl.create({
        message: `Você está ${message} agora.`,
        duration: 3000,
        position: "bottom"
      }).present();
    }
    // Add Markers to the MAP
    // Params :
    // Lat - 
    // Lng - 
    addMarker(lat: number, lng: number): void {      
      let latLng = new google.maps.LatLng(lat, lng);
      
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });    
      this.pubmarkers.push(marker);     
    }
    //
    removeMarker(){
      for (var i = 0; i < this.pubmarkers.length; i++) {
        this.pubmarkers[i].setMap(null);
      }
    }
    // Pin Pubs on the MAP
    // Params : 
    // Pubs - 
    pinPubs(pubs){
        pubs.forEach(pub =>{
          if(pub.location.lat, pub.location.lng){
            let pubLocation = new google.maps.LatLng(pub.location.lat, pub.location.lng);
            let image = {
              url: 'assets/icon/mapicons/beer-cup1-1.svg',
              scaledSize: new google.maps.Size(40, 40)
            };
            let pubMarker = new google.maps.Marker({
              position: pubLocation,
              title: pub.pubname,
              animation: google.maps.Animation.DROP,
              map: this.map,
              icon: image
            });
            this.pubmarkers.push(pubMarker);
            let info = '<div id="iw-content">'+
            '<h1 id="iw-title" class="iw-title">' + pub.pubname + '</h1>'+
            '<p id = "myid' + pub.pubname + '">Ver detalhes</p>'+
            '</div>';
            
            let infoWindow = new google.maps.InfoWindow({
              content: info
            });
            
            google.maps.event.addListener(pubMarker, 'click', () => {
              infoWindow.open(this.map, pubMarker);
            });
            google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
              document.getElementById('myid' + pub.pubname).addEventListener('click', () => {
                //this.navCtrl.push('PubPage', pub);
                this.events.publish("PubPage",pub);
              });
            });        
            
          }
        });
    }
    // DEPRECATED
    get navCtrl(): NavController {
        return this.app.getActiveNav();
    }
    // Load Google Places on the MAP
    // Params to SET
    // Location - 
    // Radius - 
    // Type - 
    loadPlaces(){
      let service = new google.maps.places.PlacesService(this.map);
          service.nearbySearch({
            location: this.userPos,
            radius: 1000,
            type: ['bar']
          }, (results,status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                this.createMarker(results[i]);
              }
            }
          });
    }
    // Create google place icons
    // Params : 
    // Place -  
    createMarker(place) {
      let placeLoc = place.geometry.location;
      var image = {
        url: 'assets/icon/mapicons/beer-icon1-1.png',
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(40, 40)
      };
      
      let placeMarker = new google.maps.Marker({
        position: placeLoc,
        title: place.name,
        map: this.map,
        icon: image
      });
      
      let infoPlace = new google.maps.InfoWindow({
        content: '<div><strong>' + place.name + '</strong><br>' +
        place.vicinity + '</div>'
      });
      google.maps.event.addListener(placeMarker, 'click', () => {
        infoPlace.open(this.map, placeMarker);
      });
    }
    // 
    getAddressGeoCode(addr): Promise<any>{
      return new Promise((resolve,reject)=>{
        let geocoder = new google.maps.Geocoder();
        
        let location =  {
          street: addr,
          lat: "",
          lng: "",
          city: "",
          uf: "",
          hood: ""
        };
            geocoder.geocode({ address: addr }, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    let address_components = results[0].address_components; 
                    location.lat = results[0].geometry.location.lat();
                    location.lng = results[0].geometry.location.lng();

                    address_components.forEach(element => {
                      if (element.types[0] == 'administrative_area_level_1' ) {
                        location.uf = element.short_name;
                      }
                      if (element.types[0] == 'administrative_area_level_2' ) {
                        location.city = element.short_name;
                      }
                      if (element.types[1] == 'sublocality' || element.types[2] == 'sublocality_level_1') {
                        location.hood = element.short_name;
                      }
                      if (element.types[0] == 'postal_code') {
                        location.street += " - "+element.short_name;
                      }
                      // if (element.types[0] == 'country') {
                      //   location.country = element.short_name;
                      // }
                    });
                    resolve(location);
                } else {
                    reject(status);
                }
            });
      })
    }
}

    