import { buildGraph, NODES, SEGMENTS, type Segment } from '@/data/routeNetwork';

export interface VehicleDimensions {
  lengthM: number;   // длина в метрах
  widthM: number;    // ширина
  heightM: number;   // высота
  axleLoadT: number; // нагрузка на ось в тоннах
}

export interface PathResult {
  found: boolean;
  segments: Segment[];
  totalDistanceKm: number;
  blockedBy: BlockedSegment[];
  allCoords: [number, number][];
}

export interface BlockedSegment {
  segment: Segment;
  reason: string;
}

// Проверяет, проходит ли транспорт через участок
export function canPassSegment(seg: Segment, vehicle: VehicleDimensions): { ok: boolean; reason: string } {
  if (seg.maxLengthM > 0 && vehicle.lengthM > seg.maxLengthM)
    return { ok: false, reason: `Длина ${vehicle.lengthM}м > ${seg.maxLengthM}м` };
  if (seg.maxWidthM > 0 && vehicle.widthM > seg.maxWidthM)
    return { ok: false, reason: `Ширина ${vehicle.widthM}м > ${seg.maxWidthM}м` };
  if (seg.maxHeightM > 0 && vehicle.heightM > seg.maxHeightM)
    return { ok: false, reason: `Высота ${vehicle.heightM}м > ${seg.maxHeightM}м` };
  if (seg.maxAxleLoad > 0 && vehicle.axleLoadT > seg.maxAxleLoad)
    return { ok: false, reason: `Нагрузка на ось ${vehicle.axleLoadT}т > ${seg.maxAxleLoad}т` };
  return { ok: true, reason: '' };
}

// Алгоритм Дейкстры по графу участков
export function findPath(
  fromNodeId: string,
  toNodeId: string,
  vehicle: VehicleDimensions
): PathResult {
  const graph = buildGraph();

  const dist: Record<string, number> = {};
  const prev: Record<string, { nodeId: string; segment: Segment } | null> = {};
  const visited = new Set<string>();

  NODES.forEach(n => {
    dist[n.id] = Infinity;
    prev[n.id] = null;
  });
  dist[fromNodeId] = 0;

  const blockedSegments: BlockedSegment[] = [];

  while (true) {
    // Берём узел с минимальным расстоянием
    let u: string | null = null;
    let minDist = Infinity;
    for (const nodeId of Object.keys(dist)) {
      if (!visited.has(nodeId) && dist[nodeId] < minDist) {
        minDist = dist[nodeId];
        u = nodeId;
      }
    }
    if (!u || u === toNodeId) break;
    visited.add(u);

    for (const { nodeId: v, segment } of (graph[u] || [])) {
      if (visited.has(v)) continue;

      const check = canPassSegment(segment, vehicle);
      if (!check.ok) {
        // Запоминаем заблокированные участки для отображения
        const already = blockedSegments.find(b => b.segment.id === segment.id);
        if (!already) blockedSegments.push({ segment, reason: check.reason });
        continue;
      }

      const alt = dist[u] + segment.distanceKm;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = { nodeId: u, segment };
      }
    }
  }

  // Восстанавливаем путь
  const segments: Segment[] = [];
  let cur = toNodeId;

  if (dist[toNodeId] === Infinity) {
    return { found: false, segments: [], totalDistanceKm: 0, blockedBy: blockedSegments, allCoords: [] };
  }

  while (prev[cur] !== null) {
    const p = prev[cur]!;
    segments.unshift(p.segment);
    cur = p.nodeId;
  }

  // Строим массив координат для карты
  const allCoords: [number, number][] = [];
  segments.forEach((seg, i) => {
    // Определяем направление участка
    const isForward = seg.from === (i === 0 ? fromNodeId : segments[i - 1].to) ||
                      seg.from === (i === 0 ? fromNodeId : segments[i - 1].from);

    if (i === 0) {
      allCoords.push(isForward ? seg.fromCoords : seg.toCoords);
    }
    allCoords.push(isForward ? seg.toCoords : seg.fromCoords);
  });

  return {
    found: true,
    segments,
    totalDistanceKm: dist[toNodeId],
    blockedBy: blockedSegments,
    allCoords,
  };
}

// Список участков заблокированных для данного транспорта
export function getBlockedSegments(vehicle: VehicleDimensions): BlockedSegment[] {
  return SEGMENTS.flatMap(seg => {
    const check = canPassSegment(seg, vehicle);
    return check.ok ? [] : [{ segment: seg, reason: check.reason }];
  });
}
