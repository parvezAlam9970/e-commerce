const { Schema, model, type } = require("mongoose");

const orderDetailSchema = new Schema(
  {
    orderId: {
      type: type.ObjectId,
      ref: "order",
    },
    userId: {
      type: Types.ObjectId,
      ref: "user",
    },
    cart: [
      {
        productId: {
          type: type.ObjectId,
          ref: "product",
        },
        productVarientId: {
          type: type.ObjectId,
          ref: "productVarient",
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },

    transactionStatus: {
      type: String,
      enum: ["CLEARED", "NOT CLEARED"],
      default: "NOT CLEARED",
    },

    paymentStatus: {
      type: String,
      enum: ["INITIATED", "PAID", "FAIL"],
    },
  },
  { timestamps: true }
);

const orderDetailModel = model("orderDetail", orderDetailSchema);
module.exports = orderDetailModel;
