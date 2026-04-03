const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Property = require('./models/Property');

const sampleProperties = [
  {
    title: 'Skyline Penthouse',
    address: '1 Tower Bridge Rd',
    city: 'London',
    price: 2500000,
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    type: 'penthouse',
    description: 'Breathtaking panoramic views of the city skyline. Floor-to-ceiling windows, private rooftop terrace, and concierge services.',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    tags: ['luxury', 'rooftop', 'city-view', 'concierge'],
  },
  {
    title: 'Sunridge Family Home',
    address: '47 Maple Grove',
    city: 'Manchester',
    price: 485000,
    bedrooms: 5,
    bathrooms: 3,
    area: 2800,
    type: 'house',
    description: 'Spacious detached family home with large garden, double garage, and modern open-plan kitchen.',
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    tags: ['family', 'garden', 'garage', 'quiet-street'],
  },
  {
    title: 'The Glass Apartment',
    address: '22 Canal Street',
    city: 'Birmingham',
    price: 320000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1050,
    type: 'apartment',
    description: 'Contemporary waterfront apartment with exposed concrete, designer finishes, and private balcony overlooking the canal.',
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    tags: ['waterfront', 'modern', 'balcony', 'parking'],
  },
  {
    title: 'Cobblestone Cottage',
    address: '8 Mill Lane',
    city: 'Edinburgh',
    price: 275000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1400,
    type: 'house',
    description: 'Charming stone cottage in the heart of the Old Town. Original features throughout with sympathetic modern updates.',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    tags: ['character', 'old-town', 'stone', 'fireplace'],
  },
  {
    title: 'Marina Studio',
    address: '5 Harbour View',
    city: 'Bristol',
    price: 195000,
    bedrooms: 0,
    bathrooms: 1,
    area: 520,
    type: 'studio',
    description: 'Smart studio apartment in the vibrant Harbourside area. Perfect for first-time buyers or investors. Fully furnished.',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    tags: ['investment', 'harbourside', 'furnished', 'first-time-buyer'],
  },
  {
    title: 'Tuscany Villa',
    address: '99 Golden Gate Drive',
    city: 'London',
    price: 1850000,
    bedrooms: 6,
    bathrooms: 5,
    area: 5500,
    type: 'villa',
    description: 'Mediterranean-inspired villa with heated pool, wine cellar, cinema room and landscaped gardens. Gated estate.',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    tags: ['pool', 'gated', 'luxury', 'garden', 'cinema'],
  },
  {
    title: 'Northside Flat',
    address: '33 Park Road',
    city: 'Leeds',
    price: 160000,
    bedrooms: 1,
    bathrooms: 1,
    area: 640,
    type: 'apartment',
    description: 'Well-presented first-floor flat near the city centre. Bright open-plan lounge/kitchen and private parking.',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    tags: ['first-floor', 'parking', 'city-centre'],
  },
  {
    title: 'The Botanist',
    address: '14 Green Quarter',
    city: 'Manchester',
    price: 425000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1750,
    type: 'apartment',
    description: 'Award-winning eco development with green roofs, biophilic design, and residents\' rooftop garden. A-rated energy efficiency.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    tags: ['eco', 'sustainable', 'rooftop-garden', 'modern'],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('Cleared existing users and properties');

    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123', 
    });
    console.log(' Seed user created');

    await Property.insertMany(sampleProperties);
    console.log(`Seeded ${sampleProperties.length} properties`);

    await mongoose.disconnect();
    console.log('Done! Database disconnected.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDB();