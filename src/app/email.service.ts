import { Injectable } from '@angular/core';
import * as emailjs from 'emailjs-com';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private userID = 'v0Ifj4B7lWB4x7sj2'; // Replace with your Email.js User ID

  constructor() {
    emailjs.init(this.userID);
  }

  sendEmail(
    toEmail: string,
 
    message: string,
    fromName: string
  ) {
    const emailParams = {
      to_email: toEmail,
      from_name: fromName,
      message: message,

    };

    return emailjs
      .send('service_kalatas', 'template_tp0cneh', emailParams)
      .then((response) => {
        console.log('Email sent: ', response);
        return response;
      })
      .catch((error) => {
        console.error('Email error: ', error);
        throw error;
      });
  }
}