import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ContentItem, Category } from '@/types';
import Card from '@/components/shared/Card';
import Spinner from '@/components/shared/Spinner';
import Alert from '@/components/shared/Alert';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import SEO from '@/components/shared/SEO';
import FilterBar from '@/components/shared/FilterBar';

interface CategoryPageData {
  category: Category;
  items: ContentItem[];
  groupedItems: { [categoryName: string]: ContentItem[] };
}

const fetchCategoryData = async (slug: string, sortBy: string, availability: string[]) => {
  const params = new URLSearchParams({ sortBy, availability: availability.join(',') });
  const { data } = await api.get(`/content/category/${slug}?${params.toString()}`);
  return data as CategoryPageData;
};

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [sortBy, setSortBy] = useState('featured');
  const [availability, setAvailability] = useState<string[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['categoryPage', categorySlug, sortBy, availability],
    queryFn: () => fetchCategoryData(categorySlug!, sortBy, availability),
    enabled: !!categorySlug,
  });

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Spinner /></div>;
  if (error || !data) return <div className="container mx-auto p-4"><Alert type="error" message="Could not load category." /></div>;
  
  const { category, items, groupedItems } = data;
  const hasGroups = Object.keys(groupedItems).length > 0;

  return (
    <>
      <SEO title={category.name} description={category.description || `Browse our collection of ${category.name}.`} />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: category.name }]} />
        <div className="mt-4 text-center border-b pb-4">
            <h1 className="font-sans text-4xl font-bold">{category.name}</h1>
            {category.description && <p className="mt-2 text-gray-600 max-w-2xl mx-auto">{category.description}</p>}
        </div>
        
        <FilterBar
          sortBy={sortBy as any}
          setSortBy={setSortBy as any}
          availability={availability as any}
          setAvailability={setAvailability}
        />

        {hasGroups ? (
          <div className="space-y-12 mt-8">
            {Object.entries(groupedItems).map(([groupName, groupItems]) => (
              <section key={groupName}>
                <h2 className="font-sans text-2xl font-bold mb-4">{groupName}</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {(groupItems as ContentItem[]).map(item => <Card key={item.id} item={item} />)}
                </div>
              </section>
            ))}
          </div>
        ) : (
          items.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => <Card key={item.id} item={item} />)}
            </div>
          ) : (
            <p className="mt-8 text-center text-gray-500">No products found with the selected filters.</p>
          )
        )}
      </div>
    </>
  );
}