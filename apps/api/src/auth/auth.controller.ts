import { Controller, Post, Body, Get, Req, Res, UseGuards, UnauthorizedException, BadRequestException, Query } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  @Get('check-login')
  async checkLogin(@Query('login') login: string) {
    if (!login) return { available: false };
    const user = await this.prisma.user.findUnique({
      where: { login: login.toLowerCase() }
    });
    return { available: !user };
  }

  @Get('agreement')
  async getAgreement() {
    const agreement = await this.prisma.agreementVersion.findFirst({
      orderBy: { publishedAt: 'desc' }
    });
    return agreement;
  }

  @Post('register')
  async register(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { companyName, firstName, lastName, phone, regionId, districtId, email, login, password } = body;
    const lowerLogin = login.toLowerCase();

    const existingLogin = await this.prisma.user.findUnique({ where: { login: lowerLogin } });
    if (existingLogin) {
      throw new BadRequestException({ code: 'LOGIN_TAKEN', message: 'Bu login band' });
    }

    const existingPhone = await this.prisma.user.findUnique({ where: { phone } });
    if (existingPhone) {
      throw new BadRequestException({ code: 'PHONE_TAKEN', message: 'Bu telefon raqami allaqachon roʻyxatdan oʻtgan' });
    }

    if (email) {
      const existingEmail = await this.prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        throw new BadRequestException({ code: 'EMAIL_TAKEN', message: 'Bu elektron pochta allaqachon roʻyxatdan oʻtgan' });
      }
    }

    const passwordHash = await argon2.hash(password);
    const user = await this.prisma.user.create({
      data: {
        companyName,
        firstName,
        lastName,
        phone,
        regionId,
        districtId,
        email: email || null,
        login: lowerLogin,
        passwordHash,
        agreementVersionAccepted: "1.0",
        agreementAcceptedAt: new Date()
      }
    });

    const token = this.jwtService.sign({ sub: user.id, role: user.role, login: user.login });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return {
      user: {
        id: user.id,
        login: user.login,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        phone: user.phone,
        role: user.role,
        regionId: user.regionId,
        districtId: user.districtId
      },
      token
    };
  }

  @Post('login')
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { login, password, rememberMe } = body;
    if (!login || !password) {
      throw new BadRequestException({ code: 'INVALID_CREDENTIALS', message: 'Login yoki parol notoʻgʻri' });
    }

    const user = await this.prisma.user.findUnique({
      where: { login: login.toLowerCase() }
    });

    if (!user || !user.passwordHash) {
      throw new BadRequestException({ code: 'INVALID_CREDENTIALS', message: 'Login yoki parol notoʻgʻri' });
    }

    if (user.isBlocked) {
      throw new BadRequestException({ code: 'USER_BLOCKED', message: user.blockReason || 'Hisobingiz bloklangan' });
    }

    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) {
      throw new BadRequestException({ code: 'INVALID_CREDENTIALS', message: 'Login yoki parol notoʻgʻri' });
    }

    const token = this.jwtService.sign({ sub: user.id, role: user.role, login: user.login });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      ...(rememberMe ? { maxAge: 30 * 24 * 60 * 60 * 1000 } : {})
    });

    return {
      user: {
        id: user.id,
        login: user.login,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        phone: user.phone,
        role: user.role,
        regionId: user.regionId,
        districtId: user.districtId
      },
      token
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { success: true };
  }
}
