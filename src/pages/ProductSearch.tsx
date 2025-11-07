import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Filter, X, Star, ShoppingBag, Heart, Grid, List, SlidersHorizontal } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface ProductWithImage extends Product {
  image_url: string;
  sizes: any[];
}

const ProductSearch: React.FC = () => {
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Categories and filters
  const categories = ['All', 'T-Shirts', 'Jeans', 'Dresses', 'Jackets', 'Activewear', 'Accessories', 'Shoes'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const brands = ['Nike', 'Adidas', 'Zara', 'H&M', 'Gucci', 'Prada'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, searchTerm, sortBy, priceRange, selectedCategory, selectedSizes, selectedBrands]);

  async function fetchProducts() {
    try {
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      if (productsData && productsData.length > 0) {
        const productIds = productsData.map(p => p.id);
        const { data: imagesData } = await supabase
          .from('product_images')
          .select('*')
          .in('product_id', productIds)
          .eq('is_primary', true);

        const productsWithImages = productsData.map(product => {
          const image = imagesData?.find(img => img.product_id === product.id);
          return {
            ...product,
            image_url: image?.image_url || 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
            sizes: product.sizes || [] // Ensure sizes array exists
          };
        });

        setProducts(productsWithImages);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  function applyFiltersAndSort() {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = product.sale_price || product.base_price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => 
        product.sizes && product.sizes.some((size: string) => selectedSizes.includes(size))
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        product.brand && selectedBrands.includes(product.brand)
      );
    }

    // Sort results
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.sale_price || a.base_price) - (b.sale_price || b.base_price));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.sale_price || b.base_price) - (a.sale_price || a.base_price));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    setFilteredProducts(filtered);
  }

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedSizes([]);
    setSelectedBrands([]);
    setPriceRange([0, 5000]);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-[#B84037]  text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Our Products</h1>
            <p className="text-xl text-white/90 mb-8">Find exactly what you're looking for</p>
          </motion.div>
        </div>
      </div>

      {/* Large Search Bar Section */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={28} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products, brands, categories, or descriptions..."
                className="w-full pl-20 pr-6 py-5 text-lg rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all duration-200 shadow-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={24} />
                </button>
              )}
            </div>
            
            {/* Quick Search Suggestions */}
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              <span className="text-sm text-gray-600">Quick search:</span>
              {['T-Shirts', 'Jeans', 'Dresses', 'Shoes', 'Accessories', 'Sale'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setSearchTerm(suggestion)}
                  className="text-sm bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700 px-3 py-1 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-2xl shadow-lg sticky top-24"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Filter className="mr-2" size={20} />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Categories</label>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category.toLowerCase())}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                          selectedCategory === category.toLowerCase()
                            ? 'bg-orange-100 text-orange-700 font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Price Range - R{priceRange[1]}
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-orange-600"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>R0</span>
                      <span className="font-bold text-orange-600">R{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`w-12 h-12 border-2 rounded-lg font-medium transition-all ${
                          selectedSizes.includes(size)
                            ? 'border-orange-600 bg-orange-600 text-white'
                            : 'border-gray-300 text-gray-700 hover:border-orange-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Brands</label>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <label key={brand} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                        />
                        <span className="text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </aside>

          {/* Products Section */}
          <div className="flex-1">
            {/* Controls Bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4"
            >
              <div className="flex items-center gap-4">
                <p className="text-gray-600">
                  <span className="font-bold text-gray-900">{filteredProducts.length}</span> products found
                </p>
                {(searchTerm || selectedCategory !== 'all' || selectedSizes.length > 0 || selectedBrands.length > 0 || priceRange[1] < 5000) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition ${
                      viewMode === 'grid' 
                        ? 'bg-orange-600 text-white' 
                        : 'text-gray-600 hover:text-orange-600'
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition ${
                      viewMode === 'list' 
                        ? 'bg-orange-600 text-white' 
                        : 'text-gray-600 hover:text-orange-600'
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 bg-white"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="rating">Highest Rated</option>
                </select>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition"
                >
                  <SlidersHorizontal size={18} />
                  Filters
                </button>
              </div>
            </motion.div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : (
              <motion.div
                layout
                className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.base_price}
                    salePrice={product.sale_price}
                    imageUrl={product.image_url}
                    slug={product.slug}
                    isFeatured={product.is_featured}
                  />
                ))}
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                  <Search className="mx-auto text-gray-300 mb-4" size={64} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                  <button
                    onClick={clearFilters}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default ProductSearch;