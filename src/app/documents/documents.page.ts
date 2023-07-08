import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.page.html',
  styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage{

  constructor(private router: Router){}

  public data = [
    'Form 137',
    'Form 138',
    'Certificate of Completion',
    'Certificate of Good Moral',
    'Enrollment Form',
    'Transcript of Records',
  ];
  public results = [...this.data];

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.results = this.data.filter((d) => d.toLowerCase().indexOf(query) > -1);
  }

  logOut(){
    this.router.navigate(['/login'])
  }

  openForm(){
    this.router.navigate(['/form'])
  }
  

  

}


