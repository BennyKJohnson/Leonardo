import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Testing ScheduleController (e2e)', () => {
  let app: INestApplication;

  const createSchedule = async (details?: Record<string, any>) => {
    return request(app.getHttpServer())
      .post('/schedules')
      .send(
        details || {
          accountId: 1,
          agentId: 1,
          startTime: '2019-12-31T22:00:00.000Z',
          endTime: '2020-01-01T06:00:00.000Z',
        },
      )
      .expect(201);
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Given details for a schedule', () => {
    describe('When making a POST request to /schedules', () => {
      it('Then it should return the created schedule', async () => {
        const response = await request(app.getHttpServer())
          .post('/schedules')
          .send({
            accountId: 1,
            agentId: 1,
            startTime: '2019-12-31T22:00:00.000Z',
            endTime: '2020-01-01T06:00:00.000Z',
          })
          .expect(201);

        const getResponse = await request(app.getHttpServer())
          .get(`/schedules/${response.body.id}`)
          .expect(200);

        expect(getResponse.body).toEqual({
          id: response.body.id,
          accountId: 1,
          agentId: 1,
          startTime: '2019-12-31T22:00:00.000Z',
          endTime: '2020-01-01T06:00:00.000Z',
        });
      });
    });
  });

  describe('Given multiple schedules', () => {
    let schedule1Response: request.Response;
    let schedule2Response: request.Response;
    beforeAll(async () => {
      schedule1Response = await createSchedule({
        accountId: 1,
        agentId: 2,
        startTime: '2019-12-31T22:00:00.000Z',
        endTime: '2020-01-01T06:00:00.000Z',
      });
      schedule2Response = await createSchedule({
        accountId: 1,
        agentId: 1,
        startTime: '2019-12-31T22:00:00.000Z',
        endTime: '2020-01-01T06:00:00.000Z',
      });
    });

    describe('When making a GET request to /schedules', () => {
      it('Then it should return all schedules', async () => {
        const response = await request(app.getHttpServer())
          .get('/schedules')
          .expect(200);

        expect(response.body).toContainEqual({
          id: schedule1Response.body.id,
          accountId: 1,
          agentId: 2,
          startTime: '2019-12-31T22:00:00.000Z',
          endTime: '2020-01-01T06:00:00.000Z',
        });

        expect(response.body).toContainEqual({
          id: schedule2Response.body.id,
          accountId: 1,
          agentId: 1,
          startTime: '2019-12-31T22:00:00.000Z',
          endTime: '2020-01-01T06:00:00.000Z',
        });
      });
    });
  });

  describe('Given a schedule', () => {
    let createResponse: request.Response;
    beforeEach(async () => {
      createResponse = await createSchedule();
    });

    describe('When making a GET request to /schedules/:id', () => {
      it('Then it should return the schedule', async () => {
        const response = await request(app.getHttpServer())
          .get(`/schedules/${createResponse.body.id}`)
          .expect(200);

        expect(response.body).toEqual({
          id: createResponse.body.id,
          accountId: 1,
          agentId: 1,
          startTime: '2019-12-31T22:00:00.000Z',
          endTime: '2020-01-01T06:00:00.000Z',
        });
      });
    });

    describe('When making a PUT request to /schedules/:id', () => {
      it('Then it should return the updated schedule', async () => {
        const createResponse = await createSchedule();

        await request(app.getHttpServer())
          .put(`/schedules/${createResponse.body.id}`)
          .send({
            startTime: '2021-12-31T22:00:00.000Z',
            endTime: '2022-01-01T06:00:00.000Z',
          })
          .expect(200);
      });

      describe('When making a DELETE request to /schedules/:id', () => {
        it('Then it should return the deleted schedule', async () => {
          const createResponse = await createSchedule();
          await request(app.getHttpServer())
            .delete(`/schedules/${createResponse.body.id}`)
            .expect(200);

          await request(app.getHttpServer())
            .get(`/schedules/${createResponse.body.id}`)
            .expect(404);
        });
      });
    });
  });
});
