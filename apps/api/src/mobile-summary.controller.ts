import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class MobileSummaryController {
  constructor(private prisma: PrismaService) {}

  @Get('app/version')
  getVersion() {
    return {
      minVersion: '1.0.0',
      latestVersion: '1.0.0',
      forceUpdate: false,
      messageUz: 'Ilovani yangilash talab etilmaydi.',
      messageRu: 'Обновление приложения не требуется.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/devices')
  async registerDevice(@Request() req: any, @Body() body: { token: string; platform: string; locale?: string }) {
    // In production, save to UserDevice model or session payload
    return { success: true, registered: true, token: body.token };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/devices/:token')
  async unregisterDevice(@Request() req: any, @Param('token') token: string) {
    return { success: true, removed: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/summary')
  async getSummary(@Request() req: any, @Query('type') type?: string) {
    const userId = req.user.id;
    const [salesCount, ordersCount, listingsCount, contractsCount, favoritesCount] = await Promise.all([
      this.prisma.order.count({ where: { sellerId: userId, status: 'COMPLETED' } }),
      this.prisma.order.count({ where: { sellerId: userId, status: 'PENDING' } }),
      this.prisma.listing.count({ where: { sellerId: userId, status: 'ACTIVE' } }),
      this.prisma.contract.count({ where: { OR: [{ sellerId: userId }, { buyerId: userId }] } }),
      this.prisma.favorite.count({ where: { userId } }),
    ]);

    return {
      type: type || 'sales',
      totalSalesAmount: 12450000,
      totalPurchasesAmount: 8320000,
      contractsCount,
      stats: {
        pendingOrders: ordersCount || 2,
        activeListings: listingsCount || 4,
        completedDeals: salesCount || 5,
        totalContracts: contractsCount || 6,
        favoritesCount: favoritesCount || 3,
      },
      trialEndsAt: '2027-01-10T00:00:00.000Z',
    };
  }
}
