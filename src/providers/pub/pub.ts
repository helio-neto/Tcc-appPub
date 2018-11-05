import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Injectable()
export class PubProvider {
  
  data : any;
  pub: any;
  private urlAPI = "https://tcchasbeeer.herokuapp.com/api/pubs";
  // private urlAPI = "http://localhost:8080/api/pubs";

  constructor(public http: HttpClient,private storage: Storage) {
    console.log('PubProvider Brewing!');
  }
  // 
  async getStorageData(){
    let data = await this.storage.get("pub_userdata");
    if(data){
      return data;
    }
    return null;
  }
  // 
  getPubs(): Observable<any[]>{
    return this.http.get(this.urlAPI)
      .map(res => <any[]>res)
      .catch((erro:any)=>Observable.throw(erro));
  }
  // TO DO
  getPub(pub): Observable<any[]>{
    return this.http.get(this.urlAPI)
      .map(res => <any[]>res)
      .catch((erro:any)=>Observable.throw(erro));
  }
  // 
  searchByBeer(beer_name){
    return this.http.get(this.urlAPI+"/search/"+beer_name)
    .map(res => <any[]>res)
    .catch((erro:any)=>Observable.throw(erro));
  }
  // 
  register(pub){
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");

    return this.http.post(this.urlAPI+"/register",pub,{headers:headers})
    .map(res => <any[]>res)
    .catch((erro:any)=>Observable.throw(erro));
  }
  // 
  login(pub){
    let headers = new HttpHeaders();
    headers.append("Content-type","application/json");
    
    return this.http.post(this.urlAPI+"/loginAuth", pub,{headers:headers})
    .map(res => <any[]>res)
    .catch((erro:any)=>Observable.throw(erro));
  }
  // 
  async editPub(pub){
    let headers = new HttpHeaders();
    headers.append("Content-type","application/json");
    console.log("Editando Pub",pub);
    let userStorage = await this.getStorageData();
    pub.token = userStorage.token;
    return new Promise((resolve, reject)=>{
      this.http.put(`${this.urlAPI}/${pub.id}`, pub,{headers:headers})
        .subscribe(result =>{
          resolve(result);
        },
        error=>{
          console.log("ERRO na requisiçao",error);
          reject(error);
        });
    });
  }
  // 
  async addBeer(beers){
    let headers = new HttpHeaders();
    headers.append("Content-type","application/json");
    let userStorage = await this.getStorageData();
    let payload = {
      beers: beers,
      token: userStorage.token,
      pub_id: userStorage.pub._id
    }
    console.log("Adicionando cerveja",payload);
    return new Promise((resolve, reject)=>{
      this.http.put(`${this.urlAPI}/beers/${payload.pub_id}`, payload,{headers:headers})
        .subscribe(result =>{
          resolve(result);
        },
        error=>{
          console.log("ERRO na requisiçao",error);
          reject(error);
        });
    });
  }
  // 
  async editBeer(beer){
    let headers = new HttpHeaders();
    headers.append("Content-type","application/json");
    let userStorage = await this.getStorageData();
    let payload = {
      beer: beer,
      token: userStorage.token,
      pub_id: userStorage.pub._id
    }
    console.log("Editando cerveja",payload);
    return new Promise((resolve, reject)=>{
      this.http.patch(`${this.urlAPI}/beers/${payload.pub_id}`, payload,{headers:headers})
        .subscribe(result =>{
          resolve(result);
        },
        error=>{
          console.log("ERRO na requisiçao",error);
          reject(error);
        });
    });
  }
  // 
  async deleteBeer(beer){
    let userStorage = await this.getStorageData();
    let payload = {
      beer_id: beer._id,
      token: userStorage.token,
      pub_id: userStorage.pub._id
    }
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: payload,
    };
    console.log("Deletando cerveja",payload);
    return new Promise((resolve, reject)=>{
      this.http.delete(`${this.urlAPI}/beers/${payload.pub_id}`, options)
        .subscribe(result =>{
          resolve(result);
        },
        error=>{
          console.log("ERRO na requisiçao",error);
          reject(error);
        });
    });
  }

}
