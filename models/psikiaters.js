const mongoose = require("mongoose");

const psikiaterSchema = new mongoose.Schema(
  {
    is_active: {
      type: Boolean,
      default: true,
    },
    first_name: {
      type: String,
      required: "First Name Is Required",
      set: (v) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(),
    },
    last_name: {
      type: String,
      set: (v) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(),
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
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
    date_of_birth: {
      type: Date,
      required: true,
    },
    work_address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    avatar_url: {
      type: String,
      default:
        "https://www.suitdoctors.com/wp-content/uploads/2016/11/dummy-man-570x570.png",
    },
    info: {
      experience_year: {
        type: String,
        required: true,
        //validator : regex => pertama angka setelahnya huruf
      },
      region: {
        type: String,
        required: true,
        maxlength: 10,
        set: (v) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(),
      },
    },
    schedule: {
      work_days: {
        type: [String],
        default: [],
      },
      work_time: {
        type: [String],
        default: [],
      },
    },
    fees: {
      type: Number,
      default: "",
    },
    specialize: {
      type: String,
      required: true,
      maxlength: 30,
      set: (v) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(),
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

//virtual rating

const Psikiaters = mongoose.model("Psikiaters", psikiaterSchema);
module.exports = Psikiaters;
