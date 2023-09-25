import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../service/firebase.service'; 


@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.page.html',
  styleUrls: ['./adminlogin.page.scss'],
})
export class AdminloginPage implements OnInit {
  public email:any;
  public password:any;
  isAdmin= false;

  constructor(private router: Router, public fireService:FirebaseService,
    ) { }

  ngOnInit() {
  }

  logIn(){
    this.fireService.loginWithEmail({email:this.email,password:this.password}).then(res=>{
      console.log(res);
      if(res.user!.uid){
        const userId = res.user!.uid;
        const userName = res.user!.displayName
        const userEmail = res.user!.email
        this.fireService.getDetails({uid:res.user!.uid}).subscribe(res=>{
          console.log(res);
          console.log('User ID:', userId);
          console.log('User Name:', userName);
          console.log('User Email:', userEmail);
          this.router.navigate(['/admindocu']);
        },err=>{
          console.log(err);
        });
      }
    },err=>{
      alert(err.message)
      console.log(err);
    })
  }

  adminDoc(){
    this.router.navigate(['/admindocu']);
  }

}
