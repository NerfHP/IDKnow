import { prisma } from '../config/prisma';

const getReviewsByProductId = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return reviews;
};

// Updated to accept an optional imageUrl
const createReview = async (
  productId: string, 
  userId: string, 
  rating: number, 
  comment: string,
  imageUrl?: string
) => {
  return prisma.review.create({
    data: {
      rating,
      comment,
      imageUrl,
      // --- THIS IS THE FIX ---
      // We use `connect` to link this new review to the existing product and user.
      product: {
        connect: { id: productId }
      },
      user: {
        connect: { id: userId }
      }
    },
  });
};

export const reviewService = {
  getReviewsByProductId,
  createReview,
};

