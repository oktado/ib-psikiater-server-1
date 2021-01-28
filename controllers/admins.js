const AdminModel = require("../models/admin");
const bcrypt = require("bcrypt");
const AppointmentModel = require("../models/appointments");
const PaymentModel = require("../models/payments");
const PatientModel = require("../models/patients");
const emailer = require("../utilities/emailer");

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

      res
        .status(202)
        .json({
          status: "success",
          message: "Successfully created admin",
          data: admin,
        });
    } catch (error) {
      next(error);
    }
  };

  static updateStatusByPaymentID = async (req, res, next) => {
    const { patient_id } = req.body;
    try {
      const PatientData = await PatientModel.findById(patient_id);
      const Data = {
        email: PatientData.email,
      };
      const {payment_status} = req.body;
      const { payment_id } = req.body;
      const PaymentData = await PaymentModel.findByIdAndUpdate(
        payment_id,
        { payment_status: payment_status },
        { new: true }
      );
     
      const FindPaymentData = await PaymentModel.findById(payment_id);
      const statusPayment = FindPaymentData.payment_status;
      if (statusPayment === "Reject") {
        const emailSent = await emailer(
            PatientData.email,
            "Payment Status",
            `<h3><strong>Payment Reject Again</strong></h3>`
          );
      }else if (statusPayment === "Accept") {
        const emailSent = await emailer(
          PatientData.email,
          "Payment Status",
          `<h3><strong>Payment Success</strong></h3>`
        );
        const detailPayment = PaymentData.product_detail;
        const appointmentData = {
          psikiater_id : detailPayment.psikiater_id,
          patient_id : detailPayment.patient_id,
          appointment_date : detailPayment.appointment_date,
          appointment_time : detailPayment.appointment_time,
          complaint : detailPayment.complaint,
          isOnline : detailPayment.isOnline
        }
        const appointment = await AppointmentModel.create(appointmentData);

      }
        
      res.status(200).json({
        status: "Success",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AdminController;
