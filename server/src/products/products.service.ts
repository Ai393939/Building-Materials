import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import { CatalogQueryDto } from './dto/catalog-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

const SORT_COLUMNS = {
  price: 'product.price',
  title: 'product.title',
} as const;

const CATALOG_CACHE_TTL_SECONDS = 90;

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
    private readonly redis: RedisService,
  ) {}

  async findCatalog(query: CatalogQueryDto) {
    const key = this.catalogCacheKey(query);
    const cached = await this.redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const page = await this.queryCatalog(query);
    await this.redis.set(key, JSON.stringify(page), CATALOG_CACHE_TTL_SECONDS);
    return page;
  }

  private async queryCatalog(query: CatalogQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const qb = this.products.createQueryBuilder('product');

    const search = query.search?.trim();
    if (search) {
      qb.andWhere(
        '(product.title ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (query.min_price !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice: query.min_price });
    }

    if (query.max_price !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: query.max_price });
    }

    if (query.min_rating !== undefined) {
      qb.andWhere('product.rating >= :minRating', {
        minRating: query.min_rating,
      });
    }

    if (query.sort_by) {
      qb.orderBy(SORT_COLUMNS[query.sort_by], query.order === 'desc' ? 'DESC' : 'ASC');
    } else {
      qb.orderBy('product.id', 'ASC');
    }

    qb.skip((page - 1) * limit).take(limit);
    const [items, totalItems] = await qb.getManyAndCount();

    return {
      items,
      meta: {
        total_items: totalItems,
        total_pages: totalItems === 0 ? 0 : Math.ceil(totalItems / limit),
        current_page: page,
        limit,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.products.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  create(dto: CreateProductDto) {
    const product = this.products.create({
      ...dto,
      specifications: dto.specifications ?? null,
    });
    return this.products.save(product);
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.products.save(product);
  }

  async remove(id: number): Promise<void> {
    const result = await this.products.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException('Product not found');
    }
  }

  private catalogCacheKey(query: CatalogQueryDto): string {
    const parts = [
      `page=${query.page ?? 1}`,
      `limit=${query.limit ?? 12}`,
      `search=${query.search?.trim().toLowerCase() ?? ''}`,
      `min_price=${query.min_price ?? ''}`,
      `max_price=${query.max_price ?? ''}`,
      `min_rating=${query.min_rating ?? ''}`,
      `sort_by=${query.sort_by ?? ''}`,
      `order=${query.order ?? ''}`,
    ];
    return `products:${parts.join('&')}`;
  }
}
