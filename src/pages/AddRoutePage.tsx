import { useState } from 'react';
import Icon from '@/components/ui/icon';

const FORMAT_EXAMPLE = `// Формат JSON:
{
  "name": "Москва → Казань",
  "points": [
    { "lat": 55.7558, "lon": 37.6173, "name": "Москва" },
    { "lat": 56.0184, "lon": 37.4231, "name": "Химки" },
    { "lat": 55.7887, "lon": 49.1221, "name": "Казань" }
  ],
  "type": "highway",
  "description": "Федеральная трасса М-7"
}`;

const FORMAT_EXAMPLE_COORDS = `// Формат координат (по одной на строку):
55.7558, 37.6173
56.0184, 37.4231
55.7887, 49.1221`;

export default function AddRoutePage() {
  const [format, setFormat] = useState<'json' | 'coords' | 'gpx'>('json');
  const [routeName, setRouteName] = useState('');
  const [routeText, setRouteText] = useState('');
  const [routeType, setRouteType] = useState('highway');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!routeName || !routeText) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const placeholders: Record<string, string> = {
    json: FORMAT_EXAMPLE,
    coords: FORMAT_EXAMPLE_COORDS,
    gpx: '// Вставьте содержимое GPX-файла или перетащите файл в эту область',
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="font-oswald text-2xl font-bold text-foreground tracking-wide mb-1">Добавление маршрута</h2>
        <p className="text-muted-foreground font-golos text-sm">Введите данные маршрута в текстовом формате</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Route name */}
          <div className="card-dark rounded-xl p-5">
            <label className="block text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Название маршрута
            </label>
            <input
              type="text"
              value={routeName}
              onChange={e => setRouteName(e.target.value)}
              placeholder="Например: Москва → Екатеринбург"
              className="w-full px-4 py-3 bg-muted rounded-lg text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:border-primary transition-colors font-golos text-sm"
            />
          </div>

          {/* Format selector */}
          <div className="card-dark rounded-xl p-5">
            <label className="block text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Формат ввода
            </label>
            <div className="flex gap-2">
              {(['json', 'coords', 'gpx'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 py-2 rounded-lg text-sm font-golos font-medium transition-all ${
                    format === f
                      ? 'gradient-orange text-background'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f === 'json' ? 'JSON' : f === 'coords' ? 'Координаты' : 'GPX'}
                </button>
              ))}
            </div>
          </div>

          {/* Text input */}
          <div className="card-dark rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider">
                Данные маршрута
              </label>
              <button
                onClick={() => setRouteText(placeholders[format])}
                className="text-xs text-primary hover:text-yellow-400 transition-colors font-golos flex items-center gap-1"
              >
                <Icon name="Copy" size={12} />
                Вставить пример
              </button>
            </div>

            {format === 'gpx' ? (
              <div
                className="w-full h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 transition-colors group"
                onClick={() => {}}
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon name="Upload" size={22} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-golos font-medium text-foreground">Перетащите GPX-файл</p>
                  <p className="text-xs text-muted-foreground mt-1">или нажмите для выбора</p>
                </div>
                <span className="text-xs text-muted-foreground border border-border rounded-lg px-3 py-1">.gpx, .kml, .geojson</span>
              </div>
            ) : (
              <textarea
                value={routeText}
                onChange={e => setRouteText(e.target.value)}
                placeholder={placeholders[format]}
                className="w-full h-64 px-4 py-3 bg-muted rounded-lg text-foreground placeholder:text-muted-foreground/60 border border-border focus:outline-none focus:border-primary transition-colors font-mono text-xs resize-none leading-relaxed"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!routeName || !routeText}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-golos font-semibold text-sm transition-all ${
                routeName && routeText
                  ? 'gradient-orange text-background hover:opacity-90 glow-orange-sm'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {saved ? (
                <><Icon name="Check" size={16} /> Сохранено!</>
              ) : (
                <><Icon name="Save" size={16} /> Сохранить маршрут</>
              )}
            </button>
            <button className="px-4 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all font-golos text-sm">
              <Icon name="Eye" size={16} />
            </button>
          </div>
        </div>

        {/* Right - info */}
        <div className="space-y-4">
          {/* Route type */}
          <div className="card-dark rounded-xl p-5">
            <label className="block text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Тип маршрута
            </label>
            <div className="space-y-2">
              {[
                { id: 'highway', label: 'Трасса', icon: 'Truck', color: 'text-primary' },
                { id: 'city', label: 'Городской', icon: 'Building2', color: 'text-yellow-400' },
                { id: 'scenic', label: 'Живописный', icon: 'Trees', color: 'text-green-400' },
                { id: 'custom', label: 'Пользовательский', icon: 'Star', color: 'text-blue-400' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setRouteType(type.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                    routeType === type.id
                      ? 'bg-primary/10 border border-primary/30'
                      : 'hover:bg-muted border border-transparent'
                  }`}
                >
                  <Icon name={type.icon} size={16} className={routeType === type.id ? type.color : 'text-muted-foreground'} />
                  <span className={`text-sm font-golos ${routeType === type.id ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {type.label}
                  </span>
                  {routeType === type.id && (
                    <Icon name="Check" size={14} className="ml-auto text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card-dark rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Lightbulb" size={16} className="text-yellow-400" />
              <span className="text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider">Подсказки</span>
            </div>
            <ul className="space-y-2.5">
              {[
                'Координаты в формате десятичных градусов',
                'Широта от -90 до 90, долгота от -180 до 180',
                'Минимум 2 точки для построения маршрута',
                'GPX-файлы из любых GPS-приложений',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground font-golos">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Preview mini */}
          <div className="card-dark rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="MapPin" size={16} className="text-primary" />
              <span className="text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider">Предпросмотр</span>
            </div>
            <div className="h-24 bg-muted rounded-lg flex items-center justify-center">
              {routeText ? (
                <div className="text-center">
                  <Icon name="Route" size={24} className="text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground font-golos">Данные введены</p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground font-golos">Введите данные маршрута</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
