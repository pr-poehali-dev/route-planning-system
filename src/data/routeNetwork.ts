// Сеть участков маршрутов — реальные данные по России
// Каждый узел — город/точка, каждый участок — ребро графа

export interface Segment {
  id: string;
  name: string;
  from: string;      // ID узла
  to: string;        // ID узла
  fromCoords: [number, number];
  toCoords: [number, number];
  distanceKm: number;
  // Ограничения
  maxLengthM: number;     // Макс. длина авто в метрах (0 = нет ограничения)
  maxWidthM: number;      // Макс. ширина
  maxHeightM: number;     // Макс. высота
  maxAxleLoad: number;    // Макс. нагрузка на ось (тонн)
  conditions: string[];   // Доп. условия: 'spring_ban', 'seasonal', 'toll'
  color: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  coords: [number, number];
}

export const NODES: NetworkNode[] = [
  { id: 'vladivostok',     name: 'Владивосток',          coords: [43.1155, 131.8855] },
  { id: 'artem',           name: 'Артём',                coords: [43.3606, 132.1867] },
  { id: 'ussuriysk',       name: 'Уссурийск',            coords: [43.7977, 131.9474] },
  { id: 'khabarovsk',      name: 'Хабаровск',            coords: [48.4827, 135.0840] },
  { id: 'birobidzhan',     name: 'Биробиджан',           coords: [48.7926, 132.9213] },
  { id: 'blagoveshchensk', name: 'Благовещенск',         coords: [50.2905, 127.5272] },
  { id: 'chita',           name: 'Чита',                 coords: [52.0336, 113.4995] },
  { id: 'tanga',           name: 'Танга (Онон)',         coords: [50.9640, 111.0708] },
  { id: 'ulan_ude',        name: 'Улан-Удэ',             coords: [51.8272, 107.6065] },
  { id: 'irkutsk',         name: 'Иркутск',              coords: [52.2855, 104.2890] },
  { id: 'krasnoyarsk',     name: 'Красноярск',           coords: [56.0153, 92.8932]  },
  { id: 'novosibirsk',     name: 'Новосибирск',          coords: [54.9884, 82.9057]  },
  { id: 'omsk',            name: 'Омск',                 coords: [54.9885, 73.3242]  },
  { id: 'ishim',           name: 'Ишим',                 coords: [56.1099, 69.4748]  },
  { id: 'abatskoe',        name: 'Абатское',             coords: [56.2805, 70.4391]  },
  { id: 'tyumen',          name: 'Тюмень',               coords: [57.1553, 65.5343]  },
  { id: 'yekaterinburg',   name: 'Екатеринбург',         coords: [56.8389, 60.6057]  },
  { id: 'kamensk_uralsky', name: 'Каменск-Уральский',   coords: [56.4143, 61.9186]  },
  { id: 'chelyabinsk',     name: 'Челябинск',            coords: [55.1644, 61.4368]  },
  { id: 'ufa',             name: 'Уфа',                  coords: [54.7388, 55.9721]  },
  { id: 'kazan',           name: 'Казань',               coords: [55.8304, 49.0661]  },
  { id: 'nizhny_novgorod', name: 'Нижний Новгород',      coords: [56.2965, 43.9361]  },
  { id: 'vladimir',        name: 'Владимир',             coords: [56.1291, 40.4072]  },
  { id: 'moscow',          name: 'Москва',               coords: [55.7558, 37.6173]  },
  { id: 'tanga_omni',      name: 'ТангаОМНИ',            coords: [50.9640, 110.9628] },
];

// Цвета по зонам
const C = {
  far_east: '#FF8C00',
  siberia:  '#FFB84D',
  ural:     '#22C55E',
  center:   '#3B82F6',
};

export const SEGMENTS: Segment[] = [
  // ── Дальний Восток ──
  {
    id: 's1',
    name: 'Артём — Хабаровск',
    from: 'artem', to: 'khabarovsk',
    fromCoords: [43.3606, 132.0710], toCoords: [48.3373, 135.0444],
    distanceKm: 780,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 8,
    conditions: ['spring_ban'],
    color: C.far_east,
  },
  {
    id: 's2',
    name: 'Хабаровск — Биробиджан',
    from: 'khabarovsk', to: 'birobidzhan',
    fromCoords: [48.4827, 135.0840], toCoords: [48.7926, 132.9213],
    distanceKm: 175,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: [],
    color: C.far_east,
  },
  {
    id: 's3',
    name: 'Биробиджан — Благовещенск',
    from: 'birobidzhan', to: 'blagoveshchensk',
    fromCoords: [48.7926, 132.9213], toCoords: [50.2905, 127.5272],
    distanceKm: 390,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: [],
    color: C.far_east,
  },
  {
    id: 's4',
    name: 'Благовещенск — Чита',
    from: 'blagoveshchensk', to: 'chita',
    fromCoords: [50.2905, 127.5272], toCoords: [52.0336, 113.4995],
    distanceKm: 1040,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: ['spring_ban'],
    color: C.far_east,
  },
  {
    id: 's5',
    name: 'Хабаровск — Танга',
    from: 'khabarovsk', to: 'tanga',
    fromCoords: [48.5470, 135.0343], toCoords: [50.9629, 111.0709],
    distanceKm: 1580,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: ['spring_ban'],
    color: C.far_east,
  },

  // ── Сибирь ──
  {
    id: 's6',
    name: 'ТангаОМНИ — Ишим',
    from: 'tanga_omni', to: 'ishim',
    fromCoords: [50.9640, 110.9628], toCoords: [56.1599, 69.5498],
    distanceKm: 2450,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 0,
    conditions: [],
    color: C.siberia,
  },
  {
    id: 's7',
    name: 'Чита — Улан-Удэ',
    from: 'chita', to: 'ulan_ude',
    fromCoords: [52.0336, 113.4995], toCoords: [51.8272, 107.6065],
    distanceKm: 440,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: [],
    color: C.siberia,
  },
  {
    id: 's8',
    name: 'Улан-Удэ — Иркутск',
    from: 'ulan_ude', to: 'irkutsk',
    fromCoords: [51.8272, 107.6065], toCoords: [52.2855, 104.2890],
    distanceKm: 450,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: [],
    color: C.siberia,
  },
  {
    id: 's9',
    name: 'Иркутск — Красноярск',
    from: 'irkutsk', to: 'krasnoyarsk',
    fromCoords: [52.2855, 104.2890], toCoords: [56.0153, 92.8932],
    distanceKm: 1080,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: [],
    color: C.siberia,
  },
  {
    id: 's10',
    name: 'Красноярск — Новосибирск',
    from: 'krasnoyarsk', to: 'novosibirsk',
    fromCoords: [56.0153, 92.8932], toCoords: [54.9884, 82.9057],
    distanceKm: 775,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: [],
    color: C.siberia,
  },
  {
    id: 's11',
    name: 'Новосибирск — Омск',
    from: 'novosibirsk', to: 'omsk',
    fromCoords: [54.9884, 82.9057], toCoords: [54.9885, 73.3242],
    distanceKm: 635,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: [],
    color: C.siberia,
  },
  {
    id: 's12',
    name: 'Танга — ТангаОМНИ',
    from: 'tanga', to: 'tanga_omni',
    fromCoords: [50.9629, 111.0709], toCoords: [50.9640, 110.9628],
    distanceKm: 8,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 0,
    conditions: [],
    color: C.siberia,
  },

  // ── Урал ──
  {
    id: 's13',
    name: 'Омск — Ишим',
    from: 'omsk', to: 'ishim',
    fromCoords: [54.9885, 73.3242], toCoords: [56.1099, 69.4748],
    distanceKm: 320,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: [],
    color: C.ural,
  },
  {
    id: 's14',
    name: 'Абатское — Каменск-Уральский',
    from: 'abatskoe', to: 'kamensk_uralsky',
    fromCoords: [56.2805, 70.4391], toCoords: [56.3334, 62.2503],
    distanceKm: 480,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 0,
    conditions: [],
    color: C.ural,
  },
  {
    id: 's15',
    name: 'Ишим — Абатское',
    from: 'ishim', to: 'abatskoe',
    fromCoords: [56.1099, 69.4748], toCoords: [56.2805, 70.4391],
    distanceKm: 95,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 0,
    conditions: [],
    color: C.ural,
  },
  {
    id: 's16',
    name: 'Ишим — Тюмень',
    from: 'ishim', to: 'tyumen',
    fromCoords: [56.1099, 69.4748], toCoords: [57.1553, 65.5343],
    distanceKm: 310,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: [],
    color: C.ural,
  },
  {
    id: 's17',
    name: 'Тюмень — Екатеринбург',
    from: 'tyumen', to: 'yekaterinburg',
    fromCoords: [57.1553, 65.5343], toCoords: [56.8389, 60.6057],
    distanceKm: 325,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: [],
    color: C.ural,
  },
  {
    id: 's18',
    name: 'Каменск-Уральский — Екатеринбург',
    from: 'kamensk_uralsky', to: 'yekaterinburg',
    fromCoords: [56.4143, 61.9186], toCoords: [56.8389, 60.6057],
    distanceKm: 100,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: [],
    color: C.ural,
  },
  {
    id: 's19',
    name: 'Екатеринбург — Челябинск',
    from: 'yekaterinburg', to: 'chelyabinsk',
    fromCoords: [56.8389, 60.6057], toCoords: [55.1644, 61.4368],
    distanceKm: 210,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: [],
    color: C.ural,
  },

  // ── Центральная Россия ──
  {
    id: 's20',
    name: 'Челябинск — Уфа',
    from: 'chelyabinsk', to: 'ufa',
    fromCoords: [55.1644, 61.4368], toCoords: [54.7388, 55.9721],
    distanceKm: 415,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: [],
    color: C.center,
  },
  {
    id: 's21',
    name: 'Уфа — Казань',
    from: 'ufa', to: 'kazan',
    fromCoords: [54.7388, 55.9721], toCoords: [55.8304, 49.0661],
    distanceKm: 525,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: [],
    color: C.center,
  },
  {
    id: 's22',
    name: 'Казань — Нижний Новгород',
    from: 'kazan', to: 'nizhny_novgorod',
    fromCoords: [55.8304, 49.0661], toCoords: [56.2965, 43.9361],
    distanceKm: 395,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: [],
    color: C.center,
  },
  {
    id: 's23',
    name: 'Нижний Новгород — Владимир',
    from: 'nizhny_novgorod', to: 'vladimir',
    fromCoords: [56.2965, 43.9361], toCoords: [56.1291, 40.4072],
    distanceKm: 240,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: [],
    color: C.center,
  },
  {
    id: 's24',
    name: 'Владимир — Москва',
    from: 'vladimir', to: 'moscow',
    fromCoords: [56.1291, 40.4072], toCoords: [55.7558, 37.6173],
    distanceKm: 185,
    maxLengthM: 0, maxWidthM: 0, maxHeightM: 0, maxAxleLoad: 10,
    conditions: [],
    color: C.center,
  },
  {
    id: 's25',
    name: 'Владивосток — Артём',
    from: 'vladivostok', to: 'artem',
    fromCoords: [43.1155, 131.8855], toCoords: [43.3606, 132.1867],
    distanceKm: 42,
    maxLengthM: 25, maxWidthM: 3.5, maxHeightM: 4.5, maxAxleLoad: 0,
    conditions: ['spring_ban'],
    color: C.far_east,
  },
];

// Граф для быстрого поиска соседей
export type Graph = Record<string, { nodeId: string; segment: Segment }[]>;

export function buildGraph(): Graph {
  const graph: Graph = {};
  NODES.forEach(n => { graph[n.id] = []; });

  SEGMENTS.forEach(seg => {
    graph[seg.from].push({ nodeId: seg.to, segment: seg });
    graph[seg.to].push({ nodeId: seg.from, segment: seg }); // двунаправленные
  });

  return graph;
}
