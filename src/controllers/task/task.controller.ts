import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Task } from '../../entities/task';
import {
  TaskService,
  TaskServiceError,
  TaskServiceErrorCode,
} from '../../task.service';
import { CreateTaskRequestBody } from './create-task-request';
import { TaskResponse } from './task-response';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOkResponse({
    description: 'Gets all tasks',
    type: TaskResponse,
    isArray: true,
  })
  async findAll(): Promise<Record<string, any>[]> {
    const tasks = await this.taskService.getTasks();
    return tasks.map((task) => this.presentTask(task));
  }

  @Post()
  @ApiOkResponse({
    description: 'Returns created task',
    type: TaskResponse,
    isArray: false,
  })
  async create(@Body() createTaskRequestBody: CreateTaskRequestBody) {
    const details = {
      accountId: createTaskRequestBody.accountId,
      scheduleId: createTaskRequestBody.scheduleId,
      startTime: new Date(createTaskRequestBody.startTime),
      duration: createTaskRequestBody.duration,
      type: createTaskRequestBody.type,
    };

    try {
      const task = await this.taskService.createTask(details);
      return this.presentTask(task);
    } catch (error) {
      if (error instanceof TaskServiceError) {
        this.handleTaskError(error);
      }
      throw error;
    }
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Returns task for id',
    type: TaskResponse,
    isArray: false,
  })
  async findOne(@Param('id') id: string) {
    try {
      const task = await this.taskService.getTask(id);
      return this.presentTask(task);
    } catch (error) {
      if (error instanceof TaskServiceError) {
        this.handleTaskError(error);
      }
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.taskService.deleteTask(id);
    } catch (error) {
      if (error instanceof TaskServiceError) {
        this.handleTaskError(error);
      }
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskRequestBody: CreateTaskRequestBody,
  ) {
    const updateTaskDetails = {
      accountId: updateTaskRequestBody.accountId,
      scheduleId: updateTaskRequestBody.scheduleId,
      startTime: updateTaskRequestBody.startTime
        ? new Date(updateTaskRequestBody.startTime)
        : undefined,
      duration: updateTaskRequestBody.duration,
      type: updateTaskRequestBody.type,
    };
    try {
      await this.taskService.updateTask(id, updateTaskDetails);
    } catch (error) {
      if (error instanceof TaskServiceError) {
        this.handleTaskError(error);
      }
    }
  }

  handleTaskError(error: TaskServiceError) {
    switch (error.code) {
      case TaskServiceErrorCode.TaskNotFound:
        throw new NotFoundException(error);
      case TaskServiceErrorCode.InvalidType:
        throw new BadRequestException(error);
      case TaskServiceErrorCode.ScheduleNotFound:
        throw new BadRequestException(error);
      default:
        throw error;
    }
  }

  presentTask(task: Task): TaskResponse {
    return {
      id: task.id,
      accountId: task.accountId,
      scheduleId: task.scheduleId,
      startTime: task.startTime.toISOString(),
      duration: task.duration,
      type: task.type,
    };
  }
}
