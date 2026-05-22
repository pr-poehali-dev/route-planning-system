import Icon from '@/components/ui/icon';

type Page = 'home' | 'routes' | 'add' | 'edit' | 'planner' | 'settings';

interface HomePageProps {
  setPage: (p: Page) => void;
}

const recentRoutes = [
  { name: 'Москва → Санкт-Петербург', distance: '714 км', points: 8, date: '20 мая', type: 'highway' },
  { name: 'Центр → Аэропорт Шереметьево', distance: '38 км', points: 4, date: '19 мая', type: 'city' },
  { name: 'Горный маршрут Сочи', distance: '92 км', points: 12, date: '17 мая', type: 'scenic' },
];

const typeColors: Record<string, string> = {
  highway: 'bg-primary/20 text-primary',
  city: 'bg-yellow-500/20 text-yellow-400',
  scenic: 'bg-green-500/20 text-green-400',
};

const typeLabels: Record<string, string> = {
  highway: 'Трасса',
  city: 'Город',
  scenic: 'Живописный',
};

export default function HomePage({ setPage }: HomePageProps) {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl gradient-orange p-8 glow-orange">
        <div className="relative z-10">
          <p className="text-background/70 font-golos text-sm font-medium mb-2 uppercase tracking-widest">
            Добро пожаловать
          </p>
          <h2 className="font-oswald text-4xl font-bold text-background mb-3 leading-tight">
            Ваши маршруты<br />на карте России
          </h2>
          <p className="text-background/75 font-golos text-base max-w-md mb-6">
            Создавайте, визуализируйте и редактируйте маршруты с интерактивной картой Яндекс
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setPage('add')}
              className="flex items-center gap-2 px-5 py-2.5 bg-background text-primary rounded-xl font-golos font-semibold text-sm hover:bg-background/90 transition-all hover:scale-105"
            >
              <Icon name="Plus" size={16} />
              Новый маршрут
            </button>
            <button
              onClick={() => setPage('routes')}
              className="flex items-center gap-2 px-5 py-2.5 bg-background/20 text-background rounded-xl font-golos font-semibold text-sm hover:bg-background/30 transition-all border border-background/30"
            >
              <Icon name="Map" size={16} />
              Открыть карту
            </button>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <div className="absolute top-4 right-4 w-40 h-40 rounded-full border-4 border-background" />
          <div className="absolute top-12 right-12 w-24 h-24 rounded-full border-2 border-background" />
          <div className="absolute top-20 right-20 w-10 h-10 rounded-full bg-background" />
        </div>
        <div className="absolute bottom-4 right-6 opacity-15">
          <Icon name="Navigation" size={120} className="text-background" />
        </div>
      </div>

      {/* Recent routes */}
      <div className="card-dark rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-oswald text-lg font-semibold text-foreground tracking-wide">Последние маршруты</h3>
          <button
            onClick={() => setPage('routes')}
            className="text-primary text-sm font-golos font-medium hover:text-yellow-400 transition-colors flex items-center gap-1"
          >
            Все маршруты <Icon name="ArrowRight" size={14} />
          </button>
        </div>
        <div className="divide-y divide-border">
          {recentRoutes.map((route, i) => (
            <div
              key={route.name}
              className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors group cursor-pointer"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-10 h-10 rounded-lg gradient-orange flex items-center justify-center flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <Icon name="Route" size={18} className="text-background" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-golos font-semibold text-foreground text-sm truncate">{route.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{route.distance} · {route.points} точек · {route.date}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-lg font-golos font-medium ${typeColors[route.type]}`}>
                {typeLabels[route.type]}
              </span>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: 'GitBranch', title: 'Планировщик', desc: 'Построить по участкам', page: 'planner' as Page },
          { icon: 'FileText', title: 'Добавить участок', desc: 'Новый маршрут в сеть', page: 'add' as Page },
          { icon: 'Edit3', title: 'Редактировать', desc: 'Изменить существующий', page: 'edit' as Page },
        ].map((action) => (
          <button
            key={action.title}
            onClick={() => setPage(action.page)}
            className="card-dark rounded-xl p-5 text-left hover:border-primary/40 transition-all group hover:glow-orange-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3 group-hover:gradient-orange transition-all">
              <Icon name={action.icon} size={18} className="text-primary group-hover:text-background" />
            </div>
            <p className="font-golos font-semibold text-foreground text-sm">{action.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}