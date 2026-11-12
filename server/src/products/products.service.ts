import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogQueryDto } from './dto/catalog-query.dto';
import { Product } from './product.entity';

const SORT_COLUMNS = {
  price: 'product.price',
  title: 'product.title',
} as const;

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  async findCatalog(query: CatalogQueryDto) {
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
}
