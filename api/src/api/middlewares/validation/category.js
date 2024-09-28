const { check } = require("express-validator");
const { formValidation } = require("../others");
const categoryService = require('../../../services/category');
const categoryModel = require("../../../models/category");

const validations = {
    categoryValidation: [
        check("name")
            .trim()
            .notEmpty().withMessage("Name is required"),

        check("slug")
            .trim()
            .notEmpty().withMessage("Slug is required")
            .isSlug().withMessage("Provide a valid slug")
            .custom(async (value, { req }) => {
                const data = await categoryModel.findOne({ slug: value, parentId: req.body.parentId, isDeleted: false });
                if (data?._id && data?._id.toString() !== req.body?._id) {
                    throw new Error("A category already exits with this slug");
                }
            }),
        formValidation,
    ]
};

module.exports = validations;
