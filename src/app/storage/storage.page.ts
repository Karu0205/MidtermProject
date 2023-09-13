import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FileUploadService } from '../file-upload.service';
import { FirebaseService } from '../service/firebase.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';


@Component({
  selector: 'app-storage',
  templateUrl: './storage.page.html',
  styleUrls: ['./storage.page.scss'],
})
export class StoragePage implements OnInit {
  selectedFile: File | null = null;
  uploadProgress: number | null = null;
  downloadURL: string | null = null;
  files: any[];
  folderPath = '/Form137'; // Replace with your Firebase Storage folder path
  contents: any[] = [];
  searchText: string = '';

  uploadedDocuments: any[] 

  allContents: any[] = [];
  filteredContents: any[] = [];

  constructor(private router: Router, private fileUploadService: FileUploadService, 
    private firebaseService: FirebaseService, private sanitizer: DomSanitizer,
    private platform: Platform, private afStorage: AngularFireStorage) { }

    onFileSelected(event: any): void {
      this.selectedFile = event.target.files[0];
    }

    uploadFile(): void{
      if(this.selectedFile){
        this.fileUploadService.uploadFile(this.selectedFile, 'Form137').subscribe(
          (url) => {
            this.downloadURL = url;
            this.uploadProgress = null;
          },
          (error) => {
            console.log('Error Uploading File', error);
            this.uploadProgress = null;
          },
          () => {
            this.uploadProgress = null;
          }
        )
      }
    }

  ngOnInit() {
    this.getFolderContents();

  }

  getFolderContents() {
    this.firebaseService.getFolderContents(this.folderPath).subscribe(
      (data) => {
        this.contents = data;
        this.filteredContents = data;
        console.log(data)
      },
      (error) => {
        console.error('Error fetching folder contents:', error);
      }
    );
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


  filterContents() {
    if (this.searchText.trim() === '') {
      // If search text is empty, reset to the original data
      this.filteredContents = this.contents.slice(); // Make a copy
    } else {
      // Filter based on search text
      this.filteredContents = this.contents.filter((item) =>
        item.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

downloadItem(item: any) {
  const fileUrl = item.url;
  if (fileUrl) {
    // Attempt to initiate the download
    window.open(fileUrl, '_blank');
  } else {
    console.error('File URL is invalid or missing.');
  }
}

deleteItem(item: any) {
  const filePath = `${this.folderPath}/${item.name}`;
  
  // Use AngularFireStorage to delete the file
  this.afStorage.storage.ref(filePath).delete()
    .then(() => {
      console.log(`File ${item.name} deleted successfully.`);
      // After deletion, refresh the list of contents
      this.getFolderContents();
    })
    .catch((error) => {
      console.error(`Error deleting file ${item.name}:`, error);
    });
}



}
