import { PartialType } from '@nestjs/swagger';
import { CreateTaskRequestBody } from './create-task-request';

export class UpdateTaskRequest extends PartialType(CreateTaskRequestBody) {}
