import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public email:any;
  public password:any;
  public displayName:any;


  constructor(public fireService:FirebaseService) { }

  ngOnInit() {
  }

    signup(){ 
    this.fireService.signup({email:this.email,password:this.password}).then(res=>{
      if(res.user!.uid){
        let data = {
          email:this.email,
          password:this.password,
          displayName:this.displayName,
          uid:res.user!.uid
        }
        this.fireService.saveDetails(data).then(res=>{
         alert('Account Created!');
        },err=>{
          console.log(err);
        })
      }
    },err=>{
      alert(err.message);

      console.log(err);
    })
  }


}
