import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ContentItem } from '@/types';
import Card from '@/components/shared/Card';
import Spinner from '@/components/shared/Spinner';
import Alert from '@/components/shared/Alert';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import SEO from '@/components/shared/SEO';

const fetchServices = async () => {
  const { data } = await api.get('/content/items?type=SERVICE');
  return data as ContentItem[];
};

export default function ServicesPage() {
  const { data: services, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  return (
    <>
    <SEO 
      title="Spiritual Services"
      description="Book our authentic spiritual services, including pujas and astrology consultations, performed by experienced experts."
    />
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services' }]} />
      <h1 className="mt-4 font-sans text-4xl font-bold">Spiritual Services</h1>
      
      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      )}

      {error && (
        <div className="mt-8">
          <Alert type="error" message="Failed to load services. Please try again." />
        </div>
      )}

      {services && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} item={service} />
          ))}
        </div>
      )}
    </div>
    </>
  );
}