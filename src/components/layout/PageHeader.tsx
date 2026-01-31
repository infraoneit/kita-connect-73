import { ChevronLeft, Settings, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showSettings?: boolean;
  showNotifications?: boolean;
  showLogout?: boolean;
  notificationCount?: number;
  rightAction?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  showBack = false,
  showSettings = false,
  showNotifications = false,
  showLogout = true,
  notificationCount = 0,
  rightAction,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => navigate(-1)}
              className="-ml-2"
            >
              <ChevronLeft size={24} />
            </Button>
          )}
          <div>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {showNotifications && (
            <Button variant="ghost" size="iconSm" className="relative">
              <Bell size={22} />
              {notificationCount > 0 && (
                <span className="badge-unread">{notificationCount}</span>
              )}
            </Button>
          )}
          {showSettings && (
            <Button variant="ghost" size="iconSm">
              <Settings size={22} />
            </Button>
          )}
          {showLogout && (
            <Button variant="ghost" size="iconSm" onClick={handleLogout} title="Abmelden">
              <LogOut size={20} />
            </Button>
          )}
          {rightAction}
        </div>
      </div>
    </header>
  );
}
