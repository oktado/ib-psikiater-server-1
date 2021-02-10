const admin = require("firebase-admin");
const serviceAccount = require("./filings-online-consultation-firebase-adminsdk-r4p3l-df9a02e717.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const dbFirebase = admin.firestore();

module.exports = dbFirebase;
