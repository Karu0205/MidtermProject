import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../service/firebase.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email:any;
  public password:any;


  constructor(private router: Router, public fireService:FirebaseService) { }

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
          this.router.navigate(['/documents']);
        },err=>{
          console.log(err);
        });
      }
    },err=>{
      alert(err.message)
      console.log(err);
    })
  }

  reset(){
    this.router.navigate(['/resetpass'])
  }

}
