const { default: mongoose } = require("mongoose");
const productModel = require("../models/product");
const productVarientModel = require("../models/productVarient");
const { clearSearch } = require("../utilities/Helper");
const { paginationAggregate } = require("../utilities/pagination");

class productVarientService {
  static async save(data) {
    try {
      const response = { data: {}, status: false };

      // Check if the document already exists by ID, else create a new instance
      let docData = data._id
        ? await productVarientModel.findById(data._id)
        : new productVarientModel();

      // Assign data to the product model fields
      docData.productId = data.productId;
      docData.colourCode = data.colourCode;
      docData.discountPrice = data.discountPrice ?? docData.discountPrice;
      docData.price = data.price ?? docData.price;
      docData.thumbImage = data.thumbImage ?? docData.thumbImage;
      docData.inventory = data.inventory ?? docData.inventory;
      docData.status = data.status ?? docData.status;
      docData.isDefault = data.isDefault ?? docData.isDefault;
      docData.isDeleted = data.isDeleted ?? docData.isDeleted;

      docData.pictures = Array.isArray(data.pictures)
        ? data.pictures
        : docData.pictures;

      console.log(data);
      await docData.save();

      // Prepare the response
      response.data = docData;
      response.status = true;

      return response;
    } catch (e) {
      throw e;
    }
  }

  static async list(query = {}) {
    const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
    let response = { data: [], extra: { ...$extra }, status: false };
console.log(query)
    try {
      const search = {
        isDeleted: false,
        ...(query?.productId &&
          mongoose.Types.ObjectId.isValid(query.productId) && {
            productId: mongoose.Types.ObjectId(query.productId),
          }),
      };
      console.log(query, search);
      clearSearch(search);
      const $aggregate = [{ $match: search }, { $sort: { _id: -1 } }];

      response = await paginationAggregate(
        productVarientModel,
        $aggregate,
        $extra
      );

      response.status = true;
      return response;
    } catch (err) {
      throw err;
    }
  }

  // static async delete(ids) {
  //   const response = { status: false, ids: [] };
  //   try {
  //     if (Array.isArray(ids)) {
  //       await productModel.updateMany({ _id: { $in: ids } }, { isDeleted: true });
  //     } else if (typeof ids === "string") {
  //       await productModel.updateOne({ _id: ids }, { isDeleted: true });
  //       response.id = ids;
  //     }

  //     response.status = true;
  //     response.ids = ids;

  //     return response;
  //   } catch (err) {
  //     throw err;
  //   }
  // }
}

module.exports = productVarientService;
