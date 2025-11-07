import { Heart, ShoppingCart, Eye, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useCart } from './contexts/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  slug: string;
  isFeatured?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  id, 
  name, 
  price, 
  salePrice, 
  imageUrl, 
  slug, 
  isFeatured 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { dispatch } = useCart();

  const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  const addToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id,
        name,
        price,
        salePrice,
        imageUrl,
        quantity: 1
      }
    });
  };

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={imageUrl}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />

        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{discount}%
          </div>
        )}

        {isFeatured && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
            Featured
          </div>
        )}

        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`absolute top-3 ${discount > 0 ? 'left-16' : 'left-3'} w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all ${
            isFavorite ? 'text-red-600 scale-110' : 'text-gray-700 hover:text-red-600'
          }`}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
        >
          <div className="flex gap-2">
            <button
              onClick={addToCart}
              className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg transition"
            > <span className='text=white'> Add to cart</span>
              <ShoppingBag className="w-5 h-5" />
           
            </button>
            <button className="w-12 h-12 bg-white hover:bg-orange-600 text-gray-900 hover:text-white rounded-lg transition-all flex items-center justify-center">
              <Eye size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-orange-600 transition line-clamp-2">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          {salePrice ? (
            <>
              <span className="text-2xl font-bold text-red-600">R{salePrice.toFixed(2)}</span>
              <span className="text-sm text-gray-500 line-through">R{price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-2xl font-bold text-[#B84037]">
              R{price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;