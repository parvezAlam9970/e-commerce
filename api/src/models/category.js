const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    parentId: { type: Schema.Types.ObjectId, ref: "category" },

    image: {
      type: String,
    },
    name: {
      type: String,
    },
    slug: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const categoryModel = model("category", categorySchema);
module.exports = categoryModel;
