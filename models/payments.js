const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patients",
      required: true,
    },
    product_type: {
      type: String,
      required: true,
    },
    product_detail: {
      complaint: {
        type: String,
        required: true,
      },
      allergy: {
        type: String,
      },
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
      appointment_date: {
        type: Date,
        required: true,
      },
      appointment_time: {
        type: String,
        required: true,
      },
      isOnline: {
        type: Boolean,
        required: true,
      },
    },
    product_price: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    payment_method: {
      type: String,
    },
    payment_status: {
      type: String,
      required: true,
      default: "Pending",
    },
    slip_url: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const Payments = mongoose.model("Payments", paymentSchema);
module.exports = Payments;
