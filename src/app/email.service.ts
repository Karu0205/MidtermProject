import { Injectable } from '@angular/core';
import * as emailjs from 'emailjs-com';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private userID = '4sbibvj3jkPmnbpPh'; // Replace with your Email.js User ID

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
      .send('service_37dskd6', 'template_w5s2i4c', emailParams)
      .then((response) => {
        console.log('Email sent: ', response);
        return response;
      })
      .catch((error) => {
        console.error('Email error: ', error);
        throw error;
      });
  }

    sendEmail2(
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
      .send('service_37dskd6', 'template_rlda7k7', emailParams)
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