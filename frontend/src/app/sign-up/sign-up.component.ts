import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private service:ApiserviceService ) { }

  ngOnInit(): void {
  }

  errmsg:any;

  userForm = new FormGroup({
    'username':new FormControl('',Validators.required),
    'email':new FormControl('',Validators.required),
    'mobile':new FormControl('',Validators.required),
    'password':new FormControl('',Validators.required)

  });

  userSubmit()
  {
    
    if(this.userForm.value){
      console.log(this.userForm.value);
      this.service.signUpData(this.userForm.value).subscribe((res)=>{
        console.log(res,'res==>');
      })
    }else{
      this.errmsg = 'all field is require';
    }

  }

}
