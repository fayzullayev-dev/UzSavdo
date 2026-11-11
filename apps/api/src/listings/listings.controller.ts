import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('listings')
export class ListingsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getListings(
    @Query('categoryId') categoryId?: string,
    @Query('productId') productId?: string,
    @Query('regionId') regionId?: string,
    @Query('districtId') districtId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sort') sort?: string,
    @Query('q') q?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '24'
  ) {
    const where: any = {
      status: 'ACTIVE',
      deletedAt: null
    };

    if (categoryId) where.categoryId = categoryId;
    if (productId) where.productId = productId;
    if (regionId) where.regionId = regionId;
    if (districtId) where.districtId = districtId;

    if (minPrice || maxPrice) {
      where.pricePerUnit = {};
      if (minPrice) where.pricePerUnit.gte = parseFloat(minPrice);
      if (maxPrice) where.pricePerUnit.lte = parseFloat(maxPrice);
    }

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } }
      ];
    }

    let orderBy: any = { publishedAt: 'desc' };
    if (sort === 'price_asc') orderBy = { pricePerUnit: 'asc' };
    if (sort === 'price_desc') orderBy = { pricePerUnit: 'desc' };

    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;

    const [items, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          category: true,
          product: true,
          region: true,
          district: true,
          images: { orderBy: { sortOrder: 'asc' }, take: 1 }
        }
      }),
      this.prisma.listing.count({ where })
    ]);

    return { items, total, page: parseInt(page, 10), pages: Math.ceil(total / take) };
  }

  @Get(':id')
  async getListing(@Param('id') id: string, @Req() req: any) {
    let currentUserId: string | null = null;
    const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

    if (token) {
      try {
        // Simple jwt decode
        const decoded: any = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        currentUserId = decoded.sub;
      } catch {}
    }

    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        category: true,
        product: true,
        region: true,
        district: true,
        images: { orderBy: { sortOrder: 'asc' } },
        seller: {
          select: {
            id: true,
            ratingAvg: true,
            ratingCount: true,
            createdAt: true,
            ordersAnsweredOnTime: true,
            ordersIgnored: true
          }
        }
      }
    });

    if (!listing) throw new NotFoundException('Eʼlon topilmadi');

    // Increment views
    await this.prisma.listing.update({
      where: { id },
      data: { viewsCount: { increment: 1 } }
    });

    // Check if user has PAID contract for this listing or is the seller
    let isUnlocked = false;
    let sellerContacts: any = null;

    if (currentUserId) {
      if (currentUserId === listing.sellerId) {
        isUnlocked = true;
      } else {
        const paidContract = await this.prisma.contract.findFirst({
          where: {
            listingId: id,
            buyerId: currentUserId,
            status: 'PAID'
          }
        });
        if (paidContract) isUnlocked = true;
      }
    }

    if (isUnlocked) {
      const fullSeller = await this.prisma.user.findUnique({
        where: { id: listing.sellerId },
        select: { companyName: true, firstName: true, lastName: true, phone: true, telegram: true, address: true }
      });
      sellerContacts = {
        companyName: fullSeller?.companyName,
        firstName: fullSeller?.firstName,
        lastName: fullSeller?.lastName,
        phone: listing.showPhone ? fullSeller?.phone : null,
        telegram: fullSeller?.telegram,
        address: fullSeller?.address
      };
    }

    const totalOrders = (listing.seller.ordersAnsweredOnTime || 0) + (listing.seller.ordersIgnored || 0);
    const responseRate = totalOrders > 0 ? Math.round((listing.seller.ordersAnsweredOnTime / totalOrders) * 100) : 100;

    return {
      ...listing,
      isOwner: currentUserId === listing.sellerId,
      isUnlocked,
      seller: {
        id: listing.seller.id,
        ratingAvg: listing.seller.ratingAvg,
        ratingCount: listing.seller.ratingCount,
        responseRatePercent: responseRate,
        memberSinceYear: new Date(listing.seller.createdAt).getFullYear(),
        ...sellerContacts
      }
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createListing(@Req() req: any, @Body() body: any) {
    const sellerId = req.user.sub;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const {
      categoryId,
      productId,
      title,
      titleRu,
      description,
      descriptionRu,
      unit,
      pricePerUnit,
      isNegotiable,
      totalQuantity,
      origin,
      delivery,
      expiryOrHarvestDate,
      regionId,
      districtId,
      address,
      certificateUrl,
      showPhone,
      images
    } = body;

    const listing = await this.prisma.listing.create({
      data: {
        sellerId,
        categoryId,
        productId,
        title,
        titleRu: titleRu || title,
        description,
        descriptionRu: descriptionRu || description,
        unit,
        pricePerUnit: parseFloat(pricePerUnit),
        isNegotiable: !!isNegotiable,
        totalQuantity: parseFloat(totalQuantity),
        availableQuantity: parseFloat(totalQuantity),
        origin,
        delivery,
        expiryOrHarvestDate,
        regionId,
        districtId,
        address,
        certificateUrl,
        showPhone: showPhone !== false,
        status: 'ACTIVE',
        expiresAt,
        images: {
          create: (images || []).map((imgUrl: string, idx: number) => ({
            url: imgUrl,
            thumbUrl: imgUrl,
            sortOrder: idx
          }))
        }
      }
    });

    return listing;
  }

  @Post(':id/sales')
  @UseGuards(JwtAuthGuard)
  async markSale(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Eʼlon topilmadi');
    if (listing.sellerId !== req.user.sub) throw new ForbiddenException('Ruxsat berilmagan');

    const qty = parseFloat(body.quantity);
    const available = Number(listing.availableQuantity);

    if (qty > available) {
      throw new BadRequestException({ code: 'INVALID_QTY', message: 'Mavjud miqdordan koʻp kiritib boʻlmaydi' });
    }

    const newAvailable = available - qty;
    const isSoldOut = newAvailable <= 0;

    const [sale, updatedListing] = await this.prisma.$transaction([
      this.prisma.sale.create({
        data: {
          listingId: id,
          orderId: body.orderId || null,
          quantity: qty,
          isOffPlatform: !body.orderId
        }
      }),
      this.prisma.listing.update({
        where: { id },
        data: {
          availableQuantity: Math.max(0, newAvailable),
          status: isSoldOut ? 'SOLD' : listing.status
        }
      })
    ]);

    if (isSoldOut) {
      // Close pending orders as OUT_OF_STOCK
      await this.prisma.order.updateMany({
        where: {
          listingId: id,
          status: 'PENDING'
        },
        data: {
          status: 'OUT_OF_STOCK'
        }
      });
    }

    return { sale, updatedListing };
  }
}
