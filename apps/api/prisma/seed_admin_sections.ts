import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding admin demo records...');
  const users = await prisma.user.findMany({ select: { id: true, login: true, firstName: true } });
  const admin = users.find(u => u.login === 'admin') || users[0];
  const demo = users.find(u => u.login === 'demo') || users[1] || users[0];
  const listings = await prisma.listing.findMany({ take: 5, select: { id: true, title: true, sellerId: true } });

  // 1. Settings
  await prisma.setting.upsert({
    where: { key: 'commission_rate' },
    update: { value: JSON.stringify({ rate: 0.015, enabled: true, trialEndsAt: '2027-01-10T00:00:00.000Z' }) },
    create: {
      key: 'commission_rate',
      value: JSON.stringify({ rate: 0.015, enabled: true, trialEndsAt: '2027-01-10T00:00:00.000Z' }),
      updatedById: admin.id,
    },
  });

  await prisma.setting.upsert({
    where: { key: 'order_timeout_hours' },
    update: { value: JSON.stringify({ hours: 72, autoCancel: true }) },
    create: {
      key: 'order_timeout_hours',
      value: JSON.stringify({ hours: 72, autoCancel: true }),
      updatedById: admin.id,
    },
  });

  // 2. Complaints
  const complaintCount = await prisma.complaint.count();
  if (complaintCount === 0 && listings.length > 0) {
    await prisma.complaint.createMany({
      data: [
        {
          reporterId: demo.id,
          listingId: listings[0].id,
          targetUserId: listings[0].sellerId,
          reason: 'PRICE_MISMATCH',
          comment: 'Telefon qilganda eʼlondagi narx 1350 emas, 1800 soʻm deb aytishdi.',
          status: 'PENDING',
        },
        {
          reporterId: demo.id,
          listingId: listings[1]?.id || listings[0].id,
          targetUserId: listings[1]?.sellerId || listings[0].sellerId,
          reason: 'QUALITY_ISSUE',
          comment: 'Mahsulot sifati rasmdagidek emas, yaroqsiz qismi koʻp.',
          status: 'IN_REVIEW',
        },
        {
          reporterId: demo.id,
          listingId: listings[2]?.id || listings[0].id,
          targetUserId: listings[2]?.sellerId || listings[0].sellerId,
          reason: 'OUT_OF_STOCK',
          comment: 'Omborda tovar yoʻq ekan, eʼlon oʻz vaqtida yopilmagan.',
          status: 'RESOLVED',
        },
      ],
    });
    console.log('Complaints seeded');
  }

  // 3. Support Tickets
  const ticketCount = await prisma.supportTicket.count();
  if (ticketCount === 0) {
    await prisma.supportTicket.createMany({
      data: [
        {
          userId: demo.id,
          subject: 'Shartnomani yuklab olishda xatolik',
          message: 'PDF formatda shartnomani yuklayotganda fayl ochilmayapti.',
          status: 'OPEN',
        },
        {
          userId: demo.id,
          subject: 'Yetkazib berish shartlari',
          message: 'Boshqa viloyatga yetkazib berish xizmati narxi qanday hisoblanadi?',
          status: 'ANSWERED',
          adminReply: 'Yetkazib berish xaridor va sotuvchi oʻrtasidagi shartnomada kelishilgan tarif asosida amalga oshiriladi.',
        },
        {
          userId: demo.id,
          subject: 'Tadbirkorlik hisobini tasdiqlash',
          message: 'STIR va yuridik maʼlumotlarim tekshiruvdan oʻtdimi?',
          status: 'CLOSED',
          adminReply: 'Ha, maʼlumotlaringiz tasdiqlandi va profilingizga tasdiqlangan tadbirkor belgisi berildi.',
        },
      ],
    });
    console.log('Support tickets seeded');
  }

  // 4. Audit Logs
  const auditCount = await prisma.auditLog.count();
  if (auditCount === 0) {
    await prisma.auditLog.createMany({
      data: [
        {
          actorId: admin.id,
          action: 'LOGIN',
          entity: 'AUTH',
          entityId: admin.id,
          after: JSON.stringify({ ip: '127.0.0.1', userAgent: 'Chrome/Admin' }),
        },
        {
          actorId: admin.id,
          action: 'EXPORT_REPORT',
          entity: 'REPORT',
          entityId: 'reg-report-q1',
          after: JSON.stringify({ type: 'REGIONAL_EXCEL', format: 'xlsx' }),
        },
        {
          actorId: admin.id,
          action: 'UPDATE_SETTING',
          entity: 'SETTING',
          entityId: 'commission_rate',
          before: JSON.stringify({ rate: 0.02 }),
          after: JSON.stringify({ rate: 0.015 }),
        },
        {
          actorId: admin.id,
          action: 'MODERATE_LISTING',
          entity: 'LISTING',
          entityId: listings[0]?.id || 'listing-1',
          after: JSON.stringify({ status: 'ACTIVE', verified: true }),
        },
      ],
    });
    console.log('Audit logs seeded');
  }

  console.log('Admin demo data check complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
