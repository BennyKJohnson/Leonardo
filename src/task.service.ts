import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TaskRepository } from './repositories/task.repository';
import { ScheduleRepository } from './repositories/schedule.repository';
import { Task, TaskType } from './entities/task';

interface TaskDetails {
  accountId: number;
  scheduleId: string;
  startTime: Date;
  duration: number;
  type: string;
}

export enum TaskServiceErrorCode {
  InvalidType = 'invalid_type',
  ScheduleNotFound = 'schedule_not_found',
  TaskNotFound = 'task_not_found',
}

export class TaskServiceError extends Error {
  code: TaskServiceErrorCode;

  constructor(errorCode: TaskServiceErrorCode) {
    super(`TaskServiceError: ${errorCode}`);
    this.name = 'TaskServiceError';
    this.code = errorCode;
  }
}

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  async getTasks(): Promise<Task[]> {
    return this.taskRepository.getAll();
  }

  async getTask(id: string) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new TaskServiceError(TaskServiceErrorCode.TaskNotFound);
    }
    return task;
  }

  async deleteTask(id: string) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new TaskServiceError(TaskServiceErrorCode.TaskNotFound);
    }
    await this.taskRepository.delete(id);
  }

  isValidType(type: string) {
    return type === TaskType.Break || type === TaskType.Work;
  }

  async createTask(taskDetails: TaskDetails): Promise<Task> {
    if (!this.isValidType(taskDetails.type)) {
      throw new TaskServiceError(TaskServiceErrorCode.InvalidType);
    }
    const task = new Task({
      id: uuidv4(),
      ...taskDetails,
      type: taskDetails.type as TaskType,
    });

    const schedule = await this.scheduleRepository.findById(
      taskDetails.scheduleId,
    );
    if (!schedule) {
      throw new TaskServiceError(TaskServiceErrorCode.ScheduleNotFound);
    }
    await this.taskRepository.create(task);
    return task;
  }

  async updateTask(id: string, taskDetails: Partial<TaskDetails>) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new TaskServiceError(TaskServiceErrorCode.TaskNotFound);
    }

    if (taskDetails.type) {
      if (!this.isValidType(taskDetails.type)) {
        throw new TaskServiceError(TaskServiceErrorCode.InvalidType);
      }
      task.type = taskDetails.type as TaskType;
    }

    if (taskDetails.startTime) {
      task.startTime = taskDetails.startTime;
    }

    if (taskDetails.duration) {
      task.duration = taskDetails.duration;
    }

    if (taskDetails.scheduleId) {
      const schedule = await this.scheduleRepository.findById(
        taskDetails.scheduleId,
      );
      if (!schedule) {
        throw new TaskServiceError(TaskServiceErrorCode.ScheduleNotFound);
      }

      task.scheduleId = taskDetails.scheduleId;
    }

    if (taskDetails.accountId) {
      task.accountId = taskDetails.accountId;
    }

    await this.taskRepository.update(task);
  }
}
