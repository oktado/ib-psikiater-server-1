const mongoose = require("mongoose");
const PsikiaterModel = require("../models/psikiaters");
const ReviewModel = require("../models/reviews");
const PORT = process.env.PORT;
const SERVER_IP_ADDRESS = process.env.SERVER_IP_ADDRESS;

class PsikiaterController {
  static updatePsikiaterData = async (req, res, next) => {
    try {
      const {
        is_active,
        first_name,
        last_name,
        email,
        password,
        date_of_birth,
        work_address,
        experience_year,
        region,
        gender,
        fees,
        specialize,
      } = req.body;

      const psikiaterData = await PsikiaterModel.findByIdAndUpdate(
        req.params.id,
        {
          is_active: is_active,
          first_name: first_name,
          last_name: last_name,
          password: password,
          email: email,
          date_of_birth: date_of_birth,
          work_address: work_address,
          info: {
            experience_year: experience_year,
            region: region,
          },
          work_address: work_address,
          gender: gender,
          fees: fees,
          specialize: specialize,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!psikiaterData) {
        throw new Error("Unable update data");
      }

      res.status(200).json({
        status: "Success",
        message: "Data was updated",
        data: psikiaterData,
      });
    } catch (error) {
      next(error);
    }
  };

  static uploadAvatar = async (req, res, next) => {
    try {
      const { filename } = req.file;

      const uploadAvatar = await PsikiaterModel.findByIdAndUpdate(
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

  static getSearching = async (req, res, next) => {
    try {
      const { region, first_name } = req.query;
      const searchingRegion = new RegExp(region, "i");
      const searchingName = new RegExp(first_name, "i");
      const psikiater = await PsikiaterModel.find({
        "info.region": {
          $regex: searchingRegion,
        },
        first_name: {
          $regex: searchingName,
        },
      });

      if (!psikiater) {
        throw new Error("No psychiatrist found.");
      }

      res.status(200).json({
        status: "Success",
        message: "Success get psychiatrist data",
        data: psikiater,
      });
    } catch (error) {
      next(error);
    }
  };

  static getPsikiaterDataById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const psikiaterData = await PsikiaterModel.findById(id);

      if (!psikiaterData) {
        throw new Error("Psikiater Not Found");
      }

      res.status(200).json({
        status: "Success",
        message: "Success Get Psikiater Data",
        data: psikiaterData,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllPsikiaterData = async (req, res, next) => {
    try {
      const psikiaterData = await PsikiaterModel.find();

      if (!psikiaterData) {
        throw new Error("Psikiater Not Found");
      }

      res.status(200).json({
        status: "Success",
        message: "Success Get All Psychiatrist Data",
        data: psikiaterData,
      });
    } catch (error) {
      next(error);
    }
  };

  static getPsychiatristRating = async (req, res, next) => {
    try {
      const { psychiatrist_id } = req.params;

      const rating = await ReviewModel.aggregate([
        {
          $match: {
            psikiater_id: mongoose.Types.ObjectId(psychiatrist_id),
          },
        },
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "psikiater_id",
            as: "review",
          },
        },
        {
          $unwind: {
            path: "$review",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$psikiater_id",
            total_review: {
              $sum: 1,
            },
            average_score: {
              $avg: "$rating",
            },
          },
        },
        {
          $project: {
            review: {
              total_review: "$total_review",
              average_rating: "$average_score",
            },
          },
        },
      ]);

      res.status(200).json({
        status: "Success",
        message: "Success Get Psikiater Rating",
        data: !rating.length ? null : rating[0],
      });
    } catch (error) {
      next(error);
    }
  };

  static getInactivePsychiatrist = async (req, res, next) => {
    try {
      const psychiatrist = await PsikiaterModel.find({ is_active: false });

      if (!psychiatrist) {
        throw new Error("Psikiater Not Found");
      }

      res.status(200).json({
        status: "Success",
        message: "Success Get All Inactive Psychiatrist",
        data: psychiatrist,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = PsikiaterController;
