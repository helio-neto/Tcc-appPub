import { Injectable } from '@angular/core';
import { PubProvider } from '../../providers/pub/pub';
import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class LocationsProvider {
  
  userMarker: any = [];
  userPos: any = {};
  
  pubmarkers: any = [];
  pubs: any[];
  pubsAfter: any[];
  afterSearch: any = [];
  originData: any = [];
  searchData: any = [];
  
  constructor(private pubProv: PubProvider, public geoLocation: Geolocation) {
    
  }
  // GET USER POSITION
  getUserLocation(){
    return new Promise((resolve,reject) =>{
      let opt = {maximumAge: 30000, timeout: 20000, enableHighAccuracy: true};
      this.geoLocation.getCurrentPosition(opt).then((position) => {
        //alert("Estamos carregando sua posição...");
        this.userPos.type = "NativeGeo";
        this.userPos.lat = position.coords.latitude;
        this.userPos.lng =  position.coords.longitude;
        resolve(this.userPos);
      }).catch((error)=>{
        if(navigator){
          navigator.geolocation.getCurrentPosition((data)=>{
            alert("Navigator ->"+data.coords.latitude+" - "+data.coords.longitude);
            this.userPos.type = "NavigatorGeo";
            this.userPos.lat = data.coords.latitude;
            this.userPos.lng = data.coords.longitude;
            console.log(this.userPos);
            resolve(this.userPos);
          });
        }else{
          this.userPos.type = "FixedGeo";
          this.userPos.lat = -30.0989177;
          this.userPos.lng= -51.2469273;
          resolve(this.userPos);
        }
        console.log("Catch user Geoloc ->",error);
        //reject(error);
      });
    })
  }
  // Get pubs from DB, usingo Heroku API
  // PROMISE 
  // get pubs from service
  // apply Haversine to calculate distance between locations and user position
  // RETURN -> PUBS ordered by distance from the user
  loadPubs(){ 
      if(this.pubsAfter){
        return Promise.resolve(this.pubsAfter);
      }
      return new Promise(resolve => {
        this.pubProv.getPubs().subscribe(
          data => {
            this.pubsAfter = this.applyHaversine(data);
            this.pubsAfter.sort((locationA, locationB) => {
              return locationA.distance - locationB.distance;
            });
            this.originData = this.pubsAfter;
            console.log("Pubs Loaded!");
            resolve(this.pubsAfter);
          });
      });
  }
  // Search METHOD used in MAPS PAGE
  // Params : 
  // Query - (Beer name)
  searchMap(query){
      if(query == ''){
        this.pubs = this.originData;
        return Promise.resolve(this.pubs);     
      }else{
        return new Promise((resolve, reject) => {
          this.pubProv.searchByBeer(query).subscribe(
            (data) => {
              this.searchData = data.result;
              this.afterSearch = [];
              console.log("PubsAfter ->",this.pubsAfter);
              console.log("Pubs ->", this.searchData);
              this.pubsAfter.forEach((e1)=>this.searchData.forEach((e2)=> {
                if(e1.pubname.toLowerCase() == e2.pubname.toLowerCase()){
                  console.log(e1.pubname);
                  this.afterSearch.push(e1);
                }
              }));
              resolve(this.afterSearch);
              //console.log("SEARCH RESULT ->",this.afterSearch);          
            },
            (erro) => {
              console.log("Search Map Error ->", erro);
              reject(erro);
            }
          );
        });
        
      }
  }
  // Function to calculate distance between two points
  // using latitude and longitude
  // Params : 
  // Pubs - 
  applyHaversine(pubs){
      
      let usersLocation = {
        lat: this.userPos.lat,
        lng: this.userPos.lng
      };
      
      pubs.map((pub) => {
        let placeLocation = {
          lat: pub.location.lat,
          lng: pub.location.lng
        };
        
        pub.distance = this.getDistanceBetweenPoints(
          usersLocation,
          placeLocation,
          'km'
        ).toFixed(2);
      });
      
      return pubs;
  }
  // Calculate Distance Between points
  // Params : 
  // Start - 
  // End - 
  // Units - 
  getDistanceBetweenPoints(start, end, units){
      
      let earthRadius = {
        miles: 3958.8,
        km: 6371
      };
      
      let R = earthRadius[units || 'km'];
      let lat1 = start.lat;
      let lon1 = start.lng;
      let lat2 = end.lat;
      let lon2 = end.lng;
      
      let dLat = this.toRad((lat2 - lat1));
      let dLon = this.toRad((lon2 - lon1));
      let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c;
      
      return d;
  }
  // Convert measure to Radians
  toRad(x){
      return x * Math.PI / 180;
  }
    
}
  