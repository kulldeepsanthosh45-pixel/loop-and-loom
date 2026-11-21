import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌸 Starting Loop & Loom database seeding...');

  // 1. Seed Products
  const toteBag = await prisma.product.upsert({
    where: { slug: 'granny-square-tote-bag' },
    update: {},
    create: {
      slug: 'granny-square-tote-bag',
      name: 'Granny Square Tote Bag',
      description: 'A stunning granny square tote bag handmade with premium cotton yarn. Features a beautiful terracotta and cream pattern with wooden handles. Perfect for everyday use or as a statement piece.',
      price: 1899,
      comparePrice: 2499,
      images: ['/images/product-bag.jpg', '/images/hero-banner.jpg'],
      category: 'Crochet Bags',
      categorySlug: 'bags',
      material: '100% Cotton Yarn',
      stock: 5,
      isNew: true,
      isFeatured: true,
      rating: 4.8,
      reviewCount: 24,
      variants: {
        create: [
          { color: 'Terracotta', size: 'Standard', stock: 3, sku: 'BAG-GS-TER-STD' },
          { color: 'Cream', size: 'Standard', stock: 2, sku: 'BAG-GS-CRM-STD' },
        ],
      },
    },
  });

  const headband = await prisma.product.upsert({
    where: { slug: 'crochet-headband-set' },
    update: {},
    create: {
      slug: 'crochet-headband-set',
      name: 'Crochet Headband Set',
      description: 'A beautiful set of 4 handmade crochet headbands in pastel shades. Each headband features a unique stitch pattern, making it a versatile accessory for every outfit.',
      price: 699,
      comparePrice: 999,
      images: ['/images/product-hairband.jpg', '/images/product-scrunchie.jpg'],
      category: 'Hair Accessories',
      categorySlug: 'hair-accessories',
      material: 'Soft Acrylic Yarn',
      stock: 12,
      isNew: true,
      isFeatured: true,
      rating: 4.9,
      reviewCount: 31,
      variants: {
        create: [
          { color: 'Pastel Pack', size: 'One Size', stock: 12, sku: 'ACC-HB-PST-OS' },
        ],
      },
    },
  });

  const earrings = await prisma.product.upsert({
    where: { slug: 'flower-crochet-earrings' },
    update: {},
    create: {
      slug: 'flower-crochet-earrings',
      name: 'Flower Crochet Earrings',
      description: 'Delicate crochet flower earrings with gold-plated hooks. Lightweight and comfortable for all-day wear. Each pair is carefully handmade with fine cotton thread.',
      price: 399,
      comparePrice: 599,
      images: ['/images/product-earrings.jpg'],
      category: 'Earrings & Jewellery',
      categorySlug: 'earrings-jewellery',
      material: 'Fine Cotton Thread with Gold Plated Brass Hooks',
      stock: 8,
      isNew: false,
      isFeatured: true,
      rating: 4.7,
      reviewCount: 19,
    },
  });

  // 2. Seed Courses & Modules & Lessons
  const course1 = await prisma.course.upsert({
    where: { slug: 'crochet-basics-for-beginners' },
    update: {},
    create: {
      slug: 'crochet-basics-for-beginners',
      title: 'Crochet Basics for Beginners',
      description: 'Start your crochet journey with this comprehensive beginner course. Learn fundamental stitches, read patterns, and create your first projects.',
      longDescription: 'Whether you have never held a crochet hook before or you tried and gave up, this course is designed to build your confidence from scratch. You will learn to hold the hook and yarn, create chain stitches, single crochet, double crochet, and more.',
      instructor: 'Priya Sharma',
      price: 999,
      comparePrice: 1499,
      image: '/images/hero-banner.jpg',
      level: 'BEGINNER',
      duration: '4 hours',
      lessonCount: 12,
      studentCount: 342,
      rating: 4.9,
      reviewCount: 87,
      isFeatured: true,
      modules: {
        create: [
          {
            title: 'Getting Started',
            order: 1,
            lessons: {
              create: [
                { title: 'Welcome & Course Overview', duration: '5 min', isPreview: true, order: 1 },
                { title: 'Essential Tools & Materials', duration: '12 min', isPreview: true, order: 2 },
                { title: 'How to Hold Hook & Yarn', duration: '10 min', isPreview: false, order: 3 },
              ],
            },
          },
          {
            title: 'Foundation Stitches',
            order: 2,
            lessons: {
              create: [
                { title: 'Chain Stitch (ch)', duration: '15 min', isPreview: false, order: 1 },
                { title: 'Single Crochet (sc)', duration: '18 min', isPreview: false, order: 2 },
                { title: 'Double Crochet (dc)', duration: '20 min', isPreview: false, order: 3 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Database seeded successfully with products and courses!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
