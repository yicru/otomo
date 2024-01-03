export const TaskStatus = {
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  IN_PROGRESS: 'IN_PROGRESS',
  SCHEDULED: 'SCHEDULED',
} as const
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]
