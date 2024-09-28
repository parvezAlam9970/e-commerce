const brandModel = require("../models/brand");
const { clearSearch } = require("../utilities/Helper");
const { paginationAggregate } = require("../utilities/pagination");

class BrandService {
  static async save(data) {
    try {
      const response = { data: {}, status: false };
      let docData = data._id
        ? await brandModel.findById(data._id)
        : new brandModel();
        
      docData.name = data.name;
      docData.slug = data.slug;
      docData.status = data.status;

      await docData.save();

      response.status = docData;
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
        {
          $project: {
            _id: 1,
            status: 1,
            name: 1,
            slug: 1,
          },
        },
      ];

      response = await paginationAggregate(brandModel, $aggregate, $extra);

      response.status = true;
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async delete(ids) {
    const response = { status: false, ids: [] };
    try {
      if (Array.isArray(ids)) {
        await brandModel.updateMany({ _id: { $in: ids } }, { isDeleted: true });
      } else if (typeof ids === "string") {
        await brandModel.updateOne({ _id: ids }, { isDeleted: true });
        response.id = ids;
      }

      response.status = true;
      response.ids = ids;

      return response;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = BrandService;
