import { Module } from '@nestjs/common';
import { ScheduleController } from './controllers/schedule/schedule.controller';
import { ScheduleService } from './schedule.service';
import { TaskController } from './controllers/task/task.controller';
import { TaskService } from './task.service';
import { TaskRepository } from './repositories/task.repository';
import { ScheduleRepository } from './repositories/schedule.repository';
import { PrismaService } from './repositories/prisma.service';

@Module({
  imports: [],
  controllers: [ScheduleController, TaskController],
  providers: [
    PrismaService,
    ScheduleRepository,
    TaskRepository,
    ScheduleService,
    TaskService,
  ],
})
export class AppModule {}
