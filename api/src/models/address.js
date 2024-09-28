const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    name: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    address_line_1: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Home", "Office", "Other"]
  },

    city: {
      type: String,
      trim: true,
    },
    pinCode: {
      type: String,
      trim: true,
    },

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

const addressModel = mongoose.model("address", addressSchema);
module.exports = addressModel;
