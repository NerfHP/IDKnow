import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ContentItem } from '@/types';
import Spinner from '@/components/shared/Spinner';
import Alert from '@/components/shared/Alert';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import Button from '@/components/shared/Button';
import { formatCurrency } from '@/lib/utils';
import SEO from '@/components/shared/SEO';

const fetchServiceBySlug = async (slug: string) => {
  const { data } = await api.get(`/content/item/${slug}`);
  return data as ContentItem;
};

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', slug],
    queryFn: () => fetchServiceBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message="Service not found or failed to load." />
      </div>
    );
  }

  return (
    <>
    <SEO 
      title={service.name}
      description={service.description}
      imageUrl={service.images[0]}
    />
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: service.name },
        ]}
      />
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <img
            src={service.images[0]}
            alt={service.name}
            className="w-full rounded-lg object-cover shadow-lg"
          />
        </div>
        <div>
          <h1 className="font-sans text-4xl font-bold">{service.name}</h1>
          <p className="mt-2 text-lg text-gray-600">{service.description}</p>
          {service.price && (
            <p className="mt-4 text-3xl font-bold text-primary-dark">
              {formatCurrency(service.price)}
            </p>
          )}
          <div className="mt-6">
            <Button size="lg">Book Now</Button>
          </div>
          <div className="prose mt-8 max-w-none text-gray-700">
            <p>{service.content}</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}