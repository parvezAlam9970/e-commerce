const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema(
  {
    name: {
      type: "string",
    },
    slug: {
      type: String,
    },

    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
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

const productModel = mongoose.model("model", ModelSchema);
module.exports = productModel;
