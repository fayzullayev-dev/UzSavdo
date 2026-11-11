export interface DistrictData {
  nameUz: string;
  nameRu: string;
  type: 'CITY' | 'DISTRICT';
}

export interface RegionData {
  nameUz: string;
  nameRu: string;
  type: 'REPUBLIC' | 'VILOYAT' | 'CITY';
  districts: DistrictData[];
}

export const REGIONS_DATA: RegionData[] = [
  {
    nameUz: "Qoraqalpogʻiston Respublikasi",
    nameRu: "Республика Каракалпакстан",
    type: "REPUBLIC",
    districts: [
      { nameUz: "Nukus shahri", nameRu: "г. Нукус", type: "CITY" },
      { nameUz: "Amudaryo", nameRu: "Амударьинский", type: "DISTRICT" },
      { nameUz: "Beruniy", nameRu: "Берунийский", type: "DISTRICT" },
      { nameUz: "Boʻzatov", nameRu: "Бозатауский", type: "DISTRICT" },
      { nameUz: "Chimboy", nameRu: "Чимбайский", type: "DISTRICT" },
      { nameUz: "Ellikqalʼa", nameRu: "Элликкалинский", type: "DISTRICT" },
      { nameUz: "Kegeyli", nameRu: "Кегейлийский", type: "DISTRICT" },
      { nameUz: "Moʻynoq", nameRu: "Муйнакский", type: "DISTRICT" },
      { nameUz: "Nukus", nameRu: "Нукусский", type: "DISTRICT" },
      { nameUz: "Qanlikoʻl", nameRu: "Канлыкульский", type: "DISTRICT" },
      { nameUz: "Qoraoʻzak", nameRu: "Караузякский", type: "DISTRICT" },
      { nameUz: "Qoʻngʻirot", nameRu: "Кунградский", type: "DISTRICT" },
      { nameUz: "Shumanay", nameRu: "Шуманайский", type: "DISTRICT" },
      { nameUz: "Taxiatosh", nameRu: "Тахиаташский", type: "DISTRICT" },
      { nameUz: "Taxtakoʻpir", nameRu: "Тахтакупырский", type: "DISTRICT" },
      { nameUz: "Toʻrtkoʻl", nameRu: "Турткульский", type: "DISTRICT" },
      { nameUz: "Xoʻjayli", nameRu: "Ходжейлийский", type: "DISTRICT" }
    ]
  },
  {
    nameUz: "Andijon viloyati",
    nameRu: "Андижанская область",
    type: "VILOYAT",
    districts: [
      { nameUz: "Andijon shahri", nameRu: "г. Андижан", type: "CITY" },
      { nameUz: "Andijon", nameRu: "Андижанский", type: "DISTRICT" },
      { nameUz: "Asaka", nameRu: "Асакинский", type: "DISTRICT" },
      { nameUz: "Baliqchi", nameRu: "Балыкчинский", type: "DISTRICT" },
      { nameUz: "Boʻston", nameRu: "Бустанский", type: "DISTRICT" },
      { nameUz: "Buloqboshi", nameRu: "Булакбашинский", type: "DISTRICT" },
      { nameUz: "Izboskan", nameRu: "Избасканский", type: "DISTRICT" },
      { nameUz: "Jalaquduq", nameRu: "Джалакудукский", type: "DISTRICT" },
      { nameUz: "Marhamat", nameRu: "Мархаматский", type: "DISTRICT" },
      { nameUz: "Oltinkoʻl", nameRu: "Алтынкульский", type: "DISTRICT" },
      { nameUz: "Paxtaobod", nameRu: "Пахтаабадский", type: "DISTRICT" },
      { nameUz: "Qoʻrgʻontepa", nameRu: "Кургантепинский", type: "DISTRICT" },
      { nameUz: "Shahrixon", nameRu: "Шахриханский", type: "DISTRICT" },
      { nameUz: "Ulugʻnor", nameRu: "Улугнорский", type: "DISTRICT" },
      { nameUz: "Xoʻjaobod", nameRu: "Ходжаабадский", type: "DISTRICT" }
    ]
  },
  {
    nameUz: "Buxoro viloyati",
    nameRu: "Бухарская область",
    type: "VILOYAT",
    districts: [
      { nameUz: "Buxoro shahri", nameRu: "г. Бухара", type: "CITY" },
      { nameUz: "Buxoro", nameRu: "Бухарский", type: "DISTRICT" },
      { nameUz: "Gʻijduvon", nameRu: "Гиждуванский", type: "DISTRICT" },
      { nameUz: "Jondor", nameRu: "Жондорский", type: "DISTRICT" },
      { nameUz: "Kogon", nameRu: "Каганский", type: "DISTRICT" },
      { nameUz: "Olot", nameRu: "Алатский", type: "DISTRICT" },
      { nameUz: "Peshku", nameRu: "Пешкунский", type: "DISTRICT" },
      { nameUz: "Qorakoʻl", nameRu: "Каракульский", type: "DISTRICT" },
      { nameUz: "Qorovulbozor", nameRu: "Караулбазарский", type: "DISTRICT" },
      { nameUz: "Romitan", nameRu: "Ромитанский", type: "DISTRICT" },
      { nameUz: "Shofirkon", nameRu: "Шафирканский", type: "DISTRICT" },
      { nameUz: "Vobkent", nameRu: "Вабкентский", type: "DISTRICT" }
    ]
  },
  {
    nameUz: "Fargʻona viloyati",
    nameRu: "Ферганская область",
    type: "VILOYAT",
    districts: [
      { nameUz: "Fargʻona shahri", nameRu: "г. Фергана", type: "CITY" },
      { nameUz: "Qoʻqon shahri", nameRu: "г. Коканд", type: "CITY" },
      { nameUz: "Margʻilon shahri", nameRu: "г. Маргилан", type: "CITY" },
      { nameUz: "Bagʻdod", nameRu: "Багдадский", type: "DISTRICT" },
      { nameUz: "Beshariq", nameRu: "Бешарыкский", type: "DISTRICT" },
      { nameUz: "Buvayda", nameRu: "Бувайдинский", type: "DISTRICT" },
      { nameUz: "Dangʻara", nameRu: "Дангаринский", type: "DISTRICT" },
      { nameUz: "Fargʻona", nameRu: "Ферганский", type: "DISTRICT" },
      { nameUz: "Furqat", nameRu: "Фуркатский", type: "DISTRICT" },
      { nameUz: "Oltiariq", nameRu: "Алтыарыкский", type: "DISTRICT" },
      { nameUz: "Oʻzbekiston", nameRu: "Узбекистанский", type: "DISTRICT" },
      { nameUz: "Qoʻshtepa", nameRu: "Куштепинский", type: "DISTRICT" },
      { nameUz: "Quva", nameRu: "Кувинский", type: "DISTRICT" },
      { nameUz: "Rishton", nameRu: "Риштанский", type: "DISTRICT" },
      { nameUz: "Soʻx", nameRu: "Сохский", type: "DISTRICT" },
      { nameUz: "Toshloq", nameRu: "Ташлакский", type: "DISTRICT" },
      { nameUz: "Uchkoʻprik", nameRu: "Учкуприкский", type: "DISTRICT" },
      { nameUz: "Yozyovon", nameRu: "Язъяванский", type: "DISTRICT" }
    ]
  },
  {
    nameUz: "Jizzax viloyati",
    nameRu: "Джизакская область",
    type: "VILOYAT",
    districts: [
      { nameUz: "Jizzax shahri", nameRu: "г. Джизак", type: "CITY" },
      { nameUz: "Arnasoy", nameRu: "Арнасайский", type: "DISTRICT" },
      { nameUz: "Baxmal", nameRu: "Бахмальский", type: "DISTRICT" },
      { nameUz: "Doʻstlik", nameRu: "Дустликский", type: "DISTRICT" },
      { nameUz: "Forish", nameRu: "Фаришский", type: "DISTRICT" },
      { nameUz: "Gʻallaorol", nameRu: "Галляаральский", type: "DISTRICT" },
      { nameUz: "Mirzachoʻl", nameRu: "Мирзачульский", type: "DISTRICT" },
      { nameUz: "Paxtakor", nameRu: "Пахтакорский", type: "DISTRICT" },
      { nameUz: "Sharof Rashidov", nameRu: "Шараф-Рашидовский", type: "DISTRICT" },
      { nameUz: "Yangiobod", nameRu: "Янгиабадский", type: "DISTRICT" },
      { nameUz: "Zafarobod", nameRu: "Зафарабадский", type: "DISTRICT" },
      { nameUz: "Zarbdor", nameRu: "Зарбдарский", type: "DISTRICT" },
      { nameUz: "Zomin", nameRu: "Зааминский", type: "DISTRICT" }
    ]
  },
  {
    nameUz: "Namangan viloyati",
    nameRu: "Наманганская область",
    type: "VILOYAT",
    districts: [
      { nameUz: "Namangan shahri", nameRu: "г. Наманган", type: "CITY" },
      { nameUz: "Chortoq", nameRu: "Чартакский", type: "DISTRICT" },
      { nameUz: "Chust", nameRu: "Чустский", type: "DISTRICT" },
      { nameUz: "Kosonsoy", nameRu: "Касансайский", type: "DISTRICT" },
      { nameUz: "Mingbuloq", nameRu: "Мингбулакский", type: "DISTRICT" },
      { nameUz: "Namangan", nameRu: "Наманганский", type: "DISTRICT" },
      { nameUz: "Norin", nameRu: "Нарынский", type: "DISTRICT" },
      { nameUz: "Pop", nameRu: "Папский", type: "DISTRICT" },
      { nameUz: "Toʻraqoʻrgʻon", nameRu: "Туракурганский", type: "DISTRICT" },
      { nameUz: "Uchqoʻrgʻon", nameRu: "Учкурганский", type: "DISTRICT" },
      { nameUz: "Uychi", nameRu: "Уйчинский", type: "DISTRICT" },
      { nameUz: "Yangiqoʻrgʻon", nameRu: "Янгикурганский", type: "DISTRICT" }
    ]
  },
  {
    nameUz: "Navoiy viloyati",
    nameRu: "Навоийская область",
    type: "VILOYAT",
    districts: [
      { nameUz: "Navoiy shahri", nameRu: "г. Навои", type: "CITY" },
      { nameUz: "Karmana", nameRu: "Карманинский", type: "DISTRICT" },
      { nameUz: "Konimex", nameRu: "Канимехский", type: "DISTRICT" },
      { nameUz: "Navbahor", nameRu: "Навбахорский", type: "DISTRICT" },
      { nameUz: "Nurota", nameRu: "Нуратинский", type: "DISTRICT" },
      { nameUz: "Qiziltepa", nameRu: "Кызылтепинский", type: "DISTRICT" },
      { nameUz: "Tomdi", nameRu: "Тамдынский", type: "DISTRICT" },
      { nameUz: "Uchquduq", nameRu: "Учкудукский", type: "DISTRICT" },
      { nameUz: "Xatirchi", nameRu: "Хатырчинский", type: "DISTRICT" }
    ]
  },
  {
    nameUz: "Qashqadaryo viloyati",
    nameRu: "Кашкадарьинская область",
    type: "VILOYAT",
    districts: [
      { nameUz: "Qarshi shahri", nameRu: "г. Карши", type: "CITY" },
      { nameUz: "Shahrisabz shahri", nameRu: "г. Шахрисабз", type: "CITY" },
      { nameUz: "Chiroqchi", nameRu: "Чиракчинский", type: "DISTRICT" },
      { nameUz: "Dehqonobod", nameRu: "Дехканабадский", type: "DISTRICT" },
      { nameUz: "Gʻuzor", nameRu: "Гузарский", type: "DISTRICT" },
      { nameUz: "Kasbi", nameRu: "Касбийский", type: "DISTRICT" },
      { nameUz: "Kitob", nameRu: "Китабский", type: "DISTRICT" },
      { nameUz: "Koson", nameRu: "Касанский", type: "DISTRICT" },
      { nameUz: "Koʻkdala", nameRu: "Кукдалинский", type: "DISTRICT" },
      { nameUz: "Mirishkor", nameRu: "Миришкорский", type: "DISTRICT" },
      { nameUz: "Muborak", nameRu: "Мубарекский", type: "DISTRICT" },
      { nameUz: "Nishon", nameRu: "Нишанский", type: "DISTRICT" },
      { nameUz: "Qamashi", nameRu: "Камашинский", type: "DISTRICT" },
      { nameUz: "Qarshi", nameRu: "Каршинский", type: "DISTRICT" },
      { nameUz: "Shahrisabz", nameRu: "Шахрисабзский", type: "DISTRICT" },
      { nameUz: "Yakkabogʻ", nameRu: "Яккабагский", type: "DISTRICT" }
    ]
  },
  {
    nameUz: "Samarqand viloyati",
    nameRu: "Самаркандская область",
    type: "VILOYAT",
    districts: [
      { nameUz: "Samarqand shahri", nameRu: "г. Самарканд", type: "CITY" },
      { nameUz: "Kattaqoʻrgʻon shahri", nameRu: "г. Каттакурган", type: "CITY" },
      { nameUz: "Bulungʻur", nameRu: "Булунгурский", type: "DISTRICT" },
      { nameUz: "Ishtixon", nameRu: "Иштыханский", type: "DISTRICT" },
      { nameUz: "Jomboy", nameRu: "Джамбайский", type: "DISTRICT" },
      { nameUz: "Kattaqoʻrgʻon", nameRu: "Каттакурганский", type: "DISTRICT" },
      { nameUz: "Narpay", nameRu: "Нарпайский", type: "DISTRICT" },
      { nameUz: "Nurobod", nameRu: "Нурабадский", type: "DISTRICT" },
      { nameUz: "Oqdaryo", nameRu: "Акдарьинский", type: "DISTRICT" },
      { nameUz: "Pastdargʻom", nameRu: "Пастдаргомский", type: "DISTRICT" },
      { nameUz: "Paxtachi", nameRu: "Пахтачийский", type: "DISTRICT" },
      { nameUz: "Payariq", nameRu: "Пайарыкский", type: "DISTRICT" },
      { nameUz: "Qoʻshrabot", nameRu: "Кошрабадский", type: "DISTRICT" },
      { nameUz: "Samarqand", nameRu: "Самаркандский", type: "DISTRICT" },
      { nameUz: "Toyloq", nameRu: "Тайлакский", type: "DISTRICT" },
      { nameUz: "Urgut", nameRu: "Ургутский", type: "DISTRICT" }
    ]
  },
  {
    nameUz: "Sirdaryo viloyati",
    nameRu: "Сырдарьинская область",
    type: "VILOYAT",
    districts: [
      { nameUz: "Guliston shahri", nameRu: "г. Гулистан", type: "CITY" },
      { nameUz: "Boyovut", nameRu: "Баяутский", type: "DISTRICT" },
      { nameUz: "Guliston", nameRu: "Гулистанский", type: "DISTRICT" },
      { nameUz: "Mirzaobod", nameRu: "Мирзаабадский", type: "DISTRICT" },
      { nameUz: "Oqoltin", nameRu: "Акалтынский", type: "DISTRICT" },
      { nameUz: "Sardoba", nameRu: "Сардобинский", type: "DISTRICT" },
      { nameUz: "Sayxunobod", nameRu: "Сайхунабадский", type: "DISTRICT" },
      { nameUz: "Sirdaryo", nameRu: "Сырдарьинский", type: "DISTRICT" },
      { nameUz: "Xovos", nameRu: "Хавастский", type: "DISTRICT" }
    ]
  },
  {
    nameUz: "Surxondaryo viloyati",
    nameRu: "Сурхандарьинская область",
    type: "VILOYAT",
    districts: [
      { nameUz: "Termiz shahri", nameRu: "г. Термез", type: "CITY" },
      { nameUz: "Angor", nameRu: "Ангорский", type: "DISTRICT" },
      { nameUz: "Bandixon", nameRu: "Бандиханский", type: "DISTRICT" },
      { nameUz: "Boysun", nameRu: "Байсунский", type: "DISTRICT" },
      { nameUz: "Denov", nameRu: "Денауский", type: "DISTRICT" },
      { nameUz: "Jarqoʻrgʻon", nameRu: "Джаркурганский", type: "DISTRICT" },
      { nameUz: "Muzrabot", nameRu: "Музрабадский", type: "DISTRICT" },
      { nameUz: "Oltinsoy", nameRu: "Алтынсайский", type: "DISTRICT" },
      { nameUz: "Qiziriq", nameRu: "Кизирикский", type: "DISTRICT" },
      { nameUz: "Qumqoʻrgʻon", nameRu: "Кумкурганский", type: "DISTRICT" },
      { nameUz: "Sariosiyo", nameRu: "Сариасийский", type: "DISTRICT" },
      { nameUz: "Sherobod", nameRu: "Шерабадский", type: "DISTRICT" },
      { nameUz: "Shoʻrchi", nameRu: "Шурчинский", type: "DISTRICT" },
      { nameUz: "Termiz", nameRu: "Термезский", type: "DISTRICT" },
      { nameUz: "Uzun", nameRu: "Узунский", type: "DISTRICT" }
    ]
  },
  {
    nameUz: "Toshkent viloyati",
    nameRu: "Ташкентская область",
    type: "VILOYAT",
    districts: [
      { nameUz: "Nurafshon shahri", nameRu: "г. Нурафшан", type: "CITY" },
      { nameUz: "Chirchiq shahri", nameRu: "г. Чирчик", type: "CITY" },
      { nameUz: "Olmaliq shahri", nameRu: "г. Алмалык", type: "CITY" },
      { nameUz: "Angren shahri", nameRu: "г. Ангрен", type: "CITY" },
      { nameUz: "Bekobod", nameRu: "Бекабадский", type: "DISTRICT" },
      { nameUz: "Boʻka", nameRu: "Букинский", type: "DISTRICT" },
      { nameUz: "Boʻstonliq", nameRu: "Бостанлыкский", type: "DISTRICT" },
      { nameUz: "Chinoz", nameRu: "Чиназский", type: "DISTRICT" },
      { nameUz: "Ohangaron", nameRu: "Ахангаранский", type: "DISTRICT" },
      { nameUz: "Oqqoʻrgʻon", nameRu: "Аккурганский", type: "DISTRICT" },
      { nameUz: "Oʻrtachirchiq", nameRu: "Уртачирчикский", type: "DISTRICT" },
      { nameUz: "Parkent", nameRu: "Паркентский", type: "DISTRICT" },
      { nameUz: "Piskent", nameRu: "Пскентский", type: "DISTRICT" },
      { nameUz: "Qibray", nameRu: "Кибрайский", type: "DISTRICT" },
      { nameUz: "Quyichirchiq", nameRu: "Куйичирчикский", type: "DISTRICT" },
      { nameUz: "Toshkent", nameRu: "Ташкентский", type: "DISTRICT" },
      { nameUz: "Yangiyoʻl", nameRu: "Янгиюльский", type: "DISTRICT" },
      { nameUz: "Yuqorichirchiq", nameRu: "Юкоричирчикский", type: "DISTRICT" },
      { nameUz: "Zangiota", nameRu: "Зангиатинский", type: "DISTRICT" }
    ]
  },
  {
    nameUz: "Xorazm viloyati",
    nameRu: "Хорезмская область",
    type: "VILOYAT",
    districts: [
      { nameUz: "Urganch shahri", nameRu: "г. Ургенч", type: "CITY" },
      { nameUz: "Xiva shahri", nameRu: "г. Хива", type: "CITY" },
      { nameUz: "Bogʻot", nameRu: "Багатский", type: "DISTRICT" },
      { nameUz: "Gurlan", nameRu: "Гурленский", type: "DISTRICT" },
      { nameUz: "Qoʻshkoʻpir", nameRu: "Кошкупырский", type: "DISTRICT" },
      { nameUz: "Shovot", nameRu: "Шаватский", type: "DISTRICT" },
      { nameUz: "Tuproqqalʼa", nameRu: "Тупроккалинский", type: "DISTRICT" },
      { nameUz: "Urganch", nameRu: "Ургенчский", type: "DISTRICT" },
      { nameUz: "Xazorasp", nameRu: "Хазараспский", type: "DISTRICT" },
      { nameUz: "Xiva", nameRu: "Хивинский", type: "DISTRICT" },
      { nameUz: "Xonqa", nameRu: "Ханкинский", type: "DISTRICT" },
      { nameUz: "Yangiariq", nameRu: "Янгиарыкский", type: "DISTRICT" },
      { nameUz: "Yangibozor", nameRu: "Янгибазарский", type: "DISTRICT" }
    ]
  },
  {
    nameUz: "Toshkent shahri",
    nameRu: "город Ташкент",
    type: "CITY",
    districts: [
      { nameUz: "Bektemir", nameRu: "Бектемирский", type: "DISTRICT" },
      { nameUz: "Chilonzor", nameRu: "Чиланзарский", type: "DISTRICT" },
      { nameUz: "Mirobod", nameRu: "Мирабадский", type: "DISTRICT" },
      { nameUz: "Mirzo Ulugʻbek", nameRu: "Мирзо-Улугбекский", type: "DISTRICT" },
      { nameUz: "Olmazor", nameRu: "Алмазарский", type: "DISTRICT" },
      { nameUz: "Sergeli", nameRu: "Сергелийский", type: "DISTRICT" },
      { nameUz: "Shayxontohur", nameRu: "Шайхантахурский", type: "DISTRICT" },
      { nameUz: "Uchtepa", nameRu: "Учтепинский", type: "DISTRICT" },
      { nameUz: "Yakkasaroy", nameRu: "Яккасарайский", type: "DISTRICT" },
      { nameUz: "Yangihayot", nameRu: "Янгихаётский", type: "DISTRICT" },
      { nameUz: "Yashnobod", nameRu: "Яшнабадский", type: "DISTRICT" },
      { nameUz: "Yunusobod", nameRu: "Юнусабадский", type: "DISTRICT" }
    ]
  }
];
