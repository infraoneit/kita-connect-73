import { Home, MessageCircle, Calendar, BookOpen, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Übersicht', path: '/' },
  { icon: MessageCircle, label: 'Chat', path: '/chat', badge: 2 },
  { icon: Calendar, label: 'Kalender', path: '/calendar' },
  { icon: BookOpen, label: 'Tagebuch', path: '/diary' },
  { icon: Users, label: 'Kinder', path: '/children' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around h-full max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'bottom-nav-item relative flex-1',
                isActive && 'active'
              )}
            >
              <div className="relative">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge && item.badge > 0 && (
                  <span className="badge-unread">{item.badge}</span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
