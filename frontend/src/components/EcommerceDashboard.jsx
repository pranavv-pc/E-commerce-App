import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  User, 
  LogOut, 
  Sparkles, 
  Star, 
  Eye, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Package, 
  CreditCard, 
  Award, 
  SlidersHorizontal,
  ArrowRight,
  Tag,
  Check,
  Percent
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export default function EcommerceDashboard({ user, onLogout }) {
  // Products & filter states
  const [products] = useState(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'low-high' | 'high-low' | 'rating'

  // Cart & Wishlist state
  const [cart, setCart] = useState([
    { ...MOCK_PRODUCTS[0], quantity: 1 }
  ]);
  const [wishlist, setWishlist] = useState(['prod-2']);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  // Checkout modal
  const [isCheckoutSuccessOpen, setIsCheckoutSuccessOpen] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Categories
  const categories = ['All', 'Audio', 'Smartwatches', 'Fashion', 'Electronics', 'Home Living'];

  // Wishlist toggle
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      showToast('Removed from your wishlist.');
    } else {
      setWishlist([...wishlist, productId]);
      showToast('Added to your wishlist!');
    }
  };

  // Add to cart
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
    showToast(`Added "${product.name.slice(0, 24)}..." to cart.`);
  };

  // Cart quantity controls
  const updateQuantity = (id, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
    showToast('Item removed from cart.');
  };

  // Apply promo code
  const handleApplyPromo = (e) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'LUXE20' || clean === 'WELCOME20') {
      setDiscountPercent(20);
      setPromoMessage('20% VIP promotional discount applied!');
      showToast('Promo code applied: 20% OFF!');
    } else if (clean === 'SAVE10') {
      setDiscountPercent(10);
      setPromoMessage('10% discount applied!');
      showToast('Promo code applied: 10% OFF!');
    } else {
      setPromoMessage('Invalid promo code. Try LUXE20');
    }
  };

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Complete checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;
    setLastOrderDetails({
      orderId: `LUM-${Math.floor(100000 + Math.random() * 900000)}`,
      total: grandTotal,
      itemCount: totalCartCount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    setCart([]);
    setIsCartOpen(false);
    setIsCheckoutSuccessOpen(true);
  };

  return (
    <div style={styles.dashboardContainer}>
      
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <div style={styles.tickerBar}>
        <div style={styles.tickerContent}>
          <span style={styles.tickerBadge}>VIP EXCLUSIVE</span>
          <span>Complimentary Express Delivery on orders over $150 • Use coupon <strong>LUXE20</strong> for 20% off</span>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          
          {/* Brand Logo */}
          <div style={styles.brandGroup}>
            <div style={styles.logoBadge}>
              <ShoppingBag size={22} color="#ffffff" />
            </div>
            <div>
              <span style={styles.logoTitle}>LUMINA <span style={styles.logoAccent}>LUXE</span></span>
              <span style={styles.logoTagline}>PREMIUM COMMERCE</span>
            </div>
          </div>

          {/* Search Bar */}
          <div style={styles.searchBox}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search audio, watches, fashion, electronics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            {searchQuery && (
              <button style={styles.clearSearchBtn} onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Action Icons & Profile */}
          <div style={styles.headerActions}>
            
            {/* Wishlist Button */}
            <button 
              style={styles.iconButton} 
              title="Saved Wishlist"
              onClick={() => showToast(`You have ${wishlist.length} items in your wishlist.`)}
            >
              <Heart size={20} color={wishlist.length > 0 ? '#f43f5e' : '#94a3b8'} fill={wishlist.length > 0 ? '#f43f5e' : 'none'} />
              {wishlist.length > 0 && (
                <span style={styles.counterBadge}>{wishlist.length}</span>
              )}
            </button>

            {/* Cart Trigger Button */}
            <button 
              style={styles.cartButton}
              onClick={() => setIsCartOpen(true)}
              aria-label="View shopping cart"
            >
              <ShoppingBag size={20} color="#ffffff" />
              <span style={styles.cartBtnText}>Cart</span>
              <span style={styles.cartBadge}>{totalCartCount}</span>
            </button>

            {/* User Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                style={styles.profileBtn}
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                aria-expanded={isProfileMenuOpen}
              >
                <div style={styles.avatarCircle}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={styles.profileDetails}>
                  <span style={styles.profileName}>{user?.name || 'Guest User'}</span>
                  <span style={styles.profileRole}>{user?.role || 'VIP Member'}</span>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div style={styles.profileMenu} className="animate-scale-in">
                  <div style={styles.profileMenuHeader}>
                    <p style={styles.menuUserName}>{user?.name}</p>
                    <p style={styles.menuUserEmail}>{user?.email}</p>
                    <div style={styles.consentVerifiedPill}>
                      <ShieldCheck size={14} color="#10b981" />
                      <span>Consent Verified & Accepted</span>
                    </div>
                  </div>

                  <div style={styles.menuDivider}></div>

                  <div style={styles.menuItem}>
                    <Award size={16} color="#f59e0b" />
                    <span>Tier: <strong>{user?.role || 'VIP Member'}</strong></span>
                  </div>

                  <div style={styles.menuItem}>
                    <CreditCard size={16} color="#06b6d4" />
                    <span>Store Credit: <strong>$150.00</strong></span>
                  </div>

                  <div style={styles.menuDivider}></div>

                  <button 
                    style={styles.logoutBtn}
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* 3. WELCOME & QUICK METRICS BANNER */}
      <section style={styles.dashboardBanner}>
        <div style={styles.bannerGrid}>
          
          {/* Welcome Card */}
          <div style={styles.welcomeCard}>
            <div style={styles.welcomeBadge}>
              <Sparkles size={16} color="#f59e0b" />
              <span>AUTHENTICATED MEMBER SESSION</span>
            </div>
            <h2 style={styles.welcomeHeading}>
              Welcome back, <span style={styles.userNameHighlight}>{user?.name || 'Valued Member'}</span>
            </h2>
            <p style={styles.welcomeDesc}>
              Your statutory consent is on file. Explore bespoke collections, apply exclusive coupons, and enjoy same-day priority dispatch.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div style={styles.metricsWrapper}>
            <div style={styles.metricCard}>
              <div style={styles.metricIconBox}>
                <CreditCard size={20} color="#6366f1" />
              </div>
              <div>
                <span style={styles.metricLabel}>Member Balance</span>
                <p style={styles.metricValue}>$1,450.00</p>
              </div>
            </div>

            <div style={styles.metricCard}>
              <div style={styles.metricIconBox}>
                <Package size={20} color="#06b6d4" />
              </div>
              <div>
                <span style={styles.metricLabel}>Active Orders</span>
                <p style={styles.metricValue}>2 In Transit</p>
              </div>
            </div>

            <div style={styles.metricCard}>
              <div style={styles.metricIconBox}>
                <Award size={20} color="#f59e0b" />
              </div>
              <div>
                <span style={styles.metricLabel}>Reward Points</span>
                <p style={styles.metricValue}>1,850 pts</p>
              </div>
            </div>

            <div style={styles.metricCard}>
              <div style={styles.metricIconBox}>
                <ShieldCheck size={20} color="#10b981" />
              </div>
              <div>
                <span style={styles.metricLabel}>Consent Status</span>
                <p style={{ ...styles.metricValue, color: '#34d399', fontSize: '0.95rem' }}>Active & Verified</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. HERO PROMOTIONAL BANNER */}
      <section style={styles.heroPromo}>
        <div style={styles.heroPromoInner}>
          <div style={styles.heroPromoText}>
            <span style={styles.promoPill}>SPRING LUXURY DROPS</span>
            <h2 style={styles.heroPromoTitle}>Precision Engineering Meets Timeless Luxury</h2>
            <p style={styles.heroPromoSub}>
              Discover flagship audio instruments, biometric titanium watches, and handcrafted Tuscan leather essentials.
            </p>
            <div style={styles.promoActions}>
              <button 
                style={styles.heroCtaBtn}
                onClick={() => {
                  setSelectedCategory('Audio');
                  showToast('Filtered by Audio collection.');
                }}
              >
                <span>Shop Audio Flagships</span>
                <ArrowRight size={18} />
              </button>
              <div style={styles.codeSnippet}>
                <span>Use Code:</span>
                <code>LUXE20</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FILTER & SORT CONTROLS */}
      <section style={styles.catalogSection}>
        <div style={styles.filterBar}>
          
          {/* Category Tabs */}
          <div style={styles.categoryPills}>
            {categories.map(cat => (
              <button
                key={cat}
                style={{
                  ...styles.catPill,
                  ...(selectedCategory === cat ? styles.catPillActive : {})
                }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown & Product Counter */}
          <div style={styles.sortControls}>
            <span style={styles.productCount}>
              Showing <strong>{filteredProducts.length}</strong> products
            </span>
            <div style={styles.sortSelectWrapper}>
              <SlidersHorizontal size={15} color="#94a3b8" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={styles.sortSelect}
              >
                <option value="featured">Featured Curations</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>

        </div>

        {/* 6. PRODUCTS GRID */}
        {filteredProducts.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>No matching products found</p>
            <p style={styles.emptyDesc}>Try adjusting your search query or reset category filter.</p>
            <button 
              style={styles.resetBtn} 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={styles.productGrid}>
            {filteredProducts.map(product => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <div key={product.id} style={styles.productCard} className="animate-fade-in">
                  
                  {/* Image Container with Badges & Quick Action */}
                  <div style={styles.imageBox}>
                    <img src={product.image} alt={product.name} style={styles.productImg} />
                    
                    {/* Badge */}
                    <span style={styles.productTag}>{product.tag}</span>

                    {/* Wishlist button */}
                    <button 
                      style={{
                        ...styles.wishlistBtn,
                        ...(isWishlisted ? styles.wishlistBtnActive : {})
                      }}
                      onClick={() => toggleWishlist(product.id)}
                      aria-label="Toggle wishlist"
                    >
                      <Heart 
                        size={18} 
                        color={isWishlisted ? '#f43f5e' : '#ffffff'} 
                        fill={isWishlisted ? '#f43f5e' : 'none'} 
                      />
                    </button>

                    {/* Quick View Button */}
                    <button 
                      style={styles.quickViewBtn}
                      onClick={() => setQuickViewProduct(product)}
                    >
                      <Eye size={16} />
                      <span>Quick View</span>
                    </button>
                  </div>

                  {/* Card Content */}
                  <div style={styles.cardDetails}>
                    <div style={styles.cardCategoryRow}>
                      <span style={styles.categoryTag}>{product.category}</span>
                      <div style={styles.ratingBadge}>
                        <Star size={13} color="#f59e0b" fill="#f59e0b" />
                        <span>{product.rating}</span>
                        <span style={styles.reviewCount}>({product.reviewsCount})</span>
                      </div>
                    </div>

                    <h3 style={styles.productTitle}>{product.name}</h3>
                    <p style={styles.productDesc}>{product.description.slice(0, 85)}...</p>

                    {/* Price and Add to Cart */}
                    <div style={styles.priceRow}>
                      <div style={styles.priceContainer}>
                        <span style={styles.currentPrice}>${product.price}</span>
                        {product.originalPrice && (
                          <span style={styles.originalPrice}>${product.originalPrice}</span>
                        )}
                      </div>

                      <button 
                        style={styles.addToCartBtn}
                        onClick={() => addToCart(product)}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <Plus size={16} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 7. SLIDE-OUT CART DRAWER */}
      {isCartOpen && (
        <div style={styles.cartOverlay} onClick={() => setIsCartOpen(false)}>
          <div 
            style={styles.cartDrawer} 
            onClick={(e) => e.stopPropagation()}
            className="animate-slide-in-right"
          >
            {/* Drawer Header */}
            <div style={styles.drawerHeader}>
              <div style={styles.drawerTitleRow}>
                <ShoppingBag size={22} color="#6366f1" />
                <h3 style={styles.drawerTitle}>Your Cart ({totalCartCount})</h3>
              </div>
              <button style={styles.drawerCloseBtn} onClick={() => setIsCartOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div style={styles.drawerItemList}>
              {cart.length === 0 ? (
                <div style={styles.emptyCartBox}>
                  <ShoppingBag size={48} color="#64748b" style={{ marginBottom: '1rem' }} />
                  <p style={{ fontWeight: 600, color: '#f8fafc' }}>Your shopping cart is empty</p>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
                    Browse our luxury collections and add your favorite items.
                  </p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={styles.cartItem}>
                    <img src={item.image} alt={item.name} style={styles.cartItemImg} />
                    <div style={styles.cartItemInfo}>
                      <h4 style={styles.cartItemTitle}>{item.name}</h4>
                      <span style={styles.cartItemPrice}>${item.price}</span>
                      
                      <div style={styles.quantityRow}>
                        <div style={styles.qtyControls}>
                          <button 
                            style={styles.qtyBtn} 
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span style={styles.qtyValue}>{item.quantity}</span>
                          <button 
                            style={styles.qtyBtn} 
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button 
                          style={styles.removeBtn} 
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Promo code & Total Summary Footer */}
            {cart.length > 0 && (
              <div style={styles.drawerFooter}>
                
                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} style={styles.promoForm}>
                  <div style={styles.promoInputWrapper}>
                    <Tag size={16} color="#94a3b8" />
                    <input 
                      type="text" 
                      placeholder="Promo code (try LUXE20)" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      style={styles.promoInput}
                    />
                  </div>
                  <button type="submit" style={styles.applyBtn}>Apply</button>
                </form>

                {promoMessage && (
                  <p style={{
                    ...styles.promoFeedback,
                    color: discountPercent > 0 ? '#34d399' : '#f87171'
                  }}>
                    {promoMessage}
                  </p>
                )}

                {/* Totals */}
                <div style={styles.summaryBreakdown}>
                  <div style={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {discountPercent > 0 && (
                    <div style={{ ...styles.summaryRow, color: '#34d399' }}>
                      <span>VIP Discount ({discountPercent}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div style={styles.summaryRow}>
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>

                  <div style={styles.divider}></div>

                  <div style={styles.totalRow}>
                    <span>Total Due</span>
                    <span style={styles.totalAmount}>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button 
                  style={styles.checkoutBtn}
                  onClick={handleCheckout}
                >
                  <span>Proceed to Instant Checkout</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 8. QUICK VIEW PRODUCT MODAL */}
      {quickViewProduct && (
        <div style={styles.modalOverlay} onClick={() => setQuickViewProduct(null)}>
          <div style={styles.quickModal} onClick={(e) => e.stopPropagation()} className="animate-scale-in">
            <button style={styles.modalCloseBtn} onClick={() => setQuickViewProduct(null)}>
              <X size={20} />
            </button>

            <div style={styles.quickModalGrid}>
              <div style={styles.quickModalImageWrapper}>
                <img src={quickViewProduct.image} alt={quickViewProduct.name} style={styles.quickModalImg} />
                <span style={styles.quickModalTag}>{quickViewProduct.tag}</span>
              </div>

              <div style={styles.quickModalDetails}>
                <span style={styles.categoryTag}>{quickViewProduct.category}</span>
                <h3 style={styles.quickModalTitle}>{quickViewProduct.name}</h3>
                
                <div style={styles.ratingBadge}>
                  <Star size={14} color="#f59e0b" fill="#f59e0b" />
                  <span>{quickViewProduct.rating}</span>
                  <span style={styles.reviewCount}>({quickViewProduct.reviewsCount} verified customer reviews)</span>
                </div>

                <div style={styles.quickModalPriceRow}>
                  <span style={styles.modalCurrentPrice}>${quickViewProduct.price}</span>
                  {quickViewProduct.originalPrice && (
                    <span style={styles.modalOriginalPrice}>${quickViewProduct.originalPrice}</span>
                  )}
                  <span style={styles.inStockBadge}>In Stock & Ready to Ship</span>
                </div>

                <p style={styles.quickModalDesc}>{quickViewProduct.description}</p>

                {quickViewProduct.features && (
                  <div style={styles.featuresList}>
                    {quickViewProduct.features.map((feat, idx) => (
                      <div key={idx} style={styles.featureItem}>
                        <Check size={14} color="#10b981" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={styles.quickModalActions}>
                  <button 
                    style={styles.modalAddToCartBtn}
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                  >
                    <ShoppingBag size={18} />
                    <span>Add to Shopping Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. ORDER CONFIRMATION MODAL */}
      {isCheckoutSuccessOpen && lastOrderDetails && (
        <div style={styles.modalOverlay} onClick={() => setIsCheckoutSuccessOpen(false)}>
          <div style={styles.orderSuccessModal} onClick={(e) => e.stopPropagation()} className="animate-scale-in">
            <div style={styles.orderSuccessIcon}>
              <CheckCircle2 size={44} color="#10b981" />
            </div>

            <h3 style={styles.orderSuccessTitle}>Order Successfully Placed!</h3>
            <p style={styles.orderSuccessSub}>
              Thank you for shopping at LUMINA LUXE. Your simulated order has been registered and is being processed.
            </p>

            <div style={styles.receiptBox}>
              <div style={styles.receiptRow}>
                <span>Order Reference:</span>
                <strong>{lastOrderDetails.orderId}</strong>
              </div>
              <div style={styles.receiptRow}>
                <span>Total Settled:</span>
                <strong style={{ color: '#34d399' }}>${lastOrderDetails.total.toFixed(2)}</strong>
              </div>
              <div style={styles.receiptRow}>
                <span>Items Count:</span>
                <span>{lastOrderDetails.itemCount} items</span>
              </div>
              <div style={styles.receiptRow}>
                <span>Order Date:</span>
                <span>{lastOrderDetails.date}</span>
              </div>
              <div style={styles.receiptRow}>
                <span>Consent Record:</span>
                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} /> Stored on File
                </span>
              </div>
            </div>

            <button 
              style={styles.continueShopBtn}
              onClick={() => setIsCheckoutSuccessOpen(false)}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* 10. FLOATING TOAST NOTIFICATION */}
      {toast && (
        <div style={styles.toast} className="animate-fade-in">
          <CheckCircle2 size={18} color="#34d399" />
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
}

const styles = {
  dashboardContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#090c15'
  },
  tickerBar: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderBottom: '1px solid rgba(99, 102, 241, 0.25)',
    padding: '0.45rem 1.5rem',
    textAlign: 'center',
    fontSize: '0.8rem',
    color: '#cbd5e1'
  },
  tickerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  tickerBadge: {
    backgroundColor: '#6366f1',
    color: '#ffffff',
    fontSize: '0.68rem',
    fontWeight: 800,
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.05em'
  },
  header: {
    backgroundColor: 'rgba(15, 20, 36, 0.9)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 50
  },
  headerInner: {
    maxWidth: '1360px',
    margin: '0 auto',
    padding: '0.85rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1.5rem'
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  logoBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
  },
  logoTitle: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#ffffff',
    letterSpacing: '-0.02em',
    lineHeight: 1
  },
  logoAccent: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  logoTagline: {
    display: 'block',
    fontSize: '0.62rem',
    fontWeight: 700,
    color: '#94a3b8',
    letterSpacing: '0.12em',
    marginTop: '2px'
  },
  searchBox: {
    flex: 1,
    maxWidth: '480px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 14, 25, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '0 1rem'
  },
  searchInput: {
    width: '100%',
    padding: '0.65rem 0.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#f8fafc',
    fontSize: '0.88rem'
  },
  clearSearchBtn: {
    color: '#94a3b8',
    padding: '4px'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  iconButton: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'all 0.2s'
  },
  counterBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: '#f43f5e',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 800,
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cartButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    backgroundColor: '#6366f1',
    color: '#ffffff',
    padding: '0.55rem 1.1rem',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '0.88rem',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
    transition: 'all 0.2s'
  },
  cartBtnText: {
    fontWeight: 700
  },
  cartBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    padding: '2px 7px',
    borderRadius: '8px',
    fontSize: '0.78rem',
    fontWeight: 800
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '0.35rem 0.65rem',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    cursor: 'pointer'
  },
  avatarCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#8b5cf6',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.88rem'
  },
  profileDetails: {
    textAlign: 'left',
    display: 'none',
    '@media (min-width: 768px)': {
      display: 'block'
    }
  },
  profileName: {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 700,
    color: '#f8fafc',
    lineHeight: 1.1
  },
  profileRole: {
    display: 'block',
    fontSize: '0.68rem',
    color: '#f59e0b',
    fontWeight: 600
  },
  profileMenu: {
    position: 'absolute',
    top: '110%',
    right: 0,
    width: '240px',
    backgroundColor: '#0f1424',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    padding: '0.85rem',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
    zIndex: 100
  },
  profileMenuHeader: {
    paddingBottom: '0.6rem'
  },
  menuUserName: {
    fontSize: '0.92rem',
    fontWeight: 700,
    color: '#f8fafc',
    margin: 0
  },
  menuUserEmail: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    margin: '2px 0 6px 0'
  },
  consentVerifiedPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.7rem',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#34d399',
    padding: '2px 8px',
    borderRadius: '6px',
    fontWeight: 600
  },
  menuDivider: {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    margin: '0.5rem 0'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.82rem',
    color: '#cbd5e1',
    padding: '0.45rem 0.25rem'
  },
  logoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '0.55rem',
    padding: '0.55rem',
    fontSize: '0.84rem',
    fontWeight: 600,
    color: '#f43f5e',
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderRadius: '8px',
    marginTop: '0.25rem'
  },
  dashboardBanner: {
    maxWidth: '1360px',
    margin: '1.5rem auto 0',
    padding: '0 1.5rem',
    width: '100%'
  },
  bannerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.25rem'
  },
  welcomeCard: {
    gridColumn: 'span 2',
    backgroundColor: 'rgba(18, 24, 40, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '20px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
  },
  welcomeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#fbbf24',
    letterSpacing: '0.05em',
    marginBottom: '0.4rem'
  },
  welcomeHeading: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: '#f8fafc',
    margin: '0 0 0.5rem 0'
  },
  userNameHighlight: {
    background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  welcomeDesc: {
    fontSize: '0.88rem',
    color: '#94a3b8',
    lineHeight: 1.5
  },
  metricsWrapper: {
    gridColumn: 'span 2',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.85rem'
  },
  metricCard: {
    backgroundColor: 'rgba(18, 24, 40, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem'
  },
  metricIconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  metricLabel: {
    fontSize: '0.74rem',
    color: '#94a3b8',
    display: 'block'
  },
  metricValue: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#f8fafc',
    margin: 0
  },
  heroPromo: {
    maxWidth: '1360px',
    margin: '1.5rem auto 0',
    padding: '0 1.5rem',
    width: '100%'
  },
  heroPromoInner: {
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(6, 182, 212, 0.2) 100%)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '24px',
    padding: '2.5rem 2rem',
    position: 'relative',
    overflow: 'hidden'
  },
  heroPromoText: {
    maxWidth: '650px'
  },
  promoPill: {
    display: 'inline-block',
    fontSize: '0.72rem',
    fontWeight: 800,
    color: '#a5b4fc',
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    padding: '4px 10px',
    borderRadius: '20px',
    letterSpacing: '0.08em',
    marginBottom: '0.75rem'
  },
  heroPromoTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#ffffff',
    lineHeight: 1.2,
    marginBottom: '0.75rem'
  },
  heroPromoSub: {
    fontSize: '0.95rem',
    color: '#cbd5e1',
    lineHeight: 1.5,
    marginBottom: '1.5rem'
  },
  promoActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  heroCtaBtn: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    padding: '0.75rem 1.4rem',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.25)'
  },
  codeSnippet: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.85rem',
    color: '#e2e8f0',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '0.55rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  catalogSection: {
    maxWidth: '1360px',
    margin: '2rem auto 4rem',
    padding: '0 1.5rem',
    width: '100%'
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1.25rem',
    marginBottom: '1.75rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '1.25rem'
  },
  categoryPills: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  catPill: {
    padding: '0.5rem 1.1rem',
    borderRadius: '10px',
    fontSize: '0.84rem',
    fontWeight: 600,
    color: '#94a3b8',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    transition: 'all 0.2s'
  },
  catPillActive: {
    backgroundColor: '#6366f1',
    color: '#ffffff',
    borderColor: '#6366f1',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
  },
  sortControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  productCount: {
    fontSize: '0.82rem',
    color: '#94a3b8'
  },
  sortSelectWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(18, 24, 40, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '0.4rem 0.8rem'
  },
  sortSelect: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#f8fafc',
    fontSize: '0.82rem',
    fontWeight: 600
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 1.5rem',
    backgroundColor: 'rgba(18, 24, 40, 0.5)',
    borderRadius: '18px',
    border: '1px dashed rgba(255, 255, 255, 0.1)'
  },
  emptyTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#f8fafc'
  },
  emptyDesc: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    marginTop: '4px'
  },
  resetBtn: {
    marginTop: '1.25rem',
    padding: '0.6rem 1.25rem',
    borderRadius: '10px',
    backgroundColor: '#6366f1',
    color: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: 600
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem'
  },
  productCard: {
    backgroundColor: 'rgba(18, 24, 40, 0.75)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '18px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    transition: 'transform 0.2s, border-color 0.2s'
  },
  imageBox: {
    position: 'relative',
    height: '240px',
    overflow: 'hidden',
    backgroundColor: '#0a0d17'
  },
  productImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease'
  },
  productTag: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(15, 20, 36, 0.85)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#f8fafc',
    fontSize: '0.68rem',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '6px'
  },
  wishlistBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: 'rgba(15, 20, 36, 0.85)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s'
  },
  wishlistBtnActive: {
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    borderColor: '#f43f5e'
  },
  quickViewBtn: {
    position: 'absolute',
    bottom: '12px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(15, 20, 36, 0.9)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#f8fafc',
    padding: '0.4rem 0.9rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
  },
  cardDetails: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  cardCategoryRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.45rem'
  },
  categoryTag: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#818cf8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  ratingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#f8fafc'
  },
  reviewCount: {
    color: '#64748b',
    fontWeight: 400,
    fontSize: '0.72rem'
  },
  productTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#f8fafc',
    margin: '0 0 0.35rem 0',
    lineHeight: 1.3
  },
  productDesc: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    lineHeight: 1.45,
    marginBottom: '1rem',
    flex: 1
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '0.85rem'
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem'
  },
  currentPrice: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#ffffff'
  },
  originalPrice: {
    fontSize: '0.85rem',
    color: '#64748b',
    textDecoration: 'line-through'
  },
  addToCartBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    backgroundColor: '#6366f1',
    color: '#ffffff',
    padding: '0.48rem 0.95rem',
    borderRadius: '10px',
    fontSize: '0.82rem',
    fontWeight: 700,
    transition: 'all 0.15s'
  },
  cartOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(5, 8, 16, 0.75)',
    backdropFilter: 'blur(6px)',
    zIndex: 100,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  cartDrawer: {
    width: '100%',
    maxWidth: '440px',
    height: '100%',
    backgroundColor: '#0f1424',
    borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
    display: 'flex',
    flexDirection: 'column'
  },
  drawerHeader: {
    padding: '1.25rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  drawerTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem'
  },
  drawerTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#f8fafc',
    margin: 0
  },
  drawerCloseBtn: {
    color: '#94a3b8',
    padding: '4px'
  },
  drawerItemList: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  emptyCartBox: {
    textAlign: 'center',
    padding: '3rem 1rem'
  },
  cartItem: {
    display: 'flex',
    gap: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '14px',
    padding: '0.75rem'
  },
  cartItemImg: {
    width: '70px',
    height: '70px',
    borderRadius: '10px',
    objectFit: 'cover'
  },
  cartItemInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  cartItemTitle: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#f8fafc',
    margin: 0,
    lineHeight: 1.3
  },
  cartItemPrice: {
    fontSize: '0.88rem',
    fontWeight: 700,
    color: '#818cf8',
    marginTop: '2px'
  },
  quantityRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: '0.4rem'
  },
  qtyControls: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  qtyBtn: {
    padding: '4px 8px',
    color: '#94a3b8'
  },
  qtyValue: {
    fontSize: '0.8rem',
    fontWeight: 700,
    padding: '0 6px',
    color: '#f8fafc'
  },
  removeBtn: {
    color: '#f43f5e',
    padding: '4px'
  },
  drawerFooter: {
    padding: '1.25rem 1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(10, 14, 25, 0.95)'
  },
  promoForm: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.4rem'
  },
  promoInputWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '0 0.75rem'
  },
  promoInput: {
    width: '100%',
    padding: '0.55rem 0',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#f8fafc',
    fontSize: '0.82rem'
  },
  applyBtn: {
    padding: '0.55rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#f8fafc',
    borderRadius: '10px',
    fontSize: '0.82rem',
    fontWeight: 600
  },
  promoFeedback: {
    fontSize: '0.74rem',
    margin: '0 0 0.75rem 0'
  },
  summaryBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
    margin: '0.85rem 0 1.25rem 0'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.84rem',
    color: '#94a3b8'
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    margin: '0.4rem 0'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1rem',
    fontWeight: 800,
    color: '#ffffff'
  },
  totalAmount: {
    fontSize: '1.25rem',
    color: '#34d399'
  },
  checkoutBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
    color: '#ffffff',
    padding: '0.85rem',
    borderRadius: '12px',
    fontSize: '0.92rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)'
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(5, 8, 16, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 110,
    padding: '1.5rem'
  },
  quickModal: {
    backgroundColor: '#0f1424',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '820px',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
    position: 'relative',
    overflow: 'hidden'
  },
  modalCloseBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    color: '#94a3b8',
    padding: '6px',
    zIndex: 10
  },
  quickModalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
  },
  quickModalImageWrapper: {
    position: 'relative',
    height: '380px',
    backgroundColor: '#0a0d17'
  },
  quickModalImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  quickModalTag: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    backgroundColor: 'rgba(15, 20, 36, 0.85)',
    color: '#fff',
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '3px 9px',
    borderRadius: '6px'
  },
  quickModalDetails: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column'
  },
  quickModalTitle: {
    fontSize: '1.35rem',
    fontWeight: 800,
    color: '#f8fafc',
    margin: '0.35rem 0 0.5rem 0'
  },
  quickModalPriceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    margin: '0.85rem 0'
  },
  modalCurrentPrice: {
    fontSize: '1.45rem',
    fontWeight: 800,
    color: '#ffffff'
  },
  modalOriginalPrice: {
    fontSize: '0.95rem',
    color: '#64748b',
    textDecoration: 'line-through'
  },
  inStockBadge: {
    fontSize: '0.72rem',
    color: '#34d399',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    padding: '2px 8px',
    borderRadius: '6px',
    fontWeight: 600
  },
  quickModalDesc: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    lineHeight: 1.5,
    marginBottom: '1.25rem'
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
    marginBottom: '1.5rem'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.82rem',
    color: '#cbd5e1'
  },
  quickModalActions: {
    marginTop: 'auto'
  },
  modalAddToCartBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#ffffff',
    padding: '0.85rem',
    borderRadius: '12px',
    fontSize: '0.92rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 18px rgba(99, 102, 241, 0.4)'
  },
  orderSuccessModal: {
    backgroundColor: '#0f1424',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '460px',
    padding: '2.25rem 2rem',
    textAlign: 'center',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
  },
  orderSuccessIcon: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.25rem'
  },
  orderSuccessTitle: {
    fontSize: '1.35rem',
    fontWeight: 800,
    color: '#f8fafc',
    margin: '0 0 0.5rem 0'
  },
  orderSuccessSub: {
    fontSize: '0.84rem',
    color: '#94a3b8',
    lineHeight: 1.5,
    marginBottom: '1.5rem'
  },
  receiptBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    marginBottom: '1.5rem',
    textAlign: 'left'
  },
  receiptRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.84rem',
    color: '#cbd5e1'
  },
  continueShopBtn: {
    width: '100%',
    backgroundColor: '#6366f1',
    color: '#ffffff',
    padding: '0.8rem',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: 700
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: 'rgba(15, 20, 36, 0.95)',
    border: '1px solid rgba(16, 185, 129, 0.4)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '0.8rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.86rem',
    fontWeight: 600,
    color: '#f8fafc',
    zIndex: 200
  }
};
