import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  loggedIn:boolean = false;
  twofa:boolean = true;

  constructor(private service:ApiserviceService,private _router:Router) { }

  ngOnInit(): void {

    this.service.getToken().subscribe((res)=>{
      this.loggedIn = res.loggedIn;
      this.twofa = res.twofa;
      if(this.loggedIn){
        console.log(res,'res==>');
      }else{
        this._router.navigate(['./LogIn']);
      }
    })
  }

  twoFA(){
    
  }

}
