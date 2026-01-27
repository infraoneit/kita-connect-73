import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AttendanceStatus } from '@/types/kita';

interface AttendanceCardProps {
  attendance: AttendanceStatus[];
  groupName: string;
}

export function AttendanceCard({ attendance, groupName }: AttendanceCardProps) {
  const present = attendance.filter((a) => a.status === 'present').length;
  const absent = attendance.filter((a) => a.status === 'absent').length;
  const late = attendance.filter((a) => a.status === 'late').length;
  const notArrived = attendance.filter((a) => a.status === 'not_arrived').length;
  const total = attendance.length;

  return (
    <Card className="p-4 card-interactive">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Anwesenheit</h3>
          <p className="text-sm text-muted-foreground">{groupName}</p>
        </div>
        <div className="flex items-center gap-2 text-primary">
          <Users size={20} />
          <span className="text-xl font-bold">{present}/{total}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center p-2 rounded-lg bg-success-light">
          <UserCheck size={18} className="text-success mb-1" />
          <span className="text-lg font-semibold text-success">{present}</span>
          <span className="text-xs text-muted-foreground">Anwesend</span>
        </div>
        
        <div className="flex flex-col items-center p-2 rounded-lg bg-destructive-light">
          <UserX size={18} className="text-destructive mb-1" />
          <span className="text-lg font-semibold text-destructive">{absent}</span>
          <span className="text-xs text-muted-foreground">Fehlen</span>
        </div>
        
        <div className="flex flex-col items-center p-2 rounded-lg bg-warning-light">
          <Clock size={18} className="text-warning-foreground mb-1" />
          <span className="text-lg font-semibold text-warning-foreground">{late}</span>
          <span className="text-xs text-muted-foreground">Verspätet</span>
        </div>
        
        <div className="flex flex-col items-center p-2 rounded-lg bg-secondary">
          <Users size={18} className="text-muted-foreground mb-1" />
          <span className="text-lg font-semibold text-muted-foreground">{notArrived}</span>
          <span className="text-xs text-muted-foreground">Erwartet</span>
        </div>
      </div>
    </Card>
  );
}
