import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ContentItem } from '@/types';
import Card from '@/components/shared/Card';
import Spinner from '@/components/shared/Spinner';
import Alert from '@/components/shared/Alert';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import SEO from '@/components/shared/SEO';

const fetchProducts = async () => {
  const { data } = await api.get('/content/items?type=PRODUCT');
  return data as ContentItem[];
};

export default function ProductsPage() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  return (
    <>
    <SEO 
      title="Shop Spiritual Products"
      description="Browse our collection of high-quality spiritual products, including deity idols, puja items, and more."
    />
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Collection' }]} />
      <h1 className="text-center mt-4 font-sans text-4xl font-bold">Complete Collection 💯</h1>
      
      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      )}

      {error && (
        <div className="mt-8">
          <Alert type="error" message="Failed to load products. Please try again." />
        </div>
      )}

      {products && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} item={product} />
          ))}
        </div>
      )}
    </div>
    </>
  );
}