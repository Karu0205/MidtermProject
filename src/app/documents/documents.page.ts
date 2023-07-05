import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.page.html',
  styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage{

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
  

  

}


