import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, Category } from '../lib/supabase';

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      if (data) setCategories(data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-[#B84037]  bg-clip-text text-transparent">
            Shop By Category
          </h2>
          <p className="text-gray-600 text-lg">
            Explore our curated collections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/${category.slug}`}
              className="group relative h-[400px] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-3xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-gray-200 mb-4">{category.description}</p>
                <div className="flex items-center text-white font-bold group-hover:text-orange-400 transition">
                  <span>Shop Now</span>
                  <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={20} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
