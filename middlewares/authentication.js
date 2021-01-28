"use strict";

const jwt = require("jsonwebtoken");
const { PATIENT, PSIKIATER, ADMIN } = require("../constants/role");
const SECRET_KEY = process.env.SECRET_KEY;
const PatientsModel = require("../models/patients");
const PsikiatersModel = require("../models/psikiaters");
const AdminModel = require("../models/admin");

const authentication = async (req, res, next) => {
  try {
    const { accesstoken } = req.headers;
    if (!accesstoken) {
      throw new Error("invalid token");
    }
    const { user_id, role } = jwt.verify(accesstoken, SECRET_KEY);

    if (role !== PATIENT && role !== PSIKIATER && role !== ADMIN) {
      throw new Error("JWT Malformed");
    }

    if (role === PATIENT) {
      const patient = await PatientsModel.findById(user_id);

      if (!patient) {
        throw new Error("JWT Malformed");
      }
    }

    if (role === PSIKIATER) {
      const psikiater = await PsikiatersModel.findById(user_id);

      if (!psikiater) {
        throw new Error("JWT Malformed");
      }
    }

    if (role === ADMIN) {
      const admin = await AdminModel.findById(user_id);

      if (!admin) {
        throw new Error("JWT Malformed");
      }
    }

    req.user = {
      user_id,
      role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
