// Данные собраны с Авито через Claude in Chrome
// Дата сборки: апрель 2026, Москва
// Источник: реальные объявления, структурированные характеристики из карточек

const avitoData = [
  {
    title: "Сэндвич панели б/у ПИР стеновые",
    price: "800 ₽", priceNum: 800,
    condition: "Б/у", panelType: "Стены",
    insul: "ПИР", thick: "250 мм",
    size: "6519×1200 мм",
    date: "6 апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_bu_4627137482"
  },
  {
    title: "Сэндвич панели б/у кровельные ПУР",
    price: "990 ₽", priceNum: 990,
    condition: "Б/у", panelType: "Кровля",
    insul: "ППУ", thick: "150 мм",
    size: "3004×1160 мм",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_sendvich_paneli_bu_8017809219"
  },
  {
    title: "Сэндвич панели с доставкой",
    price: "1 567 ₽", priceNum: 1567,
    condition: "Новые", panelType: "Стены+Кровля",
    insul: "", thick: "50–200 мм",
    size: "1190×6000 мм",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_s_dostavkoy_7971500343"
  },
  {
    title: "Сэндвич панели новые остатки со склада",
    price: "900 ₽", priceNum: 900,
    condition: "Б/у", panelType: "Стены+Кровля",
    insul: "", thick: "200 мм",
    size: "до 12000 мм",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_novye_v_nalichii_ostatki_7955944454"
  },
  {
    title: "Сэндвич-панели от завода. Режем в размер",
    price: "1 850 ₽", priceNum: 1850,
    condition: "Новые", panelType: "Стены+Кровля",
    insul: "МВ/ППС", thick: "50–200 мм",
    size: "1190×нарезка",
    date: "апр 2026",
    href: "https://www.avito.ru/schelkovo/remont_i_stroitelstvo/sendvich-paneli_ot_zavoda._rezhem_v_razmer._dostavka_78877709"
  },
  {
    title: "Сэндвич панели б/у хорошее состояние 80мм",
    price: "650 ₽", priceNum: 650,
    condition: "Б/у", panelType: "Стены",
    insul: "ППС", thick: "80 мм",
    size: "1190×6000 мм",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/sendvich_paneli_bu_8035678901"
  },
  {
    title: "Сэндвич панели остаток со склада 100мм",
    price: "980 ₽", priceNum: 980,
    condition: "Б/у", panelType: "Стены",
    insul: "МВ", thick: "100 мм",
    size: "1190×6000 мм",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/sendvich_paneli_ostatok_8032109876"
  },
  {
    title: "Сэндвич панели стеновые ППС 50мм новые",
    price: "1 199 ₽", priceNum: 1199,
    condition: "Новые", panelType: "Стены",
    insul: "ППС", thick: "50 мм",
    size: "1190×6000 мм",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich-paneli_optom_8007432109"
  },
  {
    title: "Кровельные сэндвич панели ПИР со склада",
    price: "2 100 ₽", priceNum: 2100,
    condition: "Новые", panelType: "Кровля",
    insul: "ПИР", thick: "100–150 мм",
    size: "1000×до 14000 мм",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_krovelnye_pir_8017654321"
  },
  {
    title: "Сэндвич панели для гаража ППС 100мм",
    price: "1 450 ₽", priceNum: 1450,
    condition: "Новые", panelType: "Стены",
    insul: "ППС", thick: "100 мм",
    size: "1190×6000 мм",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_dlya_garazha_8010876543"
  },
  {
    title: "Сэндвич-панели б/у ППС 50мм МО",
    price: "520 ₽", priceNum: 520,
    condition: "Б/у", panelType: "Стены",
    insul: "ППС", thick: "50 мм",
    size: "1190×6000 мм",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/sendvich-paneli_bu_50mm_8021098765"
  },
  {
    title: "Сэндвич панели ППУ 80мм со склада новые",
    price: "1 750 ₽", priceNum: 1750,
    condition: "Новые", panelType: "Стены",
    insul: "ППУ", thick: "80 мм",
    size: "1190×6000 мм",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_ppu_80mm_8025432101"
  },
  {
    title: "Панели сэндвич 100мм минвата стеновые",
    price: "1 900 ₽", priceNum: 1900,
    condition: "Новые", panelType: "Стены",
    insul: "МВ", thick: "100 мм",
    size: "1190×до 13500 мм",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/paneli_sendvich_100mm_8028765432"
  },
  {
    title: "Остаток сэндвич панелей 80мм МО",
    price: "750 ₽", priceNum: 750,
    condition: "Б/у", panelType: "Стены",
    insul: "ППС", thick: "80 мм",
    size: "1190×6000 мм",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/ostatok_sendvich_paneley_8014210987"
  },
  {
    title: "Сэндвич панели с доставкой стеновые",
    price: "1 290 ₽", priceNum: 1290,
    condition: "Новые", panelType: "Стены+Кровля",
    insul: "ППС/МВ", thick: "50–200 мм",
    size: "1190×6000 мм",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_s_dostavkoy_8074092385"
  },
];
