import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ContentItem } from '@/types';
import Card from '@/components/shared/Card';
import Spinner from '@/components/shared/Spinner';
import Alert from '@/components/shared/Alert';
import Button from '@/components/shared/Button';
import { Link } from 'react-router-dom';
import SEO from '@/components/shared/SEO';
import { Gem, ShieldCheck, Globe, Zap } from 'lucide-react';
import { formatCurrency } from '@/lib/utils'; // Import formatCurrency
import toast from 'react-hot-toast'; // Import toast
import { useCart } from '@/hooks/useCart'; // Import useCart
import ImageCarousel from '@/components/shared/ImageCarousel';

const fetchFeaturedItems = async () => {
  const { data } = await api.get('/content/featured');
  return data;
};

export default function HomePage() {
  const { addToCart } = useCart(); // Use useCart hook
  const { data, isLoading, error } = useQuery({
    queryKey: ['featuredItems'],
    queryFn: fetchFeaturedItems,
  });

  const handleAddToCart = (item: ContentItem) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <>
      <SEO 
        title="Your Guide to Spiritual Wellness"
        description="Discover authentic spiritual products, book puja services, and find guidance with our expert astrology consultations. Your path to peace and well-being starts here."
      />
      
      {/* Hero Section */}
      <section className="bg-secondary text-text-light text-center py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-sans text-4xl font-bold tracking-tight md:text-6xl">
            Embark on Your Spiritual Journey
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            Discover authentic products, services, and knowledge to enrich your
            spiritual life and find inner peace.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg">
              <Link to="/products">Explore Products</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <Link to="/services">Book a Service</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Wrapper for the rest of the page */}
      <div className="bg-background py-16 space-y-16">
        {/* Featured Products Section */}
        <section className="container mx-auto px-4">
          <h2 className="text-center font-sans text-3xl font-bold text-text-main">
            Featured Products
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Handpicked items for your spiritual practices.
          </p>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : error ? (
            <Alert
              type="error"
              message="Could not load featured products. Please try again later."
            />
          ) : (
            data && (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {data.products.map((item: ContentItem) => (
                  <Card key={item.id} item={item} />
                ))}
              </div>
            )
          )}
        </section>

        {/* --- UPDATED "OUR SERVICES" SECTION --- */}
        <section className="container mx-auto px-4">
          <h2 className="text-center font-sans text-3xl font-bold text-text-main">
            Our Services
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Connect with ancient traditions through our expert services.
          </p>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : (
            data && data.services.length > 0 && (
              <div className="mt-8">
                {data.services.length === 1 ? (
                  // If there is only one service, show a large, detailed view
                  <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg border">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <img 
                          src={JSON.parse(data.services[0].images || '[]')[0]} 
                          alt={data.services[0].name}
                          className="w-full rounded-lg object-cover aspect-square"
                        />
                      </div>
                      <div className="text-center md:text-left">
                        <h3 className="font-sans text-2xl font-bold text-text-main">{data.services[0].name}</h3>
                        <p className="text-gray-600 text-sm mt-2">{data.services[0].description}</p>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                          {data.services[0].salePrice && (
                            <p className="text-2xl font-bold text-primary-dark">{formatCurrency(data.services[0].salePrice)}</p>
                          )}
                          <p className={`text-lg ${data.services[0].salePrice ? 'text-gray-500 line-through' : 'font-bold text-primary-dark'}`}>
                            {formatCurrency(data.services[0].price)}
                          </p>
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                          <Button size="md" onClick={() => handleAddToCart(data.services[0])}>Add to Cart</Button>
                          <Button asChild size="md" variant="outline">
                            <Link to={`/services/${data.services[0].slug}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // If more than one service, display the grid of cards
                  <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                    {data.services.map((item: ContentItem) => (
                      <Card key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </section>
        {/* Trust Signals Section */}
        <section className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center border-t border-gray-200 pt-16">
                <div className="flex flex-col items-center">
                    <ShieldCheck size={40} className="text-primary mb-3" />
                    <h3 className="font-bold text-lg text-text-main">Lab-Certified Purity</h3>
                    <p className="text-sm text-gray-600">Every Rudraksha and gemstone is 100% authentic and certified.</p>
                </div>
                <div className="flex flex-col items-center">
                    <Zap size={40} className="text-primary mb-3" />
                    <h3 className="font-bold text-lg text-text-main">Energized & Blessed</h3>
                    <p className="text-sm text-gray-600">Our products are spiritually energized to unlock their full potential.</p>
                </div>
                <div className="flex flex-col items-center">
                    <Globe size={40} className="text-primary mb-3" />
                    <h3 className="font-bold text-lg text-text-main">Worldwide Shipping</h3>
                    <p className="text-sm text-gray-600">We deliver spiritual wellness to your doorstep, wherever you are.</p>
                </div>
                <div className="flex flex-col items-center">
                    <Gem size={40} className="text-primary mb-3" />
                    <h3 className="font-bold text-lg text-text-main">Authentic Sourcing</h3>
                    <p className="text-sm text-gray-600">Sourced directly from Nepal and Indonesia for the highest quality.</p>
                </div>
            </div>
        </section>
      </div>
    </>
  );
}