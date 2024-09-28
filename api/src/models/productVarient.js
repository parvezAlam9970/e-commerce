const mongoose = require("mongoose");
const { Schema } = mongoose;

const productVarientSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "product",
    },
    colourCode: {
      type: String,
      required: true,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    thumbImage: {
      type: String,
      trim: true,
    },

    inventory: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    pictures: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const productVarientModel = mongoose.model("productVarient", productVarientSchema);
module.exports = productVarientModel;
