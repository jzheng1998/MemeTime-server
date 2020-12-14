const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "dynamic-web-b49a8.firebaseapp.com",
  projectId: "dynamic-web-b49a8",
  storageBucket: "dynamic-web-b49a8.appspot.com",
  messagingSenderId: "872225899077",
  appId: "1:872225899077:web:db64176ff0c96930b7992c",
};

const firebase = require("firebase");
// Initialize Firebase
if (firebase.app.length) {
  firebase.initializeApp(firebaseConfig);
}

// Routes Import
const indexRoute = require("./routes/index.js");
const userRoute = require("./routes/user.js");
const roomRoute = require("./routes/room.js");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Routes
app.use("/", indexRoute);
app.use("/user", userRoute);
app.use("/room", roomRoute);

app.listen(port, () => {
  console.log("Jack's Dynamic Web Application Final is running!");
});
