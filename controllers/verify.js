const VerifyModel = require("../models/verify");
const PatientModel = require("../models/patients");
const PsikiaterModel = require("../models/psikiaters");
const jwt = require("jsonwebtoken");
const emailer = require("../utilities/emailer");

class VerifyController {
  static verifyUser = async (req, res, next) => {
    try {
      const { token } = req.params;

      const { email, role } = jwt.verify(token, process.env.SECRET_KEY);

      const verifyData = await VerifyModel.findOne({
        activation_token: token,
      });

      if (verifyData) {
        if (role === "PATIENT") {
          await PatientModel.updateOne({ is_active: true });
        } else {
          await PsikiaterModel.updateOne({ is_active: true });
        }

        await verifyData.delete();

        res.status(301).redirect("http://localhost:3000/login?verify=true");
      }

      res
        .status(301)
        .redirect(
          `http://localhost:3000/email-verification?type=expired&token=${token}`
        );
    } catch (error) {
      next(error);
    }
  };

  static sendNewLink = async (req, res, next) => {
    try {
      const { token } = req.params;

      const { email } = jwt.verify(token, process.env.SECRET_KEY);

      const tokenDoc = await VerifyModel.create({
        email: email,
        activation_token: token,
      });

      if (!tokenDoc) {
        throw new Error("Failed storing verification token");
      }

      const emailSent = await emailer(
        email,
        "Verification Link",
        `<h3><strong>Clink this link to verify your account: </strong>http://${process.env.SERVER_IP_ADDRESS}:${process.env.PORT}/verify-user/verify/${token}</h3>`
      );

      if (!emailSent.messageId) {
        throw new Error("Failed sending email verification");
      }

      res.status(200).json({
        status: "success",
        message: "Successfully send new verification email",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = VerifyController;
