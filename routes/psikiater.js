const Router = require("express").Router();
const PsychiatristController = require("../controllers/psikiaters");
const upload = require("../middlewares/multer");
const authorization = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");
const { ADMIN, PSIKIATER } = require("../constants/role");

Router.get(
  "/rating/:psychiatrist_id",
  PsychiatristController.getPsychiatristRating
);

Router.get("/search", PsychiatristController.getSearching);

Router.get("/", PsychiatristController.getAllPsikiaterData);

Router.get("/:id", PsychiatristController.getPsikiaterDataById);

Router.use(authentication);

Router.get(
  "/all/inactive",
  authorization(ADMIN),
  PsychiatristController.getInactivePsychiatrist
);

Router.use(authorization(PSIKIATER));

Router.patch("/:id", PsychiatristController.updatePsikiaterData);

Router.post(
  "/upload/:id",
  upload.single("profile_photo"),
  PsychiatristController.uploadAvatar
);

module.exports = Router;
