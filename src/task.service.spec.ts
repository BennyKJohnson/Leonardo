import { ScheduleRepository } from './repositories/schedule.repository';
import { TaskRepository } from './repositories/task.repository';
import { TaskService } from './task.service';
import { TaskType } from './entities/task';

describe('Testing TaskService', () => {
  let taskService: TaskService;
  let mockScheduleRepository: ScheduleRepository;
  let mockTaskRepository: TaskRepository;

  beforeAll(() => {
    mockTaskRepository = {
      create: jest.fn().mockResolvedValue(null),
      findById: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue(null),
      delete: jest.fn().mockResolvedValue(null),
    } as unknown as TaskRepository;
    mockScheduleRepository = {
      findById: jest.fn().mockResolvedValue({
        id: 'schedule-id',
        accountId: 1,
        agentId: 1,
        startTime: new Date(),
        endTime: new Date(),
      }),
    } as unknown as ScheduleRepository;
    taskService = new TaskService(mockTaskRepository, mockScheduleRepository);
  });

  describe('Given details for a new task', () => {
    const mockScheduleRepositoryFindById = () => {
      jest.spyOn(mockScheduleRepository, 'findById').mockResolvedValue({
        id: 'schedule-id',
        accountId: 1,
        agentId: 1,
        startTime: new Date(),
        endTime: new Date(),
      });
    };

    describe('When creating a task', () => {
      beforeAll(() => {
        mockScheduleRepositoryFindById();
      });

      it('should return the created task', async () => {
        const startTime = new Date();
        const createdTask = await taskService.createTask({
          accountId: 1,
          scheduleId: 'schedule-id',
          startTime,
          duration: 120,
          type: 'break',
        });
        expect(createdTask).toEqual(
          expect.objectContaining({
            accountId: 1,
            scheduleId: 'schedule-id',
            startTime,
            duration: 120,
            type: 'break',
          }),
        );
      });
    });

    describe('and the details for a new task with an invalid type', () => {
      beforeAll(() => {
        mockScheduleRepositoryFindById();
      });

      describe('When creating a task', () => {
        it('should throw a TaskServiceError', async () => {
          await expect(
            taskService.createTask({
              accountId: 1,
              scheduleId: 'schedule-id',
              startTime: new Date(),
              duration: 120,
              type: 'invalid',
            }),
          ).rejects.toThrow('TaskServiceError: invalid_type');
        });
      });
    });

    describe('and the details for a new task with a schedule id that does not exist', () => {
      beforeAll(() => {
        jest.spyOn(mockScheduleRepository, 'findById').mockResolvedValue(null);
      });

      describe('When creating a task', () => {
        it('should throw a TaskServiceError', async () => {
          await expect(
            taskService.createTask({
              accountId: 1,
              scheduleId: 'invalid-id',
              startTime: new Date(),
              duration: 120,
              type: 'break',
            }),
          ).rejects.toThrow('TaskServiceError: schedule_not_found');
        });
      });
    });
  });

  describe('Given an existing task', () => {
    const mockScheduleRepositoryFindById = () => {
      jest.spyOn(mockTaskRepository, 'findById').mockResolvedValue({
        id: 'task-id',
        accountId: 1,
        scheduleId: 'schedule-id',
        startTime: new Date(),
        duration: 120,
        type: TaskType.Break,
      });
    };

    describe('When updating a task', () => {
      beforeAll(() => {
        mockScheduleRepositoryFindById();
        jest.spyOn(mockTaskRepository, 'update').mockResolvedValue();
      });

      it('call update on repository', async () => {
        const startTime = new Date();
        await taskService.updateTask('task-id', {
          startTime,
        });

        expect(mockTaskRepository.update).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'task-id',
            accountId: 1,
            scheduleId: 'schedule-id',
            startTime,
            duration: 120,
            type: TaskType.Break,
          }),
        );
      });
    });

    describe('When attempting to update a task with an invalid id', () => {
      beforeAll(() => {
        jest.spyOn(mockTaskRepository, 'findById').mockResolvedValue(null);
        jest.spyOn(mockTaskRepository, 'update').mockResolvedValue();
      });

      it('should throw a TaskServiceError', async () => {
        await expect(
          taskService.updateTask('invalid-id', {
            startTime: new Date(),
          }),
        ).rejects.toThrow('TaskServiceError: task_not_found');
      });
    });

    describe('When attempting to update a task with an invalid schedule id', () => {
      it('should throw a TaskServiceError', async () => {
        mockScheduleRepositoryFindById();
        jest.spyOn(mockTaskRepository, 'update').mockResolvedValue();
        jest.spyOn(mockScheduleRepository, 'findById').mockResolvedValue(null);

        await expect(
          taskService.updateTask('task-id', {
            scheduleId: 'invalid-id',
          }),
        ).rejects.toThrow('TaskServiceError: schedule_not_found');
      });
    });

    describe('When getting a task', () => {
      it('should return the task', async () => {
        mockScheduleRepositoryFindById();
        const task = await taskService.getTask('task-id');
        expect(task).toEqual(
          expect.objectContaining({
            id: 'task-id',
            accountId: 1,
            scheduleId: 'schedule-id',
            startTime: expect.any(Date),
            duration: 120,
            type: TaskType.Break,
          }),
        );
      });
    });

    describe('When attempting to get a task with an invalid id', () => {
      it('should throw a TaskServiceError', async () => {
        jest.spyOn(mockTaskRepository, 'findById').mockResolvedValue(null);
        await expect(taskService.getTask('invalid-id')).rejects.toThrow(
          'TaskServiceError: task_not_found',
        );
      });
    });

    describe('When deleting a task', () => {
      it('should call delete on repository', async () => {
        mockScheduleRepositoryFindById();
        jest.spyOn(mockTaskRepository, 'delete').mockResolvedValue();
        await taskService.deleteTask('task-id');
        expect(mockTaskRepository.delete).toHaveBeenCalledWith('task-id');
      });
    });

    describe('When attempting to delete a task with an invalid id', () => {
      it('should throw a TaskServiceError', async () => {
        jest.spyOn(mockTaskRepository, 'findById').mockResolvedValue(null);
        await expect(taskService.deleteTask('invalid-id')).rejects.toThrow(
          'TaskServiceError: task_not_found',
        );
      });
    });
  });
});
