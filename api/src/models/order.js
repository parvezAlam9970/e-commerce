const { Schema, model, type } = require("mongoose");

const orderSchema = new Schema(
  {
    userId: {
      type: type.ObjectId,
      ref: "user",
    },
    
    totalAmount: {
      type: Number,
      required: true,
    },

    orderId: {
      type: String,
    },
    razorpayPaymentId: {
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
