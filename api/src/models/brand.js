const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: "string",
    },
    slug: {
      type: String,
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

const brandModel = mongoose.model("brand", BrandSchema);
module.exports = brandModel;
