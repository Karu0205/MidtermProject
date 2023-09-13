import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private storage: AngularFireStorage) {}

  uploadFile(file: File, path: string): Observable<string> {
    const filePath = `${path}/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = fileRef.put(file);

    return new Observable((observer) => {
      task.then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          observer.next(downloadURL);
          observer.complete();
        });
      });

      task.catch((error) => {
        observer.error(error);
      });
    });
  }
}