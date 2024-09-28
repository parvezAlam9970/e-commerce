const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    ip: {
      type: String,
    },

    otp: {
      value: {
        type: String,
        required: true,
        minlength: 4,

      },
      expireTime: {
        type: String,
        required: true,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const otpModel = mongoose.model("otp", otpSchema);
module.exports = otpModel;
