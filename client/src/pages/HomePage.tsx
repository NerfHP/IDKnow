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

const fetchFeaturedItems = async () => {
  const [productsRes, servicesRes] = await Promise.all([
    api.get('/content/items?type=PRODUCT'),
    api.get('/content/items?type=SERVICE'),
  ]);
  return {
    products: (productsRes.data as ContentItem[]).slice(0, 4),
    services: (servicesRes.data as ContentItem[]).slice(0, 2),
  };
};

export default function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['featuredItems'],
    queryFn: fetchFeaturedItems,
  });

  return (
    <>
      <SEO 
        title="Your Guide to Spiritual Wellness"
        description="Discover authentic spiritual products, book puja services, and find guidance with our expert astrology consultations. Your path to peace and well-being starts here."
      />
      
      {/* --- REDESIGNED HERO SECTION --- */}
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
              <Link to="/products/bracelets">Explore Products</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <Link to="/services">Book a Service</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- WRAPPER FOR THE REST OF THE PAGE --- */}
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
                {data.products.map((item) => (
                  <Card key={item.id} item={item} />
                ))}
              </div>
            )
          )}
        </section>

        {/* Featured Services Section */}
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
            data && (
              <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                {data.services.map((item) => (
                  <Card key={item.id} item={item} />
                ))}
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