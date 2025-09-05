import { PrismaClient } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/AppError';

const prisma = new PrismaClient();

// Helper function to get a category and all its descendants
async function getCategoryWithChildren(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        include: {
          children: true, // Include grandchildren if they exist
        },
      },
    },
  });
  return category;
}

// Function to flatten the category tree into a list of IDs
function getCategoryIds(category: any): string[] {
  let ids = [category.id];
  if (category.children) {
    for (const child of category.children) {
      ids = [...ids, ...getCategoryIds(child)];
    }
  }
  return ids;
}

const queryItems = async (filter: { type?: string; categorySlug?: string; sortBy?: string }) => {
  const { type, categorySlug, sortBy } = filter;

  let orderBy = {};
  if (sortBy === 'price-asc') {
    orderBy = { salePrice: 'asc' };
  } else if (sortBy === 'price-desc') {
    orderBy = { salePrice: 'desc' };
  } else if (sortBy === 'name-asc') {
    orderBy = { name: 'asc' };
  }

  if (categorySlug) {
    const parentCategory = await getCategoryWithChildren(categorySlug);
    if (!parentCategory) {
      return []; // No category found, so no items
    }
    const allCategoryIds = getCategoryIds(parentCategory);

    return prisma.contentItem.findMany({
      where: {
        type: type,
        categoryId: {
          in: allCategoryIds,
        },
      },
      include: {
        category: true,
      },
      orderBy: orderBy,
    });
  }

  // Fallback for queries without a category slug
  return prisma.contentItem.findMany({ where: { type }, include: { category: true }, orderBy: orderBy, });
};


const getItemBySlug = async (slug: string) => {
  const item = await prisma.contentItem.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  return item;
};

const getCategoryPageData = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { children: true },
  });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  const items = await queryItems({ type: 'PRODUCT', categorySlug: slug });
  
  const groupedItems: { [categoryName: string]: any[] } = {};

  // If the category has children, group the items by those children
  if (category.children.length > 0) {
    const childSlugs = category.children.map((c: any) => c.slug);
    items.forEach((item: any) => {
      if (childSlugs.includes(item.category.slug)) {
        if (!groupedItems[item.category.name]) {
          groupedItems[item.category.name] = [];
        }
        groupedItems[item.category.name].push(item);
      }
    });
  }

  return { category, items, groupedItems };
};

const getCategories = async () => {
  return prisma.category.findMany({ where: { parentId: null } }); // Only fetch top-level categories
};

export const contentSerivce = {
  queryItems,
  getItemBySlug,
  getCategories,
  getCategoryPageData,
};