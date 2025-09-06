import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ContentItem } from '@/types';
import Spinner from '@/components/shared/Spinner';
import Alert from '@/components/shared/Alert';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import SEO from '@/components/shared/SEO';
import Button from '@/components/shared/Button';
import { formatCurrency } from '@/lib/utils';

// --- THIS FUNCTION NOW USES THE CORRECT URL ---
const fetchServiceBySlug = async (slug: string) => {
  // The old path was likely /content/service/:slug
  // The correct path is /content/product/:slug
  const { data } = await api.get(`/content/product/${slug}`);
  return data as ContentItem;
};

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: service, isLoading, isError } = useQuery({
    queryKey: ['service', slug],
    queryFn: () => fetchServiceBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Spinner /></div>;
  if (isError || !service) return <div className="container mx-auto p-8"><Alert type="error" message="Service not found." /></div>;

  const imageArray: string[] = JSON.parse(service.images || '[]');
  const finalPrice = service.salePrice || service.price || 0;

  return (
    <>
      <SEO title={service.name} description={service.description} imageUrl={imageArray[0]} />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: service.name },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="border rounded-lg p-4 shadow-sm">
            <img 
              src={imageArray[0]} 
              alt={service.name}
              className="w-full h-auto object-cover rounded-md aspect-square"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="font-sans text-4xl font-bold text-text-main">{service.name}</h1>
            <p className="text-lg text-gray-600 mt-2">{service.description}</p>
            
            <div className="flex items-baseline gap-3 my-4">
              <p className="text-3xl font-bold text-primary">{formatCurrency(finalPrice)}</p>
              {service.salePrice && service.price && (
                <p className="text-xl text-gray-400 line-through">{formatCurrency(service.price)}</p>
              )}
            </div>
            
            <div className="mt-4">
              <Button size="lg">Book Now</Button>
            </div>
          </div>
        </div>

        {service.content && (
            <div className="mt-12 border-t pt-8">
                <h2 className="font-sans text-2xl font-bold text-text-main mb-4">Service Details</h2>
                <div className="prose max-w-none text-gray-700">
                    <p>{service.content}</p>
                </div>
            </div>
        )}
      </div>
    </>
  );
}