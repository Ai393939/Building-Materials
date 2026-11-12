import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from './app.module';
import { Product } from './products/product.entity';
import { productSeed } from './products/seed-data';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const products = app.get<Repository<Product>>(getRepositoryToken(Product));

  const existing = await products.count();
  if (existing === 0) {
    await products.save(productSeed);
  }

  await app.close();
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
