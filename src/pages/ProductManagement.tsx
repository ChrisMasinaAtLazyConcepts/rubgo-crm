import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Search, Filter, Package } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import Header from '../components/Header';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-[#B84037]  text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-white/90 mt-1">Manage your product catalog</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by name or SKU..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-bold transition">
                <Filter size={18} />
                Filter
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg font-bold transition">
                <Plus size={18} />
                Add Product
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Product</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">SKU</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Price</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <Package className="mx-auto text-gray-300 mb-3" size={48} />
                      <p className="text-gray-600">No products found</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.brand}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 font-mono">{product.sku}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">-</td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-gray-900">R{product.base_price}</p>
                          {product.sale_price && (
                            <p className="text-sm text-red-600 font-bold">Sale: R{product.sale_price}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          product.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {product.is_featured && (
                          <span className="ml-2 inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Edit size={18} />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> of <span className="font-bold text-gray-900">{products.length}</span> products
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-bold">
              Previous
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-bold">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
