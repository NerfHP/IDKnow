import { PrismaClient, Category, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/AppError';

const prisma = new PrismaClient();

async function getDescendantCategoryIds(categoryId: string): Promise<string[]> {
    const children = await prisma.category.findMany({ where: { parentId: categoryId }, select: { id: true } });
    let ids = children.map(child => child.id);
    for (const child of children) {
        const descendantIds = await getDescendantCategoryIds(child.id);
        ids = [...ids, ...descendantIds];
    }
    return ids;
}

const getCategoryPageData = async (slug: string, sortBy?: string, availability?: string[]) => {
  const category = await prisma.category.findUnique({ where: { slug }, include: { children: true } });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  const categoryIds = [category.id, ...(await getDescendantCategoryIds(category.id))];

  let orderBy: Prisma.ContentItemOrderByWithRelationInput = {};
  if (sortBy === 'price-asc') orderBy = { price: 'asc' };
  else if (sortBy === 'price-desc') orderBy = { price: 'desc' };
  else if (sortBy === 'name-asc') orderBy = { name: 'asc' };
  else orderBy = { createdAt: 'desc' };
  
  const where: Prisma.ContentItemWhereInput = {
    categories: { some: { id: { in: categoryIds } } }
  };
  if (availability && availability.length > 0) {
    where.availability = { in: availability };
  }

  const items = await prisma.contentItem.findMany({ where, include: { categories: true }, orderBy });
  
  const groupedItems: { [categoryName: string]: any[] } = {};
  // Grouping logic can be re-added here if needed in the future
  
  return { category, items, groupedItems };
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
  const products = await prisma.contentItem.findMany({ where: { type: 'PRODUCT' }, take: 4, include: { categories: true } });
  const services = await prisma.contentItem.findMany({ where: { type: 'SERVICE' }, take: 2, include: { categories: true } });
  return { products, services };
};

export const contentSerivce = {
  getItemBySlug,
  getCategories,
  getCategoryPageData,
  getFeaturedItems,
  getAllProducts,
};