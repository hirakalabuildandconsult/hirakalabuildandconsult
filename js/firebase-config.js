/*
  HIRAKALA ADMIN CONFIGURATION
  ----------------------------
  Fill in the values below with your own free Firebase and Cloudinary
  accounts, then save this file. Every page on the site reads from here.

  1) FIREBASE (free Spark plan, no credit card)
     - Go to https://console.firebase.google.com/ and create a project.
     - In the project, click the </> (web) icon to register a web app.
     - Copy the firebaseConfig values it shows you into the object below.
     - In the left sidebar, enable "Firestore Database" (start in
       production mode) and enable "Authentication" > Sign-in method >
       Email/Password.
     - In Authentication > Users, click "Add user" and create ONE account
       for yourself (this is your admin login for /admin.html).
     - In Firestore Database > Rules, paste the rules from
       firestore.rules.txt (included in this folder) and click Publish.

  2) CLOUDINARY (free plan, no credit card) — used only for photo uploads
     - Go to https://cloudinary.com/users/register/free and sign up.
     - On your Dashboard, copy the "Cloud name" shown at the top.
     - Go to Settings (gear icon) > Upload > Upload presets > Add upload
       preset. Set "Signing Mode" to "Unsigned", give it a name, and save.
     - Put that cloud name and preset name below.
*/

window.HIRAKALA_CONFIG = {
  firebase: {
    apiKey: "PASTE_YOUR_API_KEY_HERE",
    authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
    projectId: "PASTE_YOUR_PROJECT_ID",
    storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
    messagingSenderId: "PASTE_YOUR_SENDER_ID",
    appId: "PASTE_YOUR_APP_ID"
  },
  cloudinary: {
    cloudName: "PASTE_YOUR_CLOUD_NAME",
    uploadPreset: "PASTE_YOUR_UNSIGNED_UPLOAD_PRESET_NAME"
  },
  // The single email you created in Firebase Authentication > Users.
  // Only this account will be able to sign in to /admin.html.
  adminEmail: "you@example.com"
};
