const Router = require("express").Router();
const PaymentController = require("../controllers/payments");
const upload = require("../middlewares/multer");
const authorization = require("../middlewares/authorization");
const { PATIENT, ADMIN } = require("../constants/role");

Router.get("/pending", authorization(ADMIN), PaymentController.getAllPending);
Router.get("/:payment_id", PaymentController.getOneById);

Router.use(authorization(PATIENT));

Router.patch("/payment-method", PaymentController.updatePaymentMethod);

Router.post("/checkout", PaymentController.paymentCheckout);
Router.post(
  "/upload-slip/:payment_id",
  upload.single("payment_slip"),
  PaymentController.uploadPaymentSlip
);

module.exports = Router;
