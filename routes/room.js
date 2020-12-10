const constants = require("../constants");
const express = require("express");
const router = express.Router();

const firebase = require("firebase");
const database = firebase.firestore();
const rooms = database.collection("rooms");

router.get("/", (req, res) =>
  res.send({
    status: constants.ERROR,
    errorMsg: "No query provided.",
  })
);

router.get("/create", (req, res) => {
  const roomName = req.query.roomName;

  if (!roomName) {
    return res.send({
      status: constants.ERROR,
      errorMsg: "Room name not provided.",
    });
  }

  const template = {
    roomName: roomName,
    createAt: firebase.firestore.FieldValue.serverTimestamp(),
    posts: [],
  };
  rooms
    .add(template)
    .then((doc) => {
      return res.send({
        status: constants.SUCCESS,
        docId: doc.id,
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
  const roomId = req.query.roomId;

  if (!userId) {
    return res.send({
      status: constants.ERROR,
      errorMsg: "Room ID not provided.",
    });
  }

  rooms
    .doc(roomId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const response = doc.data();
        console.log(response);
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

router.get("/addPost", (req, res) => {
  const roomId = req.query.roomId;
  const postId = req.query.postId;

  if (!roomId || !postId) {
    return res.send({
      status: constants.ERROR,
      errorMsg: "Room ID or Post ID not provided.",
    });
  }

  rooms
    .doc(roomId)
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
