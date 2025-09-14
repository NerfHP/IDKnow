import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ContentItem } from '@/types';
import Spinner from '@/components/shared/Spinner';
import Alert from '@/components/shared/Alert';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import SEO from '@/components/shared/SEO';
import { Link } from 'react-router-dom';

const fetchArticles = async () => {
  const { data } = await api.get('/content/items?type=ARTICLE');
  // Ensure the server includes the category data when fetching articles
  return data as (ContentItem & { categories: { name: string }[] })[];
};

export default function BlogPage() {
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
  });

  return (
    <>
    <SEO 
      title="Blog"
      description="Read articles on spiritual topics, Hindu festivals, and philosophical concepts to deepen your understanding."
    />
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
      <h1 className="mt-4 font-sans text-4xl font-bold">Our Blog</h1>
      
      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      )}

      {error && (
        <div className="mt-8">
          <Alert type="error" message="Failed to load articles. Please try again." />
        </div>
      )}

      {articles && (
        <div className="mt-8 space-y-8">
          {articles.map((article) => (
            <Link to={`/blog/${article.slug}`} key={article.id} className="block group">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="overflow-hidden rounded-lg">
                  {/* Assuming images is a JSON string of an array */}
                  <img src={JSON.parse(article.images as string)[0]} alt={article.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
                </div>
                <div className="md:col-span-2">
                  {/* FIX: Access the first category in the 'categories' array */}
                  <p className="text-sm text-primary font-semibold">{article.categories[0]?.name}</p>
                  <h2 className="font-sans text-2xl font-bold mt-1 group-hover:text-primary-dark transition-colors">{article.name}</h2>
                  <p className="text-gray-600 mt-2">{article.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
