const { Types } = require("mongoose");
const categoryModel = require("../models/category");
const { clearSearch } = require("../utilities/Helper");
const { paginationAggregate } = require("../utilities/pagination");

class CategoryService {
  static async save(data) {
    try {
      const response = { data: {}, status: false };
      let docData = data._id
        ? await categoryModel.findById(data._id)
        : new categoryModel();
      console.log(docData);
      docData.name = data.name;
      docData.slug = data.slug;
      docData.image = data.image || null;
      docData.status = data.status;

      if (data.parentId) {
        docData.parentId = data.parentId;
      }

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
        _id: query._id
          ? Array.isArray(query._id)
            ? { $in: query._id?.map((v) => Types.ObjectId(v)) }
            : Types.ObjectId(query._id)
          : "",
        parentId: query.parentId ? Types.ObjectId(query.parentId) : "",
        name: { $regex: new RegExp(query.key || ""), $options: "i" },
        slug: query.slug
          ? Array.isArray(query.slug)
            ? { $in: query.slug }
            : query.slug
          : "",

        isDeleted: false,
      };
      if (query.showOnlyParent) {
        console.log(query);
        search.parentId = { $exists: false };
      }
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
            parentId: 1,
            image: 1,
          },
        },
      ];

      response = await paginationAggregate(categoryModel, $aggregate, $extra);

      // if (query.showWithParent) {
      //   let res = [];
      //   console.log(response.data)
      //   for (const v of response.data) {
      //     if (v.parentId) {
      //       res.push([v.parentId, v._id]);
      //     } else {
      //       const categoryData = await categoryModel.findOne({
      //         parentId: v._id,
      //       });
      //       if (categoryData?._id && categoryData?.parentId) {
      //         res.push([categoryData.parentId, categoryData._id]);
      //       } else {
      //         res.push([v._id]);
      //       }
      //     }
      //   }
      //   response.data = res;
      // }

      response.status = true;
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async buildNestedStructure(parentId) {
    const search = {
      parentId: parentId ? Types.ObjectId(parentId) : "",
    };

    clearSearch(search);
    const children = await categoryModel.aggregate([
      {
        $match: search,
      },
    ]);
    const resolvedChildren = await Promise.all(
      children.map(async (child) => ({
        value: child._id,
        label: child.name,
        children: child.length
          ? await this.buildNestedStructure(child._id)
          : [],
      }))
    );

    return resolvedChildren;
  }

  static async listAllWithParentAndChild() {
    let response = { data: [], status: false };
    const topParents = await categoryModel.find({
      isDeleted: false,
      parentId: { $exists: false },
    });
    const result = await Promise.all(
      topParents.map(async (parent) => ({
        value: parent._id,
        label: parent.name,
        children: await this.buildNestedStructure(parent._id, true),
      }))
    );
    response.data = result;
    response.status = true;
    return response;
  } // admin

  static async delete(ids) {
    console.log(ids);
    const response = { status: false, ids: [] };
    try {
      // Check if ids are provided as an array or a single id
      const categoryIds = Array.isArray(ids) ? ids : [ids];

      // Soft delete the parent categories by setting isDeleted to true
      await categoryModel.updateMany(
        { _id: { $in: categoryIds } },
        { isDeleted: true }
      );

      // Find and soft delete child categories where parentId matches the deleted categories
      await categoryModel.updateMany(
        { parentId: { $in: categoryIds } },
        { isDeleted: true }
      );

      response.status = true;
      response.ids = categoryIds;
      return response;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = CategoryService;
