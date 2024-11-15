const productModel = require("../models/product");
const { clearSearch } = require("../utilities/Helper");
const { paginationAggregate } = require("../utilities/pagination");

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

      const $aggregate = [
        { $match: search },
        { $sort: { _id: -1 } },

        // Uncommented model lookup
        {
          $lookup: {
            from: "models",
            localField: "modelId",
            foreignField: "_id",
            as: "modelDetails",
            pipeline: [
              {
                $project: {
                  name: 1,
                  brandId: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$modelDetails",
            preserveNullAndEmptyArrays: true, // Prevents loss of documents if no model is found
          },
        },

        // Uncommented brand lookup
        {
          $lookup: {
            from: "brands",
            localField: "modelDetails.brandId", // Ensure modelDetails.brandId is valid
            foreignField: "_id",
            as: "brandDetails",
            pipeline: [
              {
                $project: {
                  name: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$brandDetails",
            preserveNullAndEmptyArrays: true, // Prevents loss of documents if no brand is found
          },
        },

        // Adjusted project stage
        {
          $project: {
            modelName: "$modelDetails.name",
            brandName: "$brandDetails.name",
            name: 1,
            slug: 1,
            categoryIds: 1,
            productCode: 1,
            description: 1,
            status: 1,
            briefDescription: 1,
            modelId: 1,
          },
        },
      ];

      response = await paginationAggregate(productModel, $aggregate, $extra);
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
        isDeleted: false,
      };
      // if (query.category) {
      //   search["category.slug"] = query.category; // Add category slug to the filter
      // }
      // clearSearch(search);

      const $aggregate = [
        { $match: search },
        { $sort: { _id: -1 } },

        {
          $lookup: {
            from: "models",
            localField: "modelId",
            foreignField: "_id",
            as: "modelDetails",
            pipeline: [
              {
                $project: {
                  name: 1,
                  brandId: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$modelDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "brands",
            localField: "modelDetails.brandId",
            foreignField: "_id",
            as: "brandDetails",
            pipeline: [
              {
                $project: {
                  name: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$brandDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "categories",
            let: {
              categoryId: {
                $arrayElemAt: [{ $arrayElemAt: ["$categoryIds", 0] }, 0],
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$categoryId"],
                  },
                },
              },
              {
                $project: {
                  name: 1,
                  slug: 1,
                },
              },
            ],
            as: "category",
          },
        },

        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "productvarients",
            localField: "_id",
            foreignField: "productId",
            as: "productDetails",
            pipeline: [
              {
                $match: {
                  isDefault: true,
                  isDeleted: false,
                },
              },
              {
                $project: {
                  _id: 1,
                  price: 1,
                  // isDefault: 1,
                  thumbImage: 1,
                  inventory: 1,
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

        ...(query.category
          ? [
                {
                    $match: {
                        "category.slug": query.category,
                    },
                },
            ]
          : []),


        {
          $project: {
            modelName: "$modelDetails.name",
            brandName: "$brandDetails.name",
            name: 1,
            slug: 1,
            productCode: 1,
            status: 1,
            briefDescription: 1,
            category: 1,
            thumbImage: "$productDetails.thumbImage",
            price: "$productDetails.price",
            discountPrice: "$productDetails.discountPrice",
            inventory: "$productDetails.inventory",
          },
        },
      ];

      response = await paginationAggregate(productModel, $aggregate, $extra);
      response.status = true;
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async productDetails(query) {
    let response = { status: false, data: [] };
    const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
    try {
      let search = {
        slug: query.slug,
        isDeleted: false,
      };      


      const $aggregate = [
        { $match: search },
        { $sort: { _id: -1 } },
        {
          $lookup: {
            from: "models",
            localField: "modelId",
            foreignField: "_id",
            as: "modelDetails",
            pipeline: [
              {
                $project: {
                  name: 1,
                  brandId: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$modelDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "brands",
            localField: "modelDetails.brandId",
            foreignField: "_id",
            as: "brandDetails",
            pipeline: [
              {
                $project: {
                  name: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$brandDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "categories",
            let: {
              categoryId: {
                $arrayElemAt: [{ $arrayElemAt: ["$categoryIds", 0] }, 0],
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$categoryId"],
                  },
                },
              },
              {
                $project: {
                  name: 1,
                  slug: 1,
                },
              },
            ],
            as: "category",
          },
        },

        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "productvarients",
            localField: "_id",
            foreignField: "productId",
            as: "productDetails",
            pipeline: [
              {
                $match: {
                  isDeleted: false,
                },
              },
             
            ],
          },
        },

        // {
        //   $unwind: {
        //     path: "$productDetails",
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },

        {
          $project: {
            modelName: "$modelDetails.name",
            brandName: "$brandDetails.name",
            name: 1,
            slug: 1,
            productCode: 1,
            status: 1,
            briefDescription: 1,
            description :1,
            category: 1,
            productDetails :1
          },
        },
      ];
      response = await paginationAggregate(productModel, $aggregate, $extra);


      response.status = true;
      return response;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = productService;
