const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    area: {
      type: Number, // sq ft
      required: true,
    },
    type: {
      type: String,
      enum: ['apartment', 'house', 'villa', 'studio', 'penthouse'],
      default: 'apartment',
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Property', propertySchema);
