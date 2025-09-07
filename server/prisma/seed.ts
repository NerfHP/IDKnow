import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import seedContent from '../src/utils/seed-content.json';

const prisma = new PrismaClient();

// This defines the exact shape of your product data from the JSON file
type SeedItem = {
    name: string;
    slug: string;
    description: string;
    type: string;
    categorySlug: string;
    content?: string | null;
    price?: number | null;
    salePrice?: number | null;
    images?: string[];
    vendor?: string;
    sku?: string;
    availability?: string;
    attributes?: string;
    specifications?: Record<string, string>;
    benefits?: any[];
    variants?: any[];
    howToUse?: any[]; // Added howToUse
    packageContents?: string[]; // Added packageContents
};

type SeedCategory = {
    name: string;
    slug: string;
    description: string;
    type: string;
    image?: string;
    children?: SeedCategory[];
}

async function createCategory(categoryData: SeedCategory, parentId: string | null = null) {
  const category = await prisma.category.create({
    data: {
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
      type: categoryData.type,
      image: categoryData.image,
      parentId: parentId,
    },
  });

  if (categoryData.children) {
    for (const childData of categoryData.children) {
      await createCategory(childData, category.id);
    }
  }
}

async function main() {
  console.log('Start seeding ...');
  await prisma.contentItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('Password123!', 10);
  await prisma.user.create({ data: { email: 'testuser@example.com', name: 'Test User', password: hashedPassword } });

  console.log('Creating categories from seed-content.json...');
  for (const categoryData of (seedContent.categories as SeedCategory[])) {
    await createCategory(categoryData);
  }
  console.log('Categories created.');

  console.log('Creating products...');
  for (const item of (seedContent.items as SeedItem[])) {
    const category = await prisma.category.findUnique({ where: { slug: item.categorySlug } });
    if (category) {
      await prisma.contentItem.create({
        data: {
          name: item.name,
          slug: item.slug,
          description: item.description,
          type: item.type,
          content: item.content,
          price: item.price,
          salePrice: item.salePrice,
          vendor: item.vendor,
          sku: item.sku,
          availability: item.availability,
          attributes: item.attributes,
          images: JSON.stringify(item.images || []),
          specifications: JSON.stringify(item.specifications || null),
          benefits: JSON.stringify(item.benefits || null),
          variants: JSON.stringify(item.variants || null),
          howToUse: JSON.stringify(item.howToUse || null),
          packageContents: JSON.stringify(item.packageContents || null),
          categories: {
            connect: [{ id: category.id }],
          },
        },
      });
    } else {
      console.warn(`--> Category with slug "${item.categorySlug}" not found for item "${item.name}". Skipping.`);
    }
  }
  console.log('Products created.');
  console.log('Seeding finished.');
}

main().catch((e) => { console.error(e); throw e; }).finally(async () => { await prisma.$disconnect(); });