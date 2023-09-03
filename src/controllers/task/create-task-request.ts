import { ApiProperty } from '@nestjs/swagger';
import { TaskType } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskRequestBody {
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
