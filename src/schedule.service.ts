import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Schedule } from './entities/schedule';
import { ScheduleRepository } from './repositories/schedule.repository';

interface ScheduleDetails {
  accountId: number;
  agentId: number;
  startTime: Date;
  endTime: Date;
}

export enum ScheduleServiceErrorCode {
  ScheduleNotFound = 'schedule_not_found',
}

export class ScheduleServiceError extends Error {
  code: ScheduleServiceErrorCode;

  constructor(errorCode: ScheduleServiceErrorCode) {
    super(`ScheduleServiceError: ${errorCode}`);
    this.name = 'ScheduleServiceError';
    this.code = errorCode;
  }
}

@Injectable()
export class ScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async getSchedules(): Promise<Schedule[]> {
    const schedules = await this.scheduleRepository.getAll();
    return schedules;
  }

  async getSchedule(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) {
      throw new ScheduleServiceError(ScheduleServiceErrorCode.ScheduleNotFound);
    }
    return schedule;
  }

  async deleteSchedule(id: string) {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) {
      throw new ScheduleServiceError(ScheduleServiceErrorCode.ScheduleNotFound);
    }
    await this.scheduleRepository.delete(id);
  }

  async createSchedule(scheduleDetails: ScheduleDetails): Promise<Schedule> {
    const schedule = new Schedule({
      id: uuidv4(),
      ...scheduleDetails,
    });
    return this.scheduleRepository.create(schedule);
  }

  async updateSchedule(id: string, scheduleDetails: Partial<ScheduleDetails>) {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) {
      throw new ScheduleServiceError(ScheduleServiceErrorCode.ScheduleNotFound);
    }
    for (const key in scheduleDetails) {
      schedule[key] = scheduleDetails[key];
    }

    await this.scheduleRepository.update(schedule);
  }
}
