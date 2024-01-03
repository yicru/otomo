import { TaskStatus } from '@/db/enums'
import { SynthesisTask } from '@aws-sdk/client-polly'
import { match } from 'ts-pattern'

export const getTaskStatus = (
  synthesisTask: SynthesisTask,
): TaskStatus | undefined => {
  return match(synthesisTask.TaskStatus)
    .with('completed', () => TaskStatus.COMPLETED)
    .with('failed', () => TaskStatus.FAILED)
    .with('inProgress', () => TaskStatus.IN_PROGRESS)
    .with('scheduled', () => TaskStatus.SCHEDULED)
    .with(undefined, () => undefined)
    .exhaustive()
}
