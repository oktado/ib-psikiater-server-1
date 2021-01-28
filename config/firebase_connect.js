const admin = require("firebase-admin");
const serviceAccount = require("./webchat-27f5d-firebase-adminsdk-p8jqn-72c21982b1.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://webchat-27f5d-default-rtdb.firebaseio.com"
});

const dbFirebase = admin.firestore();

module.exports= dbFirebase;