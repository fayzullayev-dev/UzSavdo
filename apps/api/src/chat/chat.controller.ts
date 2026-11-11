import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class ChatFavoritesController {
  constructor(private prisma: PrismaService) {}

  @Get('favorites')
  async getFavorites(@Req() req: any) {
    const favs = await this.prisma.favorite.findMany({
      where: { userId: req.user.sub },
      include: {
        listing: {
          include: {
            images: { take: 1 },
            category: true,
            region: true,
            district: true
          }
        }
      }
    });
    return favs.map(f => f.listing);
  }

  @Post('favorites/:listingId')
  async addFavorite(@Param('listingId') listingId: string, @Req() req: any) {
    await this.prisma.favorite.upsert({
      where: {
        userId_listingId: {
          userId: req.user.sub,
          listingId
        }
      },
      update: {},
      create: {
        userId: req.user.sub,
        listingId
      }
    });
    return { success: true };
  }

  @Delete('favorites/:listingId')
  async removeFavorite(@Param('listingId') listingId: string, @Req() req: any) {
    await this.prisma.favorite.deleteMany({
      where: {
        userId: req.user.sub,
        listingId
      }
    });
    return { success: true };
  }

  @Get('conversations')
  async getConversations(@Req() req: any) {
    const userId = req.user.sub;
    return this.prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }]
      },
      orderBy: { lastMessageAt: 'desc' },
      include: {
        buyer: { select: { id: true, companyName: true, firstName: true, lastName: true } },
        seller: { select: { id: true, companyName: true, firstName: true, lastName: true } },
        contract: {
          include: {
            listing: { select: { title: true } }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
  }

  @Get('conversations/:id/messages')
  async getMessages(@Param('id') id: string) {
    return this.prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true } }
      }
    });
  }

  @Post('conversations/:id/messages')
  async sendMessage(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    const conv = await this.prisma.conversation.findUnique({ where: { id } });
    if (!conv) throw new NotFoundException('Suhbat topilmadi');

    const msg = await this.prisma.message.create({
      data: {
        conversationId: id,
        senderId: req.user.sub,
        text: body.text
      }
    });

    await this.prisma.conversation.update({
      where: { id },
      data: { lastMessageAt: new Date() }
    });

    return msg;
  }
}
