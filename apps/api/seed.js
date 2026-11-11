const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");
const { REGIONS_DATA, CATEGORIES_DATA } = require("@uzsavdo/shared");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database (JS)...");

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
      textUz: `FOYDALANUVCHI KELISHUVI (Ommaviy oferta)\n\n1. UMUMIY QOIDALAR\n1.1. Mazkur hujjat «UzSavdo» ulgurji savdo maydonchasidan (keyingi o'rinlarda — Platforma) foydalanish shartlarini belgilaydi.\n1.2. Platformada ro'yxatdan o'tgan har bir shaxs ushbu Kelishuv shartlariga to'liq va so'zsiz rozilik bildiradi.\n\n2. RO'YXATDAN O'TISH VA MA'LUMOTLARNING TO'G'RILIGI\n2.1. Foydalanuvchi taqdim etilayotgan korxona, telefon raqami va manzillarning haqiqiyligi uchun to'liq javobgardir.\n\n3. E'LONLARNI JOYLASHTIRISH QOIDALARI\n3.1. Taqiqlangan tovarlar, kontrafakt yoki yolg'on ma'lumotlarni joylashtirish qat'iyan taqiqlanadi.\n3.2. Mahsulot fotosuratlari faqat haqiqiy tovarning surati bo'lishi shart.\n\n4. MAHSULOT SHARTNOMASI VA TO'LOV\n4.1. Xaridor sotuvchining aloqa ma'lumotlarini faqat mahsulot shartnomasini rasmiylashtirgandan so'ng ko'radi.\n4.2. Shartnoma uchun to'lov platforma xizmati uchun to'lanadi va QAYTARILMAYDI (shu jumladan sotuvchi buyurtmani 3 kun ichida qabul qilmagan taqdirda ham).\n\n5. SOTUVCHINING MAJBURIYATI\n5.1. Sotuvchi kelib tushgan buyurtmani 72 soat (3 kun) ichida qabul qilishi yoki rad etishi shart.\n5.2. Javobsiz qolgan buyurtmalar 72 soatdan so'ng avtomatik ravishda bekor qilinadi.\n\n6. MAHSULOT UCHUN HISOB-KITOB\n6.1. Mahsulot uchun haq to'lash va yetkazib berish taraflar o'rtasida to'g'ridan-to'g'ri mustaqil ravishda amalga oshiriladi.\n\n7. SHAXSIY MA'LUMOTLAR\n7.1. O'zbekiston Respublikasining «Shaxsiy ma'lumotlar to'g'risida»gi qonuniga muvofiq, ma'lumotlar O'zbekiston hududidagi serverlarda saqlanadi.`,
      textRu: `ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ (Публичная оферта)\n\n1. ОБЩИЕ ПОЛОЖЕНИЯ\n1.1. Настоящий документ определяет условия использования оптовой торговой площадки «UzSavdo».\n1.2. Регистрация на платформе означает полное и безоговорочное согласие с настоящим Соглашением.\n\n2. РЕГИСТРАЦИЯ И ДОСТОВЕРНОСТЬ ДАННЫХ\n2.1. Пользователь несёт полную ответственность за достоверность данных предприятия, телефона и адреса.\n\n3. ПРАВИЛА РАЗМЕЩЕНИЯ ОБЪЯВЛЕНИЙ\n3.1. Запрещено размещение запрещенных товаров, фальсификата и недостоверных цен.\n3.2. Фотографии должны отображать исключительно реальный товар.\n\n4. ДОГОВОР НА ТОВАР И ОПЛАТА\n4.1. Покупатель получает доступ к контактам продавца только после оформления договора на товар.\n4.2. Оплата за оформление договора является платой за сервис платформы и НЕ ВОЗВРАЩАЕТСЯ, в том числе при истечении 3-дневного срока ответа продавца.\n\n5. ОБЯЗАННОСТИ ПРОДАВЦА\n5.1. Продавец обязан принять или отклонить заказ в течение 72 часов (3 дней).\n5.2. Необработанные заказы аннулируются автоматически через 72 часа.\n\n6. РАСЧЁТЫ ЗА ТОВАР\n6.1. Расчёты за сам товар производятся сторонами напрямую. Платформа не выступает стороной сделки купли-продажи.\n\n7. ПЕРСОНАЛЬНЫЕ ДАННЫХ\n7.1. В соответствии с законом РУз «О персональных данных», данные хранятся на серверах в Республике Узбекистан.`
    }
  });

  await prisma.contractTemplate.upsert({
    where: { version: "1.0" },
    update: {},
    create: {
      version: "1.0",
      textUz: `MAHSULOT SHARTNOMASI № {number}\n\nTuzilgan sana: {date}\nTuzilgan joyi: {seller_region}\n\n«UzSavdo» elektron maydonchasi orqali {buyer_company} (keyingi o'rinlarda — «Xaridor») va {seller_company} (keyingi o'rinlarda — «Sotuvchi») o'rtasida quyidagi shartlarda tuzildi:\n1. Shartnoma predmeti: {product_title}, miqdori: {quantity} {unit}.\n2. Narxi: {price_per_unit} so'm / {unit}.\n3. Umumiy taxminiy qiymati: {estimated_total} so'm.\n4. Yetkazib berish sharti: {delivery_type}.\n5. Taraflar hisob-kitobni to'g'ridan-to'g'ri o'zaro kelishuv asosida amalga oshiradilar.`,
      textRu: `ДОГОВОР НА ТОВАР № {number}\n\nДата заключения: {date}\nМесто заключения: {seller_region}\n\nНастоящий договор заключён через электронную площадку «UzSavdo» между {buyer_company} («Покупатель») и {seller_company} («Продавец»):\n1. Предмет договора: {product_title}, количество: {quantity} {unit}.\n2. Цена: {price_per_unit} сум / {unit}.\n3. Ориентировочная сумма: {estimated_total} сум.\n4. Условие поставки: {delivery_type}.\n5. Стороны производят взаиморасчёты напрямую по взаимному соглашению.`
    }
  });

  // Regions & Districts
  const allRegions = await prisma.region.findMany({ include: { districts: true } });
  const regionMap = new Map();
  const districtMap = new Map();

  if (allRegions.length === 0) {
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
        districtMap.set(`${createdReg.id}_${dist.nameUz}`, createdDist.id);
      }
    }
  } else {
    for (const r of allRegions) {
      regionMap.set(r.nameUz, r.id);
      for (const d of r.districts) {
        districtMap.set(`${r.id}_${d.nameUz}`, d.id);
      }
    }
  }

  // Categories & Products
  let allCats = await prisma.category.findMany({ include: { products: true } });
  const categoryMap = new Map();
  const productMap = new Map();

  if (allCats.length === 0) {
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
        productMap.set(`${createdCat.id}_${prod.nameUz}`, createdProd.id);
      }
    }
  } else {
    for (const c of allCats) {
      categoryMap.set(c.nameUz, c.id);
      for (const p of c.products) {
        productMap.set(`${c.id}_${p.nameUz}`, p.id);
      }
    }
  }

  // Users
  const adminPassword = await argon2.hash("AdminPassword2026!");
  const demoPassword = await argon2.hash("Demo12345");

  // Find regions safely
  const findRegId = (part) => {
    for (const [name, id] of regionMap.entries()) {
      if (name.includes(part)) return id;
    }
    return [...regionMap.values()][0];
  };

  const findDistId = (regId, part) => {
    for (const [key, id] of districtMap.entries()) {
      if (key.startsWith(regId) && key.includes(part)) return id;
    }
    for (const [key, id] of districtMap.entries()) {
      if (key.startsWith(regId)) return id;
    }
    return [...districtMap.values()][0];
  };

  const toshkentRegId = findRegId("Toshkent shahri");
  const toshkentDistId = findDistId(toshkentRegId, "Chilonzor");
  const samarqandRegId = findRegId("Samarqand");
  const samarqandDistId = findDistId(samarqandRegId, "Urgut");
  const fargonaRegId = findRegId("Farg");
  const fargonaDistId = findDistId(fargonaRegId, "Quva");
  const andijonRegId = findRegId("Andijon");
  const andijonDistId = findDistId(andijonRegId, "Asaka");
  const buxoroRegId = findRegId("Buxoro");
  const buxoroDistId = findDistId(buxoroRegId, "Gʻijduvon");
  const surxonRegId = findRegId("Surxondaryo");
  const surxonDistId = findDistId(surxonRegId, "Denov");

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

  const demoUsersData = [
    {
      login: "agro_sharq",
      companyName: "«Sharq Agro Fayz» MChJ",
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
      companyName: "«Vodiy Bog'lari» Fermer xo'jaligi",
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
      companyName: "«Zarbdor Don Savdo» XK",
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
      companyName: "«Buxoro Ipak & Tekstil» MChJ",
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
      companyName: "«Surxon Agro Eksport» MChJ",
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
      companyName: "«Toshkent Grand Savdo» MChJ",
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

  const userIds = [];
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

  // Check if listings already created
  const existingListings = await prisma.listing.count();
  if (existingListings === 0) {
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
        prodName: "Bugʻdoy",
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
        catName: "Paxta va toʻqimachilik",
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
        catName: "Quruq mevalar va yongʻoqlar",
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
        catName: "Quruq mevalar va yongʻoqlar",
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
        catName: "Oʻgʻitlar va agrokimyo",
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
        catName: "Xoʻjalik tovarlari",
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
        catName: "Goʻsht, parranda va baliq",
        prodName: "Mol goʻshti",
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
        catName: "Urugʻ va koʻchatlar",
        prodName: "Urugʻlik kartoshka",
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
        catName: "Xoʻjalik tovarlari",
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
        prodName: "Gʻisht",
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

    const createdListingIds = [];

    for (const item of listingsData) {
      const catId = categoryMap.get(item.catName);
      const prodId = productMap.get(`${catId}_${item.prodName}`);
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
          minOrderQuantity: item.minQty,
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

    // Seed Demo Contracts & Orders
    console.log("Seeding demo contracts & orders...");
    const expTimer = new Date();
    expTimer.setHours(expTimer.getHours() + 48);

    const c1 = await prisma.contract.create({
      data: {
        number: "SH-2026-000001",
        listingId: createdListingIds[0],
        buyerId: userIds[5],
        sellerId: userIds[0],
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
  }

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
