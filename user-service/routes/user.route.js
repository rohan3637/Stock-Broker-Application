const express = require("express");
const {
  addUser,
  getUsers,
  getFunds,
} = require("../controllers/user.controller.js");

const router = express.Router();

router.post("/add", addUser);
router.get("/get", getUsers);
router.post("/getFunds", getFunds);

module.exports = router;
