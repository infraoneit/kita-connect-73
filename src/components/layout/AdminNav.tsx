import { Home, Users, Calendar, FileText, UserCog, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Verwaltung', path: '/verwaltung' },
  { icon: FileText, label: 'Verträge', path: '/vertraege' },
  { icon: Calendar, label: 'Belegung', path: '/belegung' },
  { icon: UserCog, label: 'Personal', path: '/personal' },
];

export function AdminNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around h-full max-w-2xl mx-auto">
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
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
