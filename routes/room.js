const constants = require("../constants");
const express = require("express");
const router = express.Router();

const firebase = require("firebase");
const database = firebase.firestore();
const rooms = database.collection("rooms");
const posts = database.collection("posts");

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

router.get("/retrieveMultiple", (req, res) => {
  const inputRooms = req.query.inputRooms;

  if (!inputRooms || inputRooms.length === 0) {
    return res.send({
      status: constants.ERROR,
      errorMsg: "No rooms.",
    });
  }

  rooms
    .where(firebase.firestore.FieldPath.documentId(), "in", inputRooms)
    .get()
    .then((querySnapshot) => {
      const userRooms = [];
      querySnapshot.forEach((doc) => {
        userRooms.push(doc.data());
      });
      return res.send({
        status: constants.SUCCESS,
        userRooms: userRooms,
      });
    })
    .catch((error) => {
      return res.send({
        status: constants.ERROR,
        errorMsg: error,
      });
    });
});

router.get("/retrieveSingle", (req, res) => {
  const roomId = req.query.roomId;

  if (!roomId) {
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
  const username = req.query.username;
  const roomId = req.query.roomId;
  const postId = req.query.postId;

  if (!roomId || !postId) {
    return res.send({
      status: constants.ERROR,
      errorMsg: "Room ID or Post ID not provided.",
    });
  }

  const template = {
    postId: postId,
    createAt: firebase.firestore.FieldValue.serverTimestamp(),
    createBy: username,
    likes: 0,
  };

  posts
    .doc(postId)
    .set(template)
    .then(() => {
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
    })
    .catch((error) => {
      return res.send({
        status: constants.ERROR,
        errorMsg: error,
      });
    });
});

router.get("/getPost", (req, res) => {
  const postId = req.query.postId;

  if (!postId) {
    return res.send({
      status: constants.ERROR,
      errorMsg: "Post ID not provided.",
    });
  }

  posts
    .doc(postId)
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

module.exports = router;
