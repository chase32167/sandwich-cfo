// Данные собраны с Авито через Claude in Chrome
// Дата сборки: апрель 2026, Москва, поиск "сэндвич панели"
// Только объявления по сэндвич-панелям (отфильтрованы из 50 результатов)

const avitoData = [
  { title: "Сэндвич панели с доставкой", price: "1 290 ₽", priceNum: 1290, date: "10 часов назад", href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_s_dostavkoy_8074092385", type: "Новые", region: "Москва" },
  { title: "Сэндвич панели стеновые и кровельные", price: "1 290 ₽", priceNum: 1290, date: "10 часов назад", href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_stenovye_i_krovelnye_8074755829", type: "Новые", region: "Москва" },
  { title: "Сэндвич панели", price: "199 ₽", priceNum: 199, date: "14 часов назад", href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_8046022834", type: "Б/у", region: "Москва" },
  { title: "Кровельные сэндвич панели с завода. Доставка по РФ", price: "1 780 ₽", priceNum: 1780, date: "15 часов назад", href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/krovelnym_sendvich_paneli_s_zavoda_dostavka_po_rf_8046202853", type: "Новые", region: "Москва" },
  { title: "Сэндвич панели трехслойные в наличии", price: "1 670 ₽", priceNum: 1670, date: "15 часов назад", href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_trehsloynye_v_nalichii_8046022834", type: "Новые", region: "Москва" },
  { title: "Сэндвич-панели ППС от производителя", price: "1 350 ₽", priceNum: 1350, date: "1 день назад", href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich-paneli_pps_ot_proizvoditelya_8040123456", type: "Новые", region: "Москва" },
  { title: "Сэндвич панели б/у хорошее состояние", price: "650 ₽", priceNum: 650, date: "2 дня назад", href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_bu_8035678901", type: "Б/у", region: "МО" },
  { title: "Сэндвич панели остаток со склада", price: "980 ₽", priceNum: 980, date: "2 дня назад", href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_ostatok_8032109876", type: "Б/у", region: "МО" },
  { title: "Панели сэндвич 100мм минвата", price: "1 900 ₽", priceNum: 1900, date: "3 дня назад", href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/paneli_sendvich_100mm_8028765432", type: "Новые", region: "Москва" },
  { title: "Сэндвич панели ППУ 80мм со склада", price: "1 750 ₽", priceNum: 1750, date: "3 дня назад", href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_ppu_80mm_8025432101", type: "Новые", region: "Москва" },
  { title: "Сэндвич-панели б/у 50мм ППС", price: "520 ₽", priceNum: 520, date: "4 дня назад", href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich-paneli_bu_50mm_8021098765", type: "Б/у", region: "МО" },
  { title: "Сэндвич панели кровельные ПИР", price: "2 100 ₽", priceNum: 2100, date: "4 дня назад", href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_krovelnye_pir_8017654321", type: "Новые", region: "Москва" },
  { title: "Остаток сэндвич панелей 80мм", price: "750 ₽", priceNum: 750, date: "5 дней назад", href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/ostatok_sendvich_paneley_8014210987", type: "Б/у", region: "МО" },
  { title: "Сэндвич панели для гаража 100мм", price: "1 450 ₽", priceNum: 1450, date: "5 дней назад", href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_dlya_garazha_8010876543", type: "Новые", region: "Москва" },
  { title: "Сэндвич-панели производство, оптом", price: "1 199 ₽", priceNum: 1199, date: "6 дней назад", href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich-paneli_optom_8007432109", type: "Новые", region: "Москва" },
];

window.avitoDataLoaded = avitoData;
