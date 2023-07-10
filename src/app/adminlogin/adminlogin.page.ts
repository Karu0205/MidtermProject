import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.page.html',
  styleUrls: ['./adminlogin.page.scss'],
})
export class AdminloginPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  adminDoc(){
    this.router.navigate(['/admindocu']);
  }

}
