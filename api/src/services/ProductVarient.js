const productModel = require("../models/product");
const productVarientModel = require("../models/productVarient");

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
          
          // Handle pictures array (ensure it's an array before assigning)
          docData.pictures = Array.isArray(data.pictures) ? data.pictures : docData.pictures;
    
          // Save the document in the database
          await docData.save();
    
          // Prepare the response
          response.data = docData;
          response.status = true;
    
          return response;
        } catch (e) {
          throw e;
        }
      }

  //   static async list(query = {}) {
  //     const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
  //     let response = { data: [], extra: { ...$extra }, status: false };

  //     try {
  //       const search = {
  //         name: { $regex: new RegExp(query.name || ""), $options: "i" },
  //         slug: query.slug
  //           ? Array.isArray(query.slug)
  //             ? { $in: query.slug }
  //             : query.slug
  //           : "",

  //         isDeleted: false,
  //       };

  //       clearSearch(search);
  //       const $aggregate = [
  //         { $match: search },
  //         { $sort: { _id: -1 } },
  //         {
  //           $lookup: {
  //             from: "brands",
  //             localField: "brandId",
  //             foreignField: "_id",
  //             as: "brandDetails",

  //           },
  //         },
  //         {
  //           $unwind: "$brandDetails",
  //         },
  //         {
  //           $project: {
  //             _id: 1,
  //             status: 1,
  //             name: 1,
  //             slug: 1,
  //             brandDetails  :{
  //               name: 1,
  //               slug: 1,
  //               status: 1,
  //             }
  //           },
  //         },
  //       ];

  //       response = await paginationAggregate(productModel, $aggregate, $extra);

  //       response.status = true;
  //       return response;
  //     } catch (err) {
  //       throw err;
  //     }
  //   }

  //   static async delete(ids) {
  //     const response = { status: false, ids: [] };
  //     try {
  //       if (Array.isArray(ids)) {
  //         await productModel.updateMany({ _id: { $in: ids } }, { isDeleted: true });
  //       } else if (typeof ids === "string") {
  //         await productModel.updateOne({ _id: ids }, { isDeleted: true });
  //         response.id = ids;
  //       }

  //       response.status = true;
  //       response.ids = ids;

  //       return response;
  //     } catch (err) {
  //       throw err;
  //     }
  //   }
}

module.exports = productVarientService;
