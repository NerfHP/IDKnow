import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import seedContent from '../src/utils/seed-content.json';

const prisma = new PrismaClient();

// Define the shape of the data we expect from the JSON file
type SeedItem = {
    name: string;
    slug: string;
    description: string;
    type: string;
    categorySlug: string;
    [key: string]: any; // Allow other optional properties
};

type SeedCategory = {
    name: string;
    slug: string;
    description: string;
    type: string;
    children?: SeedCategory[];
}

// A helper function to create categories and their children recursively
async function createCategory(categoryData: SeedCategory, parentId: string | null = null) {
  const category = await prisma.category.create({
    data: {
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
      type: categoryData.type,
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

  // Clear existing data
  await prisma.contentItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Seed User
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  await prisma.user.create({ data: { email: 'testuser@example.com', name: 'Test User', password: hashedPassword } });

  // Seed Categories directly from the JSON file
  console.log('Creating categories from seed-content.json...');
  for (const categoryData of (seedContent.categories as SeedCategory[])) {
    await createCategory(categoryData);
  }
  console.log('Categories created.');

  // Seed Products from the JSON file
  console.log('Creating products...');
  for (const item of (seedContent.items as SeedItem[])) {
    const category = await prisma.category.findUnique({ where: { slug: item.categorySlug } });
    if (category) {
      
      // --- THIS IS THE NEW, MORE EXPLICIT APPROACH ---
      await prisma.contentItem.create({
        data: {
          // Required fields are listed manually
          name: item.name,
          slug: item.slug,
          description: item.description,
          type: item.type,
          
          // Optional fields are also listed manually
          content: item.content,
          price: item.price,
          salePrice: item.salePrice,
          vendor: item.vendor,
          sku: item.sku,
          availability: item.availability,
          attributes: item.attributes,
          
          // JSON string conversions with fallbacks
          images: JSON.stringify(item.images || []),
          specifications: JSON.stringify(item.specifications || null),
          benefits: JSON.stringify(item.benefits || null),
          variants: JSON.stringify(item.variants || null),

          // Relation
          categoryId: category.id,
        },
      });
    } else {
      console.warn(`--> Category with slug "${item.categorySlug}" not found for item "${item.name}". Skipping.`);
    }
  }
  console.log('Products created.');
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });