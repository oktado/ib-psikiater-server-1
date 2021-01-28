const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    psikiater_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Psikiaters",
      required: true,
    },
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patients",
      required: true,
    },
    prescription_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescriptions",
    },
    appointment_date: {
      type: Date,
      required: true,
    },
    appointment_time: {
      type: String,
      required: true,
    },
    complaint: {
      type: String,
      required: true,
      default: "",
    },
    status: {
      type: String,
      required: true,
      default: "Paid",
    },
    isOnline: {
      type: Boolean,
      required: true,
    },
    allergy: String,
    diagnose: {
      diagnose_name: {
        type: String,
        default: "",
      },
      diagnose_date: {
        type: Date,
        default: "",
      },
    },
    roomChat_id: {
      type: String,
      default: "",
    },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

const Appointments = mongoose.model("Appointments", appointmentSchema);
module.exports = Appointments;
