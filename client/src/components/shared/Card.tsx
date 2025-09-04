import { Link } from 'react-router-dom';
import { cn, formatCurrency } from '@/lib/utils';
import { ContentItem } from '@/types';
import Button from './Button';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

interface CardProps {
  item: ContentItem;
  className?: string;
}

export default function Card({ item, className }: CardProps) {
  const { addToCart } = useCart();
  const linkTo = `/product/${item.slug}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  }
  
  const imageArray = JSON.parse(item.images || '[]');
  const imageUrl = imageArray[0] || 'https://picsum.photos/800/600';

  const discount = item.price && item.salePrice ? Math.round(((item.price - item.salePrice) / item.price) * 100) : 0;

  return (
    <Link
      to={linkTo}
      className={cn(
        'group overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-lg flex flex-col',
        className,
      )}
    >
      <div className="overflow-hidden relative">
        <img
          src={imageUrl}
          alt={item.name}
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="flex-grow font-serif text-md font-semibold text-secondary min-h-[40px]">
          {item.name}
        </h3>
        <div className="mt-2">
          {item.salePrice && item.price ? (
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-gray-800">{formatCurrency(item.salePrice)}</p>
              <p className="text-sm text-gray-500 line-through">{formatCurrency(item.price)}</p>
            </div>
          ) : (
            <p className="text-lg font-bold text-gray-800">{formatCurrency(item.price)}</p>
          )}
        </div>
        <div className="mt-4">
          <Button size="sm" variant="outline" className="w-full" onClick={handleAddToCart}>Add to Cart</Button>
        </div>
      </div>
    </Link>
  );
}