const { check } = require("express-validator");
const { formValidation } = require("../others");


const validations = {
    createSnippet: [
        check("title")
            .trim()
            .notEmpty().withMessage("Title is required"),

        check("category")
            .isIn(["React", "VanillaJS", "HTML", "CSS", "HTML/CSS", "DSA", "Other"])
            .withMessage("Invalid category"),

        check("subcategories")
            .optional()
            .isArray().withMessage("Subcategories should be an array")
            .custom((value, { req }) => {
                if (req.body.category === 'DSA') {
                    if (!value || value.length === 0) {
                        throw new Error("Subcategories must have at least one item if category is DSA.");
                    }
                } else if (value && value.length > 0) {
                    throw new Error("Subcategories should not be provided if category is not DSA.");
                }
                return true;
            }),

        formValidation,
    ]

};

module.exports = validations;
