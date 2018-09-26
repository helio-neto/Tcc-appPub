import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class PubProvider {
  
  data : any;
  
  private urlAPI = "https://tcchasbeeer.herokuapp.com/api/pubs";
  // private urlAPI = "http://localhost:8080/api/pubs";


  constructor(public http: HttpClient) {
    console.log('PubProvider Brewing!');
  }
  // 
  getPubs(): Observable<any[]>{
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

}
