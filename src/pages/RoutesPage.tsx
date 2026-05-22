import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

const ROUTES_DATA = [
  {
    id: 1,
    name: 'Москва → Санкт-Петербург',
    distance: '714 км',
    duration: '~8 ч',
    points: [
      [55.7558, 37.6173],
      [56.1366, 37.4081],
      [57.6261, 39.8845],
      [58.5213, 31.2754],
      [59.9311, 30.3609],
    ] as [number, number][],
    color: '#FF8C00',
    type: 'Трасса',
  },
  {
    id: 2,
    name: 'Центр → Шереметьево',
    distance: '38 км',
    duration: '~50 мин',
    points: [
      [55.7558, 37.6173],
      [55.8283, 37.5018],
      [55.9726, 37.4146],
    ] as [number, number][],
    color: '#FFD700',
    type: 'Город',
  },
  {
    id: 3,
    name: 'Горный маршрут Сочи',
    distance: '92 км',
    duration: '~2.5 ч',
    points: [
      [43.5992, 39.7257],
      [43.6741, 40.1055],
      [43.5903, 40.8203],
    ] as [number, number][],
    color: '#4CAF50',
    type: 'Живописный',
  },
];

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ymaps: any;
  }
}

export default function RoutesPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ymapRef = useRef<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<number>(1);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.ymaps) return;
      try {
        window.ymaps.ready(() => {
          if (ymapRef.current) {
            ymapRef.current.destroy();
          }
          const route = ROUTES_DATA.find(r => r.id === selectedRoute);
          const center = route ? route.points[0] : [55.7558, 37.6173];

          const map = new window.ymaps.Map(mapRef.current, {
            center,
            zoom: route?.id === 1 ? 5 : route?.id === 3 ? 9 : 10,
            type: 'yandex#map',
          }, {
            suppressMapOpenBlock: true,
          });

          map.controls.remove('searchControl');
          map.controls.remove('trafficControl');
          map.controls.remove('typeSelector');
          map.controls.remove('fullscreenControl');
          map.controls.remove('routePanelControl');

          ROUTES_DATA.forEach((r) => {
            const polyline = new window.ymaps.Polyline(
              r.points,
              { hintContent: r.name },
              {
                strokeColor: r.id === selectedRoute ? r.color : '#444',
                strokeWidth: r.id === selectedRoute ? 5 : 2,
                strokeOpacity: r.id === selectedRoute ? 0.9 : 0.4,
              }
            );
            map.geoObjects.add(polyline);

            if (r.id === selectedRoute) {
              r.points.forEach((coord, i) => {
                const placemark = new window.ymaps.Placemark(coord, {
                  hintContent: i === 0 ? 'Старт' : i === r.points.length - 1 ? 'Финиш' : `Точка ${i}`,
                }, {
                  preset: i === 0 ? 'islands#greenDotIcon' : i === r.points.length - 1 ? 'islands#redDotIcon' : 'islands#orangeDotIcon',
                });
                map.geoObjects.add(placemark);
              });
            }
          });

          ymapRef.current = map;
          setMapReady(true);
        });
      } catch {
        setMapError(true);
      }
    };

    if (window.ymaps) {
      initMap();
    } else {
      const interval = setInterval(() => {
        if (window.ymaps) {
          clearInterval(interval);
          initMap();
        }
      }, 300);
      setTimeout(() => { clearInterval(interval); setMapError(true); }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedRoute]);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-0">
      {/* Route list */}
      <div className="w-full lg:w-80 flex-shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-oswald text-base font-semibold text-foreground tracking-wide mb-3">Маршруты</h3>
          <div className="relative">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск маршрута..."
              className="w-full pl-9 pr-3 py-2 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:border-primary transition-colors font-golos"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {ROUTES_DATA.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route.id)}
              className={`w-full p-4 text-left transition-all ${
                selectedRoute === route.id
                  ? 'bg-primary/10 border-l-2 border-primary'
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: route.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-golos font-semibold text-sm text-foreground truncate">{route.name}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icon name="Route" size={11} /> {route.distance}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icon name="Clock" size={11} /> {route.duration}
                    </span>
                  </div>
                  <span
                    className="inline-block mt-2 text-xs px-2 py-0.5 rounded-md font-golos"
                    style={{
                      backgroundColor: route.color + '20',
                      color: route.color,
                    }}
                  >
                    {route.type}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 gradient-orange rounded-xl text-sm font-golos font-semibold text-background hover:opacity-90 transition-opacity">
            <Icon name="Plus" size={16} />
            Добавить маршрут
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-[400px] lg:min-h-0">
        {!mapReady && !mapError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card z-10">
            <div className="w-12 h-12 rounded-2xl gradient-orange flex items-center justify-center mb-4 animate-pulse-orange">
              <Icon name="Map" size={24} className="text-background" />
            </div>
            <p className="text-muted-foreground font-golos text-sm">Загрузка карты...</p>
          </div>
        )}

        {mapError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card z-10 p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Icon name="MapOff" size={28} className="text-muted-foreground" />
            </div>
            <p className="font-oswald text-lg font-semibold text-foreground mb-2">Карта недоступна</p>
            <p className="text-muted-foreground font-golos text-sm max-w-xs">
              Для работы карты необходим API-ключ Яндекс.Карт. Добавьте его в настройках.
            </p>
            <div className="mt-6 p-4 bg-muted rounded-xl text-left w-full max-w-sm">
              <p className="text-xs text-muted-foreground font-golos mb-2 font-medium">Визуализация маршрута:</p>
              {ROUTES_DATA.find(r => r.id === selectedRoute)?.points.map((point, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    i === 0 ? 'bg-green-500' :
                    i === (ROUTES_DATA.find(r => r.id === selectedRoute)?.points.length || 0) - 1
                    ? 'bg-red-500' : 'bg-primary'
                  }`} />
                  <span className="text-xs text-muted-foreground font-golos">
                    {i === 0 ? 'Старт: ' : i === (ROUTES_DATA.find(r => r.id === selectedRoute)?.points.length || 0) - 1 ? 'Финиш: ' : `Точка ${i}: `}
                    {point[0].toFixed(4)}, {point[1].toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div ref={mapRef} className="w-full h-full ymap-container" />

        {/* Map controls overlay */}
        {mapReady && (
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button className="w-9 h-9 bg-card border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors shadow-lg">
              <Icon name="Plus" size={16} className="text-foreground" />
            </button>
            <button className="w-9 h-9 bg-card border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors shadow-lg">
              <Icon name="Minus" size={16} className="text-foreground" />
            </button>
            <div className="w-9 h-px bg-border" />
            <button className="w-9 h-9 bg-card border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors shadow-lg">
              <Icon name="Locate" size={16} className="text-primary" />
            </button>
          </div>
        )}

        {/* Route info badge */}
        {(() => {
          const route = ROUTES_DATA.find(r => r.id === selectedRoute);
          return route ? (
            <div className="absolute bottom-4 left-4 right-4 lg:right-auto lg:max-w-xs">
              <div className="card-dark rounded-xl p-4 shadow-xl backdrop-blur-sm border border-border/80">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-8 rounded-full" style={{ backgroundColor: route.color }} />
                  <div>
                    <p className="font-golos font-semibold text-foreground text-sm">{route.name}</p>
                    <p className="text-xs text-muted-foreground">{route.points.length} точек маршрута</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <p className="text-xs text-muted-foreground">Дистанция</p>
                    <p className="font-oswald font-bold text-foreground text-sm">{route.distance}</p>
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <p className="text-xs text-muted-foreground">Время</p>
                    <p className="font-oswald font-bold text-foreground text-sm">{route.duration}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null;
        })()}
      </div>
    </div>
  );
}