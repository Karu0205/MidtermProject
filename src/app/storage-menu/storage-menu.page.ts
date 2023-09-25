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
    this.router.navigate(['/admindocu'])
  }

  openRegister(){
    this.router.navigate(['/signup'])
  }

  openStorage(){
    this.router.navigate(['/storage'])
  }

  form137(){
    this.router.navigate(['/storage'])
  }

  ESC(){
    this.router.navigate(['/esc'])
  }

  goodmoral(){
    this.router.navigate(['/goodmoral'])
  }

  completion(){
    this.router.navigate(['/completion'])
  }

  enrollment(){
    this.router.navigate(['/enrollment'])
  }

  ranking(){
    this.router.navigate(['/ranking'])
  }

  cemi(){
    this.router.navigate(['/cemi'])
  }

  transcript(){
    this.router.navigate(['/transcript'])
  }

}
