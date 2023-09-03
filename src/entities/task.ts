export enum TaskType {
  Break = 'break',
  Work = 'work',
}

interface TaskDetails {
  id: string;
  accountId: number;
  scheduleId: string;
  startTime: Date;
  duration: number;
  type: TaskType;
}

export class Task {
  id: string;
  accountId: number;
  scheduleId: string;
  startTime: Date;
  duration: number;
  type: TaskType;

  constructor(details: TaskDetails) {
    this.id = details.id;
    this.accountId = details.accountId;
    this.scheduleId = details.scheduleId;
    this.startTime = details.startTime;
    this.duration = details.duration;
    this.type = details.type;
  }
}
