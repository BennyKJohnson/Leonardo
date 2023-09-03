import { Schedule } from '@prisma/client';
import { ScheduleRepository } from './repositories/schedule.repository';
import { ScheduleService } from './schedule.service';

describe('Testing ScheduleService', () => {
  describe('Given details for a new schedule', () => {
    let mockScheduleRepository: ScheduleRepository;
    let createdSchedule: Schedule;
    describe('When creating a schedule', () => {
      const scheduleDetails = {
        accountId: 1,
        agentId: 1,
        startTime: new Date(),
        endTime: new Date(),
      };

      beforeAll(async () => {
        mockScheduleRepository = {
          create: jest.fn().mockReturnValue({
            ...scheduleDetails,
            id: 'new-schedule-id',
          }),
        } as unknown as ScheduleRepository;
        const scheduleService = new ScheduleService(mockScheduleRepository);
        createdSchedule = await scheduleService.createSchedule({
          accountId: 1,
          agentId: 1,
          startTime: new Date(),
          endTime: new Date(),
        });
      });

      it('should return the created schedule', async () => {
        expect(createdSchedule).toEqual({
          ...scheduleDetails,
          id: 'new-schedule-id',
        });
      });
    });
  });

  describe('Given an invalid schedule id', () => {
    describe('When getting a schedule', () => {
      it('should throw a ScheduleServiceError', async () => {
        const mockScheduleRepository = {
          findById: jest.fn().mockReturnValue(null),
        } as unknown as ScheduleRepository;
        const scheduleService = new ScheduleService(mockScheduleRepository);
        await expect(scheduleService.getSchedule('invalid-id')).rejects.toThrow(
          'ScheduleServiceError: schedule_not_found',
        );
      });
    });
  });
});
