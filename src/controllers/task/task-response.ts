import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TaskType } from '../../entities/task';

export class TaskResponse {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  accountId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  scheduleId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({ enum: TaskType, enumName: 'TaskType' })
  @IsNotEmpty()
  @IsString()
  type: TaskType;
}
