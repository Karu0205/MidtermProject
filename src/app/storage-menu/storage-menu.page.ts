import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-storage-menu',
  templateUrl: './storage-menu.page.html',
  styleUrls: ['./storage-menu.page.scss'],
})
export class StorageMenuPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  logOut(){
    this.router.navigate(['/adminlogin'])
  }

  openDocu(){
    this.router.navigate(['/documents'])
  }

  openRegister(){
    this.router.navigate(['/signup'])
  }

  openStorage(){
    this.router.navigate(['/storage'])
  }

}
