import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ContentItem, Category, Review } from '@/types';
import Spinner from './Spinner';
import { Star, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- TYPES ---
interface HighlightedReview extends Review {
  product: Partial<ContentItem>; // Use Partial for sample data flexibility
}

// --- API CALL (Temporarily Disabled for UI Preview) ---
// const fetchHighlightedReviews = async () => {
//   const { data } = await api.get('/content/reviews/highlighted');
//   return data as HighlightedReview[];
// };

// --- HELPER FUNCTION FOR PRODUCT LINKS ---
const generateCategoryPath = (category: Category | null | undefined): string => {
  if (!category) return '';
  const parentPath = category.parent ? generateCategory-path(category.parent as Category) : '';
  return parentPath ? `${parentPath}/${category.slug}` : category.slug;
};

// --- INDIVIDUAL CARD COMPONENT ---
const TestimonialCard = ({ review }: { review: HighlightedReview }) => {
  const productLink = `/product/${review.product?.slug}`;
  
  const getProductImage = () => {
    try {
      if (typeof review.product?.images === 'string') {
        const images = JSON.parse(review.product.images);
        return images[0] || null;
      } return null;
    } catch (e) { return null; }
  };
  
  const displayImage = review.imageUrl || getProductImage();

  return (
    <div className="bg-white rounded-lg border shadow-sm flex flex-col h-full overflow-hidden">
      <img 
        src={displayImage || 'https://placehold.co/600x400/F7F7F7/CCC?text=Image'} 
        alt={`Review for ${review.product?.name}`} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className={i < (review.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"} />
          ))}
        </div>
        <p className="font-bold text-sm mt-2">{review.user?.name} <span className="text-green-600 font-normal inline-flex items-center gap-1 text-xs"><CheckCircle size={12} /> Verified</span></p>
        <p className="text-xs text-gray-500 mb-2">{new Date(review.createdAt).toLocaleDateString()}</p>
        <p className="text-sm text-gray-700 flex-grow mb-3">"{review.comment || 'No comment provided.'}"</p>
        <Link to={productLink} className="mt-auto pt-3 border-t flex items-center gap-3 hover:bg-gray-50 -mx-4 px-4 pb-1 rounded-b-lg transition">
          <img src={getProductImage() || 'https://placehold.co/100x100/F7F7F7/CCC?text=P'} alt={review.product?.name} className="w-10 h-10 object-cover rounded"/>
          <span className="text-xs font-medium text-text-main">{review.product?.name}</span>
        </Link>
      </div>
    </div>
  );
};

// --- SAMPLE DATA (FOR UI PREVIEW) ---
const sampleReviews: HighlightedReview[] = [
    { id: '1', rating: 5, comment: 'Absolutely divine! The energy from this Rudraksha is palpable. Highly recommend to everyone.', imageUrl: 'https://placehold.co/600x400/d1c4e9/673ab7?text=Urav+Jha', createdAt: '2025-09-10T12:00:00Z', user: { name: 'Urav Jha' }, product: { name: '1 Mukhi Rudraksha', slug: '1-mukhi-rudraksha', images: '["https://placehold.co/100x100/ede7f6/5e35b1?text=Rudra"]' } },
    { id: '2', rating: 4, comment: 'Beautifully crafted and feels very authentic. The packaging was also excellent. Thank you!', imageUrl: null, createdAt: '2025-09-09T12:00:00Z', user: { name: 'Kashish' }, product: { name: 'Shree Yantra Plate', slug: 'shree-yantra-copper', images: '["https://placehold.co/100x100/fff8e1/ffc107?text=Yantra"]' } },
    { id: '3', rating: 5, comment: 'Great product and fast delivery. I am very impressed with the overall quality and service.', imageUrl: 'https://placehold.co/600x400/c8e6c9/4caf50?text=Gurup.+Naik', createdAt: '2025-09-08T12:00:00Z', user: { name: 'Gurupdrasad Naik' }, product: { name: '7 Chakra Bracelet', slug: 'seven-chakra-bracelet', images: '["https://placehold.co/100x100/e8f5e9/4caf50?text=Bracelet"]' } },
    { id: '4', rating: 5, comment: 'Is this used for women? It looks absolutely amazing! I love the design.', imageUrl: null, createdAt: '2025-09-07T12:00:00Z', user: { name: 'Viji' }, product: { name: 'Rose Quartz Mala', slug: 'rose-quartz-crystal-mala', images: '["https://placehold.co/100x100/fce4ec/e91e63?text=Mala"]' } },
    { id: '5', rating: 4, comment: 'Love the product... har har mahadev. It brings a sense of peace.', imageUrl: 'https://placehold.co/600x400/bbdefb/2196f3?text=Shiva', createdAt: '2025-09-06T12:00:00Z', user: { name: 'Shiva' }, product: { name: 'Karungali Malai', slug: 'original-karungali-malai', images: '["https://placehold.co/100x100/e3f2fd/2196f3?text=Karungali"]' } },
    { id: '6', rating: 5, comment: 'Super! I am very happy with my purchase. Will definitely buy again from this store.', imageUrl: null, createdAt: '2025-09-05T12:00:00Z', user: { name: 'Aatharv Sanap' }, product: { name: 'Natural Blue Sapphire', slug: 'natural-blue-sapphire-neelam', images: '["https://placehold.co/100x100/e8eaf6/3f51b5?text=Gem"]' } },
    { id: '7', rating: 5, comment: 'Good quality, nice product. The finish is excellent and feels premium. 🙏', imageUrl: 'https://placehold.co/600x400/ffe0b2/ff9800?text=Rajesh+R', createdAt: '2025-09-04T12:00:00Z', user: { name: 'Rajesh R Poojary' }, product: { name: 'Kuber Yantra', slug: 'kuber-yantra-brass', images: '["https://placehold.co/100x100/fff3e0/ff9800?text=Kuber"]' } },
    { id: '8', rating: 5, comment: 'Very Good divine feeling. Thank you for this wonderful item.', imageUrl: null, createdAt: '2025-09-03T12:00:00Z', user: { name: 'Yugesh Kumar' }, product: { name: '10 Mukhi Bracelet', slug: '10-mukhi-rudraksha-bracelet-adjustable', images: '["https://placehold.co/100x100/fbe9e7/ff5722?text=Bracelet"]' } },
    { id: '9', rating: 4, comment: 'The details are incredible. Arrived safely and on time.', imageUrl: 'https://placehold.co/600x400/dcedc8/8bc34a?text=Priya', createdAt: '2025-09-02T12:00:00Z', user: { name: 'Priya S.' }, product: { name: 'Ganesh Rudraksha', slug: 'ganesh-rudraksha', images: '["https://placehold.co/100x100/f1f8e9/c5e1a5?text=Ganesh"]' } },
    { id: '10', rating: 5, comment: 'Exceeded my expectations. The energy is truly positive.', imageUrl: null, createdAt: '2025-09-01T12:00:00Z', user: { name: 'Ankit Sharma' }, product: { name: 'Clear Quartz Mala', slug: 'clear-quartz-mala', images: '["https://placehold.co/100x100/fafafa/eeeeee?text=Quartz"]' } }
];


// --- MAIN CAROUSEL COMPONENT ---
export default function TestimonialCarousel() {
  // We use the sample data directly for the UI preview
  const reviews = sampleReviews;
  const isLoading = false; // Set loading to false for the preview

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const getItemsPerPage = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1024) return 4;
        if (window.innerWidth >= 768) return 2;
      }
      return 1;
  };
  
  const slideNext = () => {
    if (!reviews) return;
    const itemsPerPage = getItemsPerPage();
    setCurrentIndex((prev) => (prev >= reviews.length - itemsPerPage ? 0 : prev + 1));
  };

  const slidePrev = () => {
    if (!reviews) return;
    const itemsPerPage = getItemsPerPage();
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - itemsPerPage : prev - 1));
  };
  
  useEffect(() => {
    const slideInterval = setInterval(slideNext, 5000);
    return () => clearInterval(slideInterval);
  }, [currentIndex]);

  if (isLoading) return <div className="flex justify-center py-8"><Spinner /></div>;
  
  const itemsPerPage = getItemsPerPage();

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-center font-sans text-3xl font-bold text-text-main">See what our customers said</h2>
        <div className="relative mt-8">
          
          {reviews && reviews.length > 0 ? (
            <>
              <div ref={carouselRef} className="overflow-hidden">
                <motion.div
                  className="flex -mx-2" // Use negative margin to counteract padding on items
                  animate={{ x: `-${currentIndex * (100 / itemsPerPage)}%` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  {reviews.map((review) => (
                    <div key={review.id} style={{ flex: `0 0 ${100 / itemsPerPage}%` }} className="px-2">
                      <TestimonialCard review={review} />
                    </div>
                  ))}
                </motion.div>
              </div>

              <button onClick={slidePrev} className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition z-10 disabled:opacity-50" aria-label="Previous Review" disabled={currentIndex === 0}>
                  <ChevronLeft />
              </button>
              <button onClick={slideNext} className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition z-10" aria-label="Next Review" disabled={currentIndex >= reviews.length - itemsPerPage}>
                  <ChevronRight />
              </button>
            </>
          ) : (
            <div className="text-center py-16 text-gray-500 italic">
              <p>Customer reviews will be shown here soon.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

