const config = require("../config");
const orderModel = require("../models/order");
const orderDetailModel = require("../models/orderDetail");
const UserService = require("./user");

const stripe = require("stripe")(config.Stripe.secret_key);

class orderServices {
  static async createOrder(data) {
    const response = { data: {}, status: false };

    try {
      const sessionPaymnetCreateData = await this.stripeInit({
        amount: data.totalAmount,
        currency: data.currency,
      });
      if (!sessionPaymnetCreateData?.id) {
        throw new Error("Failed to initialize payment");
      }
      const docData = new orderModel();

      docData.userId = data.userId;
      docData.orderId = sessionPaymnetCreateData?.id;
      docData.totalAmount = data.totalAmount;
      docData.transaction_type = "ONLINE";
      docData.status = "INITIATED";
      await docData.save();

      let orderDetail = await this.SaveOrderDetail({
        order: docData,
        data,
      });
      if (!orderDetail) {
        throw new Error("Failed to save order detail");
      }

      response.data = await this.getStripeDetails({
        userId: data.userId,
        finalPrice: docData.totalAmount,
        orderId: docData.orderId,
        _id: docData._id,
        sessionId: sessionPaymnetCreateData.id,
        clientSecret: sessionPaymnetCreateData.client_secret,
      });
      response.status = true;
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async makePaymentSuccess(data) {
    const response = { data: {}, status: false };

    try {
      const { paymentIntentId, orderId } = data;
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (paymentIntent.status === "succeeded") {
        const updatedOrder = await orderModel.findByIdAndUpdate(
          orderId,
          { status: "PAID", stripePaymentId: paymentIntentId },
          { new: true }
        );
        response.data = updatedOrder;
        response.status = true;
      } else {
        const updatedOrder = await orderModel.findByIdAndUpdate(
          orderId,
          { status: "FAIL" },
          { new: true }
        );
        throw new Error("Stripe Verification  failed");
      }

      return response;
    } catch (error) {
      throw new Error("Stripe Verification  failed");
    }
  }

  static async getStripeDetails(data) {
    try {
      const userDetails = (await UserService.userData(data.userId))?.data;
      const res = {
        // key: process.env.STRIPE_KEY_PUBLIC,
        amount: data.finalPrice * 100,
        currency: "USD",
        name: "ecommerce",
        paymentMethod: "stripe",
        order_id: data.orderId,
        sessionId: data.sessionId,
        clientSecret: data?.clientSecret,
        _id: data._id,
        prefill: {
          email: userDetails?.email || "",
          contact: userDetails?.phone || "",
        },
      };
      return res;
    } catch (error) {}
  }

  static async SaveOrderDetail({ data, order }) {
    try {
      const docData = new orderDetailModel();
      docData.orderId = order._id;
      docData.userId = data.userId;
      docData.totalAmount = data.totalAmount;
      docData.paymentStatus = "PENDING";

      docData.cart = data.cart.map((item) => ({
        productId: item.productId,
        productVarientId: item.productVarientId,
        quantity: item.quantity,
        price: item.price,
      }));

      await docData.save();

      return docData;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to save order detail", error);
    }
  }

  static async stripeInit({ amount = 2000, currency = "USD" }) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: currency,
        metadata: {
          integration_check: "accept_a_payment",
        },
      });
      return paymentIntent;
    } catch (error) {
      throw new Error("Stripe initialization failed");
    }
  }
}

module.exports = orderServices;
