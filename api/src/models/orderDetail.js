const { Schema, model, Types } = require("mongoose");

const orderDetailSchema = new Schema(
  {
    orderId: {
      type: Types.ObjectId,
      ref: "order",
    },
    userId: {
      type: Types.ObjectId,
      ref: "user",
    },
    cart: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "product",
        },
        productVarientId: {
          type: Types.ObjectId,
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

   
    paymentStatus: {
      type: String,
      enum: ["PAID", "FAIL" , "PENDING"],
      default: "FAIL"

    },
  },
  { timestamps: true }
);

const orderDetailModel = model("orderDetail", orderDetailSchema);
module.exports = orderDetailModel;
