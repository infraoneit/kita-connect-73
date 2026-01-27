import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Child, AttendanceStatus } from '@/types/kita';
import { cn } from '@/lib/utils';
import { Clock, ThermometerSun, Palmtree } from 'lucide-react';

interface ChildAttendanceListProps {
  children: Child[];
  attendance: AttendanceStatus[];
  onChildClick?: (child: Child) => void;
}

const statusConfig = {
  present: {
    dotClass: 'status-dot-present',
    label: 'Anwesend',
    bgClass: 'bg-success-light',
  },
  absent: {
    dotClass: 'status-dot-absent',
    label: 'Abwesend',
    bgClass: 'bg-destructive-light',
  },
  late: {
    dotClass: 'status-dot-late',
    label: 'Verspätet',
    bgClass: 'bg-warning-light',
  },
  not_arrived: {
    dotClass: 'bg-muted-foreground/50',
    label: 'Erwartet',
    bgClass: 'bg-secondary',
  },
};

const absenceIcons = {
  sick: ThermometerSun,
  vacation: Palmtree,
  late: Clock,
  early_pickup: Clock,
  other: Clock,
};

export function ChildAttendanceList({
  children,
  attendance,
  onChildClick,
}: ChildAttendanceListProps) {
  const getAttendance = (childId: string) =>
    attendance.find((a) => a.childId === childId);

  const sortedChildren = [...children].sort((a, b) => {
    const statusOrder = { absent: 0, not_arrived: 1, late: 2, present: 3 };
    const aStatus = getAttendance(a.id)?.status || 'not_arrived';
    const bStatus = getAttendance(b.id)?.status || 'not_arrived';
    return statusOrder[aStatus] - statusOrder[bStatus];
  });

  return (
    <div className="space-y-2">
      {sortedChildren.map((child) => {
        const childAttendance = getAttendance(child.id);
        const status = childAttendance?.status || 'not_arrived';
        const config = statusConfig[status];
        const AbsenceIcon = childAttendance?.absenceType
          ? absenceIcons[childAttendance.absenceType]
          : null;

        return (
          <Card
            key={child.id}
            className={cn(
              'p-3 card-interactive cursor-pointer flex items-center gap-3',
              config.bgClass
            )}
            onClick={() => onChildClick?.(child)}
          >
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {child.firstName[0]}
                  {child.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <span className={cn('status-dot absolute -bottom-0.5 -right-0.5 border-2 border-card', config.dotClass)} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">
                {child.firstName} {child.lastName}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{config.label}</span>
                {childAttendance?.checkInTime && (
                  <span className="text-xs text-muted-foreground">
                    seit {childAttendance.checkInTime}
                  </span>
                )}
              </div>
            </div>

            {AbsenceIcon && (
              <AbsenceIcon size={18} className="text-muted-foreground" />
            )}

            {child.allergies.length > 0 && (
              <span className="text-xs px-2 py-0.5 bg-warning/20 text-warning-foreground rounded-full">
                Allergie
              </span>
            )}
          </Card>
        );
      })}
    </div>
  );
}
