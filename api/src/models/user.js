const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");



const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },

    mobile_no: {
      type: String,
      unique: true,
    },

    profile_picture: {
      type: String,
    },

    loginStatus: {
      type: Boolean,
      default: false,
    },

    isNumber_verified: {
      type: Boolean,
      default: false,
    },
    signup_through: {
      type: String,
      enum: ["google", "otp"],
    },

    name: String,

    status: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);




// Generate JWT access token

// userSchema.methods.generateAccessToken = function() {
//   return jwt.sign(
//     {
//       _id: this._id,
//       email: this.email,
//       phone: this.phoneNumber,
//     },
//     process.env.JWT_SECRET_KEY,
//     {
//       expiresIn: process.env.JWT_EXPIRATION_TIME,
//     }
//   );
// };

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
