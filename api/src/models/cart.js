const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    productVarientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "productVarient",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true }
);


const cartModel = mongoose.model("cart", cartSchema);
module.exports = cartModel;

cartSchema.pre('save', async function (next) {
    try {
        if (this.quantity <= 0) {
            await cartModel.remove({ _id: this._id });
        }
    } catch (err) {
        throw new Error('Error! Cart can not be updated');
    }
    return next();
});