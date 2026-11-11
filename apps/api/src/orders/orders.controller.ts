import { Controller, Get, Post, Body, Param, Query, Req, UseGuards, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class OrdersContractsController {
  constructor(private prisma: PrismaService) {}

  @Post('contracts')
  async createContract(@Req() req: any, @Body() body: any) {
    const buyerId = req.user.sub;
    const { listingId, quantity, paymentMethod } = body;

    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { seller: true }
    });

    if (!listing) throw new NotFoundException('Eʼlon topilmadi');
    if (listing.sellerId === buyerId) {
      throw new BadRequestException('Oʻz eʼloningizdan xarid qila olmaysiz');
    }

    const qty = parseFloat(quantity);
    if (qty <= 0) {
      throw new BadRequestException('Miqdor 0 dan katta boʻlishi kerak');
    }
    if (qty > Number(listing.availableQuantity)) {
      throw new BadRequestException('Mavjud miqdordan koʻp kiritib boʻlmaydi');
    }

    // Check trial or setting
    const trialSetting = await this.prisma.setting.findUnique({ where: { key: 'trial_period' } });
    const feeSetting = await this.prisma.setting.findUnique({ where: { key: 'contract_fee' } });

    let isTrial = true;
    let fee = 0;
    if (trialSetting) {
      const val = JSON.parse(trialSetting.value);
      if (val.isEnabled && new Date(val.endsAt) > new Date()) {
        isTrial = true;
        fee = 0;
      } else if (feeSetting) {
        fee = JSON.parse(feeSetting.value).amount || 0;
        isTrial = false;
      }
    }

    // Generate contract number SH-YYYY-000001
    const count = await this.prisma.contract.count();
    const contractNumber = `SH-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    const estimatedTotal = Number(listing.pricePerUnit) * qty;

    const contract = await this.prisma.contract.create({
      data: {
        number: contractNumber,
        listingId,
        buyerId,
        sellerId: listing.sellerId,
        quantity: qty,
        unit: listing.unit,
        pricePerUnit: listing.pricePerUnit,
        estimatedTotal,
        fee,
        isTrial,
        status: 'PAID',
        paidAt: new Date()
      }
    });

    // Create Payment record
    if (fee > 0 || paymentMethod) {
      await this.prisma.payment.create({
        data: {
          contractId: contract.id,
          provider: paymentMethod || 'CLICK',
          mode: 'MOCK',
          amount: fee,
          status: 'COMPLETED'
        }
      });
    }

    return contract;
  }

  @Post('orders')
  async createOrderFromContract(@Req() req: any, @Body() body: any) {
    const buyerId = req.user.sub;
    const { contractId } = body;

    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
      include: { order: true }
    });

    if (!contract) throw new NotFoundException('Shartnoma topilmadi');
    if (contract.buyerId !== buyerId) throw new ForbiddenException('Ruxsat berilmagan');
    if (contract.order) return contract.order;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72); // 72 hours deadline

    const order = await this.prisma.order.create({
      data: {
        contractId: contract.id,
        listingId: contract.listingId,
        buyerId: contract.buyerId,
        sellerId: contract.sellerId,
        quantity: contract.quantity,
        status: 'PENDING',
        expiresAt
      }
    });

    // Send notification to seller
    await this.prisma.notification.create({
      data: {
        userId: contract.sellerId,
        type: 'ORDER_RECEIVED',
        payload: JSON.stringify({
          key: 'notification.orderReceived',
          params: { orderId: order.id, contractNumber: contract.number }
        }),
        link: `/listings/${contract.listingId}`
      }
    });

    return order;
  }

  @Get('orders')
  async getOrders(@Req() req: any, @Query('role') role: string) {
    const userId = req.user.sub;
    const where: any = {};

    if (role === 'buyer') {
      where.buyerId = userId;
    } else {
      where.sellerId = userId;
    }

    return this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        listing: {
          include: {
            images: { take: 1 },
            region: true,
            district: true
          }
        },
        buyer: {
          select: { id: true, companyName: true, firstName: true, lastName: true, phone: true }
        },
        seller: {
          select: { id: true, companyName: true, firstName: true, lastName: true, phone: true }
        },
        contract: true,
        review: true
      }
    });
  }

  @Post('orders/:id/accept')
  async acceptOrder(@Param('id') id: string, @Req() req: any) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Buyurtma topilmadi');
    if (order.sellerId !== req.user.sub) throw new ForbiddenException('Ruxsat berilmagan');

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        status: 'ACCEPTED',
        acceptedAt: new Date()
      }
    });

    // Update seller on time stats
    await this.prisma.user.update({
      where: { id: order.sellerId },
      data: { ordersAnsweredOnTime: { increment: 1 } }
    });

    await this.prisma.notification.create({
      data: {
        userId: order.buyerId,
        type: 'ORDER_ACCEPTED',
        payload: JSON.stringify({ key: 'notification.orderAccepted', params: { orderId: id } }),
        link: `/orders`
      }
    });

    return updated;
  }

  @Post('orders/:id/reject')
  async rejectOrder(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Buyurtma topilmadi');
    if (order.sellerId !== req.user.sub) throw new ForbiddenException('Ruxsat berilmagan');

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectReason: body.reason || null,
        rejectedAt: new Date()
      }
    });

    await this.prisma.user.update({
      where: { id: order.sellerId },
      data: { ordersAnsweredOnTime: { increment: 1 } }
    });

    await this.prisma.notification.create({
      data: {
        userId: order.buyerId,
        type: 'ORDER_REJECTED',
        payload: JSON.stringify({ key: 'notification.orderRejected', params: { orderId: id } }),
        link: `/orders`
      }
    });

    return updated;
  }

  @Post('orders/:id/complete')
  async completeOrder(@Param('id') id: string, @Req() req: any) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Buyurtma topilmadi');

    return this.prisma.order.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });
  }

  @Get('contracts')
  async getContracts(@Req() req: any, @Query('role') role: string) {
    const userId = req.user.sub;
    const where: any = role === 'seller' ? { sellerId: userId } : { buyerId: userId };

    return this.prisma.contract.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        listing: {
          include: { images: { take: 1 } }
        },
        buyer: { select: { id: true, companyName: true, firstName: true, lastName: true, phone: true } },
        seller: { select: { id: true, companyName: true, firstName: true, lastName: true, phone: true } },
        order: true
      }
    });
  }
}
