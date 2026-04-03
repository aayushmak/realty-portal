const express = require('express');
const router = express.Router();
const Favourite = require('../models/Favourite');
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/favourites 
router.get('/', async (req, res, next) => {
  try {
    const favourites = await Favourite.find({ user: req.user._id })
      .populate('property')
      .sort({ createdAt: -1 });

    // Filter out any orphaned favourites where property was deleted
    const valid = favourites.filter((f) => f.property !== null);

    res.json({
      success: true,
      count: valid.length,
      favourites: valid,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/favourites/:propertyId
router.post('/:propertyId', async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    // Check property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    // Try to create, unique index prevents duplicates
    const favourite = await Favourite.create({
      user: req.user._id,
      property: propertyId,
    });

    await favourite.populate('property');

    res.status(201).json({
      success: true,
      message: `"${property.title}" added to favourites!`,
      favourite,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This property is already in your favourites.',
      });
    }
    next(error);
  }
});

// DELETE /api/favourites/:propertyId 
router.delete('/:propertyId', async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const favourite = await Favourite.findOneAndDelete({
      user: req.user._id,
      property: propertyId,
    });

    if (!favourite) {
      return res.status(404).json({
        success: false,
        message: 'This property is not in your favourites.',
      });
    }

    res.json({
      success: true,
      message: 'Property removed from favourites.',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/favourites/check/:propertyId 
router.get('/check/:propertyId', async (req, res, next) => {
  try {
    const favourite = await Favourite.findOne({
      user: req.user._id,
      property: req.params.propertyId,
    });

    res.json({ success: true, isFavourited: !!favourite });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
