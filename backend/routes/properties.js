const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Favourite = require('../models/Favourite');
const { protect } = require('../middleware/auth');

// GET /api/properties 
router.get('/', async (req, res, next) => {
  try {
    const { city, type, minPrice, maxPrice, search } = req.query;
    const filter = {};

    if (city) filter.city = { $regex: city, $options: 'i' };
    if (type) filter.type = type;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: properties.length, properties });
  } catch (error) {
    next(error);
  }
});

// GET /api/properties/:id 
router.get('/:id', async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }
    res.json({ success: true, property });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
