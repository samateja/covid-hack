import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';

@Injectable()
export class ParentService {
    private API_ENDPOINT: string;
    constructor(private http: Http) {
        // this.API_ENDPOINT = CONFIG.endpoint;
    }

  public headerDict = {
    'content-type':"application/json",
  };

  // settings:any = {
  //   "async": true,
  //   "crossDomain": true,
  //   "headers": {
  //     "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
  //     "x-rapidapi-key": "iqPr1DrNanmshCleHW1fo2oqefpqp1JiKBcjsnIxzK8A5xjPoK"
  //   }
  // }

 
  public generateHeaders(){
    let headerObj = {
      headers: new Headers(this.headerDict)
    };

    return headerObj;
  }

  public getMethod(url:string){
    return this.http.get(url).
    pipe(
      map((response: Response) => {
          let getData = response.json();
          if (getData) {
          return getData;
          }
      }),catchError((err: Response) => {
        console.log("error::", err);
              let details = err.json();
              if (details) {
              return Observable.throw(new Error(details));
              }
          })
      )
  }

  public postMethod(url:string, content:any){
      console.log("content::", content);
    return this.http.post(url,content,this.generateHeaders()).  
    pipe(
      map((response: Response) => {
          let getData = response.json();
          if (getData) {
            return getData;
          }
      }),catchError((err: Response) => {
              let details = err.json();
              if (details) {
                return Observable.throw(new Error(details));
              }
          })
      )
  }

  public putMethod(url:string, content:any){
    if(content){
      this.headerDict["content-type"] = "application/json; charset=UTF-8";
      this.headerDict["accept"] ="application/json";
    }
      
    return this.http.put(url,JSON.stringify(content),this.generateHeaders()).  
    pipe(
      map((response: Response) => {
          let getData = response.json();
          if (getData) {
            return getData;
          }
      }),catchError((err: Response) => {
              let details = err.json();
              if (details) {
                return Observable.throw(new Error(details));
              }
          })
      )
  }

}
