import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ScheduleResponse {
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
