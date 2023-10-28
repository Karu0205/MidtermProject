import { Component, OnInit } from '@angular/core';
import { Account, FirebaseService, Request } from '../service/firebase.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { first } from 'rxjs/operators';
import { UserService } from '../user.service';
import { Event } from '../event.model';
import { EventService } from '../event.service';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { EmailService } from '../email.service';
import { FormPage } from '../form/form.page';
import { SchedulePage } from '../schedule/schedule.page';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private dataService: FirebaseService, private alertCtrl: AlertController, 
    private router: Router, private modalCtrl: ModalController, private afAuth: AngularFireAuth,
    private firestore: AngularFirestore, private userService: UserService, private eventService: EventService,
    private storage: AngularFireStorage, private emailService:EmailService) { }

    selectedImage: File | null = null;
    userProfile: any = {}; // Initialize an empty object for the user's profile data.
    desiredImageWidth = 200; // Adjust this to your desired width.
    desiredImageHeight = 200; // Adjust this to your desired height.
  
  
    userId: any;
    isLoggedIn: boolean;
    userName: any;
    userEmail: any;
    userData: any;
    userRequest: any[];
  
    accounts: Account[] = []; 
    requests: Request[] = []; 
  
    
    events: Event[] = [];
    selectedEvent: Event = { title: '', description: '', startDate: new Date()};

    ngOnInit() {

      this.afAuth.authState.subscribe((user) => {
        if (user) {
          this.userId = user.uid; // Store the current user's UID.
          this.fetchUserProfile(this.userId);
        } else {
          // Handle user not logged in.
        }
      });
  
      this.afAuth.authState.subscribe(user => {
        if (user) {
  
          this.dataService.getUserDataByUID(user.uid).subscribe(rq => {
            this.userRequest = rq;
  
          });
  
          this.firestore
          .collection('users')
          .doc(user.uid)
          .valueChanges()
          .subscribe((data) => {
            this.userData = data;
          });
          // User is logged in
          this.isLoggedIn = true;
          this.userId = user.uid; // Retrieve the user ID
          this.userEmail = user.email;
          this.userName = user.displayName// Retrieve the user name
  
        } else {
          // User is not logged in
          this.isLoggedIn = false;
          this.userId = null;
          this.userName = null;
  
        }
      });
    }

    showFileUpload: boolean = false;

    toggleFileUpload() {
      this.showFileUpload = !this.showFileUpload;
    }

     onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImage = file;
        };
        reader.readAsDataURL(file);
      }
    }
  

  async uploadImage() {
    if (!this.selectedImage || !this.userId) {
      console.error('No image selected or user not logged in.');
      return;
    }

    const filePath = `/user-profiles/${this.userId}/profile-picture.jpg`;
    const fileRef = this.storage.ref(filePath);

    // Create an HTML Image element to load the selected image.
    const img = new Image();
    img.src = URL.createObjectURL(this.selectedImage);

    // Wait for the image to load.
    img.onload = async () => {
      // Create a canvas to resize the image.
      const canvas = document.createElement('canvas');
      if (!canvas) {
        console.error('Canvas could not be created.');
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Canvas context (ctx) is null.');
        return;
      }
      canvas.width = this.desiredImageWidth;
      canvas.height = this.desiredImageHeight;

      // Resize and draw the image on the canvas.
      ctx.drawImage(img, 0, 0, this.desiredImageWidth, this.desiredImageHeight);

      // Convert the canvas content to a Blob (JPEG format).
      canvas.toBlob(async (blob) => {
        if (blob) {
          // Upload the resized image (Blob) to Firebase Storage.
          const task = this.storage.upload(filePath, blob);

          // Finalize the upload process.
          task.snapshotChanges().pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((url) => {
                // Update the user's profile in Firestore with the image URL.
                this.updateUserProfile(this.userId, { profilePicture: url });
              });
            })
          ).subscribe();
        }
      }, 'image/jpeg'); // You can adjust the format if needed.
    };
  }


  fetchUserProfile(userId: string) {
    const userRef = this.firestore.collection('users').doc(userId);
    userRef.valueChanges().subscribe((data) => {
      this.userProfile = data;
    });
  }

  updateUserProfile(userId: string, data: any) {
    const userRef = this.firestore.collection('users').doc(userId);
    userRef.update(data)
      .then(() => {
        console.log('User profile updated successfully');
      })
      .catch((error) => {
        console.error('Error updating user profile:', error);
      });
  }

  async deleteAccount() {
    const confirmDelete = window.confirm('Are you sure you want to delete your account?');
    
    if (confirmDelete) {
      try {
        const user = await this.afAuth.currentUser;
        if (user) {
          // Prompt the user to log in again to confirm their identity
          const email = prompt('Please enter your email:');
          const password = prompt('Please enter your password:');
  
          if (email && password) {
            try {
              // Sign in the user with email and password for confirmation
              await this.afAuth.signInWithEmailAndPassword(email, password);
  
              // Delete the user's Firestore document
              await this.dataService.deleteUser(user.uid);
  
              // Delete the user's Firebase Authentication account
              await user.delete();
  
              // Sign out the user
              await this.afAuth.signOut();
  
              this.router.navigate(['/login']);
            } catch (error) {
              console.error('Error confirming account deletion:', error);
            }
          } else {
            // User canceled email or password entry
            console.log('Account deletion canceled.');
          }
        }
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  }
}
