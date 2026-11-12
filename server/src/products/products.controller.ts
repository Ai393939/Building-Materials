import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CatalogQueryDto } from './dto/catalog-query.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  findCatalog(@Query() query: CatalogQueryDto) {
    return this.products.findCatalog(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.products.findOne(id);
  }
}
