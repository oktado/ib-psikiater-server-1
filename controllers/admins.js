const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AdminModel = require("../models/admin");
const VerifyModel = require("../models/verify");
const SECRET_KEY = process.env.SECRET_KEY;
const SERVER_IP_ADDRESS = process.env.SERVER_IP_ADDRESS;
const PORT = process.env.PORT;
const { PSIKIATER } = require("../constants/role");
const AppointmentModel = require("../models/appointments");
const PaymentModel = require("../models/payments");
const PsikiaterModel = require("../models/psikiaters");
const emailer = require("../utilities/emailer");
const chatroom = require("../utilities/chatroom");

class AdminController {
  static createAdmin = async (req, res, next) => {
    try {
      const { first_name, last_name, password, email } = req.body;

      const admin = await AdminModel.create({
        first_name,
        last_name,
        password: bcrypt.hashSync(password, 10),
        email,
      });

      if (!admin) {
        throw new Error("Failed creating admin");
      }

      res.status(202).json({
        status: "success",
        message: "Successfully created admin",
        data: admin,
      });
    } catch (error) {
      next(error);
    }
  };

  static getOneAdminById = async (req, res, next) => {
    try {
      const { admin_id } = req.params;

      const admin = await AdminModel.findById(admin_id);

      if (!admin) {
        throw new Error("Cannot find admin.");
      }

      res.status(200).json({
        status: "success",
        message: "Successfully get one admin",
        data: admin,
      });
    } catch (error) {
      next(error);
    }
  };

  static approvalPsikiater = async (req, res, next) => {
    try {
      const { admin_action, psychiatrist_id } = req.body;
      const psychiatrist = await PsikiaterModel.findById(psychiatrist_id);

      if (admin_action === "reject") {
        const emailSent = await emailer(
          psychiatrist.email,
          "Registration rejected.",
          `<h3>Sorry! your registration has been rejected by Admin</h3>`
        );

        if (!emailSent) {
          throw new Error("Failed sending email to user");
        }

        res.sendStatus(204);
      } else if (admin_action === "accept") {
        const verificationToken = jwt.sign(
          {
            email: psychiatrist.email,
            role: PSIKIATER,
          },
          SECRET_KEY
        );

        const tokenVerify = await VerifyModel.create({
          email: psychiatrist.email,
          activation_token: verificationToken,
        });

        if (!tokenVerify) {
          throw new Error("Failed storing verification token");
        }

        const emailSent = await emailer(
          psychiatrist.email,
          "Registration Accepted",
          `<h3><strong>Your registration has been accepted by admin, please clink this link to verify your account: </strong><a href="http://${SERVER_IP_ADDRESS}:${PORT}/verify-user/verify/${verificationToken}">Verification Link</a></h3>`
        );

        if (!emailSent) {
          throw new Error("Failed sending email to user.");
        }

        res.sendStatus(204);
      }
    } catch (error) {
      next(error);
    }
  };

  static paymentApproval = async (req, res, next) => {
    try {
      const { admin_action, payment_id } = req.body;
      const payment = await PaymentModel.findById(payment_id).populate(
        "patient"
      );

      if (admin_action === "reject") {
        const rejectedPayment = await PaymentModel.findByIdAndUpdate(
          payment_id,
          { payment_status: "rejected" },
          { new: true }
        );

        if (!rejectedPayment) {
          throw new Error("Failed rejecting payment.");
        }

        const email = emailer(
          payment.patient.email,
          "Your payment is rejected.",
          `<h3>Payment with ID ${payment_id} is rejected by admin.</h3>`
        );

        if (!email) {
          throw new Error("Failed sending email to user.");
        }

        res.sendStatus(204);
      } else if (admin_action === "accept") {
        const acceptedPayment = await PaymentModel.findByIdAndUpdate(
          payment_id,
          { payment_status: "accepted" },
          { new: true, lean: true }
        );

        if (!acceptedPayment) {
          throw new Error("Failed accepting payment.");
        }

        const appointmentData = {
          psikiater_id: acceptedPayment.product_detail.psikiater_id,
          patient_id: acceptedPayment.product_detail.patient_id,
          appointment_date: acceptedPayment.product_detail.appointment_date,
          appointment_time: acceptedPayment.product_detail.appointment_time,
          complaint: acceptedPayment.product_detail.complaint,
          allergy: acceptedPayment.product_detail.allergy,
          isOnline: acceptedPayment.product_detail.isOnline,
        };

        const appointment = await AppointmentModel.create(appointmentData);

        if (!appointment) {
          throw new Error("Failed create appointment from payment.");
        }

        if (appointment.isOnline) {
          const chatRoomData = {
            idPsikiater: appointment.psikiater_id.toString(),
            idPatient: appointment.patient_id.toString(),
            consultationDate: appointment.appointment_date,
            consultationTime: appointment.appointment_time,
          };

          const room = await chatroom.createChatroom(chatRoomData);
          const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
            appointment._id,
            { roomChat_id: room.id },
            { new: true }
          );
          if (!updatedAppointment) {
            throw new Error(
              "Failed storing room id inside appointment document"
            );
          }
        }

        const email = emailer(
          payment.patient.email,
          "Your payment is accepted.",
          `<h3>Payment with ID ${payment_id} is accepted by admin.</h3>`
        );

        if (!email) {
          throw new Error("Failed sending email to user.");
        }

        res.sendStatus(204);
      }
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AdminController;
