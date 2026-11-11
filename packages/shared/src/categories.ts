export interface ProductSeedData {
  nameUz: string;
  nameRu: string;
}

export interface CategorySeedData {
  nameUz: string;
  nameRu: string;
  icon: string;
  products: ProductSeedData[];
}

export const CATEGORIES_DATA: CategorySeedData[] = [
  {
    nameUz: "Sabzavotlar",
    nameRu: "Овощи",
    icon: "Carrot",
    products: [
      { nameUz: "Kartoshka", nameRu: "Картофель" },
      { nameUz: "Piyoz", nameRu: "Лук репчатый" },
      { nameUz: "Sabzi", nameRu: "Морковь" },
      { nameUz: "Pomidor", nameRu: "Помидоры" },
      { nameUz: "Bodring", nameRu: "Огурцы" },
      { nameUz: "Karam", nameRu: "Капуста" },
      { nameUz: "Lavlagi", nameRu: "Свёкла" },
      { nameUz: "Bulgʻor qalampiri", nameRu: "Болгарский перец" },
      { nameUz: "Achchiq qalampir", nameRu: "Острый перец" },
      { nameUz: "Baqlajon", nameRu: "Баклажаны" },
      { nameUz: "Sarimsoq", nameRu: "Чеснок" },
      { nameUz: "Turp", nameRu: "Редька" }
    ]
  },
  {
    nameUz: "Mevalar",
    nameRu: "Фрукты",
    icon: "Apple",
    products: [
      { nameUz: "Olma", nameRu: "Яблоки" },
      { nameUz: "Nok", nameRu: "Груши" },
      { nameUz: "Uzum", nameRu: "Виноград" },
      { nameUz: "Oʻrik", nameRu: "Абрикосы" },
      { nameUz: "Shaftoli", nameRu: "Персики" },
      { nameUz: "Anor", nameRu: "Гранаты" },
      { nameUz: "Behi", nameRu: "Айва" },
      { nameUz: "Gilos", nameRu: "Черешня" },
      { nameUz: "Xurmo", nameRu: "Хурма" }
    ]
  },
  {
    nameUz: "Poliz mahsulotlari",
    nameRu: "Бахчевые культуры",
    icon: "Citrus",
    products: [
      { nameUz: "Qovun", nameRu: "Дыня" },
      { nameUz: "Tarvuz", nameRu: "Арбуз" },
      { nameUz: "Qovoq", nameRu: "Тыква" }
    ]
  },
  {
    nameUz: "Don va dukkakli ekinlar",
    nameRu: "Зерновые и бобовые",
    icon: "Wheat",
    products: [
      { nameUz: "Bugʻdoy", nameRu: "Пшеница" },
      { nameUz: "Sholi", nameRu: "Рис-сырец (шали)" },
      { nameUz: "Guruch", nameRu: "Рис" },
      { nameUz: "Arpa", nameRu: "Ячмень" },
      { nameUz: "Makkajoʻxori", nameRu: "Кукуруза" },
      { nameUz: "Mosh", nameRu: "Маш" },
      { nameUz: "Loviya", nameRu: "Фасоль" },
      { nameUz: "Noʻxat", nameRu: "Нут" }
    ]
  },
  {
    nameUz: "Quruq mevalar va yongʻoqlar",
    nameRu: "Сухофрукты и орехи",
    icon: "Nut",
    products: [
      { nameUz: "Mayiz", nameRu: "Изюм" },
      { nameUz: "Turshak", nameRu: "Курага" },
      { nameUz: "Yongʻoq", nameRu: "Грецкий орех" },
      { nameUz: "Bodom", nameRu: "Миндаль" },
      { nameUz: "Pista", nameRu: "Фисташки" },
      { nameUz: "Yeryongʻoq", nameRu: "Арахис" }
    ]
  },
  {
    nameUz: "Goʻsht, parranda va baliq",
    nameRu: "Мясо, птица и рыба",
    icon: "Beef",
    products: [
      { nameUz: "Mol goʻshti", nameRu: "Говядина" },
      { nameUz: "Qoʻy goʻshti", nameRu: "Баранина" },
      { nameUz: "Tovuq goʻshti", nameRu: "Курятина" },
      { nameUz: "Baliq", nameRu: "Рыба" }
    ]
  },
  {
    nameUz: "Sut mahsulotlari va tuxum",
    nameRu: "Молочная продукция и яйца",
    icon: "Milk",
    products: [
      { nameUz: "Sut", nameRu: "Молоко" },
      { nameUz: "Qatiq", nameRu: "Катык" },
      { nameUz: "Qaymoq", nameRu: "Сливки" },
      { nameUz: "Suzma", nameRu: "Сузьма" },
      { nameUz: "Pishloq", nameRu: "Сыр" },
      { nameUz: "Sariyogʻ", nameRu: "Сливочное масло" },
      { nameUz: "Tuxum", nameRu: "Яйца" }
    ]
  },
  {
    nameUz: "Chorva ozuqasi",
    nameRu: "Корма для скота",
    icon: "Sprout",
    products: [
      { nameUz: "Beda", nameRu: "Люцерна" },
      { nameUz: "Pichan", nameRu: "Сено" },
      { nameUz: "Somon", nameRu: "Солома" },
      { nameUz: "Kepak", nameRu: "Отруби" },
      { nameUz: "Kunjara", nameRu: "Жмых" },
      { nameUz: "Omuxta yem", nameRu: "Комбикорм" }
    ]
  },
  {
    nameUz: "Xoʻjalik tovarlari",
    nameRu: "Хозяйственные товары",
    icon: "Home",
    products: [
      { nameUz: "Supurgi", nameRu: "Веники" },
      { nameUz: "Chelak", nameRu: "Вёдра" },
      { nameUz: "Togʻora", nameRu: "Тазы" },
      { nameUz: "Qoplar", nameRu: "Мешки" },
      { nameUz: "Plastik idishlar", nameRu: "Пластиковая посуда" },
      { nameUz: "Polietilen paketlar", nameRu: "Полиэтиленовые пакеты" },
      { nameUz: "Gugurt", nameRu: "Спички" }
    ]
  },
  {
    nameUz: "Maishiy kimyo",
    nameRu: "Бытовая химия",
    icon: "SprayCan",
    products: [
      { nameUz: "Kir yuvish kukuni", nameRu: "Стиральный порошок" },
      { nameUz: "Suyuq sovun", nameRu: "Жидкое мыло" },
      { nameUz: "Xoʻjalik sovuni", nameRu: "Хозяйственное мыло" },
      { nameUz: "Idish yuvish vositasi", nameRu: "Средство для мытья посуды" },
      { nameUz: "Oqartiruvchi vosita", nameRu: "Отбеливатель" },
      { nameUz: "Dezinfeksiyalovchi vosita", nameRu: "Дезинфицирующее средство" }
    ]
  },
  {
    nameUz: "Oʻgʻitlar va agrokimyo",
    nameRu: "Удобрения и агрохимия",
    icon: "FlaskConical",
    products: [
      { nameUz: "Ammiakli selitra", nameRu: "Аммиачная селитра" },
      { nameUz: "Karbamid", nameRu: "Карбамид" },
      { nameUz: "Superfosfat", nameRu: "Суперфосфат" },
      { nameUz: "Kaliy oʻgʻiti", nameRu: "Калийное удобрение" },
      { nameUz: "Goʻng", nameRu: "Навоз" },
      { nameUz: "Pestitsidlar", nameRu: "Пестициды" },
      { nameUz: "Gerbitsidlar", nameRu: "Гербициды" }
    ]
  },
  {
    nameUz: "Urugʻ va koʻchatlar",
    nameRu: "Семена и саженцы",
    icon: "Leaf",
    products: [
      { nameUz: "Sabzavot urugʻlari", nameRu: "Семена овощей" },
      { nameUz: "Chigit", nameRu: "Семена хлопчатника" },
      { nameUz: "Urugʻlik kartoshka", nameRu: "Семенной картофель" },
      { nameUz: "Meva koʻchatlari", nameRu: "Саженцы плодовых деревьев" }
    ]
  },
  {
    nameUz: "Qurilish materiallari",
    nameRu: "Строительные материалы",
    icon: "BrickWall",
    products: [
      { nameUz: "Sement", nameRu: "Цемент" },
      { nameUz: "Gʻisht", nameRu: "Кирпич" },
      { nameUz: "Qum", nameRu: "Песок" },
      { nameUz: "Shagʻal", nameRu: "Щебень" },
      { nameUz: "Armatura", nameRu: "Арматура" },
      { nameUz: "Taxta", nameRu: "Доски" }
    ]
  },
  {
    nameUz: "Paxta va toʻqimachilik",
    nameRu: "Хлопок и текстиль",
    icon: "Shirt",
    products: [
      { nameUz: "Paxta xomashyosi", nameRu: "Хлопок-сырец" },
      { nameUz: "Paxta tolasi", nameRu: "Хлопковое волокно" },
      { nameUz: "Ip-kalava", nameRu: "Пряжа" },
      { nameUz: "Mato", nameRu: "Ткань" }
    ]
  }
];
