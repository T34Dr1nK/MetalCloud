import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedIn:boolean = false;

  constructor(private service:ApiserviceService) { }

  ngOnInit(): void {
    this.service.getToken().subscribe((res)=>{
      this.loggedIn = res.loggedIn;
    })
  }
}
