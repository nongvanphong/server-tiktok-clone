const express = require("express");
require("express-group-routes");
const auth = require("../src/controllers/auth.controllers");
const video = require("../src/controllers/video.controllers");
const favourite = require("../src/controllers/favourite.controllers");
const commets = require("../src/controllers/comment.controllers");

const uploadvideo = require("../src/config/video");
const uploadimage = require("../src/config/image");
const { verify } = require("../src/middleware/verify");
var router = express.Router();
router.group("/auth", (router) => {
  router.post("/login", auth.login);
  router.post("/register", auth.register);
  router.post("/avatar", uploadimage, verify, auth.avatar);
  //
  router.post("/checkemail", auth.findEmail);
  router.post("/changepassword", verify, auth.chanPassword);
  router.post("/changeusername", verify, auth.changeName);
  router.get("/search", auth.search);
});

router.group("/videos", (router) => {
  router.post("/create", uploadvideo, verify, video.create);
  router.get("/single", video.getVideoSingle);
  router.get("/all", video.all);
  router.get("/alluser", video.allUser);
  router.post("/delete", verify, video.delete);
  router.post("/favourite", verify, favourite.favouriteVideo);
  router.post("/update", verify, video.update);
  // router.post("/deleteVideo", verify, video.delete);
});
router.group("/comments", (router) => {
  router.post("/create", verify, commets.create);
  router.post("/update", verify, commets.update);
  router.get("/all", commets.getAll);
  router.post("/delete", verify, commets.delete);
});

module.exports = router;
