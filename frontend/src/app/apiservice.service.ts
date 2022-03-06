import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  constructor(private http:HttpClient) { }

  apiUrl = 'http://localhost:3000/';

  
  //get data
  // getAllData():Observable<any>
  // {
  //   return this.http.get(this.apiUrl+'user');
  // }

  //signUp data
  signUpData(data:any):Observable<any>
  {
    withCredentials: true
    console.log(data,'signUpapi=>');
    return this.http.post(this.apiUrl+'signUp',data)
  }

  //logIn data
  logInData(data:any):Observable<any>
  {
    console.log(data,'logIn=>');
    return this.http.post(this.apiUrl+'logIn',data,{
      withCredentials:true
    });
  }

  //check and getting a token

  getToken():Observable<any>{

    console.log("Checking...");
    return this.http.get(this.apiUrl+'gTokens',{
      withCredentials:true
    });

  }



  //delete a tokens

  deleteToken():Observable<any>{

    withCredentials: true
    return this.http.get(this.apiUrl+'dTokens')

  }
  


}
