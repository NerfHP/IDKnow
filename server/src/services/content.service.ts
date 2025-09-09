import { PrismaClient, Category, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/AppError';

const prisma = new PrismaClient();

// --- HELPER FUNCTIONS (UNCHANGED & CORRECTED) ---

// This recursive function gets all child category IDs. It's correct.
async function getDescendantCategoryIds(categoryId: string): Promise<string[]> {
    const children = await prisma.category.findMany({ where: { parentId: categoryId }, select: { id: true } });
    let ids = children.map(child => child.id);
    for (const child of children) {
        const descendantIds = await getDescendantCategoryIds(child.id);
        ids = [...ids, ...descendantIds];
    }
    return ids;
}

// This recursive function builds the breadcrumb trail for a category.
async function getCategoryAncestry(categoryId: string): Promise<Category[]> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { parent: true },
  });

  if (!category) {
    return [];
  }
  
  // If the category has no parent, it's the start of the trail.
  if (!category.parent) {
    return [category];
  }

  const ancestors = await getCategoryAncestry(category.parentId!);
  return [...ancestors, category];
}


// --- NEW, SEPARATE SERVICE FUNCTIONS ---

/**
 * Fetches data specifically for a category page.
 * Finds the category by its full nested path.
 */
const getCategoryDataByPath = async (fullPath: string, sortBy?: string, availability?: string[]) => {
  if (!fullPath) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category path is required');
  }

  const slugs = fullPath.split('/');
  const finalSlug = slugs[slugs.length - 1];

  const category = await prisma.category.findFirst({
    where: {
      slug: finalSlug,
      parent: slugs.length > 1 ? { slug: slugs[slugs.length - 2] } : null,
    },
  });
  
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  // Now that we have the category, get its breadcrumbs and all items within it and its children.
  const breadcrumbs = await getCategoryAncestry(category.id);
  const categoryIds = [category.id, ...(await getDescendantCategoryIds(category.id))];

  // Your existing sorting and filtering logic is perfect.
  let orderBy: Prisma.ContentItemOrderByWithRelationInput = { createdAt: 'desc' };
  if (sortBy === 'price-asc') orderBy = { price: 'asc' };
  else if (sortBy === 'price-desc') orderBy = { price: 'desc' };
  else if (sortBy === 'name-asc') orderBy = { name: 'asc' };
  
  const where: Prisma.ContentItemWhereInput = {
    categories: { some: { id: { in: categoryIds } } }
  };
  if (availability && availability.length > 0) {
    where.availability = { in: availability };
  }

  const items = await prisma.contentItem.findMany({ where, include: { categories: true }, orderBy });
  
  // Return a clean, predictable object for the category page.
  return { category, items, breadcrumbs };
};


/**
 * Fetches data specifically for a product detail page.
 * Finds the product by its unique slug.
 */
const getProductDataBySlug = async (slug: string) => {
  const product = await prisma.contentItem.findUnique({
    where: { slug: slug, type: 'PRODUCT' },
    include: { categories: true }, // Include the immediate category
  });

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // If the product is in a category, get the full breadcrumb trail for that category.
  let breadcrumbs: Category[] = [];
  if (product.categories && product.categories.length > 0) {
    // A product is usually in only one primary category.
    const primaryCategoryId = product.categories[0].id;
    breadcrumbs = await getCategoryAncestry(primaryCategoryId);
  }
  
  // Return a clean, predictable object for the product page.
  return { product, breadcrumbs };
};


// --- EXISTING FUNCTIONS (UNCHANGED) ---

const getAllServices = async () => {
  return prisma.contentItem.findMany({
    where: { type: 'SERVICE' },
    include: { categories: true },
    orderBy: { createdAt: 'desc' }
  });
};

const getAllProducts = async (sortBy?: string, availability?: string[]) => {
  let orderBy: Prisma.ContentItemOrderByWithRelationInput = {};
  if (sortBy === 'price-asc') orderBy = { price: 'asc' };
  else if (sortBy === 'price-desc') orderBy = { price: 'desc' };
  else if (sortBy === 'name-asc') orderBy = { name: 'asc' };
  else orderBy = { createdAt: 'desc' };

  const where: Prisma.ContentItemWhereInput = { type: 'PRODUCT' };
  if (availability && availability.length > 0) {
    where.availability = { in: availability };
  }

  return prisma.contentItem.findMany({ where, include: { categories: true }, orderBy });
};

const getItemBySlug = async (slug: string) => {
  const item = await prisma.contentItem.findUnique({ where: { slug }, include: { categories: true } });
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  return item;
};

const getCategories = async () => {
  return prisma.category.findMany({ where: { parentId: null } });
};

const getFeaturedItems = async () => {
  const products = await prisma.contentItem.findMany({
    where: { type: 'PRODUCT' },
    take: 4,
    include: { categories: true },
    orderBy: { createdAt: 'desc' }
  });
  const services = await prisma.contentItem.findMany({
    where: { type: 'SERVICE' },
    take: 2,
    include: { categories: true },
    orderBy: { createdAt: 'desc' }
  });
  return { products, services };
};

export const contentSerivce = {
  getItemBySlug,
  getCategories,
  getFeaturedItems,
  getAllProducts,
  // EXPORT THE NEW FUNCTIONS
  getCategoryDataByPath,
  getProductDataBySlug,
  getAllServices,
};
