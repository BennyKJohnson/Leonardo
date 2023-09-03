import { Injectable } from '@nestjs/common';
import { Task } from '../entities/task';
import { PrismaService } from './prisma.service';

@Injectable()
export class TaskRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const records = await this.prismaService.task.findMany();
    return records.map((record) => this.mapToEntity(record));
  }

  async findById(id: string) {
    const record = await this.prismaService.task.findUnique({
      where: {
        id,
      },
    });
    if (!record) {
      return;
    }
    return this.mapToEntity(record);
  }

  async delete(id: string) {
    await this.prismaService.task.delete({
      where: {
        id,
      },
    });
  }

  async create(task: Task) {
    await this.prismaService.task.create({
      data: this.mapToRecord(task),
    });
  }

  async update(task: Task) {
    await this.prismaService.task.update({
      where: {
        id: task.id,
      },
      data: this.mapToRecord(task),
    });
  }

  mapToEntity(record: Record<string, any>): Task {
    return new Task({
      id: record.id,
      accountId: record.accountId,
      scheduleId: record.scheduleId,
      startTime: record.startTime,
      duration: record.duration,
      type: record.type,
    });
  }

  mapToRecord(task: Task) {
    return {
      id: task.id,
      accountId: task.accountId,
      schedule: {
        connect: {
          id: task.scheduleId,
        },
      },
      startTime: task.startTime,
      duration: task.duration,
      type: task.type,
    };
  }
}
