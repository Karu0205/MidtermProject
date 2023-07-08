import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';

@Component({
  selector: 'app-admindocu',
  templateUrl: './admindocu.page.html',
  styleUrls: ['./admindocu.page.scss'],
})
export class AdmindocuPage implements OnInit {
  accounts = [] as any;

  constructor(private dataService: FirebaseService) {
    this.dataService.getAccounts().subscribe(res => {
      console.log(res);
      this.accounts=res;
    })
   }

  ngOnInit() {
  }

  accountList(){
    
  }

}
