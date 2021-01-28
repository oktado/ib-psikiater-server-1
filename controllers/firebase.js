const db = require("../config/firebase_connect");
const AppointmentModel = require("../models/appointments");

class FirebaseController {
  static firebaseSaveData = async (req, res, next) => {
    const { appointment_id } = req.body;
    try {
      const AppointmentData = await AppointmentModel.findById(appointment_id);
      const firebaseData = {
        idPsikiater: `${AppointmentData.psikiater_id}`,
        idPatient: `${AppointmentData.patient_id}`,
        consultationTime: AppointmentData.appointment_time,
        consultationDate: AppointmentData.appointment_date,
      };
      const message = await db.collection("Message").add(firebaseData);
      res.status(201).json({
        status: "Success",
        data: firebaseData,
        idFirebase: message.id,
      });

      const firebase_id = message.id;
      const AppointmentDataUpdate = await AppointmentModel.findByIdAndUpdate(
        appointment_id,
        { roomChat_id: firebase_id },
        { new: true }
      );
    } catch (error) {
      next(error);
    }
  };
}

module.exports = FirebaseController;
