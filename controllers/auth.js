const PatientsModel = require("../models/patients");
const PsikiaterModel = require("../models/psikiaters");
const AdminModel = require("../models/admin");
const VerifyModel = require("../models/verify");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const SERVER_IP_ADDRESS = process.env.SERVER_IP_ADDRESS;
const PORT = process.env.PORT;
const { PATIENT, PSIKIATER, ADMIN } = require("../constants/role");
const emailer = require("../utilities/emailer");

class AuthController {
  static registerPatient = async (req, res, next) => {
    const {
      first_name,
      last_name,
      email,
      password,
      date_of_birth,
      gender,
      address,
    } = req.body;

    try {
      const patientData = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: bcrypt.hashSync(password, 10),
        date_of_birth: date_of_birth,
        gender: gender,
        address: address,
      };

      const patient = await PatientsModel.create(patientData);

      const verificationToken = jwt.sign(
        {
          email: patient.email,
          role: PATIENT,
        },
        SECRET_KEY
      );

      const tokenDoc = await VerifyModel.create({
        email: patient.email,
        activation_token: verificationToken,
      });

      if (!tokenDoc) {
        throw new Error("Failed storing verification token");
      }

      const emailSent = await emailer(
        patient.email,
        "Verification Link",
        `<h3><strong>Clink this link to verify your account: </strong>http://${SERVER_IP_ADDRESS}:${PORT}/verify-user/verify/${verificationToken}</h3>`
      );

      if (!emailSent.messageId) {
        throw new Error("Failed sending email verification");
      }

      res.status(201).json({
        status: "Success",
        message: "Success create patient data.",
        data: patient,
      });
    } catch (error) {
      next(error);
    }
  };

  static registerPsikiater = async (req, res, next) => {
    try {
      const {
        first_name,
        last_name,
        password,
        email,
        date_of_birth,
        work_address,
        gender,
        specialize,
        experience_year,
        region,
        fees,
      } = req.body;

      const psikiaterData = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: bcrypt.hashSync(password, 10),
        date_of_birth: date_of_birth,
        work_address: work_address,
        gender: gender,
        specialize: specialize,
        info: {
          experience_year: experience_year,
          region: region,
        },
        fees: fees,
      };
      const psikiater = await PsikiaterModel.create(psikiaterData);

      const tokenPayload = {
        user_id: psikiater._id,
        role: PSIKIATER,
      };

      const jwtToken = jwt.sign(tokenPayload, SECRET_KEY);

      res.status(201).json({
        status: "created",
        message: "Success create psikiater data.",
        role: PSIKIATER,
        data: psikiater,
        token: jwtToken,
      });
    } catch (error) {
      next(error);
    }
  };

  static login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const patient = await PatientsModel.findOne({ email: email });
      const psikiater = await PsikiaterModel.findOne({ email: email });
      const admin = await AdminModel.findOne({ email: email });

      if (!patient && !psikiater && !admin) {
        throw new Error("Email or password is invalid.");
      }

      if (patient && !patient.is_active) {
        throw new Error("Your email address is not verified.");
      }

      if (psikiater && !psikiater.is_active) {
        throw new Error("Your email address is not verified.");
      }

      if (patient && bcrypt.compareSync(password, patient.password)) {
        res.status(200).json({
          status: "success",
          message: "Login successfull.",
          role: PATIENT,
          data: patient,
          token: jwt.sign(
            { user_id: patient._id, role: PATIENT },
            process.env.SECRET_KEY
          ),
        });
      }

      if (psikiater && bcrypt.compareSync(password, psikiater.password)) {
        res.status(200).json({
          status: "success",
          message: "Login successfull.",
          role: PSIKIATER,
          data: psikiater,
          token: jwt.sign(
            { user_id: psikiater._id, role: PSIKIATER },
            process.env.SECRET_KEY
          ),
        });
      }

      if (admin && bcrypt.compareSync(password, admin.password)) {
        res.status(200).json({
          status: "success",
          message: "Login successfull.",
          role: ADMIN,
          data: admin,
          token: jwt.sign(
            { user_id: admin._id, role: ADMIN },
            process.env.SECRET_KEY
          ),
        });
      }
    } catch (error) {
      next(error);
    }
  };

  static userIdentifier = async (req, res, next) => {
    try {
      const { user_id, role } = req.user;

      res.status(200).json({
        status: "success",
        message: "Get user identifier successfully",
        data: {
          user_id,
          role,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AuthController;
