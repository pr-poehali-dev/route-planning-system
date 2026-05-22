import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { NODES, SEGMENTS, type Segment } from '@/data/routeNetwork';
import { findPath, getBlockedSegments, type VehicleDimensions, type PathResult } from '@/lib/pathfinder';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ymaps: any;
  }
}

const CONDITION_LABELS: Record<string, string> = {
  spring_ban: 'Весенний запрет',
  seasonal: 'Сезонный',
  toll: 'Платный',
};

export default function PlannerPage() {
  const [fromNode, setFromNode] = useState('vladivostok');
  const [toNode, setToNode] = useState('moscow');
  const [vehicle, setVehicle] = useState<VehicleDimensions>({
    lengthM: 20,
    widthM: 2.5,
    heightM: 4.0,
    axleLoadT: 8,
  });
  const [result, setResult] = useState<PathResult | null>(null);
  const [showBlocked, setShowBlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<'result' | 'network'>('result');

  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ymapRef = useRef<any>(null);
  const [mapError, setMapError] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const handleFind = () => {
    const r = findPath(fromNode, toNode, vehicle);
    setResult(r);
    setActiveTab('result');
  };

  const blockedAll = getBlockedSegments(vehicle);

  // Рисуем карту при наличии результата
  useEffect(() => {
    if (!mapRef.current) return;

    const drawMap = () => {
      try {
        window.ymaps.ready(() => {
          if (ymapRef.current) ymapRef.current.destroy();

          const map = new window.ymaps.Map(mapRef.current, {
            center: [57, 90],
            zoom: 3,
            type: 'yandex#map',
          }, { suppressMapOpenBlock: true });

          map.controls.remove('searchControl');
          map.controls.remove('trafficControl');
          map.controls.remove('typeSelector');
          map.controls.remove('fullscreenControl');
          map.controls.remove('routePanelControl');

          // Рисуем всю сеть серым
          SEGMENTS.forEach(seg => {
            const isBlocked = blockedAll.some(b => b.segment.id === seg.id);
            const isOnPath = result?.segments.some(s => s.id === seg.id);
            const line = new window.ymaps.Polyline(
              [seg.fromCoords, seg.toCoords],
              { hintContent: seg.name },
              {
                strokeColor: isOnPath ? '#FF8C00' : isBlocked ? '#EF4444' : '#888',
                strokeWidth: isOnPath ? 6 : 2,
                strokeOpacity: isOnPath ? 1 : isBlocked ? 0.5 : 0.35,
                strokeStyle: isBlocked && !isOnPath ? 'dash' : 'solid',
              }
            );
            map.geoObjects.add(line);
          });

          // Узлы на карте
          NODES.forEach(node => {
            const isStart = node.id === fromNode;
            const isEnd = node.id === toNode;
            const isOnPath = result?.segments.some(
              s => s.from === node.id || s.to === node.id
            );
            if (!isOnPath && !isStart && !isEnd) return;

            const pm = new window.ymaps.Placemark(node.coords, {
              hintContent: node.name,
              balloonContent: node.name,
            }, {
              preset: isStart ? 'islands#greenDotIcon' : isEnd ? 'islands#redDotIcon' : 'islands#orangeDotIcon',
            });
            map.geoObjects.add(pm);
          });

          ymapRef.current = map;
          setMapReady(true);
        });
      } catch {
        setMapError(true);
      }
    };

    if (window.ymaps) {
      drawMap();
    } else {
      const iv = setInterval(() => {
        if (window.ymaps) { clearInterval(iv); drawMap(); }
      }, 300);
      setTimeout(() => { clearInterval(iv); setMapError(true); }, 5000);
      return () => clearInterval(iv);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, fromNode, toNode]);

  const totalConditions = result
    ? [...new Set(result.segments.flatMap(s => s.conditions))]
    : [];

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden">

      {/* ── Левая панель ── */}
      <div className="w-full lg:w-96 flex-shrink-0 border-r border-border bg-card flex flex-col overflow-y-auto">

        {/* Заголовок */}
        <div className="p-5 border-b border-border">
          <h2 className="font-oswald text-xl font-bold text-foreground tracking-wide">Планировщик маршрута</h2>
          <p className="text-xs text-muted-foreground font-golos mt-1">Поиск по существующей сети участков</p>
        </div>

        <div className="p-5 space-y-4 flex-1">

          {/* Откуда / Куда */}
          <div className="card-dark rounded-xl p-4 space-y-3">
            <p className="text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider">Маршрут</p>

            <div className="space-y-2">
              <div>
                <label className="text-xs text-muted-foreground font-golos mb-1 block">Откуда</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                  <select
                    value={fromNode}
                    onChange={e => setFromNode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 bg-muted rounded-lg text-sm text-foreground border border-border focus:outline-none focus:border-primary transition-colors font-golos appearance-none"
                  >
                    {NODES.map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => { const tmp = fromNode; setFromNode(toNode); setToNode(tmp); setResult(null); }}
                  className="w-7 h-7 rounded-lg bg-muted hover:bg-primary/20 transition-colors flex items-center justify-center text-muted-foreground hover:text-primary"
                >
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-golos mb-1 block">Куда</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
                  <select
                    value={toNode}
                    onChange={e => setToNode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 bg-muted rounded-lg text-sm text-foreground border border-border focus:outline-none focus:border-primary transition-colors font-golos appearance-none"
                  >
                    {NODES.map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Габариты */}
          <div className="card-dark rounded-xl p-4 space-y-3">
            <p className="text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider">Габариты транспорта</p>

            <div className="grid grid-cols-2 gap-3">
              {([
                { key: 'lengthM', label: 'Длина, м', icon: 'ArrowLeftRight', step: 0.5, min: 1 },
                { key: 'widthM', label: 'Ширина, м', icon: 'MoveHorizontal', step: 0.1, min: 1 },
                { key: 'heightM', label: 'Высота, м', icon: 'ArrowUpDown', step: 0.1, min: 1 },
                { key: 'axleLoadT', label: 'Ось, т', icon: 'Weight', step: 0.5, min: 1 },
              ] as const).map(field => (
                <div key={field.key}>
                  <label className="text-xs text-muted-foreground font-golos mb-1 flex items-center gap-1">
                    <Icon name={field.icon} size={11} />
                    {field.label}
                  </label>
                  <input
                    type="number"
                    step={field.step}
                    min={field.min}
                    value={vehicle[field.key]}
                    onChange={e => setVehicle(prev => ({ ...prev, [field.key]: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-muted rounded-lg text-sm text-foreground border border-border focus:outline-none focus:border-primary transition-colors font-mono"
                  />
                </div>
              ))}
            </div>

            {/* Быстрые пресеты */}
            <div>
              <p className="text-xs text-muted-foreground font-golos mb-2">Пресеты</p>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { label: 'Тягач 20т', v: { lengthM: 20, widthM: 2.5, heightM: 4.0, axleLoadT: 8 } },
                  { label: 'Фура 25т', v: { lengthM: 25, widthM: 3.5, heightM: 4.5, axleLoadT: 10 } },
                  { label: 'Негабарит', v: { lengthM: 35, widthM: 4.5, heightM: 5.0, axleLoadT: 12 } },
                ].map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => setVehicle(preset.v)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-muted hover:bg-primary/15 hover:text-primary transition-colors font-golos text-muted-foreground border border-border"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Кнопка */}
          <button
            onClick={handleFind}
            disabled={fromNode === toNode}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-golos font-bold text-sm transition-all ${
              fromNode !== toNode
                ? 'gradient-orange text-background hover:opacity-90 glow-orange-sm'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <Icon name="Route" size={18} />
            Построить маршрут
          </button>

          {/* Результат */}
          {result && (
            <div className="space-y-3 animate-fade-in">

              {/* Итог */}
              {result.found ? (
                <div className="rounded-xl overflow-hidden border border-green-500/30">
                  <div className="bg-green-500/10 px-4 py-3 flex items-center gap-2">
                    <Icon name="CheckCircle" size={16} className="text-green-400" />
                    <span className="font-golos font-semibold text-sm text-green-400">Маршрут найден</span>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <p className="font-oswald text-xl font-bold text-foreground">{result.totalDistanceKm.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground font-golos">км</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <p className="font-oswald text-xl font-bold text-foreground">{result.segments.length}</p>
                      <p className="text-xs text-muted-foreground font-golos">участков</p>
                    </div>
                  </div>
                  {totalConditions.length > 0 && (
                    <div className="px-4 pb-3 flex gap-2 flex-wrap">
                      {totalConditions.map(c => (
                        <span key={c} className="text-xs bg-yellow-500/15 text-yellow-400 px-2 py-0.5 rounded-md font-golos">
                          ⚠ {CONDITION_LABELS[c] || c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 flex items-start gap-2">
                  <Icon name="XCircle" size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-golos font-semibold text-sm text-red-400">Маршрут недоступен</p>
                    <p className="text-xs text-muted-foreground font-golos mt-1">
                      Для данного транспорта нет доступного пути. Попробуйте уменьшить габариты.
                    </p>
                  </div>
                </div>
              )}

              {/* Переключатель */}
              <div className="flex gap-1 p-1 bg-muted rounded-xl">
                {(['result', 'network'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-golos font-medium transition-all ${
                      activeTab === tab ? 'gradient-orange text-background' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab === 'result' ? 'Участки пути' : 'Заблокировано'}
                  </button>
                ))}
              </div>

              {/* Список участков пути */}
              {activeTab === 'result' && result.found && (
                <div className="space-y-1.5">
                  {result.segments.map((seg, i) => (
                    <div key={seg.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border/60">
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                          i === 0 ? 'bg-green-500/20 text-green-400' :
                          i === result.segments.length - 1 ? 'bg-red-500/20 text-red-400' :
                          'bg-primary/20 text-primary'
                        }`}>{i + 1}</div>
                        {i < result.segments.length - 1 && <div className="w-0.5 h-3 bg-border" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-golos font-semibold text-foreground">{seg.name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-muted-foreground">{seg.distanceKm} км</span>
                          {seg.conditions.map(c => (
                            <span key={c} className="text-xs bg-yellow-500/15 text-yellow-400 px-1.5 py-0.5 rounded font-golos">
                              {CONDITION_LABELS[c] || c}
                            </span>
                          ))}
                          {seg.maxAxleLoad > 0 && (
                            <span className="text-xs bg-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded font-golos">
                              до {seg.maxAxleLoad}т/ось
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Заблокированные участки */}
              {activeTab === 'network' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground font-golos">
                      Недоступно для вашего транспорта: <span className="text-red-400 font-semibold">{blockedAll.length}</span>
                    </p>
                    <button
                      onClick={() => setShowBlocked(!showBlocked)}
                      className="text-xs text-primary font-golos"
                    >
                      {showBlocked ? 'Скрыть' : 'Показать'}
                    </button>
                  </div>
                  {showBlocked && blockedAll.map(({ segment, reason }) => (
                    <div key={segment.id} className="flex items-start gap-2 p-2.5 rounded-lg bg-red-500/5 border border-red-500/20">
                      <Icon name="Ban" size={12} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-golos text-foreground">{segment.name}</p>
                        <p className="text-xs text-red-400 font-golos">{reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Карта ── */}
      <div className="flex-1 relative min-h-[400px] lg:min-h-0">
        {!mapReady && !mapError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card z-10">
            <div className="w-12 h-12 rounded-2xl gradient-orange flex items-center justify-center mb-4 animate-pulse-orange">
              <Icon name="Map" size={24} className="text-background" />
            </div>
            <p className="text-muted-foreground font-golos text-sm">Загрузка сети маршрутов...</p>
          </div>
        )}

        {mapError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card z-10 p-8 text-center">
            <Icon name="MapOff" size={40} className="text-muted-foreground mb-4" />
            <p className="font-oswald text-lg font-semibold text-foreground mb-2">Карта недоступна</p>
            <p className="text-muted-foreground font-golos text-sm max-w-xs">
              Для отображения нужен API-ключ Яндекс.Карт — добавьте его в Настройках
            </p>

            {/* Текстовое представление сети */}
            {result?.found && (
              <div className="mt-6 w-full max-w-md text-left">
                <p className="text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider mb-3">Маршрут по участкам:</p>
                <div className="space-y-1">
                  {result.segments.map((seg, i) => (
                    <div key={seg.id} className="flex items-center gap-2 text-xs font-golos">
                      <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold bg-primary/20 text-primary flex-shrink-0">{i + 1}</div>
                      <span className="text-foreground">{seg.name}</span>
                      <span className="text-muted-foreground ml-auto">{seg.distanceKm} км</span>
                    </div>
                  ))}
                  <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-xs font-golos">
                    <span className="text-muted-foreground">Итого:</span>
                    <span className="font-bold text-primary">{result.totalDistanceKm.toLocaleString()} км</span>
                  </div>
                </div>
              </div>
            )}

            {!result && (
              <div className="mt-6 w-full max-w-sm text-left">
                <p className="text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider mb-3">Узлы сети ({NODES.length} городов):</p>
                <div className="flex flex-wrap gap-1.5">
                  {NODES.map(n => (
                    <span key={n.id} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-lg font-golos">{n.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div ref={mapRef} className="w-full h-full ymap-container" />

        {/* Легенда */}
        {(mapReady || mapError) && (
          <div className="absolute bottom-4 left-4 card-dark rounded-xl p-3 shadow-xl text-xs font-golos space-y-1.5">
            <p className="font-semibold text-foreground mb-2">Легенда</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-1.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">Маршрут</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 rounded-full bg-muted-foreground" style={{ background: 'repeating-linear-gradient(90deg,#888 0 4px,transparent 4px 8px)' }} />
              <span className="text-muted-foreground">Заблокирован</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 rounded-full" style={{ background: '#555' }} />
              <span className="text-muted-foreground">Доступен</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
