const { Schema, model, Types } = require("mongoose");

const orderSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "user",
    },
    
    totalAmount: {
      type: Number,
      required: true,
    },

    orderId: {
      type: String,
    },
    stripePaymentId: {
      type: String,
    },

    transaction_type: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "ONLINE",
    },
    status: {
      type: String,
      enum: ["INITIATED", "PAID", "FAIL"],
    },
  },
  { timestamps: true }
);

const orderModel = model("order", orderSchema);
module.exports = orderModel;
