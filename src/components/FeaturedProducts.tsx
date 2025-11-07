import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { supabase, Product, ProductImage } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

type ProductWithImage = Product & { image_url: string };

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  async function fetchFeaturedProducts() {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(8);

      if (productsError) throw productsError;

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
            image_url: image?.image_url || 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800'
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

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-orange-600" size={48} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-[#B84037]  bg-clip-text text-transparent">
            Featured Collection
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Handpicked pieces that showcase the beauty and diversity of African fashion
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
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
        </div>

        <div className="text-center mt-12">
          <a
            href="/shop"
            className="inline-block bg-[#B84037]  hover:from-orange-700 hover:via-red-700 hover:to-amber-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
}
