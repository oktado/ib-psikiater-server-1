const Router = require("express").Router();
const FirebaseController = require("../controllers/firebase");
// const authorization = require("../middlewares/authorization");
// const { PATIENT } = require("../constants/role");

Router.post("/message",FirebaseController.firebaseSaveData);

module.exports = Router;