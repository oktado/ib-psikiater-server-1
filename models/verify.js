const mongoose = require("mongoose");

const verifySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (val) => {
          return /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
            val
          );
        },
        message: `invalid email format`,
      },
    },
    activation_token: {
      type: String,
    },
    createdAt: { type: Date, expires: "10m", default: Date.now },
  },
  {
    versionKey: false,
  }
);

const Verify = mongoose.model("Verify", verifySchema);
module.exports = Verify;
