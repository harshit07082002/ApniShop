const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product must have a name'],
      unique: true,
    },
    slug: {
      type: String,
    },
    avgRating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => {
        return Math.round(val * 10) / 10;
      },
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Product must have price'],
    },
    image: {
      type: String,
      required: [true, 'Product must have image'],
    },
    productType: {
      type: String,
      required: [true, 'Product must have a type'],
      enum: {
        values: ['Electronics', 'Shoes & Clothing', 'Groceries'],
        message: 'not a valid productType',
      },
    },
    warranty: {
      type: Number,
      default: 0,
    },
    features: [String],
    about: {
      type: String,
      required: [true, 'Add desc of the product'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
productSchema.index({ name: 'text', about: 'text' });
productSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
