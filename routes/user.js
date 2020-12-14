const constants = require("../constants");
const express = require("express");
const router = express.Router();

const firebase = require("firebase");
const database = firebase.firestore();
const users = database.collection("users");
const rooms = database.collection("rooms");

router.get("/", (req, res) =>
  res.send({
    status: constants.ERROR,
    errorMsg: "No query provided.",
  })
);

router.get("/create", (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.send({
      status: constants.ERROR,
      errorMsg: "User ID not provided.",
    });
  }

  const template = {
    posts: [],
    rooms: [],
  };
  users
    .doc(userId)
    .set(template)
    .then((doc) => {
      return res.send({
        status: constants.SUCCESS,
      });
    })
    .catch((error) => {
      return res.send({
        status: constants.ERROR,
        errorMsg: error,
      });
    });
});

router.get("/retrieve", (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.send({
      status: constants.ERROR,
      errorMsg: "User ID not provided.",
    });
  }

  users
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const response = doc.data();
        return res.send({
          status: constants.SUCCESS,
          response: response,
        });
      } else {
        return res.send({
          status: constants.ERROR_NO_DOCUMENT,
          errorMsg: "No document with the provided ID exists.",
        });
      }
    })
    .catch((error) => {
      return res.send({
        status: constants.ERROR,
        errorMsg: error,
      });
    });
});

router.get("/addRoom", (req, res) => {
  const userId = req.query.userId;
  const roomId = req.query.roomId;

  if (!userId || !roomId) {
    return res.send({
      status: constants.ERROR,
      errorMsg: "User ID or Room ID not provided.",
    });
  }

  users
    .doc(userId)
    .update({
      rooms: firebase.firestore.FieldValue.arrayUnion(roomId),
    })
    .then(() => {
      return res.send({
        status: constants.SUCCESS,
      });
    })
    .catch((error) => {
      return res.send({
        status: constants.ERROR,
        errorMsg: error,
      });
    });
});

router.get("/addPost", (req, res) => {
  const userId = req.query.userId;
  const postId = req.query.postId;

  if (!userId || !postId) {
    return res.send({
      status: constants.ERROR,
      errorMsg: "User ID or Post ID not provided.",
    });
  }

  users
    .doc(userId)
    .update({
      posts: firebase.firestore.FieldValue.arrayUnion(postId),
    })
    .then(() => {
      return res.send({
        status: constants.SUCCESS,
      });
    })
    .catch((error) => {
      return res.send({
        status: constants.ERROR,
        errorMsg: error,
      });
    });
});

module.exports = router;
