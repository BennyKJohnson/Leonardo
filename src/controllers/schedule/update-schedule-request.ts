import { PartialType } from '@nestjs/swagger';
import { CreateScheduleRequestBody } from './create-schedule-request';

export class UpdateScheduleRequest extends PartialType(
  CreateScheduleRequestBody,
) {}
