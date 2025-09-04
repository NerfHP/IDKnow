import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ContentItem } from '@/types';
import Card from '@/components/shared/Card';
import Spinner from '@/components/shared/Spinner';
import Alert from '@/components/shared/Alert';
import Button from '@/components/shared/Button';
import { Link } from 'react-router-dom';
import SEO from '@/components/shared/SEO';

const fetchFeaturedItems = async () => {
  const [productsRes, servicesRes] = await Promise.all([
    api.get('/content/items?type=PRODUCT'),
    api.get('/content/items?type=SERVICE'),
  ]);
  return {
    products: productsRes.data.slice(0, 4) as ContentItem[],
    services: servicesRes.data.slice(0, 2) as ContentItem[],
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
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 to-amber-100 py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-secondary md:text-6xl">
            Embark on Your Spiritual Journey
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-700">
            Discover authentic products, services, and knowledge to enrich your
            spiritual life and find inner peace.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/shop">Explore Products</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/services">Book a Service</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <h2 className="text-center font-serif text-3xl font-bold text-secondary">
          Featured Products
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Handpicked items for your spiritual practices.
        </p>
        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}
        {error && (
          <Alert
            type="error"
            message="Could not load featured products. Please try again later."
          />
        )}
        {data && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.products.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Services */}
      <section className="container mx-auto px-4">
        <h2 className="text-center font-serif text-3xl font-bold text-secondary">
          Our Services
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Connect with ancient traditions through our expert services.
        </p>
        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}
        {data && (
          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
            {data.services.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
    </>
  );
}