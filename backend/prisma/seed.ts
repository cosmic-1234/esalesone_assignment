import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function main() {
  const response = await axios.get('https://mocki.io/v1/7fed707e-0db9-4a47-be28-a8bb877a3b24');
  const products = response.data;

  const formattedData = products.map((item: any) => ({
    title: item.title,
    description: item.description,
    price: item.price,
    image: item.image,
    colors: item.variants.colors,
    sizes: item.variants.sizes,
    inventory: 100, // You can randomize this if needed
  }));

  await prisma.product.createMany({
    data: formattedData,
    skipDuplicates: true,
  });

  console.log('Products seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
