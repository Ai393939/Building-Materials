import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AppModule } from './app.module';
import { Product } from './products/product.entity';
import { productSeed } from './products/seed-data';
import { User, UserRole } from './users/user.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const products = app.get<Repository<Product>>(getRepositoryToken(Product));

  const existing = await products.count();
  if (existing === 0) {
    await products.save(productSeed);
  }

  const users = app.get<Repository<User>>(getRepositoryToken(User));
  const adminEmail = 'admin@example.com';
  const admin = await users.findOne({ where: { email: adminEmail } });
  if (!admin) {
    await users.save(
      users.create({
        email: adminEmail,
        passwordHash: await bcrypt.hash('admin12345', 10),
        role: UserRole.Admin,
      }),
    );
  }

  await app.close();
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
