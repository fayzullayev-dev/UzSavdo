import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const translations: Record<string, { titleRu: string; descriptionRu: string }> = {
  "Gala navli sara kartoshka, Samarqand 2026": {
    titleRu: "Отборный картофель сорта Гала, Самарканд 2026",
    descriptionRu: "Отборный картофель сорта Гала, Самарканд 2026. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Eksportbop qizil va sariq piyoz, sifat kafolati": {
    titleRu: "Экспортный красный и желтый лук, гарантия качества",
    descriptionRu: "Экспортный красный и желтый лук, гарантия качества. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Shirin qizil sabzi (Mshak), tozalangan qoplarda": {
    titleRu: "Сладкая красная морковь (Мшак), очищенная в мешках",
    descriptionRu: "Сладкая красная морковь (Мшак), очищенная в мешках. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Golden Delishes va Besh yulduz navli olma": {
    titleRu: "Яблоки сортов Голден Делишес и Пять звезд",
    descriptionRu: "Яблоки сортов Голден Делишес и Пять звезд. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Quva shirin anori, birinchi nav, yirik donali": {
    titleRu: "Кувинский сладкий гранат, первый сорт, крупные зерна",
    descriptionRu: "Кувинский сладкий гранат, первый сорт, крупные зерна. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Bahorgi ertapishar yirik qora gilos": {
    titleRu: "Весенняя раннеспелая крупная черная черешня",
    descriptionRu: "Весенняя раннеспелая крупная черная черешня. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Oziq-ovqatlik sifatli 3-sinf bug'doy": {
    titleRu: "Качественная продовольственная пшеница 3-го класса",
    descriptionRu: "Качественная продовольственная пшеница 3-го класса. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Lazer va Alanga navli sara guruch, Andijon": {
    titleRu: "Отборный рис сортов Лазер и Аланга, Андижан",
    descriptionRu: "Отборный рис сортов Лазер и Аланга, Андижан. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Yashil tozalangan eksportbop mosh, 50 kg qoplarda": {
    titleRu: "Зеленый очищенный экспортный маш, в мешках по 50 кг",
    descriptionRu: "Зеленый очищенный экспортный маш, в мешках по 50 кг. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "100% paxta ip-kalava Ne 30/1 ring kardli": {
    titleRu: "100% хлопчатобумажная пряжа Ne 30/1 кардная кольцевая",
    descriptionRu: "100% хлопчатобумажная пряжа Ne 30/1 кардная кольцевая. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Qora kishmish va soyagi sara mayiz": {
    titleRu: "Отборный изюм Черный кишмиш и Сояги",
    descriptionRu: "Отборный изюм Черный кишмиш и Сояги. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Po'sti yupqa qog'ozbop shirin bodom": {
    titleRu: "Сладкий миндаль с тонкой бумажной скорлупой",
    descriptionRu: "Сладкий миндаль с тонкой бумажной скорлупой. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Mirzacho'l va Torpeda navli shirin qovunlar": {
    titleRu: "Сладкие дыни сортов Мирзачуль и Торпеда",
    descriptionRu: "Сладкие дыни сортов Мирзачуль и Торпеда. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Ertapishar Qrimson Svit tarvuzlari, Termiz": {
    titleRu: "Раннеспелые арбузы Кримсон Свит, Термез",
    descriptionRu: "Раннеспелые арбузы Кримсон Свит, Термез. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Issiqxona pushti pomidori (Rozoviy ray), 1-nav": {
    titleRu: "Тепличные розовые томаты (Розовый рай), 1-й сорт",
    descriptionRu: "Тепличные розовые томаты (Розовый рай), 1-й сорт. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Bekobod M-500 sementi, 50 kg zavod qoplarda": {
    titleRu: "Бекабадский цемент М-500, в заводских мешках по 50 кг",
    descriptionRu: "Бекабадский цемент М-500, в заводских мешках по 50 кг. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "A500C diametr 12mm va 14mm metall armatura": {
    titleRu: "Металлическая арматура А500С диаметром 12мм и 14мм",
    descriptionRu: "Металлическая арматура А500С диаметром 12мм и 14мм. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Avtomat kir yuvish kukuni 9 kg iqtisodiy qadoqda": {
    titleRu: "Стиральный порошок автомат 9 кг в экономичной упаковке",
    descriptionRu: "Стиральный порошок автомат 9 кг в экономичной упаковке. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Presslangan sifatli yashil beda, 2026-yil": {
    titleRu: "Прессованная качественная зеленая люцерна, урожай 2026",
    descriptionRu: "Прессованная качественная зеленая люцерна, урожай 2026. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Parrandachilik fabrikasidan C-1 toifali oq tuxum": {
    titleRu: "Белые яйца категории С-1 от птицефабрики",
    descriptionRu: "Белые яйца категории С-1 от птицефабрики. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Navoiyazot ammiakli selitrasi N 34.4%, qoplarda": {
    titleRu: "Аммиачная селитра Навоиазот N 34.4%, в мешках",
    descriptionRu: "Аммиачная селитра Навоиазот N 34.4%, в мешках. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Oq polipropilen qoplar 50 kg un va don uchun": {
    titleRu: "Белые полипропиленовые мешки на 50 кг для муки и зерна",
    descriptionRu: "Белые полипропиленовые мешки на 50 кг для муки и зерна. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Orzu navli toza bodring, har kuni yangi terim": {
    titleRu: "Свежие огурцы сорта Орзу, ежедневный сбор",
    descriptionRu: "Свежие огурцы сорта Орзу, ежедневный сбор. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Yosh novvos go'shti (lahm va suyakli), halol so'yilgan": {
    titleRu: "Мясо молодого бычка (мякоть и на кости), халяльный забой",
    descriptionRu: "Мясо молодого бычка (мякоть и на кости), халяльный забой. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Toyfi va Qora kishmish uzumlari, eksportbop": {
    titleRu: "Виноград сортов Тойфи и Черный кишмиш, экспортный",
    descriptionRu: "Виноград сортов Тойфи и Черный кишмиш, экспортный. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Qishki oqbosh karam, 2-3 kg li zich boshlar": {
    titleRu: "Зимняя белокочанная капуста, плотные кочаны по 2-3 кг",
    descriptionRu: "Зимняя белокочанная капуста, плотные кочаны по 2-3 кг. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Gollandiya elita reproduktsiyali urug'lik kartoshka": {
    titleRu: "Семенной картофель элитной голландской репродукции",
    descriptionRu: "Семенной картофель элитной голландской репродукции. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Oziq-ovqat uchun 10 litrli plastik chelaklar": {
    titleRu: "Пластиковые ведра на 10 литров для пищевых продуктов",
    descriptionRu: "Пластиковые ведра на 10 литров для пищевых продуктов. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Antibakterial xushbo'y suyuq sovun 5 litr kanistrlarda": {
    titleRu: "Антибактериальное ароматное жидкое мыло в канистрах 5 л",
    descriptionRu: "Антибактериальное ароматное жидкое мыло в канистрах 5 л. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  },
  "Pishiq qizil g'isht M-125, Toshkent zavodidan": {
    titleRu: "Обожженный красный кирпич М-125 от ташкентского завода",
    descriptionRu: "Обожженный красный кирпич М-125 от ташкентского завода. Надежная оптовая доставка по всему Узбекистану. Все сертификаты имеются."
  }
};

async function main() {
  const listings = await prisma.listing.findMany();
  console.log(`Found ${listings.length} listings to update with Russian translations.`);

  for (const l of listings) {
    const tr = translations[l.title];
    const titleRu = tr ? tr.titleRu : l.title;
    const descriptionRu = tr ? tr.descriptionRu : (l.description || "");

    await prisma.listing.update({
      where: { id: l.id },
      data: {
        titleRu,
        descriptionRu
      }
    });
  }

  console.log("All listings successfully updated with Russian localization!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
