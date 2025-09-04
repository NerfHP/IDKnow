import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ContentItem, Variant } from '@/types';
import Spinner from '@/components/shared/Spinner';
import Alert from '@/components/shared/Alert';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import Button from '@/components/shared/Button';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';
import SEO from '@/components/shared/SEO';
import { Heart, Share2, Flame, Minus, Plus } from 'lucide-react';

// A sub-component for the tabs section, now receives parsed props
function ProductTabs({ content, specifications, benefits }: { content?: string | null, specifications?: Record<string, string> | null, benefits?: string[] | null }) {
  const [activeTab, setActiveTab] = useState('description');

  if (!content && !specifications && !benefits) return null;

  return (
    <div className="mt-12">
      <div className="border-b">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {content && <button onClick={() => setActiveTab('description')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Description</button>}
          {specifications && <button onClick={() => setActiveTab('specs')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'specs' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Specification</button>}
          {benefits && <button onClick={() => setActiveTab('benefits')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'benefits' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Benefits</button>}
        </nav>
      </div>
      <div className="py-6 prose max-w-none prose-sm sm:prose-base">
        {activeTab === 'description' && content && <p>{content}</p>}
        {activeTab === 'specs' && specifications && (
          <ul className="list-disc pl-5">
            {Object.entries(specifications).map(([key, value]) => <li key={key}><strong>{key}:</strong> {value}</li>)}
          </ul>
        )}
        {activeTab === 'benefits' && benefits && (
          <ul className="list-disc pl-5">
            {benefits.map((benefit, index) => <li key={index}>{benefit}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}

// CORRECTED API FETCH URL
const fetchProductBySlug = async (slug: string) => {
  const { data } = await api.get(`/product/${slug}`);
  return data as ContentItem;
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return <div className="flex h-96 items-center justify-center"><Spinner /></div>;
  }
  if (isError || !product) {
    return <div className="container mx-auto p-4"><Alert type="error" message="Product not found." /></div>;
  }

  // --- CORRECTED DATA PARSING ---
  const imageArray: string[] = JSON.parse(product.images || '[]');
  const specifications: Record<string, string> | null = product.specifications ? JSON.parse(product.specifications) : null;
  const benefits: string[] = product.benefits ? JSON.parse(product.benefits) : [];
  const variants: Variant[] = product.variants ? JSON.parse(product.variants) : [];

  const basePrice = product.salePrice || product.price || 0;
  const finalPrice = basePrice + (variants?.[selectedVariant]?.priceModifier || 0);

  const handleAddToCart = () => {
    const itemToAdd = { ...product, price: finalPrice };
    const variantName = variants?.[selectedVariant]?.name || '';
    const itemWithVariant = { ...itemToAdd, name: variantName ? `${itemToAdd.name} (${variantName})` : itemToAdd.name };
    
    for (let i = 0; i < quantity; i++) {
      addToCart(itemWithVariant);
    }
    toast.success(`${quantity} x ${product.name} added to cart!`);
  };

  return (
    <>
      <SEO 
        title={product.name}
        description={product.description}
        imageUrl={imageArray[0]}
      />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: product.category.name, href: `/products/${product.category.slug}` },
            { label: product.name },
          ]}
        />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Image Gallery */}
          <div>
            <div className="border rounded-lg overflow-hidden mb-4 shadow">
              <img src={imageArray[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2">
              {imageArray.map((img: string, index: number) => (
                <button 
                  key={index} 
                  onClick={() => setActiveImage(index)} 
                  className={`w-20 h-20 border rounded-md overflow-hidden transition ${activeImage === index ? 'border-primary ring-2 ring-primary' : 'hover:border-primary'}`}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          {/* Right Column: Product Details */}
          <div>
            <h1 className="font-serif text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-red-500 text-sm font-semibold">
              <Flame size={16} />
              <span>3 sold in last 17 hours</span>
            </div>
            
            <div className="flex items-baseline gap-3 mt-4">
              <p className="text-3xl font-bold text-primary-dark">{formatCurrency(finalPrice)}</p>
              {product.salePrice && product.price && (
                <p className="text-xl text-gray-500 line-through">{formatCurrency(product.price)}</p>
              )}
            </div>
            
            <div className="mt-4 prose prose-sm max-w-none text-gray-600">
              <ul className="list-disc pl-5">
                {product.attributes?.split(',').map(attr => <li key={attr}>{attr.trim()}</li>)}
              </ul>
            </div>
            
            {variants.length > 0 && (
              <div className="mt-6">
                <label className="text-sm font-medium">Type: {variants[selectedVariant].name}</label>
                <div className="flex gap-2 mt-2">
                  {variants.map((variant, index) => (
                    <button
                      key={variant.name}
                      onClick={() => setSelectedVariant(index)}
                      className={`px-4 py-2 text-sm rounded-md border transition-colors ${selectedVariant === index ? 'border-primary bg-primary/10 text-primary font-semibold' : 'border-gray-300 hover:border-gray-500'}`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6 border-t pt-6">
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium">Quantity:</p>
                <div className="flex items-center border rounded-md">
                   <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-50 transition-colors"><Minus size={14} /></button>
                   <span className="px-4 text-sm font-bold w-12 text-center">{quantity}</span>
                   <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 hover:bg-gray-50 transition-colors"><Plus size={14} /></button>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                 <Button size="lg" onClick={handleAddToCart} className="sm:col-span-2">Add to Cart</Button>
                 <div className="flex gap-3 justify-center">
                    <button className="p-3 border rounded-md hover:bg-gray-100 transition-colors w-full"><Heart /></button>
                    <button className="p-3 border rounded-md hover:bg-gray-100 transition-colors w-full"><Share2 /></button>
                 </div>
              </div>
              <div className="mt-3">
                 <Button size="lg" variant="secondary" className="w-full">Buy It Now</Button>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <input type="checkbox" id="terms" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <label htmlFor="terms" className="ml-2">I agree with the</label>
                <Link to="/terms" className="ml-1 underline hover:text-primary">Terms & Conditions</Link>
              </div>
            </div>
          </div>
        </div>
        <ProductTabs content={product.content} specifications={specifications} benefits={benefits} />
      </div>
    </>
  );
}