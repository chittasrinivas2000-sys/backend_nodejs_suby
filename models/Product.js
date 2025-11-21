const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    enum: ["veg", "non-veg"],
    required: true,
  },

  image: {
    type: String,
  },

  bestSeller: {
    type: Boolean,
    default: false,
  },

  description: {
    type: String,
  },

  firm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Firm",
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
