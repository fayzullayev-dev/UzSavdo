import { Controller, Get, Post, Body, Param, Query, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class DictionariesController {
  constructor(private prisma: PrismaService) {}

  @Get('regions')
  async getRegions() {
    return this.prisma.region.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        districts: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
  }

  @Get('categories')
  async getCategories() {
    const cats = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { listings: { where: { status: 'ACTIVE' } } }
        },
        products: {
          where: { isApproved: true },
          orderBy: { nameUz: 'asc' }
        }
      }
    });

    return cats.map(c => ({
      ...c,
      activeListingsCount: c._count.listings
    }));
  }

  @Post('products')
  @UseGuards(JwtAuthGuard)
  async addProductName(@Body() body: any, @Req() req: any) {
    const { categoryId, nameUz, nameRu } = body;
    const norm = `${nameUz}`.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');

    const existing = await this.prisma.product.findFirst({
      where: {
        OR: [
          { normalizedName: norm },
          { nameUz: { equals: nameUz.trim() } }
        ]
      }
    });

    if (existing) {
      return { duplicate: true, product: existing };
    }

    const prod = await this.prisma.product.create({
      data: {
        categoryId,
        nameUz: nameUz.trim(),
        nameRu: (nameRu || nameUz).trim(),
        normalizedName: norm,
        isUserAdded: true,
        createdById: req.user.sub,
        isApproved: true
      }
    });

    return { duplicate: false, product: prod };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
      select: {
        id: true,
        login: true,
        firstName: true,
        lastName: true,
        companyName: true,
        phone: true,
        email: true,
        telegram: true,
        address: true,
        role: true,
        regionId: true,
        districtId: true,
        ratingAvg: true,
        ratingCount: true,
        ordersAnsweredOnTime: true,
        ordersIgnored: true
      }
    });

    const unreadNotifications = await this.prisma.notification.count({
      where: { userId: req.user.sub, readAt: null }
    });

    const pendingIncomingOrders = await this.prisma.order.count({
      where: { sellerId: req.user.sub, status: 'PENDING' }
    });

    return {
      user,
      counters: {
        unreadNotifications,
        pendingIncomingOrders
      }
    };
  }

  @Get('notifications')
  @UseGuards(JwtAuthGuard)
  async getNotifications(@Req() req: any) {
    return this.prisma.notification.findMany({
      where: { userId: req.user.sub },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  @Post('notifications/read-all')
  @UseGuards(JwtAuthGuard)
  async readAllNotifications(@Req() req: any) {
    await this.prisma.notification.updateMany({
      where: { userId: req.user.sub, readAt: null },
      data: { readAt: new Date() }
    });
    return { success: true };
  }

  // Admin summary
  @Get('admin/summary')
  @UseGuards(JwtAuthGuard)
  async getAdminSummary(@Req() req: any) {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'MODERATOR') {
      throw new ForbiddenException('Ruxsat berilmagan');
    }

    const [usersCount, listingsCount, contractsCount, ordersCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.listing.count({ where: { status: 'ACTIVE' } }),
      this.prisma.contract.count(),
      this.prisma.order.count()
    ]);

    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    return {
      usersCount,
      listingsCount,
      contractsCount,
      ordersCount,
      ordersByStatus
    };
  }
}
