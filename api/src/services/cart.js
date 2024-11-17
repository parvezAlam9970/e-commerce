const { Types } = require("mongoose");
const cartModel = require("../models/cart");
const { paginationAggregate } = require("../utilities/pagination");

class cartServices {
  static async save(data) {
    const productId = data.productId ? Types.ObjectId(data.productId) : null;
    const productVarientId = data.productVarientId
      ? Types.ObjectId(data.productVarientId)
      : null;
    const userId = data.userId ? Types.ObjectId(data.userId) : null;

    const response = { data: {}, status: false };
    try {
      console.log(data);
      const docData =
        (await cartModel.findOne({
          $and: [{ userId }, { productId }, { productVarientId }],
        })) || new cartModel();

      docData.userId = data.userId;
      docData.productId = data.productId;
      docData.quantity = data.quantity || docData.quantity;
      docData.productVarientId = data.productVarientId;

      let res = await docData.save();

      response.data = res;
      response.status = true;
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async listFront(query = {}) {
    const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
    let response = { data: [], extra: { ...$extra }, status: false };

    try {
      const search = {
        // isDeleted: false,
        userId: query.userId ? Types.ObjectId(query.userId) : "",
      };
      console.log(search);

      const $aggregate = [
        {
          $match: search,
        },
        {
          $sort: { _id: -1 },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productDetails",
            pipeline: [
              {
                $match: {
                  isDeleted: false,
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  briefDescription: 1,
                  productCode: 1,
                  slug: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$productDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "productvarients",
            localField: "productVarientId",
            foreignField: "_id",
            as: "productVarient",
            pipeline: [
              {
                $match: {
                  isDeleted: false,
                },
              },
              {
                $project: {
                  _id: 1,
                  price: 1,
                  discountPrice: 1,
                  thumbImage: 1
                },
              },
            ],
          },
        },

        {
            $unwind: {
              path: "$productVarient",
              preserveNullAndEmptyArrays: true,
            },
          },




          {
            $project: {
              _id: 1,
              price: "$productVarient.price",
              discountPrice: "$productVarient.discountPrice",
              thumbImage: "$productVarient.thumbImage",

              name : "$productDetails.name",
              description : "$productDetails.description", 
              briefDescription : "$productDetails.briefDescription",
              slug: "$productDetails.slug",
              quantity: 1,
              userId: 1,
              productId: 1,
              productVarientId: 1,

            },
          },
      ];

      response = await paginationAggregate(cartModel, $aggregate, $extra);
      console.log(response);
      response.status = true;
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = cartServices;
