import { Injectable } from '@nestjs/common';
import { Schedule } from '../entities/schedule';
import { PrismaService } from './prisma.service';

@Injectable()
export class ScheduleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const records = await this.prismaService.schedule.findMany();
    return records.map((record) => this.mapToEntity(record));
  }

  async findById(id: string) {
    const record = await this.prismaService.schedule.findUnique({
      where: {
        id: id,
      },
    });
    if (!record) {
      return;
    }

    return this.mapToEntity(record);
  }

  async delete(id: string) {
    await this.prismaService.schedule.delete({
      where: {
        id: id,
      },
    });
  }

  async create(schedule: Schedule) {
    const scheduleRecord = await this.prismaService.schedule.create({
      data: this.mapToRecord(schedule),
    });
    return this.mapToEntity(scheduleRecord);
  }

  async update(schedule: Schedule) {
    await this.prismaService.schedule.update({
      where: {
        id: schedule.id,
      },
      data: this.mapToRecord(schedule),
    });
  }

  mapToRecord(schedule: Schedule) {
    return {
      id: schedule.id,
      accountId: schedule.accountId,
      agentId: schedule.agentId,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    };
  }

  mapToEntity(record: Record<string, any>) {
    return new Schedule({
      id: record.id,
      accountId: record.accountId,
      agentId: record.agentId,
      startTime: record.startTime,
      endTime: record.endTime,
    });
  }
}
