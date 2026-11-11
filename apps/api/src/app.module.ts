import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';
import { AuthController } from './auth/auth.controller';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ListingsController } from './listings/listings.controller';
import { OrdersContractsController } from './orders/orders.controller';
import { DictionariesController } from './dictionaries.controller';
import { ChatFavoritesController } from './chat/chat.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'uzsavdo_super_secret_jwt_key_2026_asian_tashkent',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [
    AuthController,
    ListingsController,
    OrdersContractsController,
    DictionariesController,
    ChatFavoritesController,
  ],
  providers: [PrismaService, JwtAuthGuard],
  exports: [PrismaService, JwtAuthGuard],
})
export class AppModule {}
