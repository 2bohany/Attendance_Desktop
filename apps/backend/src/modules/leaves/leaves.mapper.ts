import type { Leave, LeaveStatus } from '@attendance/shared';
import type { LeaveWithRelations } from './leaves.repository';

export function toLeave(leave: LeaveWithRelations): Leave {
  return {
    id: leave.id,
    startDate: leave.startDate.toISOString(),
    endDate: leave.endDate.toISOString(),
    reason: leave.reason,
    status: leave.status as LeaveStatus,
    createdAt: leave.createdAt.toISOString(),
    employee: leave.employee,
    leaveType: leave.leaveType,
  };
}
