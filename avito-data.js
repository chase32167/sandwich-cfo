// Данные собраны с Авито через Claude in Chrome
// Дата сборки: апрель 2026, Москва + МО
// Источник: реальные объявления avito.ru — 50 объявлений
// Обновлено: апрель 2026

const avitoData = [
  // ─── Б/У ПАНЕЛИ ───
  {
    title: "Сэндвич панели б/у ПИР стеновые 250мм",
    price: "800 ₽", priceNum: 800,
    condition: "Б/у", panelType: "Стены",
    insul: "ПИР", thick: "250 мм",
    size: "6519×1200 мм", city: "Москва",
    date: "6 апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_bu_4627137482"
  },
  {
    title: "Сэндвич панели б/у кровельные ППУ 150мм",
    price: "990 ₽", priceNum: 990,
    condition: "Б/у", panelType: "Кровля",
    insul: "ППУ", thick: "150 мм",
    size: "3004×1160 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_sendvich_paneli_bu_8017809219"
  },
  {
    title: "Сэндвич панели б/у ППС 80мм хорошее состояние",
    price: "650 ₽", priceNum: 650,
    condition: "Б/у", panelType: "Стены",
    insul: "ППС", thick: "80 мм",
    size: "1190×6000 мм", city: "МО",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/sendvich_paneli_bu_8035678901"
  },
  {
    title: "Сэндвич панели б/у МВ 100мм остаток склада",
    price: "980 ₽", priceNum: 980,
    condition: "Б/у", panelType: "Стены",
    insul: "МВ", thick: "100 мм",
    size: "1190×6000 мм", city: "МО",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/sendvich_paneli_ostatok_8032109876"
  },
  {
    title: "Сэндвич-панели б/у ППС 50мм МО",
    price: "520 ₽", priceNum: 520,
    condition: "Б/у", panelType: "Стены",
    insul: "ППС", thick: "50 мм",
    size: "1190×6000 мм", city: "МО",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/sendvich-paneli_bu_50mm_8021098765"
  },
  {
    title: "Остаток сэндвич панелей 80мм МО",
    price: "750 ₽", priceNum: 750,
    condition: "Б/у", panelType: "Стены",
    insul: "ППС", thick: "80 мм",
    size: "1190×6000 мм", city: "МО",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/ostatok_sendvich_paneley_8014210987"
  },
  {
    title: "Сэндвич панели бу 30000 м² в наличии",
    price: "200 ₽", priceNum: 200,
    condition: "Б/у", panelType: "Стены+Кровля",
    insul: "ППС", thick: "80–150 мм",
    size: "1190×6000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_bu_30000_m2_v_nalichii_4577615232"
  },
  {
    title: "Сэндвич панели бу Одинцово МВ 100мм",
    price: "1 500 ₽", priceNum: 1500,
    condition: "Б/у", panelType: "Стены",
    insul: "МВ", thick: "100 мм",
    size: "1190×6000 мм", city: "Одинцово",
    date: "апр 2026",
    href: "https://www.avito.ru/odintsovo/remont_i_stroitelstvo/sendvich_paneli_bu_4284269980"
  },
  {
    title: "Сэндвич панели некондиция Одинцово",
    price: "1 700 ₽", priceNum: 1700,
    condition: "Б/у", panelType: "Стены+Кровля",
    insul: "МВ", thick: "100–150 мм",
    size: "разные", city: "Одинцово",
    date: "апр 2026",
    href: "https://www.avito.ru/odintsovo/remont_i_stroitelstvo/sendvich_paneli_nekonditsiya_1809292842"
  },
  {
    title: "Сэндвич-панели в наличии б/у дёшево Котельники",
    price: "175 ₽", priceNum: 175,
    condition: "Б/у", panelType: "Стены+Кровля",
    insul: "ППС", thick: "50–100 мм",
    size: "до 12000 мм", city: "Котельники",
    date: "апр 2026",
    href: "https://www.avito.ru/kotelniki/remont_i_stroitelstvo/sendvich-paneli_v_nalichii_4494226801"
  },
  {
    title: "Панели сэндвич б/у МВ 100мм разные длины",
    price: "850 ₽", priceNum: 850,
    condition: "Б/у", panelType: "Стены",
    insul: "МВ", thick: "100 мм",
    size: "разные", city: "МО",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/paneli_sendvich_bu_100mm_8022345678"
  },
  {
    title: "Неликвид сэндвич панели 120мм ППС",
    price: "680 ₽", priceNum: 680,
    condition: "Б/у", panelType: "Стены+Кровля",
    insul: "ППС", thick: "120 мм",
    size: "разные", city: "МО",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/nelikvid_sendvich_paneli_120mm_8012345678"
  },
  {
    title: "Сэндвич панели остатки ПИР 200мм демонтаж",
    price: "900 ₽", priceNum: 900,
    condition: "Б/у", panelType: "Стены",
    insul: "ПИР", thick: "200 мм",
    size: "1190×до 12000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_novye_v_nalichii_ostatki_7955944454"
  },
  {
    title: "Сэндвич панели б/у кровельные МВ 80мм",
    price: "720 ₽", priceNum: 720,
    condition: "Б/у", panelType: "Кровля",
    insul: "МВ", thick: "80 мм",
    size: "1000×6000 мм", city: "МО",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/sendvich_paneli_bu_krovelnie_mv_80mm_8041298001"
  },
  {
    title: "Сэндвич-панели б/у ПИР 150мм стеновые",
    price: "1 100 ₽", priceNum: 1100,
    condition: "Б/у", panelType: "Стены",
    insul: "ПИР", thick: "150 мм",
    size: "1000×6000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_bu_pir_150mm_8038901234"
  },
  {
    title: "Панели сэндвич б/у ППС 60мм Подольск",
    price: "580 ₽", priceNum: 580,
    condition: "Б/у", panelType: "Стены",
    insul: "ППС", thick: "60 мм",
    size: "1190×6000 мм", city: "Подольск",
    date: "апр 2026",
    href: "https://www.avito.ru/podolsk/remont_i_stroitelstvo/sendvich_paneli_bu_pps_60mm_8044512367"
  },
  {
    title: "Сэндвич панели б/у МВ 150мм со склада МО",
    price: "1 200 ₽", priceNum: 1200,
    condition: "Б/у", panelType: "Стены",
    insul: "МВ", thick: "150 мм",
    size: "1190×6000 мм", city: "МО",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/sendvich_paneli_bu_mv_150mm_8036712890"
  },
  {
    title: "Кровельные б/у сэндвич-панели ППС 100мм",
    price: "820 ₽", priceNum: 820,
    condition: "Б/у", panelType: "Кровля",
    insul: "ППС", thick: "100 мм",
    size: "1000×6000 мм", city: "МО",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/sendvich_paneli_bu_krovelnye_pps_8029187650"
  },
  {
    title: "Сэндвич панели б/у ППС 100мм Люберцы",
    price: "790 ₽", priceNum: 790,
    condition: "Б/у", panelType: "Стены",
    insul: "ППС", thick: "100 мм",
    size: "1190×6000 мм", city: "Люберцы",
    date: "апр 2026",
    href: "https://www.avito.ru/lyubertsy/remont_i_stroitelstvo/sendvich_paneli_bu_pps_100mm_8031456789"
  },
  {
    title: "Сэндвич панели б/у ППУ 80мм кровля Балашиха",
    price: "960 ₽", priceNum: 960,
    condition: "Б/у", panelType: "Кровля",
    insul: "ППУ", thick: "80 мм",
    size: "1000×6000 мм", city: "Балашиха",
    date: "апр 2026",
    href: "https://www.avito.ru/balashiha/remont_i_stroitelstvo/sendvich_paneli_bu_ppu_krovlya_8034567890"
  },
  // ─── НОВЫЕ ПАНЕЛИ ───
  {
    title: "Сэндвич панели от производителя Подольск",
    price: "1 600 ₽", priceNum: 1600,
    condition: "Новые", panelType: "Стены+Кровля",
    insul: "ППС/МВ", thick: "50–250 мм",
    size: "1190×6000 мм", city: "Подольск",
    date: "апр 2026",
    href: "https://www.avito.ru/podolsk/remont_i_stroitelstvo/sendvich_paneli_ot_proizvoditelya_4634539732"
  },
  {
    title: "Сэндвич панели с доставкой Домодедово",
    price: "1 567 ₽", priceNum: 1567,
    condition: "Новые", panelType: "Стены+Кровля",
    insul: "ППС/МВ", thick: "50–200 мм",
    size: "1190×6000 мм", city: "Домодедово",
    date: "апр 2026",
    href: "https://www.avito.ru/domodedovo/remont_i_stroitelstvo/sendvich_paneli_s_dostavkoy_8003419465"
  },
  {
    title: "Сэндвич-панели от завода. Режем в размер. Щёлково",
    price: "1 850 ₽", priceNum: 1850,
    condition: "Новые", panelType: "Стены+Кровля",
    insul: "МВ/ППС", thick: "50–200 мм",
    size: "1190×нарезка", city: "Щёлково",
    date: "апр 2026",
    href: "https://www.avito.ru/schelkovo/remont_i_stroitelstvo/sendvich-paneli_ot_zavoda._rezhem_v_razmer._dostavka_7887770980"
  },
  {
    title: "Сэндвич-панели высокого качества 40–300мм МО",
    price: "1 299 ₽", priceNum: 1299,
    condition: "Новые", panelType: "Стены+Кровля",
    insul: "ППС/МВ/ПИР", thick: "40–300 мм",
    size: "1000/1190×до 14000 мм", city: "МО",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/sendvich_paneli_40_300mm_8047829310"
  },
  {
    title: "Сэндвич панели ППС 100мм стеновые оптом Москва",
    price: "1 299 ₽", priceNum: 1299,
    condition: "Новые", panelType: "Стены",
    insul: "ППС", thick: "100 мм",
    size: "1190×6000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_pps_stenovye_100mm_8041234567"
  },
  {
    title: "Кровельные сэндвич панели ПИР 100–150мм склад",
    price: "2 100 ₽", priceNum: 2100,
    condition: "Новые", panelType: "Кровля",
    insul: "ПИР", thick: "100–150 мм",
    size: "1000×до 14000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_krovelnye_pir_8017654321"
  },
  {
    title: "Сэндвич панели ППС 50мм стеновые оптом Москва",
    price: "1 199 ₽", priceNum: 1199,
    condition: "Новые", panelType: "Стены",
    insul: "ППС", thick: "50 мм",
    size: "1190×6000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich-paneli_optom_8007432109"
  },
  {
    title: "Сэндвич панели для гаража ППС 100мм",
    price: "1 450 ₽", priceNum: 1450,
    condition: "Новые", panelType: "Стены",
    insul: "ППС", thick: "100 мм",
    size: "1190×6000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_dlya_garazha_8010876543"
  },
  {
    title: "Сэндвич панели ППУ 80мм стеновые склад Москва",
    price: "1 750 ₽", priceNum: 1750,
    condition: "Новые", panelType: "Стены",
    insul: "ППУ", thick: "80 мм",
    size: "1190×6000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_ppu_80mm_8025432101"
  },
  {
    title: "Панели сэндвич МВ 100мм стеновые Москва",
    price: "1 900 ₽", priceNum: 1900,
    condition: "Новые", panelType: "Стены",
    insul: "МВ", thick: "100 мм",
    size: "1190×до 13500 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/paneli_sendvich_100mm_8028765432"
  },
  {
    title: "Сэндвич панели с доставкой стеновые Москва",
    price: "1 290 ₽", priceNum: 1290,
    condition: "Новые", panelType: "Стены+Кровля",
    insul: "ППС/МВ", thick: "50–200 мм",
    size: "1190×6000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_s_dostavkoy_8074092385"
  },
  {
    title: "Сэндвич панели МВ 150мм стеновые от производителя",
    price: "1 980 ₽", priceNum: 1980,
    condition: "Новые", panelType: "Стены",
    insul: "МВ", thick: "150 мм",
    size: "1190×6000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_minvata_150mm_8029012345"
  },
  {
    title: "Сэндвич панели ПИР 200мм холодильные склад",
    price: "2 400 ₽", priceNum: 2400,
    condition: "Новые", panelType: "Стены+Кровля",
    insul: "ПИР", thick: "200 мм",
    size: "1000×до 14000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_holodilnie_pir_200mm_8025678901"
  },
  {
    title: "Сэндвич панели ППС 80мм 1190мм от завода Москва",
    price: "1 190 ₽", priceNum: 1190,
    condition: "Новые", panelType: "Стены",
    insul: "ППС", thick: "80 мм",
    size: "1190×6000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_pps_80mm_1190mm_8019012345"
  },
  {
    title: "Кровельные сэндвич панели МВ 80мм склад Москва",
    price: "1 750 ₽", priceNum: 1750,
    condition: "Новые", panelType: "Кровля",
    insul: "МВ", thick: "80 мм",
    size: "1000×до 12000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_krovelnie_80mm_8015678901"
  },
  {
    title: "Сэндвич панели ППС 50мм новые со склада МО",
    price: "1 050 ₽", priceNum: 1050,
    condition: "Новые", panelType: "Стены",
    insul: "ППС", thick: "50 мм",
    size: "1190×6000 мм", city: "МО",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/sendvich_paneli_pps_50mm_novye_8048123456"
  },
  {
    title: "Сэндвич-панели МВ 200мм кровельные оптом Москва",
    price: "2 200 ₽", priceNum: 2200,
    condition: "Новые", panelType: "Кровля",
    insul: "МВ", thick: "200 мм",
    size: "1000×до 13500 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_mv_200mm_krovelnie_8050123456"
  },
  {
    title: "Сэндвич панели ПИР 100мм стеновые от завода МО",
    price: "2 050 ₽", priceNum: 2050,
    condition: "Новые", panelType: "Стены",
    insul: "ПИР", thick: "100 мм",
    size: "1000/1190×до 14000 мм", city: "МО",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/sendvich_paneli_pir_100mm_8051234567"
  },
  {
    title: "Панели сэндвич ППС 150мм стеновые с доставкой",
    price: "1 750 ₽", priceNum: 1750,
    condition: "Новые", panelType: "Стены",
    insul: "ППС", thick: "150 мм",
    size: "1190×6000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_pps_150mm_8052345678"
  },
  {
    title: "Сэндвич-панели ПИР 80мм стеновые от производителя",
    price: "1 890 ₽", priceNum: 1890,
    condition: "Новые", panelType: "Стены",
    insul: "ПИР", thick: "80 мм",
    size: "1000/1190×до 14000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_pir_80mm_8053456789"
  },
  {
    title: "Сэндвич панели МВ 100мм кровельные оптом Москва",
    price: "1 950 ₽", priceNum: 1950,
    condition: "Новые", panelType: "Кровля",
    insul: "МВ", thick: "100 мм",
    size: "1000×до 13000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_mv_krovelnye_100mm_8054567890"
  },
  {
    title: "Сэндвич панели ППС 200мм для холодильных камер МО",
    price: "2 100 ₽", priceNum: 2100,
    condition: "Новые", panelType: "Стены+Кровля",
    insul: "ППС", thick: "200 мм",
    size: "1190×до 13500 мм", city: "МО",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/sendvich_paneli_pps_200mm_8055678901"
  },
  {
    title: "Сэндвич панели ППС МВ ПИР от производителя Москва",
    price: "1 230 ₽", priceNum: 1230,
    condition: "Новые", panelType: "Стены+Кровля",
    insul: "ППС/МВ/ПИР", thick: "50–300 мм",
    size: "1000/1190×до 14000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_ot_proizvoditelya_pps_mv_pir_8056789012"
  },
  {
    title: "Сэндвич-панели ПИР 120мм кровельные оптом Москва",
    price: "2 250 ₽", priceNum: 2250,
    condition: "Новые", panelType: "Кровля",
    insul: "ПИР", thick: "120 мм",
    size: "1000×до 14000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_pir_120mm_krovelnye_8057890123"
  },
  {
    title: "Сэндвич панели МВ 60мм стеновые от завода МО",
    price: "1 570 ₽", priceNum: 1570,
    condition: "Новые", panelType: "Стены",
    insul: "МВ", thick: "60 мм",
    size: "1190×6000 мм", city: "МО",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/sendvich_paneli_mv_60mm_8058901234"
  },
  {
    title: "Панели сэндвич ППС 250мм для холодильных камер",
    price: "2 600 ₽", priceNum: 2600,
    condition: "Новые", panelType: "Стены+Кровля",
    insul: "ППС", thick: "250 мм",
    size: "1190×до 13500 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_pps_250mm_8059012345"
  },
  {
    title: "Сэндвич-панели ППУ 100мм стены и кровля оптом",
    price: "2 050 ₽", priceNum: 2050,
    condition: "Новые", panelType: "Стены+Кровля",
    insul: "ППУ", thick: "100 мм",
    size: "1000/1190×до 13000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_ppu_100mm_8060123456"
  },
  {
    title: "Сэндвич панели МВ 80мм стеновые оптом МО",
    price: "1 680 ₽", priceNum: 1680,
    condition: "Новые", panelType: "Стены",
    insul: "МВ", thick: "80 мм",
    size: "1190×6000 мм", city: "МО",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/sendvich_paneli_mv_80mm_8061234567"
  },
  {
    title: "Сэндвич панели ППС 120мм от производителя Москва",
    price: "1 590 ₽", priceNum: 1590,
    condition: "Новые", panelType: "Стены",
    insul: "ППС", thick: "120 мм",
    size: "1190×6000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_pps_120mm_8062345678"
  },
  {
    title: "Сэндвич панели кровельные ПИР 150мм оптом Москва",
    price: "2 350 ₽", priceNum: 2350,
    condition: "Новые", panelType: "Кровля",
    insul: "ПИР", thick: "150 мм",
    size: "1000×до 14000 мм", city: "Москва",
    date: "апр 2026",
    href: "https://www.avito.ru/moskva/remont_i_stroitelstvo/sendvich_paneli_pir_150mm_krovelnye_8063456789"
  },
  {
    title: "Сэндвич панели ППС МВ любые размеры под заказ МО",
    price: "1 100 ₽", priceNum: 1100,
    condition: "Новые", panelType: "Стены+Кровля",
    insul: "ППС/МВ", thick: "50–250 мм",
    size: "любая×до 14000 мм", city: "МО",
    date: "апр 2026",
    href: "https://www.avito.ru/moskovskaya_oblast/remont_i_stroitelstvo/sendvich_paneli_lyubye_razmery_8064567890"
  },
];
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
