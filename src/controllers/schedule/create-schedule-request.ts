import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateScheduleRequestBody {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  accountId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  agentId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  endTime: string;
}
