import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { ApplyPromoDto } from './dto/apply-promo.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from './cart-item.entity';
import { Cart } from './cart.entity';
import { PromoCode } from './promo-code.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly carts: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly items: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
    @InjectRepository(PromoCode)
    private readonly promoCodes: Repository<PromoCode>,
  ) {}

  async getCart(userId: number) {
    const cart = await this.loadCart(userId);
    return this.toResponse(cart);
  }

  async addItem(userId: number, dto: AddCartItemDto) {
    const cart = await this.loadCart(userId);
    const product = await this.findProduct(dto.productId);
    const existing = cart.items.find((item) => item.productId === product.id);
    const nextQuantity = (existing?.quantity ?? 0) + dto.quantity;
    this.assertStock(product, nextQuantity);

    if (existing) {
      existing.quantity = nextQuantity;
      await this.items.save(existing);
    } else {
      const created = await this.items.save(
        this.items.create({
          cartId: cart.id,
          productId: product.id,
          quantity: dto.quantity,
        }),
      );
      created.product = product;
      cart.items.push(created);
    }

    return this.toResponse(await this.loadCart(userId));
  }

  async updateItem(userId: number, itemId: number, dto: UpdateCartItemDto) {
    const cart = await this.loadCart(userId);
    const item = cart.items.find((entry) => entry.id === itemId);
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    this.assertStock(item.product, dto.quantity);
    item.quantity = dto.quantity;
    await this.items.save(item);
    return this.toResponse(await this.loadCart(userId));
  }

  async removeItem(userId: number, itemId: number) {
    const cart = await this.loadCart(userId);
    const item = cart.items.find((entry) => entry.id === itemId);
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.items.remove(item);
    return this.toResponse(await this.loadCart(userId));
  }

  async applyPromo(userId: number, dto: ApplyPromoDto) {
    const code = dto.code.trim().toUpperCase();
    const promo = await this.promoCodes.findOne({ where: { code } });
    if (!promo || !promo.isActive) {
      throw new BadRequestException('Неверный промокод');
    }

    const cart = await this.loadCart(userId);
    cart.promoCodeId = promo.id;
    cart.promoCode = promo;
    await this.carts.save(cart);
    return this.toResponse(await this.loadCart(userId));
  }

  private async loadCart(userId: number): Promise<Cart> {
    let cart = await this.carts.findOne({
      where: { userId },
      relations: { items: { product: true }, promoCode: true },
    });

    if (!cart) {
      cart = await this.carts.save(this.carts.create({ userId, promoCodeId: null }));
      cart.items = [];
      cart.promoCode = null;
    }

    cart.items = (cart.items ?? []).filter((item) => item.product);
    return cart;
  }

  private async findProduct(productId: number): Promise<Product> {
    const product = await this.products.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  private assertStock(product: Product, quantity: number) {
    if (quantity > product.stockQuantity) {
      throw new BadRequestException('Not enough items in stock');
    }
  }

  private toResponse(cart: Cart) {
    const items = cart.items.map((item) => {
      const lineTotal = this.money(item.product.price * item.quantity);
      return {
        id: item.id,
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        lineTotal,
      };
    });
    const subtotal = this.money(items.reduce((sum, item) => sum + item.lineTotal, 0));
    const percent =
      cart.promoCode && cart.promoCode.isActive
        ? cart.promoCode.discountPercentage
        : 0;
    const discount = this.money(subtotal * (percent / 100));
    const total = this.money(subtotal - discount);

    return {
      items,
      subtotal,
      discount,
      total,
      promoCode: cart.promoCode?.code ?? null,
    };
  }

  private money(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
