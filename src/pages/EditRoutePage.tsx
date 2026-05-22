import { useState } from 'react';
import Icon from '@/components/ui/icon';

const ROUTES = [
  {
    id: 1,
    name: 'Москва → Санкт-Петербург',
    type: 'highway',
    distance: '714 км',
    points: [
      { id: 'p1', lat: '55.7558', lon: '37.6173', name: 'Москва (старт)' },
      { id: 'p2', lat: '56.1366', lon: '37.4081', name: 'Химки' },
      { id: 'p3', lat: '57.6261', lon: '39.8845', name: 'Ярославль' },
      { id: 'p4', lat: '58.5213', lon: '31.2754', name: 'Новгород' },
      { id: 'p5', lat: '59.9311', lon: '30.3609', name: 'Санкт-Петербург (финиш)' },
    ],
  },
  {
    id: 2,
    name: 'Центр → Шереметьево',
    type: 'city',
    distance: '38 км',
    points: [
      { id: 'p1', lat: '55.7558', lon: '37.6173', name: 'Красная площадь' },
      { id: 'p2', lat: '55.8283', lon: '37.5018', name: 'Химки центр' },
      { id: 'p3', lat: '55.9726', lon: '37.4146', name: 'Аэропорт Шереметьево' },
    ],
  },
];

interface Point {
  id: string;
  lat: string;
  lon: string;
  name: string;
}

export default function EditRoutePage() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [editedPoints, setEditedPoints] = useState<Point[]>(ROUTES[0].points);
  const [routeName, setRouteName] = useState(ROUTES[0].name);
  const [saved, setSaved] = useState(false);
  const [activePoint, setActivePoint] = useState<string | null>(null);

  const selectRoute = (id: number) => {
    const route = ROUTES.find(r => r.id === id);
    if (route) {
      setSelectedId(id);
      setEditedPoints([...route.points]);
      setRouteName(route.name);
      setActivePoint(null);
    }
  };

  const updatePoint = (pointId: string, field: keyof Point, value: string) => {
    setEditedPoints(prev => prev.map(p => p.id === pointId ? { ...p, [field]: value } : p));
  };

  const addPoint = () => {
    const newPoint: Point = {
      id: `p${Date.now()}`,
      lat: '',
      lon: '',
      name: `Точка ${editedPoints.length + 1}`,
    };
    setEditedPoints(prev => [...prev, newPoint]);
    setActivePoint(newPoint.id);
  };

  const removePoint = (pointId: string) => {
    setEditedPoints(prev => prev.filter(p => p.id !== pointId));
    if (activePoint === pointId) setActivePoint(null);
  };

  const movePoint = (index: number, direction: 'up' | 'down') => {
    const newPoints = [...editedPoints];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newPoints.length) return;
    [newPoints[index], newPoints[target]] = [newPoints[target], newPoints[index]];
    setEditedPoints(newPoints);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden">
      {/* Route selector */}
      <div className="w-full lg:w-72 flex-shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-oswald text-base font-semibold text-foreground tracking-wide">Редактор</h3>
          <p className="text-xs text-muted-foreground font-golos mt-1">Выберите маршрут для редактирования</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {ROUTES.map((route) => (
            <button
              key={route.id}
              onClick={() => selectRoute(route.id)}
              className={`w-full p-4 text-left transition-all ${
                selectedId === route.id ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-muted/50'
              }`}
            >
              <p className="font-golos font-semibold text-sm text-foreground">{route.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{route.points.length} точек · {route.distance}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-5 max-w-3xl">
          {/* Route name */}
          <div className="card-dark rounded-xl p-5">
            <label className="block text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Название маршрута
            </label>
            <input
              type="text"
              value={routeName}
              onChange={e => setRouteName(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-lg text-foreground border border-border focus:outline-none focus:border-primary transition-colors font-golos text-sm"
            />
          </div>

          {/* Points editor */}
          <div className="card-dark rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h4 className="font-oswald text-base font-semibold text-foreground tracking-wide">Точки маршрута</h4>
                <p className="text-xs text-muted-foreground font-golos mt-0.5">{editedPoints.length} точек</p>
              </div>
              <button
                onClick={addPoint}
                className="flex items-center gap-2 px-3 py-2 gradient-orange rounded-lg text-xs font-golos font-semibold text-background hover:opacity-90 transition-opacity"
              >
                <Icon name="Plus" size={14} />
                Добавить
              </button>
            </div>

            <div className="divide-y divide-border">
              {editedPoints.map((point, index) => (
                <div key={point.id} className="group">
                  <div
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors ${
                      activePoint === point.id ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => setActivePoint(activePoint === point.id ? null : point.id)}
                  >
                    {/* Index */}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      index === 0 ? 'bg-green-500/20 text-green-400' :
                      index === editedPoints.length - 1 ? 'bg-red-500/20 text-red-400' :
                      'bg-primary/20 text-primary'
                    }`}>
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-golos font-medium text-foreground truncate">{point.name}</p>
                      <p className="text-xs text-muted-foreground font-golos">{point.lat}, {point.lon}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); movePoint(index, 'up'); }}
                        disabled={index === 0}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted disabled:opacity-30 transition-colors"
                      >
                        <Icon name="ChevronUp" size={12} className="text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); movePoint(index, 'down'); }}
                        disabled={index === editedPoints.length - 1}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted disabled:opacity-30 transition-colors"
                      >
                        <Icon name="ChevronDown" size={12} className="text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); removePoint(point.id); }}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-destructive/20 transition-colors"
                      >
                        <Icon name="X" size={12} className="text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>

                    <Icon
                      name={activePoint === point.id ? 'ChevronUp' : 'ChevronDown'}
                      size={14}
                      className="text-muted-foreground flex-shrink-0"
                    />
                  </div>

                  {/* Expanded edit */}
                  {activePoint === point.id && (
                    <div className="px-4 pb-4 bg-muted/20 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                        <div>
                          <label className="block text-xs text-muted-foreground font-golos mb-1.5">Название точки</label>
                          <input
                            type="text"
                            value={point.name}
                            onChange={e => updatePoint(point.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 bg-card rounded-lg text-sm text-foreground border border-border focus:outline-none focus:border-primary transition-colors font-golos"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground font-golos mb-1.5">Широта</label>
                          <input
                            type="text"
                            value={point.lat}
                            onChange={e => updatePoint(point.id, 'lat', e.target.value)}
                            placeholder="55.7558"
                            className="w-full px-3 py-2 bg-card rounded-lg text-sm text-foreground border border-border focus:outline-none focus:border-primary transition-colors font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground font-golos mb-1.5">Долгота</label>
                          <input
                            type="text"
                            value={point.lon}
                            onChange={e => updatePoint(point.id, 'lon', e.target.value)}
                            placeholder="37.6173"
                            className="w-full px-3 py-2 bg-card rounded-lg text-sm text-foreground border border-border focus:outline-none focus:border-primary transition-colors font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 py-3 gradient-orange rounded-xl font-golos font-semibold text-sm text-background hover:opacity-90 transition-all glow-orange-sm"
            >
              {saved ? <><Icon name="CheckCircle" size={16} />Сохранено!</> : <><Icon name="Save" size={16} />Сохранить изменения</>}
            </button>
            <button
              onClick={() => selectRoute(selectedId)}
              className="px-5 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all font-golos text-sm flex items-center gap-2"
            >
              <Icon name="RotateCcw" size={16} />
              Сбросить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
