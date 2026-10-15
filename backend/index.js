import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Seed database for users
const users = [
  {
    id: 'usr_demo',
    name: 'Alex Vance',
    email: 'demo@store.com',
    password: 'password123',
    role: 'VIP Gold',
    consentAccepted: true,
    consentTimestamp: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
];

// Seed products
const products = [
  {
    id: 'prod-1',
    name: 'Aether Pro ANC Wireless Headphones',
    category: 'Audio',
    price: 289,
    originalPrice: 349,
    rating: 4.9,
    reviewsCount: 328,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    tag: 'Best Seller',
    description: 'Immersive spatial acoustics with active noise cancellation, transparency mode, and 48-hour battery longevity.',
    inStock: true
  },
  {
    id: 'prod-2',
    name: 'Vanguard Chrono Titanium Smartwatch',
    category: 'Smartwatches',
    price: 449,
    originalPrice: 499,
    rating: 4.8,
    reviewsCount: 215,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    tag: 'New Release',
    description: 'Grade 5 titanium casing, sapphire crystal display, continuous ECG and biometric tracking with 14-day battery.',
    inStock: true
  },
  {
    id: 'prod-3',
    name: 'Minimalist Italian Leather Weekender',
    category: 'Fashion',
    price: 320,
    originalPrice: 380,
    rating: 4.9,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    tag: 'Limited Edition',
    description: 'Full-grain Tuscan leather handcrafted for discerning travelers. Water-resistant liner and brass hardware.',
    inStock: true
  },
  {
    id: 'prod-4',
    name: 'CyberBlade OLED Mechanical Keyboard',
    category: 'Electronics',
    price: 195,
    originalPrice: 220,
    rating: 4.7,
    reviewsCount: 512,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    tag: 'Trending',
    description: 'Custom hot-swappable switches, CNC aluminum chassis, customizable micro-OLED status display.',
    inStock: true
  },
  {
    id: 'prod-5',
    name: 'Lumina Horizon Studio Sunglasses',
    category: 'Fashion',
    price: 180,
    originalPrice: 225,
    rating: 4.6,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    tag: '20% OFF',
    description: 'Polarized Zeiss optical lenses with lightweight Japanese acetate framework. 100% UV400 shield.',
    inStock: true
  },
  {
    id: 'prod-6',
    name: 'AcousticPure Hi-Fi Bookshelf Speakers',
    category: 'Audio',
    price: 520,
    originalPrice: 599,
    rating: 4.9,
    reviewsCount: 178,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    tag: 'Audiophile',
    description: 'Bi-amplified studio monitor pair with silk dome tweeters and carbon fiber woofers. Optical & Bluetooth 5.3.',
    inStock: true
  },
  {
    id: 'prod-7',
    name: 'Apex Precision Ergonomic Mouse',
    category: 'Electronics',
    price: 119,
    originalPrice: 139,
    rating: 4.8,
    reviewsCount: 420,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    tag: 'Popular',
    description: 'Electromagnetic MagSpeed scroll wheel, multi-device flow switching, 8000 DPI sensor on any glass surface.',
    inStock: true
  },
  {
    id: 'prod-8',
    name: 'NeoFit Ultrasonic Smart Diffuser',
    category: 'Home Living',
    price: 85,
    originalPrice: 110,
    rating: 4.7,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    tag: 'Home Essential',
    description: 'Ceramic matte housing with ambient LED mood ring, whisper-silent diffusion, and mobile app timer controls.',
    inStock: true
  }
];

// Auth Endpoints
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, consentAccepted, marketingConsent } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  // Mandatory Fake Consent Validation
  if (!consentAccepted) {
    return res.status(400).json({ 
      error: 'You must review and accept the Terms of Service & Privacy Consent Agreement to proceed.' 
    });
  }

  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ error: 'An account with this email already exists. Please sign in instead.' });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password, // Demo in-memory mock
    role: 'VIP Member',
    consentAccepted: true,
    marketingConsent: Boolean(marketingConsent),
    consentTimestamp: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  // Return safe user object (exclude password)
  const { password: _, ...userProfile } = newUser;
  return res.status(201).json({
    message: 'Account created successfully!',
    token: `jwt_mock_${newUser.id}`,
    user: userProfile
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password. Please try again.' });
  }

  const { password: _, ...userProfile } = user;
  return res.json({
    message: 'Authentication successful!',
    token: `jwt_mock_${user.id}`,
    user: userProfile
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.replace('Bearer ', '');
  const userId = token.replace('jwt_mock_', '');
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: 'Session expired' });
  }

  const { password: _, ...userProfile } = user;
  return res.json({ user: userProfile });
});

// Products Endpoint
app.get('/api/products', (req, res) => {
  return res.json({ products });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
