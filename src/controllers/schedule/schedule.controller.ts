import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ScheduleService,
  ScheduleServiceError,
  ScheduleServiceErrorCode,
} from '../../schedule.service';
import { Schedule } from '../../entities/schedule';
import { CreateScheduleRequestBody } from './create-schedule-request';
import { UpdateScheduleRequest } from './update-schedule-request';
import { ApiOkResponse } from '@nestjs/swagger';
import { ScheduleResponse } from './schedule-response';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @ApiOkResponse({
    description: 'Returns all schedules',
    type: ScheduleResponse,
    isArray: true,
  })
  async findAll(): Promise<Record<string, any>[]> {
    const schedules = await this.scheduleService.getSchedules();
    return schedules.map((schedule) => this.presentSchedule(schedule));
  }

  @Post()
  @ApiOkResponse({
    description: 'Returns created schedule',
    type: ScheduleResponse,
    isArray: false,
  })
  async create(@Body() createScheduleRequestBody: CreateScheduleRequestBody) {
    const scheduleUpdate = {
      accountId: createScheduleRequestBody.accountId,
      agentId: createScheduleRequestBody.agentId,
      startTime: new Date(createScheduleRequestBody.startTime),
      endTime: new Date(createScheduleRequestBody.endTime),
    };
    const schedule = await this.scheduleService.createSchedule(scheduleUpdate);

    return this.presentSchedule(schedule);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Returns schedule for id',
    type: ScheduleResponse,
    isArray: false,
  })
  async findOne(@Param('id') id: string) {
    try {
      const schedule = await this.scheduleService.getSchedule(id);
      return this.presentSchedule(schedule);
    } catch (error) {
      if (error instanceof ScheduleServiceError) {
        this.handleScheduleServiceError(error);
      }
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.scheduleService.deleteSchedule(id);
    } catch (error) {
      if (error instanceof ScheduleServiceError) {
        this.handleScheduleServiceError(error);
      }
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateScheduleRequestBody: UpdateScheduleRequest,
  ) {
    const scheduleUpdate = {
      accountId: updateScheduleRequestBody.accountId,
      agentId: updateScheduleRequestBody.agentId,
      startTime: updateScheduleRequestBody.startTime
        ? new Date(updateScheduleRequestBody.startTime)
        : undefined,
      endTime: updateScheduleRequestBody.endTime
        ? new Date(updateScheduleRequestBody.endTime)
        : undefined,
    };
    try {
      await this.scheduleService.updateSchedule(id, scheduleUpdate);
    } catch (error) {
      if (error instanceof ScheduleServiceError) {
        this.handleScheduleServiceError(error);
      }
      throw error;
    }
  }

  handleScheduleServiceError(error: ScheduleServiceError) {
    switch (error.code) {
      case ScheduleServiceErrorCode.ScheduleNotFound:
        throw new NotFoundException(error);
      default:
        throw error;
    }
  }

  presentSchedule(schedule: Schedule): ScheduleResponse {
    return {
      id: schedule.id,
      accountId: schedule.accountId,
      agentId: schedule.agentId,
      startTime: schedule.startTime.toISOString(),
      endTime: schedule.endTime.toISOString(),
    };
  }
}
