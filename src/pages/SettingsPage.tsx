import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const THEMES = [
  {
    id: 'fire',
    label: 'Огонь',
    desc: 'Оранжево-жёлтый',
    from: '#FF8C00',
    to: '#FFD700',
  },
  {
    id: 'ocean',
    label: 'Океан',
    desc: 'Голубой',
    from: '#0EA5E9',
    to: '#06B6D4',
  },
  {
    id: 'forest',
    label: 'Лес',
    desc: 'Зелёный',
    from: '#22C55E',
    to: '#84CC16',
  },
  {
    id: 'sunset',
    label: 'Закат',
    desc: 'Розово-красный',
    from: '#F43F8F',
    to: '#F97316',
  },
  {
    id: 'arctic',
    label: 'Полярная',
    desc: 'Синий',
    from: '#3B82F6',
    to: '#22D3EE',
  },
];

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [mapType, setMapType] = useState('roadmap');
  const [routeColor, setRouteColor] = useState('#FF8C00');
  const [lineWidth, setLineWidth] = useState(5);
  const [language, setLanguage] = useState('ru');
  const [autoCenter, setAutoCenter] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || 'fire';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${value ? 'gradient-orange' : 'bg-muted'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${value ? 'left-6' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in space-y-5">
      <div className="mb-6">
        <h2 className="font-oswald text-2xl font-bold text-foreground tracking-wide mb-1">Настройки</h2>
        <p className="text-muted-foreground font-golos text-sm">Параметры интерфейса и карты</p>
      </div>

      {/* Theme picker */}
      <div className="card-dark rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg gradient-orange flex items-center justify-center">
            <Icon name="Palette" size={16} className="text-background" />
          </div>
          <div>
            <h3 className="font-oswald text-base font-semibold text-foreground tracking-wide">Цветовая тема</h3>
            <p className="text-xs text-muted-foreground font-golos">Изменяется мгновенно</p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                theme === t.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-border/60 bg-muted/40'
              }`}
            >
              <div
                className="w-9 h-9 rounded-lg flex-shrink-0 shadow-md"
                style={{ background: `linear-gradient(135deg, ${t.from} 0%, ${t.to} 100%)` }}
              />
              <span className={`text-xs font-golos font-medium leading-tight text-center ${theme === t.id ? 'text-primary' : 'text-muted-foreground'}`}>
                {t.label}
              </span>
              {theme === t.id && (
                <Icon name="Check" size={12} className="text-primary -mt-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* API Key */}
      <div className="card-dark rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg gradient-orange flex items-center justify-center">
            <Icon name="Key" size={16} className="text-background" />
          </div>
          <div>
            <h3 className="font-oswald text-base font-semibold text-foreground tracking-wide">Яндекс.Карты API</h3>
            <p className="text-xs text-muted-foreground font-golos">Ключ для доступа к картам</p>
          </div>
        </div>
        <div className="relative">
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="Вставьте ваш API-ключ Яндекс.Карт"
            className="w-full px-4 py-3 bg-muted rounded-lg text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:border-primary transition-colors font-mono text-sm pr-10"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="Eye" size={16} />
          </button>
        </div>
        <a
          href="https://developer.tech.yandex.ru/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:text-yellow-400 transition-colors font-golos"
        >
          Получить ключ в Яндекс.Разработчик <Icon name="ExternalLink" size={11} />
        </a>
      </div>

      {/* Map settings */}
      <div className="card-dark rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
            <Icon name="Map" size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="font-oswald text-base font-semibold text-foreground tracking-wide">Карта</h3>
            <p className="text-xs text-muted-foreground font-golos">Тип и вид карты</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { id: 'roadmap', label: 'Схема', icon: 'Map' },
            { id: 'satellite', label: 'Спутник', icon: 'Globe' },
            { id: 'hybrid', label: 'Гибрид', icon: 'Layers' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setMapType(type.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                mapType === type.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-muted hover:border-border/80 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={type.icon} size={20} />
              <span className="text-xs font-golos font-medium">{type.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-golos font-medium text-foreground">Автоцентрирование</p>
              <p className="text-xs text-muted-foreground">При выборе маршрута</p>
            </div>
            <Toggle value={autoCenter} onChange={setAutoCenter} />
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-golos font-medium text-foreground">Показывать расстояние</p>
              <p className="text-xs text-muted-foreground">На метках маршрута</p>
            </div>
            <Toggle value={showDistance} onChange={setShowDistance} />
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-golos font-medium text-foreground">Маркеры точек</p>
              <p className="text-xs text-muted-foreground">Иконки на карте</p>
            </div>
            <Toggle value={showMarkers} onChange={setShowMarkers} />
          </div>
        </div>
      </div>

      {/* Route appearance */}
      <div className="card-dark rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
            <Icon name="Palette" size={16} className="text-yellow-400" />
          </div>
          <div>
            <h3 className="font-oswald text-base font-semibold text-foreground tracking-wide">Внешний вид маршрутов</h3>
            <p className="text-xs text-muted-foreground font-golos">Цвета и толщина линий</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Цвет маршрута по умолчанию
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={routeColor}
                onChange={e => setRouteColor(e.target.value)}
                className="w-12 h-10 rounded-lg border border-border bg-muted cursor-pointer"
              />
              <div className="flex gap-2">
                {['#FF8C00', '#FFD700', '#4CAF50', '#2196F3', '#E91E63', '#9C27B0'].map(color => (
                  <button
                    key={color}
                    onClick={() => setRouteColor(color)}
                    className={`w-8 h-8 rounded-lg transition-all hover:scale-110 ${routeColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-background scale-110' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider">
                Толщина линии
              </label>
              <span className="text-xs font-oswald font-bold text-primary">{lineWidth}px</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={12}
                value={lineWidth}
                onChange={e => setLineWidth(Number(e.target.value))}
                className="flex-1 accent-orange-500"
              />
              <div
                className="h-4 w-20 rounded-full flex-shrink-0"
                style={{ height: `${lineWidth}px`, backgroundColor: routeColor, minHeight: '2px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interface */}
      <div className="card-dark rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
            <Icon name="Monitor" size={16} className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-oswald text-base font-semibold text-foreground tracking-wide">Интерфейс</h3>
            <p className="text-xs text-muted-foreground font-golos">Язык и отображение</p>
          </div>
        </div>

        <div>
          <label className="text-xs font-golos font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
            Язык
          </label>
          <div className="flex gap-2">
            {[
              { id: 'ru', label: '🇷🇺 Русский' },
              { id: 'en', label: '🇬🇧 English' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-golos font-medium transition-all ${
                  language === lang.id ? 'gradient-orange text-background' : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 py-3.5 gradient-orange rounded-xl font-golos font-semibold text-background hover:opacity-90 transition-all glow-orange-sm"
      >
        {saved ? <><Icon name="CheckCircle" size={18} />Настройки сохранены!</> : <><Icon name="Save" size={18} />Сохранить настройки</>}
      </button>
    </div>
  );
}