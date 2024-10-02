const productModel = require("../models/product");
const { clearSearch } = require("../utilities/Helper");
const { paginationAggregate } = require('../utilities/pagination');



class productService {
  static async save(data) {
    try {
      const response = { data: {}, status: false };
      let docData = data._id
        ? await productModel.findById(data._id)
        : new productModel();
      docData.name = data.name;
      docData.slug = data.slug;
      docData.description = data.description;
      docData.categoryIds = data.categoryIds;
      docData.modelId = data.modelId;
      docData.briefDescription = data.briefDescription;

      docData.productCode = data.productCode;

      docData.status = data.status ?? docData?.status;

      await docData.save();

      response.status = true;

      return response;
    } catch (e) {
      throw e;
    }
  }

    static async list(query = {}) {
      const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
      let response = { data: [], extra: { ...$extra }, status: false };

      try {
        const search = {
          name: { $regex: new RegExp(query.name || ""), $options: "i" },
          slug: query.slug
            ? Array.isArray(query.slug)
              ? { $in: query.slug }
              : query.slug
            : "",

          isDeleted: false,
        };

        clearSearch(search);
        // console
        const $aggregate = [
          { $match: search },
          { $sort: { _id: -1 } },
          {
            $lookup: {
              from: "models",
              localField: "modelId",
              foreignField: "_id",
              as: "modelDetails",

              

            },
          },
          {
            $unwind: "$modelDetails",
          },

          {
            $lookup: {
              from: "brands", 
              localField: "modelDetails.brandId", 
              foreignField: "_id",    
              as: "brandDetails"      
            },
          },

          {
            $unwind: "$brandDetails",  
          },

          {
            // Flatten the nested array of categoryIds (since it's stored as [[<id>]])
            $unwind: "$categoryIds"   // This will flatten one level of the array
          },
          {
            $unwind: "$categoryIds"   // Flatten it fully (if there are still nested arrays)
          },


          {
            $lookup: {
              from: "categories",             
              localField: "categoryIds",      
              foreignField: "_id",
              as: "categoryDetails"
            }
          },
          
          {
            $project: {
              "modelDetails._id": 1,
              "modelDetails.name": 1,

              "modelDetails.slug": 1,

              brandDetails: 1,
              categoryDetails: 1,    
              name  :1,
              slug  :1,
              productCode :1,
              description :1,
              status :1
         
            }
          }
        ];

        response = await paginationAggregate(productModel, $aggregate, $extra);
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

module.exports = productService;
