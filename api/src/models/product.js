const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },

    productCode: {
      type: String,
      required: true,
    },

    // isAccessory: {
    //   type: Boolean,
    //   default: false,
    // },
    // hasVariants: {
    //   type: Boolean,
    //   default: false,
    // },

    // productVariant: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "productVariant",
    // },

    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "model",
    },

    categoryIds: [[{ type: mongoose.Schema.Types.ObjectId, ref: "category" }]],

    searchCategoryIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    }],

    // images: {
    //   type: String,
    // },

    // price: {
    //   type: String,
    // },

    // stock: {
    //   type: Number,
    // },

    description: {
      type: String,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);



productSchema.pre('save', function (next) {
    const doc = this;
    if (!doc.isModified('categoryIds')) {
        return next();
    }
  
    try {
        const flattenedIds = doc.categoryIds.reduce((acc, innerArray) => {
            innerArray.forEach(id => {
                acc.add(id.toString());
            });
            return acc;
        }, new Set());
        const uniqueIds = Array.from(flattenedIds);
        doc.searchCategoryIds = uniqueIds;
        return next();
    } catch (error) {
        return next(error)
    }
});

const productModel = mongoose.model("product", productSchema);
module.exports = productModel;
