import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.page.html',
  styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage{

  results: string[] = [];
  showResults = false;
  public data = [
    'Form 137',
    'Form 138',
    'Certificate of Good Moral',
    'Enrollment Form',
    'Certificate of Completion',

  ];

  handleInput(event: any) {
    const query = event.target.value.toLowerCase(); // Convert the input value to lowercase for case-insensitive comparison
    this.results = this.data.filter((item: string) => item.toLowerCase().includes(query));
    this.showResults = true; // Show the results
  }

  handleBlur(){
      this.showResults = false; 
}

}


