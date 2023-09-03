interface ScheduleDetails {
  id: string;
  accountId: number;
  agentId: number;
  startTime: Date;
  endTime: Date;
}

export class Schedule {
  id: string;
  accountId: number;
  agentId: number;
  startTime: Date;
  endTime: Date;

  constructor(details: ScheduleDetails) {
    this.id = details.id;
    this.accountId = details.accountId;
    this.agentId = details.agentId;
    this.startTime = details.startTime;
    this.endTime = details.endTime;
  }
}
