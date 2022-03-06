import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  constructor(private service:ApiserviceService,private _router:Router) { }

  ngOnInit(): void {
  }

  errmsg:any;

  userForm = new FormGroup({
    'username':new FormControl('',Validators.required),
    'password':new FormControl('',Validators.required)

  });

  userSubmit()
  {

    if(this.userForm.value){
      let loggedIn:boolean;
      this.service.logInData(this.userForm.value).subscribe((res)=>{
        loggedIn = res.loggedIn
        if(loggedIn){
          this._router.navigate(['./Profile']);
        }else{
          console.log("Wrong Password or Username")
        }
        
      })
    }else{
      this.errmsg = 'all field is require';
    }

  }

}
