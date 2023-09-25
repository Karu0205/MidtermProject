/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendNotification = functions.database.ref('/requests/{student_id}').onUpdate(async (change, context) => {
  const userId = context.params.userId;
  const updatedData = change.after.val();

  // Retrieve the user's FCM token from your database (you should store it when the user logs in or registers)
  const userSnapshot = await admin.database().ref(`/users/${userId}`).once('value');
  const fcmToken = userSnapshot.val().fcmToken;

  // Construct the notification message
  const message = {
    notification: {
      title: 'Database Update',
      body: 'Your data has been updated!',
    },
    token: fcmToken,
  };

  // Send the notification
  await admin.messaging().send(message);
});

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
