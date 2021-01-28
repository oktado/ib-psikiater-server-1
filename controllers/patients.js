"use strict";
const PatientModel = require("../models/patients");
const PORT = process.env.PORT;
const SERVER_IP_ADDRESS = process.env.SERVER_IP_ADDRESS;

class PatientController {
  static getPatientDataByIdPatient = async (req, res, next) => {
    try {
      const { id } = req.params;
      const patientData = await PatientModel.findById(id);

      if (!patientData) {
        throw new Error("Data patient not found.");
      }

      res.status(200).json({
        status: "success",
        message: "Successfully get patients data by id patient.",
        data: patientData,
      });
    } catch (error) {
      next(error);
    }
  };

  static uploadAvatar = async (req, res, next) => {
    try {
      const { filename } = req.file;

      const uploadAvatar = await PatientModel.findByIdAndUpdate(
        req.params.id,
        {
          avatar_url: `http://${SERVER_IP_ADDRESS}:${PORT}/media/${filename}`,
        },
        {
          new: true,
        }
      );

      if (!uploadAvatar) {
        throw new Error("Please insert photo");
      }

      res.status(200).json({
        status: "Success",
        message: "Upload Success",
        data: uploadAvatar,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllPatientData = async (req, res, next) => {
    try {
      const patientData = await PatientModel.find();

      if (!patientData) {
        throw new Error("Patient Not Found");
      }

      res.status(200).json({
        status: "Success",
        message: "Success Get All Patient Data",
        data: patientData,
      });
    } catch (error) {
      next(error);
    }
  };
}
module.exports = PatientController;
