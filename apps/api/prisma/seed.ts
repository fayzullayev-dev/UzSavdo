import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";
import { REGIONS_DATA } from "@uzsavdo/shared";
import { CATEGORIES_DATA } from "@uzsavdo/shared";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Settings & Agreement
  await prisma.setting.upsert({
    where: { key: "contract_fee" },
    update: {},
    create: {
      key: "contract_fee",
      value: JSON.stringify({ amount: 0, currency: "UZS" })
    }
  });

  const trialEnds = new Date();
  trialEnds.setDate(trialEnds.getDate() + 60);

  await prisma.setting.upsert({
    where: { key: "trial_period" },
    update: {},
    create: {
      key: "trial_period",
      value: JSON.stringify({ isEnabled: true, endsAt: trialEnds.toISOString() })
    }
  });

  await prisma.agreementVersion.upsert({
    where: { version: "1.0" },
    update: {},
    create: {
      version: "1.0",
      textUz: `FOYDALANUVCHI KELISHUVI (Ommaviy oferta)\n\n1. UMUMIY QOIDALAR\n1.1. Mazkur hujjat Р вЂ™Р’В«UzSavdoР вЂ™Р’В» ulgurji savdo maydonchasidan (keyingi o'rinlarda Р Р†Р вЂљРІР‚Сњ Platforma) foydalanish shartlarini belgilaydi.\n1.2. Platformada ro'yxatdan o'tgan har bir shaxs ushbu Kelishuv shartlariga to'liq va so'zsiz rozilik bildiradi.\n\n2. RO'YXATDAN O'TISH VA MA'LUMOTLARNING TO'G'RILIGI\n2.1. Foydalanuvchi taqdim etilayotgan korxona, telefon raqami va manzillarning haqiqiyligi uchun to'liq javobgardir.\n\n3. E'LONLARNI JOYLASHTIRISH QOIDALARI\n3.1. Taqiqlangan tovarlar, kontrafakt yoki yolg'on ma'lumotlarni joylashtirish qat'iyan taqiqlanadi.\n3.2. Mahsulot fotosuratlari faqat haqiqiy tovarning surati bo'lishi shart.\n\n4. MAHSULOT SHARTNOMASI VA TO'LOV\n4.1. Xaridor sotuvchining aloqa ma'lumotlarini faqat mahsulot shartnomasini rasmiylashtirgandan so'ng ko'radi.\n4.2. Shartnoma uchun to'lov platforma xizmati uchun to'lanadi va QAYTARILMAYDI (shu jumladan sotuvchi buyurtmani 3 kun ichida qabul qilmagan taqdirda ham).\n\n5. SOTUVCHINING MAJBURIYATI\n5.1. Sotuvchi kelib tushgan buyurtmani 72 soat (3 kun) ichida qabul qilishi yoki rad etishi shart.\n5.2. Javobsiz qolgan buyurtmalar 72 soatdan so'ng avtomatik ravishda bekor qilinadi.\n\n6. MAHSULOT UCHUN HISOB-KITOB\n6.1. Mahsulot uchun haq to'lash va yetkazib berish taraflar o'rtasida to'g'ridan-to'g'ri mustaqil ravishda amalga oshiriladi.\n\n7. SHAXSIY MA'LUMOTLAR\n7.1. O'zbekiston Respublikasining Р вЂ™Р’В«Shaxsiy ma'lumotlar to'g'risidaР вЂ™Р’В»gi qonuniga muvofiq, ma'lumotlar O'zbekiston hududidagi serverlarda saqlanadi.`,
      textRu: `Р В РЎСџР В РЎвЂєР В РІР‚С”Р В Р’В¬Р В РІР‚вЂќР В РЎвЂєР В РІР‚в„ўР В РЎвЂ™Р В РЎС›Р В РІР‚СћР В РІР‚С”Р В Р’В¬Р В Р Р‹Р В РЎв„ўР В РЎвЂєР В РІР‚Сћ Р В Р Р‹Р В РЎвЂєР В РІР‚СљР В РІР‚С”Р В РЎвЂ™Р В Р РѓР В РІР‚СћР В РЎСљР В Р’ВР В РІР‚Сћ (Р В РЎСџР РЋРЎвЂњР В Р’В±Р В Р’В»Р В РЎвЂР РЋРІР‚РЋР В Р вЂ¦Р В Р’В°Р РЋР РЏ Р В РЎвЂўР РЋРІР‚С›Р В Р’ВµР РЋР вЂљР РЋРІР‚С™Р В Р’В°)\n\n1. Р В РЎвЂєР В РІР‚ВР В Р’В©Р В Р’ВР В РІР‚Сћ Р В РЎСџР В РЎвЂєР В РІР‚С”Р В РЎвЂєР В РІР‚вЂњР В РІР‚СћР В РЎСљР В Р’ВР В Р вЂЎ\n1.1. Р В РЎСљР В Р’В°Р РЋР С“Р РЋРІР‚С™Р В РЎвЂўР РЋР РЏР РЋРІР‚В°Р В РЎвЂР В РІвЂћвЂ“ Р В РўвЂР В РЎвЂўР В РЎвЂќР РЋРЎвЂњР В РЎВР В Р’ВµР В Р вЂ¦Р РЋРІР‚С™ Р В РЎвЂўР В РЎвЂ”Р РЋР вЂљР В Р’ВµР В РўвЂР В Р’ВµР В Р’В»Р РЋР РЏР В Р’ВµР РЋРІР‚С™ Р РЋРЎвЂњР РЋР С“Р В Р’В»Р В РЎвЂўР В Р вЂ Р В РЎвЂР РЋР РЏ Р В РЎвЂР РЋР С“Р В РЎвЂ”Р В РЎвЂўР В Р’В»Р РЋР Р‰Р В Р’В·Р В РЎвЂўР В Р вЂ Р В Р’В°Р В Р вЂ¦Р В РЎвЂР РЋР РЏ Р В РЎвЂўР В РЎвЂ”Р РЋРІР‚С™Р В РЎвЂўР В Р вЂ Р В РЎвЂўР В РІвЂћвЂ“ Р РЋРІР‚С™Р В РЎвЂўР РЋР вЂљР В РЎвЂ“Р В РЎвЂўР В Р вЂ Р В РЎвЂўР В РІвЂћвЂ“ Р В РЎвЂ”Р В Р’В»Р В РЎвЂўР РЋРІР‚В°Р В Р’В°Р В РўвЂР В РЎвЂќР В РЎвЂ Р вЂ™Р’В«UzSavdoР вЂ™Р’В».\n1.2. Р В Р’В Р В Р’ВµР В РЎвЂ“Р В РЎвЂР РЋР С“Р РЋРІР‚С™Р РЋР вЂљР В Р’В°Р РЋРІР‚В Р В РЎвЂР РЋР РЏ Р В Р вЂ¦Р В Р’В° Р В РЎвЂ”Р В Р’В»Р В Р’В°Р РЋРІР‚С™Р РЋРІР‚С›Р В РЎвЂўР РЋР вЂљР В РЎВР В Р’Вµ Р В РЎвЂўР В Р’В·Р В Р вЂ¦Р В Р’В°Р РЋРІР‚РЋР В Р’В°Р В Р’ВµР РЋРІР‚С™ Р В РЎвЂ”Р В РЎвЂўР В Р’В»Р В Р вЂ¦Р В РЎвЂўР В Р’Вµ Р В РЎвЂ Р В Р’В±Р В Р’ВµР В Р’В·Р В РЎвЂўР В РЎвЂ“Р В РЎвЂўР В Р вЂ Р В РЎвЂўР РЋР вЂљР В РЎвЂўР РЋРІР‚РЋР В Р вЂ¦Р В РЎвЂўР В Р’Вµ Р РЋР С“Р В РЎвЂўР В РЎвЂ“Р В Р’В»Р В Р’В°Р РЋР С“Р В РЎвЂР В Р’Вµ Р РЋР С“ Р В Р вЂ¦Р В Р’В°Р РЋР С“Р РЋРІР‚С™Р В РЎвЂўР РЋР РЏР РЋРІР‚В°Р В РЎвЂР В РЎВ Р В Р Р‹Р В РЎвЂўР В РЎвЂ“Р В Р’В»Р В Р’В°Р РЋРІвЂљВ¬Р В Р’ВµР В Р вЂ¦Р В РЎвЂР В Р’ВµР В РЎВ.\n\n2. Р В Р’В Р В РІР‚СћР В РІР‚СљР В Р’ВР В Р Р‹Р В РЎС›Р В Р’В Р В РЎвЂ™Р В Р’В¦Р В Р’ВР В Р вЂЎ Р В Р’В Р В РІР‚СњР В РЎвЂєР В Р Р‹Р В РЎС›Р В РЎвЂєР В РІР‚в„ўР В РІР‚СћР В Р’В Р В РЎСљР В РЎвЂєР В Р Р‹Р В РЎС›Р В Р’В¬ Р В РІР‚СњР В РЎвЂ™Р В РЎСљР В РЎСљР В Р’В«Р В РўС’\n2.1. Р В РЎСџР В РЎвЂўР В Р’В»Р РЋР Р‰Р В Р’В·Р В РЎвЂўР В Р вЂ Р В Р’В°Р РЋРІР‚С™Р В Р’ВµР В Р’В»Р РЋР Р‰ Р В Р вЂ¦Р В Р’ВµР РЋР С“Р РЋРІР‚ВР РЋРІР‚С™ Р В РЎвЂ”Р В РЎвЂўР В Р’В»Р В Р вЂ¦Р РЋРЎвЂњР РЋР вЂ№ Р В РЎвЂўР РЋРІР‚С™Р В Р вЂ Р В Р’ВµР РЋРІР‚С™Р РЋР С“Р РЋРІР‚С™Р В Р вЂ Р В Р’ВµР В Р вЂ¦Р В Р вЂ¦Р В РЎвЂўР РЋР С“Р РЋРІР‚С™Р РЋР Р‰ Р В Р’В·Р В Р’В° Р В РўвЂР В РЎвЂўР РЋР С“Р РЋРІР‚С™Р В РЎвЂўР В Р вЂ Р В Р’ВµР РЋР вЂљР В Р вЂ¦Р В РЎвЂўР РЋР С“Р РЋРІР‚С™Р РЋР Р‰ Р В РўвЂР В Р’В°Р В Р вЂ¦Р В Р вЂ¦Р РЋРІР‚в„–Р РЋРІР‚В¦ Р В РЎвЂ”Р РЋР вЂљР В Р’ВµР В РўвЂР В РЎвЂ”Р РЋР вЂљР В РЎвЂР РЋР РЏР РЋРІР‚С™Р В РЎвЂР РЋР РЏ, Р РЋРІР‚С™Р В Р’ВµР В Р’В»Р В Р’ВµР РЋРІР‚С›Р В РЎвЂўР В Р вЂ¦Р В Р’В° Р В РЎвЂ Р В Р’В°Р В РўвЂР РЋР вЂљР В Р’ВµР РЋР С“Р В Р’В°.\n\n3. Р В РЎСџР В Р’В Р В РЎвЂ™Р В РІР‚в„ўР В Р’ВР В РІР‚С”Р В РЎвЂ™ Р В Р’В Р В РЎвЂ™Р В РІР‚вЂќР В РЎС™Р В РІР‚СћР В Р’В©Р В РІР‚СћР В РЎСљР В Р’ВР В Р вЂЎ Р В РЎвЂєР В РІР‚ВР В Р вЂћР В Р вЂЎР В РІР‚в„ўР В РІР‚С”Р В РІР‚СћР В РЎСљР В Р’ВР В РІвЂћСћ\n3.1. Р В РІР‚вЂќР В Р’В°Р В РЎвЂ”Р РЋР вЂљР В Р’ВµР РЋРІР‚В°Р В Р’ВµР В Р вЂ¦Р В РЎвЂў Р РЋР вЂљР В Р’В°Р В Р’В·Р В РЎВР В Р’ВµР РЋРІР‚В°Р В Р’ВµР В Р вЂ¦Р В РЎвЂР В Р’Вµ Р В Р’В·Р В Р’В°Р В РЎвЂ”Р РЋР вЂљР В Р’ВµР РЋРІР‚В°Р В Р’ВµР В Р вЂ¦Р В Р вЂ¦Р РЋРІР‚в„–Р РЋРІР‚В¦ Р РЋРІР‚С™Р В РЎвЂўР В Р вЂ Р В Р’В°Р РЋР вЂљР В РЎвЂўР В Р вЂ , Р РЋРІР‚С›Р В Р’В°Р В Р’В»Р РЋР Р‰Р РЋР С“Р В РЎвЂР РЋРІР‚С›Р В РЎвЂР В РЎвЂќР В Р’В°Р РЋРІР‚С™Р В Р’В° Р В РЎвЂ Р В Р вЂ¦Р В Р’ВµР В РўвЂР В РЎвЂўР РЋР С“Р РЋРІР‚С™Р В РЎвЂўР В Р вЂ Р В Р’ВµР РЋР вЂљР В Р вЂ¦Р РЋРІР‚в„–Р РЋРІР‚В¦ Р РЋРІР‚В Р В Р’ВµР В Р вЂ¦.\n3.2. Р В Р’В¤Р В РЎвЂўР РЋРІР‚С™Р В РЎвЂўР В РЎвЂ“Р РЋР вЂљР В Р’В°Р РЋРІР‚С›Р В РЎвЂР В РЎвЂ Р В РўвЂР В РЎвЂўР В Р’В»Р В Р’В¶Р В Р вЂ¦Р РЋРІР‚в„– Р В РЎвЂўР РЋРІР‚С™Р В РЎвЂўР В Р’В±Р РЋР вЂљР В Р’В°Р В Р’В¶Р В Р’В°Р РЋРІР‚С™Р РЋР Р‰ Р В РЎвЂР РЋР С“Р В РЎвЂќР В Р’В»Р РЋР вЂ№Р РЋРІР‚РЋР В РЎвЂР РЋРІР‚С™Р В Р’ВµР В Р’В»Р РЋР Р‰Р В Р вЂ¦Р В РЎвЂў Р РЋР вЂљР В Р’ВµР В Р’В°Р В Р’В»Р РЋР Р‰Р В Р вЂ¦Р РЋРІР‚в„–Р В РІвЂћвЂ“ Р РЋРІР‚С™Р В РЎвЂўР В Р вЂ Р В Р’В°Р РЋР вЂљ.\n\n4. Р В РІР‚СњР В РЎвЂєР В РІР‚СљР В РЎвЂєР В РІР‚в„ўР В РЎвЂєР В Р’В  Р В РЎСљР В РЎвЂ™ Р В РЎС›Р В РЎвЂєР В РІР‚в„ўР В РЎвЂ™Р В Р’В  Р В Р’В Р В РЎвЂєР В РЎСџР В РІР‚С”Р В РЎвЂ™Р В РЎС›Р В РЎвЂ™\n4.1. Р В РЎСџР В РЎвЂўР В РЎвЂќР РЋРЎвЂњР В РЎвЂ”Р В Р’В°Р РЋРІР‚С™Р В Р’ВµР В Р’В»Р РЋР Р‰ Р В РЎвЂ”Р В РЎвЂўР В Р’В»Р РЋРЎвЂњР РЋРІР‚РЋР В Р’В°Р В Р’ВµР РЋРІР‚С™ Р В РўвЂР В РЎвЂўР РЋР С“Р РЋРІР‚С™Р РЋРЎвЂњР В РЎвЂ” Р В РЎвЂќ Р В РЎвЂќР В РЎвЂўР В Р вЂ¦Р РЋРІР‚С™Р В Р’В°Р В РЎвЂќР РЋРІР‚С™Р В Р’В°Р В РЎВ Р В РЎвЂ”Р РЋР вЂљР В РЎвЂўР В РўвЂР В Р’В°Р В Р вЂ Р РЋРІР‚В Р В Р’В° Р РЋРІР‚С™Р В РЎвЂўР В Р’В»Р РЋР Р‰Р В РЎвЂќР В РЎвЂў Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р В Р’В»Р В Р’Вµ Р В РЎвЂўР РЋРІР‚С›Р В РЎвЂўР РЋР вЂљР В РЎВР В Р’В»Р В Р’ВµР В Р вЂ¦Р В РЎвЂР РЋР РЏ Р В РўвЂР В РЎвЂўР В РЎвЂ“Р В РЎвЂўР В Р вЂ Р В РЎвЂўР РЋР вЂљР В Р’В° Р В Р вЂ¦Р В Р’В° Р РЋРІР‚С™Р В РЎвЂўР В Р вЂ Р В Р’В°Р РЋР вЂљ.\n4.2. Р В РЎвЂєР В РЎвЂ”Р В Р’В»Р В Р’В°Р РЋРІР‚С™Р В Р’В° Р В Р’В·Р В Р’В° Р В РЎвЂўР РЋРІР‚С›Р В РЎвЂўР РЋР вЂљР В РЎВР В Р’В»Р В Р’ВµР В Р вЂ¦Р В РЎвЂР В Р’Вµ Р В РўвЂР В РЎвЂўР В РЎвЂ“Р В РЎвЂўР В Р вЂ Р В РЎвЂўР РЋР вЂљР В Р’В° Р РЋР РЏР В Р вЂ Р В Р’В»Р РЋР РЏР В Р’ВµР РЋРІР‚С™Р РЋР С“Р РЋР РЏ Р В РЎвЂ”Р В Р’В»Р В Р’В°Р РЋРІР‚С™Р В РЎвЂўР В РІвЂћвЂ“ Р В Р’В·Р В Р’В° Р РЋР С“Р В Р’ВµР РЋР вЂљР В Р вЂ Р В РЎвЂР РЋР С“ Р В РЎвЂ”Р В Р’В»Р В Р’В°Р РЋРІР‚С™Р РЋРІР‚С›Р В РЎвЂўР РЋР вЂљР В РЎВР РЋРІР‚в„– Р В РЎвЂ Р В РЎСљР В РІР‚Сћ Р В РІР‚в„ўР В РЎвЂєР В РІР‚вЂќР В РІР‚в„ўР В Р’В Р В РЎвЂ™Р В Р’В©Р В РЎвЂ™Р В РІР‚СћР В РЎС›Р В Р Р‹Р В Р вЂЎ, Р В Р вЂ  Р РЋРІР‚С™Р В РЎвЂўР В РЎВ Р РЋРІР‚РЋР В РЎвЂР РЋР С“Р В Р’В»Р В Р’Вµ Р В РЎвЂ”Р РЋР вЂљР В РЎвЂ Р В РЎвЂР РЋР С“Р РЋРІР‚С™Р В Р’ВµР РЋРІР‚РЋР В Р’ВµР В Р вЂ¦Р В РЎвЂР В РЎвЂ 3-Р В РўвЂР В Р вЂ¦Р В Р’ВµР В Р вЂ Р В Р вЂ¦Р В РЎвЂўР В РЎвЂ“Р В РЎвЂў Р РЋР С“Р РЋР вЂљР В РЎвЂўР В РЎвЂќР В Р’В° Р В РЎвЂўР РЋРІР‚С™Р В Р вЂ Р В Р’ВµР РЋРІР‚С™Р В Р’В° Р В РЎвЂ”Р РЋР вЂљР В РЎвЂўР В РўвЂР В Р’В°Р В Р вЂ Р РЋРІР‚В Р В Р’В°.\n\n5. Р В РЎвЂєР В РІР‚ВР В Р вЂЎР В РІР‚вЂќР В РЎвЂ™Р В РЎСљР В РЎСљР В РЎвЂєР В Р Р‹Р В РЎС›Р В Р’В Р В РЎСџР В Р’В Р В РЎвЂєР В РІР‚СњР В РЎвЂ™Р В РІР‚в„ўР В Р’В¦Р В РЎвЂ™\n5.1. Р В РЎСџР РЋР вЂљР В РЎвЂўР В РўвЂР В Р’В°Р В Р вЂ Р В Р’ВµР РЋРІР‚В  Р В РЎвЂўР В Р’В±Р РЋР РЏР В Р’В·Р В Р’В°Р В Р вЂ¦ Р В РЎвЂ”Р РЋР вЂљР В РЎвЂР В Р вЂ¦Р РЋР РЏР РЋРІР‚С™Р РЋР Р‰ Р В РЎвЂР В Р’В»Р В РЎвЂ Р В РЎвЂўР РЋРІР‚С™Р В РЎвЂќР В Р’В»Р В РЎвЂўР В Р вЂ¦Р В РЎвЂР РЋРІР‚С™Р РЋР Р‰ Р В Р’В·Р В Р’В°Р В РЎвЂќР В Р’В°Р В Р’В· Р В Р вЂ  Р РЋРІР‚С™Р В Р’ВµР РЋРІР‚РЋР В Р’ВµР В Р вЂ¦Р В РЎвЂР В Р’Вµ 72 Р РЋРІР‚РЋР В Р’В°Р РЋР С“Р В РЎвЂўР В Р вЂ  (3 Р В РўвЂР В Р вЂ¦Р В Р’ВµР В РІвЂћвЂ“).\n5.2. Р В РЎСљР В Р’ВµР В РЎвЂўР В Р’В±Р РЋР вЂљР В Р’В°Р В Р’В±Р В РЎвЂўР РЋРІР‚С™Р В Р’В°Р В Р вЂ¦Р В Р вЂ¦Р РЋРІР‚в„–Р В Р’Вµ Р В Р’В·Р В Р’В°Р В РЎвЂќР В Р’В°Р В Р’В·Р РЋРІР‚в„– Р В Р’В°Р В Р вЂ¦Р В Р вЂ¦Р РЋРЎвЂњР В Р’В»Р В РЎвЂР РЋР вЂљР РЋРЎвЂњР РЋР вЂ№Р РЋРІР‚С™Р РЋР С“Р РЋР РЏ Р В Р’В°Р В Р вЂ Р РЋРІР‚С™Р В РЎвЂўР В РЎВР В Р’В°Р РЋРІР‚С™Р В РЎвЂР РЋРІР‚РЋР В Р’ВµР РЋР С“Р В РЎвЂќР В РЎвЂ Р РЋРІР‚РЋР В Р’ВµР РЋР вЂљР В Р’ВµР В Р’В· 72 Р РЋРІР‚РЋР В Р’В°Р РЋР С“Р В Р’В°.\n\n6. Р В Р’В Р В РЎвЂ™Р В Р Р‹Р В Р’В§Р В Р С“Р В РЎС›Р В Р’В« Р В РІР‚вЂќР В РЎвЂ™ Р В РЎС›Р В РЎвЂєР В РІР‚в„ўР В РЎвЂ™Р В Р’В \n6.1. Р В Р’В Р В Р’В°Р РЋР С“Р РЋРІР‚РЋР РЋРІР‚ВР РЋРІР‚С™Р РЋРІР‚в„– Р В Р’В·Р В Р’В° Р РЋР С“Р В Р’В°Р В РЎВ Р РЋРІР‚С™Р В РЎвЂўР В Р вЂ Р В Р’В°Р РЋР вЂљ Р В РЎвЂ”Р РЋР вЂљР В РЎвЂўР В РЎвЂР В Р’В·Р В Р вЂ Р В РЎвЂўР В РўвЂР РЋР РЏР РЋРІР‚С™Р РЋР С“Р РЋР РЏ Р РЋР С“Р РЋРІР‚С™Р В РЎвЂўР РЋР вЂљР В РЎвЂўР В Р вЂ¦Р В Р’В°Р В РЎВР В РЎвЂ Р В Р вЂ¦Р В Р’В°Р В РЎвЂ”Р РЋР вЂљР РЋР РЏР В РЎВР РЋРЎвЂњР РЋР вЂ№. Р В РЎСџР В Р’В»Р В Р’В°Р РЋРІР‚С™Р РЋРІР‚С›Р В РЎвЂўР РЋР вЂљР В РЎВР В Р’В° Р В Р вЂ¦Р В Р’Вµ Р В Р вЂ Р РЋРІР‚в„–Р РЋР С“Р РЋРІР‚С™Р РЋРЎвЂњР В РЎвЂ”Р В Р’В°Р В Р’ВµР РЋРІР‚С™ Р РЋР С“Р РЋРІР‚С™Р В РЎвЂўР РЋР вЂљР В РЎвЂўР В Р вЂ¦Р В РЎвЂўР В РІвЂћвЂ“ Р РЋР С“Р В РўвЂР В Р’ВµР В Р’В»Р В РЎвЂќР В РЎвЂ Р В РЎвЂќР РЋРЎвЂњР В РЎвЂ”Р В Р’В»Р В РЎвЂ-Р В РЎвЂ”Р РЋР вЂљР В РЎвЂўР В РўвЂР В Р’В°Р В Р’В¶Р В РЎвЂ.\n\n7. Р В РЎСџР В РІР‚СћР В Р’В Р В Р Р‹Р В РЎвЂєР В РЎСљР В РЎвЂ™Р В РІР‚С”Р В Р’В¬Р В РЎСљР В Р’В«Р В РІР‚Сћ Р В РІР‚СњР В РЎвЂ™Р В РЎСљР В РЎСљР В Р’В«Р В РўС’\n7.1. Р В РІР‚в„ў Р РЋР С“Р В РЎвЂўР В РЎвЂўР РЋРІР‚С™Р В Р вЂ Р В Р’ВµР РЋРІР‚С™Р РЋР С“Р РЋРІР‚С™Р В Р вЂ Р В РЎвЂР В РЎвЂ Р РЋР С“ Р В Р’В·Р В Р’В°Р В РЎвЂќР В РЎвЂўР В Р вЂ¦Р В РЎвЂўР В РЎВ Р В Р’В Р В Р в‚¬Р В Р’В· Р вЂ™Р’В«Р В РЎвЂє Р В РЎвЂ”Р В Р’ВµР РЋР вЂљР РЋР С“Р В РЎвЂўР В Р вЂ¦Р В Р’В°Р В Р’В»Р РЋР Р‰Р В Р вЂ¦Р РЋРІР‚в„–Р РЋРІР‚В¦ Р В РўвЂР В Р’В°Р В Р вЂ¦Р В Р вЂ¦Р РЋРІР‚в„–Р РЋРІР‚В¦Р вЂ™Р’В», Р В РўвЂР В Р’В°Р В Р вЂ¦Р В Р вЂ¦Р РЋРІР‚в„–Р В Р’Вµ Р РЋРІР‚В¦Р РЋР вЂљР В Р’В°Р В Р вЂ¦Р РЋР РЏР РЋРІР‚С™Р РЋР С“Р РЋР РЏ Р В Р вЂ¦Р В Р’В° Р РЋР С“Р В Р’ВµР РЋР вЂљР В Р вЂ Р В Р’ВµР РЋР вЂљР В Р’В°Р РЋРІР‚В¦ Р В Р вЂ  Р В Р’В Р В Р’ВµР РЋР С“Р В РЎвЂ”Р РЋРЎвЂњР В Р’В±Р В Р’В»Р В РЎвЂР В РЎвЂќР В Р’Вµ Р В Р в‚¬Р В Р’В·Р В Р’В±Р В Р’ВµР В РЎвЂќР В РЎвЂР РЋР С“Р РЋРІР‚С™Р В Р’В°Р В Р вЂ¦.`
    }
  });

  await prisma.contractTemplate.upsert({
    where: { version: "1.0" },
    update: {},
    create: {
      version: "1.0",
      textUz: `MAHSULOT SHARTNOMASI Р Р†РІР‚С›РІР‚вЂњ {number}\n\nTuzilgan sana: {date}\nTuzilgan joyi: {seller_region}\n\nР вЂ™Р’В«UzSavdoР вЂ™Р’В» elektron maydonchasi orqali {buyer_company} (keyingi o'rinlarda Р Р†Р вЂљРІР‚Сњ Р вЂ™Р’В«XaridorР вЂ™Р’В») va {seller_company} (keyingi o'rinlarda Р Р†Р вЂљРІР‚Сњ Р вЂ™Р’В«SotuvchiР вЂ™Р’В») o'rtasida quyidagi shartlarda tuzildi:\n1. Shartnoma predmeti: {product_title}, miqdori: {quantity} {unit}.\n2. Narxi: {price_per_unit} so'm / {unit}.\n3. Umumiy taxminiy qiymati: {estimated_total} so'm.\n4. Yetkazib berish sharti: {delivery_type}.\n5. Taraflar hisob-kitobni to'g'ridan-to'g'ri o'zaro kelishuv asosida amalga oshiradilar.`,
      textRu: `Р В РІР‚СњР В РЎвЂєР В РІР‚СљР В РЎвЂєР В РІР‚в„ўР В РЎвЂєР В Р’В  Р В РЎСљР В РЎвЂ™ Р В РЎС›Р В РЎвЂєР В РІР‚в„ўР В РЎвЂ™Р В Р’В  Р Р†РІР‚С›РІР‚вЂњ {number}\n\nР В РІР‚СњР В Р’В°Р РЋРІР‚С™Р В Р’В° Р В Р’В·Р В Р’В°Р В РЎвЂќР В Р’В»Р РЋР вЂ№Р РЋРІР‚РЋР В Р’ВµР В Р вЂ¦Р В РЎвЂР РЋР РЏ: {date}\nР В РЎС™Р В Р’ВµР РЋР С“Р РЋРІР‚С™Р В РЎвЂў Р В Р’В·Р В Р’В°Р В РЎвЂќР В Р’В»Р РЋР вЂ№Р РЋРІР‚РЋР В Р’ВµР В Р вЂ¦Р В РЎвЂР РЋР РЏ: {seller_region}\n\nР В РЎСљР В Р’В°Р РЋР С“Р РЋРІР‚С™Р В РЎвЂўР РЋР РЏР РЋРІР‚В°Р В РЎвЂР В РІвЂћвЂ“ Р В РўвЂР В РЎвЂўР В РЎвЂ“Р В РЎвЂўР В Р вЂ Р В РЎвЂўР РЋР вЂљ Р В Р’В·Р В Р’В°Р В РЎвЂќР В Р’В»Р РЋР вЂ№Р РЋРІР‚РЋР РЋРІР‚ВР В Р вЂ¦ Р РЋРІР‚РЋР В Р’ВµР РЋР вЂљР В Р’ВµР В Р’В· Р РЋР РЉР В Р’В»Р В Р’ВµР В РЎвЂќР РЋРІР‚С™Р РЋР вЂљР В РЎвЂўР В Р вЂ¦Р В Р вЂ¦Р РЋРЎвЂњР РЋР вЂ№ Р В РЎвЂ”Р В Р’В»Р В РЎвЂўР РЋРІР‚В°Р В Р’В°Р В РўвЂР В РЎвЂќР РЋРЎвЂњ Р вЂ™Р’В«UzSavdoР вЂ™Р’В» Р В РЎВР В Р’ВµР В Р’В¶Р В РўвЂР РЋРЎвЂњ {buyer_company} (Р вЂ™Р’В«Р В РЎСџР В РЎвЂўР В РЎвЂќР РЋРЎвЂњР В РЎвЂ”Р В Р’В°Р РЋРІР‚С™Р В Р’ВµР В Р’В»Р РЋР Р‰Р вЂ™Р’В») Р В РЎвЂ {seller_company} (Р вЂ™Р’В«Р В РЎСџР РЋР вЂљР В РЎвЂўР В РўвЂР В Р’В°Р В Р вЂ Р В Р’ВµР РЋРІР‚В Р вЂ™Р’В»):\n1. Р В РЎСџР РЋР вЂљР В Р’ВµР В РўвЂР В РЎВР В Р’ВµР РЋРІР‚С™ Р В РўвЂР В РЎвЂўР В РЎвЂ“Р В РЎвЂўР В Р вЂ Р В РЎвЂўР РЋР вЂљР В Р’В°: {product_title}, Р В РЎвЂќР В РЎвЂўР В Р’В»Р В РЎвЂР РЋРІР‚РЋР В Р’ВµР РЋР С“Р РЋРІР‚С™Р В Р вЂ Р В РЎвЂў: {quantity} {unit}.\n2. Р В Р’В¦Р В Р’ВµР В Р вЂ¦Р В Р’В°: {price_per_unit} Р РЋР С“Р РЋРЎвЂњР В РЎВ / {unit}.\n3. Р В РЎвЂєР РЋР вЂљР В РЎвЂР В Р’ВµР В Р вЂ¦Р РЋРІР‚С™Р В РЎвЂР РЋР вЂљР В РЎвЂўР В Р вЂ Р В РЎвЂўР РЋРІР‚РЋР В Р вЂ¦Р В Р’В°Р РЋР РЏ Р РЋР С“Р РЋРЎвЂњР В РЎВР В РЎВР В Р’В°: {estimated_total} Р РЋР С“Р РЋРЎвЂњР В РЎВ.\n4. Р В Р в‚¬Р РЋР С“Р В Р’В»Р В РЎвЂўР В Р вЂ Р В РЎвЂР В Р’Вµ Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р РЋРІР‚С™Р В Р’В°Р В Р вЂ Р В РЎвЂќР В РЎвЂ: {delivery_type}.\n5. Р В Р Р‹Р РЋРІР‚С™Р В РЎвЂўР РЋР вЂљР В РЎвЂўР В Р вЂ¦Р РЋРІР‚в„– Р В РЎвЂ”Р РЋР вЂљР В РЎвЂўР В РЎвЂР В Р’В·Р В Р вЂ Р В РЎвЂўР В РўвЂР РЋР РЏР РЋРІР‚С™ Р В Р вЂ Р В Р’В·Р В Р’В°Р В РЎвЂР В РЎВР В РЎвЂўР РЋР вЂљР В Р’В°Р РЋР С“Р РЋРІР‚РЋР РЋРІР‚ВР РЋРІР‚С™Р РЋРІР‚в„– Р В Р вЂ¦Р В Р’В°Р В РЎвЂ”Р РЋР вЂљР РЋР РЏР В РЎВР РЋРЎвЂњР РЋР вЂ№ Р В РЎвЂ”Р В РЎвЂў Р В Р вЂ Р В Р’В·Р В Р’В°Р В РЎвЂР В РЎВР В Р вЂ¦Р В РЎвЂўР В РЎВР РЋРЎвЂњ Р РЋР С“Р В РЎвЂўР В РЎвЂ“Р В Р’В»Р В Р’В°Р РЋРІвЂљВ¬Р В Р’ВµР В Р вЂ¦Р В РЎвЂР РЋР вЂ№.`
    }
  });

  // 2. Seed Regions and Districts
  console.log("Seeding regions and districts...");
  const regionMap = new Map<string, string>();
  const districtMap = new Map<string, string>();

  let regOrder = 1;
  for (const reg of REGIONS_DATA) {
    const createdReg = await prisma.region.create({
      data: {
        nameUz: reg.nameUz,
        nameRu: reg.nameRu,
        type: reg.type,
        sortOrder: regOrder++
      }
    });
    regionMap.set(reg.nameUz, createdReg.id);

    let distOrder = 1;
    for (const dist of reg.districts) {
      const createdDist = await prisma.district.create({
        data: {
          regionId: createdReg.id,
          nameUz: dist.nameUz,
          nameRu: dist.nameRu,
          type: dist.type,
          sortOrder: distOrder++
        }
      });
      districtMap.set(`${reg.nameUz}_${dist.nameUz}`, createdDist.id);
    }
  }

  // 3. Seed Categories and Products
  console.log("Seeding categories and products...");
  const categoryMap = new Map<string, string>();
  const productMap = new Map<string, string>();

  let catOrder = 1;
  for (const cat of CATEGORIES_DATA) {
    const createdCat = await prisma.category.create({
      data: {
        nameUz: cat.nameUz,
        nameRu: cat.nameRu,
        icon: cat.icon,
        sortOrder: catOrder++
      }
    });
    categoryMap.set(cat.nameUz, createdCat.id);

    for (const prod of cat.products) {
      const norm = `${cat.nameUz}_${prod.nameUz}`.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const createdProd = await prisma.product.create({
        data: {
          categoryId: createdCat.id,
          nameUz: prod.nameUz,
          nameRu: prod.nameRu,
          normalizedName: norm,
          isUserAdded: false,
          isApproved: true
        }
      });
      productMap.set(`${cat.nameUz}_${prod.nameUz}`, createdProd.id);
    }
  }

  // 4. Seed Admin & Users
  console.log("Seeding admin and demo users...");
  const adminPassword = await argon2.hash("AdminPassword2026!");
  const demoPassword = await argon2.hash("Demo12345");

  const toshkentRegId = regionMap.get("Toshkent shahri")!;
  const toshkentDistId = districtMap.get("Toshkent shahri_Chilonzor")!;
  const samarqandRegId = regionMap.get("Samarqand viloyati")!;
  const samarqandDistId = districtMap.get("Samarqand viloyati_Urgut")!;
  const fargonaRegId = regionMap.get("FargР С™Р’В»ona viloyati")!;
  const fargonaDistId = districtMap.get("FargР С™Р’В»ona viloyati_Quva")!;
  const andijonRegId = regionMap.get("Andijon viloyati")!;
  const andijonDistId = districtMap.get("Andijon viloyati_Asaka")!;
  const buxoroRegId = regionMap.get("Buxoro viloyati")!;
  const buxoroDistId = districtMap.get("Buxoro viloyati_GР С™Р’В»ijduvon")!;
  const surxonRegId = regionMap.get("Surxondaryo viloyati")!;
  const surxonDistId = districtMap.get("Surxondaryo viloyati_Denov")!;

  // Admin
  await prisma.user.upsert({
    where: { login: "admin" },
    update: {},
    create: {
      login: "admin",
      passwordHash: adminPassword,
      companyName: "UzSavdo Ma'muriyati",
      firstName: "Admin",
      lastName: "UzSavdo",
      phone: "+998 (71) 200-00-00",
      email: "admin@uzsavdo.uz",
      role: "ADMIN",
      regionId: toshkentRegId,
      districtId: toshkentDistId,
      agreementVersionAccepted: "1.0",
      agreementAcceptedAt: new Date()
    }
  });

  // 6 Demo Users
  const demoUsersData = [
    {
      login: "agro_sharq",
      companyName: "Р вЂ™Р’В«Sharq Agro FayzР вЂ™Р’В» MChJ",
      firstName: "Alisher",
      lastName: "Usmonov",
      phone: "+998 (90) 123-45-67",
      email: "sharq.agro@example.com",
      regionId: samarqandRegId,
      districtId: samarqandDistId,
      address: "Navoiy ko'chasi, 45-uy",
      telegram: "@sharq_agro"
    },
    {
      login: "vodiy_boglari",
      companyName: "Р вЂ™Р’В«Vodiy Bog'lariР вЂ™Р’В» Fermer xo'jaligi",
      firstName: "Bobur",
      lastName: "Qosimov",
      phone: "+998 (91) 234-56-78",
      email: "vodiy.boglari@example.com",
      regionId: fargonaRegId,
      districtId: fargonaDistId,
      address: "Bog'bonlar mahallasi, 12",
      telegram: "@vodiy_bog"
    },
    {
      login: "zarbdor_don",
      companyName: "Р вЂ™Р’В«Zarbdor Don SavdoР вЂ™Р’В» XK",
      firstName: "Jamshid",
      lastName: "Karimov",
      phone: "+998 (93) 345-67-89",
      email: "zarbdor.don@example.com",
      regionId: andijonRegId,
      districtId: andijonDistId,
      address: "Sanoat zonasi, 8-bino",
      telegram: "@zarbdor_don"
    },
    {
      login: "buxoro_ipak",
      companyName: "Р вЂ™Р’В«Buxoro Ipak & TekstilР вЂ™Р’В» MChJ",
      firstName: "Nodir",
      lastName: "Saidov",
      phone: "+998 (94) 456-78-90",
      email: "buxoro.tekstil@example.com",
      regionId: buxoroRegId,
      districtId: buxoroDistId,
      address: "Mustaqillik shoh ko'chasi, 110",
      telegram: "@buxoro_tekstil"
    },
    {
      login: "surxon_export",
      companyName: "Р вЂ™Р’В«Surxon Agro EksportР вЂ™Р’В» MChJ",
      firstName: "Rustam",
      lastName: "Rahmonov",
      phone: "+998 (97) 567-89-01",
      email: "surxon.agro@example.com",
      regionId: surxonRegId,
      districtId: surxonDistId,
      address: "Eksport markazi, 3-ombor",
      telegram: "@surxon_export"
    },
    {
      login: "toshkent_savdo",
      companyName: "Р вЂ™Р’В«Toshkent Grand SavdoР вЂ™Р’В» MChJ",
      firstName: "Farrux",
      lastName: "Nazarov",
      phone: "+998 (99) 678-90-12",
      email: "toshkent.grand@example.com",
      regionId: toshkentRegId,
      districtId: toshkentDistId,
      address: "Bunyodkor shoh ko'chasi, 22-A",
      telegram: "@toshkent_grand"
    }
  ];

  const userIds: string[] = [];
  for (const u of demoUsersData) {
    const user = await prisma.user.upsert({
      where: { login: u.login },
      update: {},
      create: {
        login: u.login,
        passwordHash: demoPassword,
        companyName: u.companyName,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        email: u.email,
        regionId: u.regionId,
        districtId: u.districtId,
        address: u.address,
        telegram: u.telegram,
        role: "USER",
        ratingAvg: 4.8,
        ratingCount: 14,
        ordersAnsweredOnTime: 18,
        ordersIgnored: 1,
        agreementVersionAccepted: "1.0",
        agreementAcceptedAt: new Date()
      }
    });
    userIds.push(user.id);
  }

  // 5. Seed 30 realistic listings
  console.log("Seeding 30 listings...");
  const listingsData = [
    {
      sellerIndex: 0,
      catName: "Sabzavotlar",
      prodName: "Kartoshka",
      title: "Gala navli sara kartoshka, Samarqand 2026",
      unit: "kg",
      price: 4200,
      qty: 15000,
      minQty: 500,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: samarqandRegId,
      distId: samarqandDistId,
      imgColor: "4A7C59"
    },
    {
      sellerIndex: 0,
      catName: "Sabzavotlar",
      prodName: "Piyoz",
      title: "Eksportbop qizil va sariq piyoz, sifat kafolati",
      unit: "kg",
      price: 2500,
      qty: 25000,
      minQty: 1000,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: samarqandRegId,
      distId: samarqandDistId,
      imgColor: "8C5E32"
    },
    {
      sellerIndex: 0,
      catName: "Sabzavotlar",
      prodName: "Sabzi",
      title: "Shirin qizil sabzi (Mshak), tozalangan qoplarda",
      unit: "kg",
      price: 3100,
      qty: 8000,
      minQty: 300,
      origin: "LOCAL",
      delivery: "PICKUP",
      regId: samarqandRegId,
      distId: samarqandDistId,
      imgColor: "D96B27"
    },
    {
      sellerIndex: 1,
      catName: "Mevalar",
      prodName: "Olma",
      title: "Golden Delishes va Besh yulduz navli olma",
      unit: "kg",
      price: 8500,
      qty: 12000,
      minQty: 200,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: fargonaRegId,
      distId: fargonaDistId,
      imgColor: "C0392B"
    },
    {
      sellerIndex: 1,
      catName: "Mevalar",
      prodName: "Anor",
      title: "Quva shirin anori, birinchi nav, yirik donali",
      unit: "kg",
      price: 18000,
      qty: 5000,
      minQty: 100,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: fargonaRegId,
      distId: fargonaDistId,
      imgColor: "922B21"
    },
    {
      sellerIndex: 1,
      catName: "Mevalar",
      prodName: "Gilos",
      title: "Bahorgi ertapishar yirik qora gilos",
      unit: "kg",
      price: 25000,
      qty: 3000,
      minQty: 50,
      origin: "LOCAL",
      delivery: "PICKUP",
      regId: fargonaRegId,
      distId: fargonaDistId,
      imgColor: "78281F"
    },
    {
      sellerIndex: 2,
      catName: "Don va dukkakli ekinlar",
      prodName: "BugР С™Р’В»doy",
      title: "Oziq-ovqatlik sifatli 3-sinf bug'doy",
      unit: "tonna",
      price: 3200000,
      qty: 80,
      minQty: 5,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: andijonRegId,
      distId: andijonDistId,
      imgColor: "B7950B"
    },
    {
      sellerIndex: 2,
      catName: "Don va dukkakli ekinlar",
      prodName: "Guruch",
      title: "Lazer va Alanga navli sara guruch, Andijon",
      unit: "kg",
      price: 19500,
      qty: 14000,
      minQty: 100,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: andijonRegId,
      distId: andijonDistId,
      imgColor: "D5D8DC"
    },
    {
      sellerIndex: 2,
      catName: "Don va dukkakli ekinlar",
      prodName: "Mosh",
      title: "Yashil tozalangan eksportbop mosh, 50 kg qoplarda",
      unit: "kg",
      price: 11000,
      qty: 20000,
      minQty: 500,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: andijonRegId,
      distId: andijonDistId,
      imgColor: "1E8449"
    },
    {
      sellerIndex: 3,
      catName: "Paxta va toР С™Р’В»qimachilik",
      prodName: "Ip-kalava",
      title: "100% paxta ip-kalava Ne 30/1 ring kardli",
      unit: "kg",
      price: 34000,
      qty: 25000,
      minQty: 1000,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: buxoroRegId,
      distId: buxoroDistId,
      imgColor: "5D6D7E"
    },
    {
      sellerIndex: 3,
      catName: "Quruq mevalar va yongР С™Р’В»oqlar",
      prodName: "Mayiz",
      title: "Qora kishmish va soyagi sara mayiz",
      unit: "kg",
      price: 45000,
      qty: 4000,
      minQty: 100,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: buxoroRegId,
      distId: buxoroDistId,
      imgColor: "2C3E50"
    },
    {
      sellerIndex: 3,
      catName: "Quruq mevalar va yongР С™Р’В»oqlar",
      prodName: "Bodom",
      title: "Po'sti yupqa qog'ozbop shirin bodom",
      unit: "kg",
      price: 68000,
      qty: 3500,
      minQty: 50,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: buxoroRegId,
      distId: buxoroDistId,
      imgColor: "A04000"
    },
    {
      sellerIndex: 4,
      catName: "Poliz mahsulotlari",
      prodName: "Qovun",
      title: "Mirzacho'l va Torpeda navli shirin qovunlar",
      unit: "dona",
      price: 15000,
      qty: 8000,
      minQty: 100,
      origin: "LOCAL",
      delivery: "PICKUP",
      regId: surxonRegId,
      distId: surxonDistId,
      imgColor: "F4D03F"
    },
    {
      sellerIndex: 4,
      catName: "Poliz mahsulotlari",
      prodName: "Tarvuz",
      title: "Ertapishar Qrimson Svit tarvuzlari, Termiz",
      unit: "kg",
      price: 1800,
      qty: 30000,
      minQty: 2000,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: surxonRegId,
      distId: surxonDistId,
      imgColor: "196F3D"
    },
    {
      sellerIndex: 4,
      catName: "Sabzavotlar",
      prodName: "Pomidor",
      title: "Issiqxona pushti pomidori (Rozoviy ray), 1-nav",
      unit: "kg",
      price: 14000,
      qty: 6000,
      minQty: 200,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: surxonRegId,
      distId: surxonDistId,
      imgColor: "E74C3C"
    },
    {
      sellerIndex: 5,
      catName: "Qurilish materiallari",
      prodName: "Sement",
      title: "Bekobod M-500 sementi, 50 kg zavod qoplarda",
      unit: "qop",
      price: 48000,
      qty: 5000,
      minQty: 50,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: toshkentRegId,
      distId: toshkentDistId,
      imgColor: "7F8C8D"
    },
    {
      sellerIndex: 5,
      catName: "Qurilish materiallari",
      prodName: "Armatura",
      title: "A500C diametr 12mm va 14mm metall armatura",
      unit: "tonna",
      price: 8900000,
      qty: 120,
      minQty: 2,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: toshkentRegId,
      distId: toshkentDistId,
      imgColor: "34495E"
    },
    {
      sellerIndex: 5,
      catName: "Maishiy kimyo",
      prodName: "Kir yuvish kukuni",
      title: "Avtomat kir yuvish kukuni 9 kg iqtisodiy qadoqda",
      unit: "quti",
      price: 85000,
      qty: 2500,
      minQty: 20,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: toshkentRegId,
      distId: toshkentDistId,
      imgColor: "2980B9"
    },
    {
      sellerIndex: 0,
      catName: "Chorva ozuqasi",
      prodName: "Beda",
      title: "Presslangan sifatli yashil beda, 2026-yil",
      unit: "dona",
      price: 28000,
      qty: 4500,
      minQty: 100,
      origin: "LOCAL",
      delivery: "PICKUP",
      regId: samarqandRegId,
      distId: samarqandDistId,
      imgColor: "27AE60"
    },
    {
      sellerIndex: 1,
      catName: "Sut mahsulotlari va tuxum",
      prodName: "Tuxum",
      title: "Parrandachilik fabrikasidan C-1 toifali oq tuxum",
      unit: "quti",
      price: 360000,
      qty: 800,
      minQty: 10,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: fargonaRegId,
      distId: fargonaDistId,
      imgColor: "F5B041"
    },
    {
      sellerIndex: 2,
      catName: "OР С™Р’В»gР С™Р’В»itlar va agrokimyo",
      prodName: "Ammiakli selitra",
      title: "Navoiyazot ammiakli selitrasi N 34.4%, qoplarda",
      unit: "qop",
      price: 165000,
      qty: 1200,
      minQty: 20,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: andijonRegId,
      distId: andijonDistId,
      imgColor: "16A085"
    },
    {
      sellerIndex: 3,
      catName: "XoР С™Р’В»jalik tovarlari",
      prodName: "Qoplar",
      title: "Oq polipropilen qoplar 50 kg un va don uchun",
      unit: "dona",
      price: 1800,
      qty: 50000,
      minQty: 1000,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: buxoroRegId,
      distId: buxoroDistId,
      imgColor: "BDC3C7"
    },
    {
      sellerIndex: 4,
      catName: "Sabzavotlar",
      prodName: "Bodring",
      title: "Orzu navli toza bodring, har kuni yangi terim",
      unit: "kg",
      price: 8000,
      qty: 4000,
      minQty: 150,
      origin: "LOCAL",
      delivery: "PICKUP",
      regId: surxonRegId,
      distId: surxonDistId,
      imgColor: "229954"
    },
    {
      sellerIndex: 5,
      catName: "GoР С™Р’В»sht, parranda va baliq",
      prodName: "Mol goР С™Р’В»shti",
      title: "Yosh novvos go'shti (lahm va suyakli), halol so'yilgan",
      unit: "kg",
      price: 82000,
      qty: 1800,
      minQty: 50,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: toshkentRegId,
      distId: toshkentDistId,
      imgColor: "900C3F"
    },
    {
      sellerIndex: 0,
      catName: "Mevalar",
      prodName: "Uzum",
      title: "Toyfi va Qora kishmish uzumlari, eksportbop",
      unit: "kg",
      price: 14000,
      qty: 7000,
      minQty: 200,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: samarqandRegId,
      distId: samarqandDistId,
      imgColor: "5B2C6F"
    },
    {
      sellerIndex: 1,
      catName: "Sabzavotlar",
      prodName: "Karam",
      title: "Qishki oqbosh karam, 2-3 kg li zich boshlar",
      unit: "kg",
      price: 2200,
      qty: 18000,
      minQty: 500,
      origin: "LOCAL",
      delivery: "PICKUP",
      regId: fargonaRegId,
      distId: fargonaDistId,
      imgColor: "52BE80"
    },
    {
      sellerIndex: 2,
      catName: "UrugР С™Р’В» va koР С™Р’В»chatlar",
      prodName: "UrugР С™Р’В»lik kartoshka",
      title: "Gollandiya elita reproduktsiyali urug'lik kartoshka",
      unit: "kg",
      price: 9000,
      qty: 15000,
      minQty: 500,
      origin: "IMPORT",
      delivery: "DELIVERY",
      regId: andijonRegId,
      distId: andijonDistId,
      imgColor: "AF7AC5"
    },
    {
      sellerIndex: 3,
      catName: "XoР С™Р’В»jalik tovarlari",
      prodName: "Plastik idishlar",
      title: "Oziq-ovqat uchun 10 litrli plastik chelaklar",
      unit: "dona",
      price: 7500,
      qty: 12000,
      minQty: 200,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: buxoroRegId,
      distId: buxoroDistId,
      imgColor: "3498DB"
    },
    {
      sellerIndex: 4,
      catName: "Maishiy kimyo",
      prodName: "Suyuq sovun",
      title: "Antibakterial xushbo'y suyuq sovun 5 litr kanistrlarda",
      unit: "dona",
      price: 24000,
      qty: 3000,
      minQty: 50,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: surxonRegId,
      distId: surxonDistId,
      imgColor: "1ABC9C"
    },
    {
      sellerIndex: 5,
      catName: "Qurilish materiallari",
      prodName: "GР С™Р’В»isht",
      title: "Pishiq qizil g'isht M-125, Toshkent zavodidan",
      unit: "dona",
      price: 1350,
      qty: 80000,
      minQty: 3000,
      origin: "LOCAL",
      delivery: "DELIVERY",
      regId: toshkentRegId,
      distId: toshkentDistId,
      imgColor: "C0392B"
    }
  ];

  const createdListingIds: string[] = [];

  for (const item of listingsData) {
    const catId = categoryMap.get(item.catName)!;
    const prodId = productMap.get(`${item.catName}_${item.prodName}`)!;
    const sellerId = userIds[item.sellerIndex];

    const expDate = new Date();
    expDate.setDate(expDate.getDate() + 30);

    const listing = await prisma.listing.create({
      data: {
        sellerId,
        categoryId: catId,
        productId: prodId,
        title: item.title,
        description: `${item.title}. O'zbekiston bo'ylab ishonchli ulgurji yetkazib berish. Barcha sertifikatlar mavjud.`,
        unit: item.unit,
        pricePerUnit: item.price,
        totalQuantity: item.qty,
        availableQuantity: item.qty,
        origin: item.origin,
        delivery: item.delivery,
        regionId: item.regId,
        districtId: item.distId,
        status: "ACTIVE",
        expiresAt: expDate,
        images: {
          create: [
            {
              url: `https://placehold.co/800x600/${item.imgColor}/ffffff?text=${encodeURIComponent(item.prodName)}`,
              thumbUrl: `https://placehold.co/400x300/${item.imgColor}/ffffff?text=${encodeURIComponent(item.prodName)}`,
              sortOrder: 0
            }
          ]
        }
      }
    });
    createdListingIds.push(listing.id);
  }

  // 6. Seed Demo Contracts & Orders
  console.log("Seeding demo contracts & orders...");
  // Demo 1: Pending order with timer
  const expTimer = new Date();
  expTimer.setHours(expTimer.getHours() + 48); // 48h remaining

  const c1 = await prisma.contract.create({
    data: {
      number: "SH-2026-000001",
      listingId: createdListingIds[0],
      buyerId: userIds[5], // Toshkent buyer
      sellerId: userIds[0], // Samarqand seller
      quantity: 1000,
      unit: "kg",
      pricePerUnit: 4200,
      estimatedTotal: 4200000,
      fee: 0,
      isTrial: true,
      status: "PAID",
      order: {
        create: {
          listingId: createdListingIds[0],
          buyerId: userIds[5],
          sellerId: userIds[0],
          quantity: 1000,
          status: "PENDING",
          expiresAt: expTimer
        }
      },
      conversation: {
        create: {
          buyerId: userIds[5],
          sellerId: userIds[0],
          messages: {
            create: [
              {
                senderId: userIds[5],
                text: "Assalomu alaykum! Kartoshkani haftaning juma kuniga yetkazib bera olasizmi?"
              }
            ]
          }
        }
      }
    }
  });

  // Demo 2: Accepted order
  const c2 = await prisma.contract.create({
    data: {
      number: "SH-2026-000002",
      listingId: createdListingIds[3],
      buyerId: userIds[0],
      sellerId: userIds[1],
      quantity: 500,
      unit: "kg",
      pricePerUnit: 8500,
      estimatedTotal: 4250000,
      fee: 0,
      isTrial: true,
      status: "PAID",
      order: {
        create: {
          listingId: createdListingIds[3],
          buyerId: userIds[0],
          sellerId: userIds[1],
          quantity: 500,
          status: "ACCEPTED",
          acceptedAt: new Date(),
          expiresAt: expTimer
        }
      }
    }
  });

  // Demo 3: Completed with Review
  const c3 = await prisma.contract.create({
    data: {
      number: "SH-2026-000003",
      listingId: createdListingIds[7],
      buyerId: userIds[4],
      sellerId: userIds[2],
      quantity: 2000,
      unit: "kg",
      pricePerUnit: 19500,
      estimatedTotal: 39000000,
      fee: 0,
      isTrial: true,
      status: "PAID",
      order: {
        create: {
          listingId: createdListingIds[7],
          buyerId: userIds[4],
          sellerId: userIds[2],
          quantity: 2000,
          status: "COMPLETED",
          acceptedAt: new Date(),
          completedAt: new Date(),
          expiresAt: expTimer,
          review: {
            create: {
              sellerId: userIds[2],
              buyerId: userIds[4],
              rating: 5,
              text: "Guruch juda sifatli ekan, kelishilgan vaqtda yetkazib berishdi. Katta rahmat!",
              sellerReply: "Xaridingiz uchun rahmat, doimiy hamkorlikdan mamnunmiz!"
            }
          }
        }
      }
    }
  });

  // Demo 4: Expired order (Muddati o'tdi)
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 4);

  await prisma.contract.create({
    data: {
      number: "SH-2026-000004",
      listingId: createdListingIds[10],
      buyerId: userIds[1],
      sellerId: userIds[3],
      quantity: 300,
      unit: "kg",
      pricePerUnit: 45000,
      estimatedTotal: 13500000,
      fee: 0,
      isTrial: true,
      status: "PAID",
      order: {
        create: {
          listingId: createdListingIds[10],
          buyerId: userIds[1],
          sellerId: userIds[3],
          quantity: 300,
          status: "EXPIRED",
          expiresAt: pastDate
        }
      }
    }
  });

  // Demo 5: Rejected order
  await prisma.contract.create({
    data: {
      number: "SH-2026-000005",
      listingId: createdListingIds[15],
      buyerId: userIds[2],
      sellerId: userIds[5],
      quantity: 100,
      unit: "qop",
      pricePerUnit: 48000,
      estimatedTotal: 4800000,
      fee: 0,
      isTrial: true,
      status: "PAID",
      order: {
        create: {
          listingId: createdListingIds[15],
          buyerId: userIds[2],
          sellerId: userIds[5],
          quantity: 100,
          status: "REJECTED",
          rejectReason: "Hozirda ushbu hajm omborda yetarli emas",
          rejectedAt: new Date(),
          expiresAt: expTimer
        }
      }
    }
  });

  // Seed Notifications
  await prisma.notification.create({
    data: {
      userId: userIds[0],
      type: "ORDER_RECEIVED",
      payload: JSON.stringify({
        key: "notification.orderReceived",
        params: { orderId: c1.id, contractNumber: "SH-2026-000001" }
      }),
      link: `/listings/${createdListingIds[0]}`
    }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
