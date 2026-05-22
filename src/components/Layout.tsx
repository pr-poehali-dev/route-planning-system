import { useState } from 'react';
import Icon from '@/components/ui/icon';

type Page = 'home' | 'routes' | 'add' | 'edit' | 'planner' | 'settings';

interface LayoutProps {
  children: (page: Page, setPage: (p: Page) => void) => React.ReactNode;
}

const navItems = [
  { id: 'home' as Page, label: 'Главная', icon: 'Home' },
  { id: 'planner' as Page, label: 'Планировщик', icon: 'GitBranch' },
  { id: 'routes' as Page, label: 'Маршруты', icon: 'Map' },
  { id: 'add' as Page, label: 'Добавить', icon: 'Plus' },
  { id: 'edit' as Page, label: 'Редактор', icon: 'Edit3' },
  { id: 'settings' as Page, label: 'Настройки', icon: 'Settings' },
];

export default function Layout({ children }: LayoutProps) {
  const [page, setPage] = useState<Page>('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 flex flex-col
        bg-card border-r border-border
        transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-orange flex items-center justify-center glow-orange-sm">
              <Icon name="Navigation" size={20} className="text-background" />
            </div>
            <div>
              <h1 className="font-oswald text-lg font-bold text-foreground tracking-wide">RouteMap</h1>
              <p className="text-xs text-muted-foreground">Визуализация маршрутов</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); setMobileOpen(false); }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                font-golos font-medium text-sm transition-all duration-200
                ${page === item.id
                  ? 'nav-item-active'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <Icon
                name={item.icon}
                size={18}
                className={page === item.id ? 'text-primary' : ''}
              />
              {item.label}
              {item.id === 'add' && (
                <span className="ml-auto w-2 h-2 rounded-full gradient-orange" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full gradient-orange flex items-center justify-center">
              <Icon name="User" size={14} className="text-background" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Пользователь</p>
              <p className="text-xs text-muted-foreground">Активен</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-green-500" />
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-card/50 backdrop-blur-sm">
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Icon name="Menu" size={22} />
          </button>

          <div className="flex-1">
            <h2 className="font-oswald text-base font-semibold text-foreground tracking-wide">
              {navItems.find(n => n.id === page)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Онлайн
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Icon name="Bell" size={16} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children(page, setPage)}
        </main>
      </div>
    </div>
  );
}