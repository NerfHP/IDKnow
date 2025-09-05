import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ContentItem } from '@/types';
import Card from '@/components/shared/Card';
import Spinner from '@/components/shared/Spinner';
import Alert from '@/components/shared/Alert';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import SEO from '@/components/shared/SEO';
import Button from '@/components/shared/Button';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';
import { Link } from 'react-router-dom';

const fetchServices = async () => {
  const { data } = await api.get('/content/items?type=SERVICE');
  return data as ContentItem[];
};

export default function ServicesPage() {
  const { addToCart } = useCart();

  const { data: services, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  const handleAddToCart = (item: ContentItem) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <>
      <SEO 
        title="Spiritual Services"
        description="Book our authentic spiritual services, including pujas and astrology consultations, performed by experienced experts."
      />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services' }]} />
        <div className="mt-4 text-center">
            <h1 className="font-sans text-4xl font-bold">Our Services</h1>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Connect with ancient traditions through our expert services.</p>
        </div>
        
        {isLoading && (
          <div className="flex h-64 items-center justify-center"><Spinner /></div>
        )}

        {error && (
          <div className="mt-8"><Alert type="error" message="Failed to load services." /></div>
        )}

        {services && (
          <div className="mt-12">
            {/* --- NEW LOGIC: Check if there is exactly one service --- */}
            {services.length === 1 ? (
              // If there is only one service, show a large, detailed view
              <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <img 
                      src={JSON.parse(services[0].images || '[]')[0]} 
                      alt={services[0].name}
                      className="w-full rounded-lg object-cover"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="font-sans text-3xl font-bold text-text-main">{services[0].name}</h2>
                    <p className="text-gray-600 mt-2">{services[0].description}</p>
                    <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                      {services[0].salePrice && (
                        <p className="text-3xl font-bold text-primary-dark">{formatCurrency(services[0].salePrice)}</p>
                      )}
                      <p className={`text-xl ${services[0].salePrice ? 'text-gray-500 line-through' : 'font-bold text-primary-dark'}`}>
                        {formatCurrency(services[0].price)}
                      </p>
                    </div>
                    <div className="mt-6 flex flex-col gap-3">
                      <Button size="lg" onClick={() => handleAddToCart(services[0])}>Add to Cart</Button>
                      <Button asChild size="lg" variant="outline">
                        <Link to={`/services/${services[0].slug}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Otherwise, show the grid of cards as before
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <Card key={service.id} item={service} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}