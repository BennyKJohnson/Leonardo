import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Testing TaskController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const createTask = async () => {
    const scheduleResponse = await request(app.getHttpServer())
      .post('/schedules')
      .send({
        accountId: 1,
        agentId: 1,
        startTime: '2019-12-31T22:00:00.000Z',
        endTime: '2020-01-01T06:00:00.000Z',
      });
    return request(app.getHttpServer())
      .post('/tasks')
      .send({
        accountId: 1,
        scheduleId: scheduleResponse.body.id,
        startTime: '2019-12-31T22:00:00.000Z',
        duration: 120,
        type: 'break',
      })
      .expect(201);
  };

  describe('Given multiple tasks', () => {
    describe('When making a GET request to /tasks', () => {
      it('Then it should return all tasks', async () => {
        const task1 = await createTask();
        const task2 = await createTask();
        const response = await request(app.getHttpServer())
          .get('/tasks')
          .expect(200);

        expect(response.body).toContainEqual({
          id: task1.body.id,
          accountId: 1,
          scheduleId: task1.body.scheduleId,
          startTime: '2019-12-31T22:00:00.000Z',
          duration: 120,
          type: 'break',
        });
        expect(response.body).toContainEqual({
          id: task2.body.id,
          accountId: 1,
          scheduleId: task2.body.scheduleId,
          startTime: '2019-12-31T22:00:00.000Z',
          duration: 120,
          type: 'break',
        });
      });
    });
  });

  describe('POST /tasks', () => {
    describe('Given a valid create task request', () => {
      describe('When making a POST request to /tasks', () => {
        it('should return a 201', async () => {
          const response = await createTask();

          const getResponse = await request(app.getHttpServer())
            .get(`/tasks/${response.body.id}`)
            .expect(200);

          expect(getResponse.body).toEqual({
            id: response.body.id,
            accountId: 1,
            scheduleId: response.body.scheduleId,
            startTime: '2019-12-31T22:00:00.000Z',
            duration: 120,
            type: 'break',
          });
        });
      });
    });

    describe('Given a create task request with an invalid type', () => {
      describe('When making a POST request to /tasks', () => {
        it('should return a 400', async () => {
          await request(app.getHttpServer())
            .post('/tasks')
            .send({
              accountId: 1,
              scheduleId: '1',
              startTime: '2019-12-31T22:00:00.000Z',
              duration: 120,
              type: 'invalid',
            })
            .expect(400);
        });
      });
    });

    describe('Given a create task request with a schedule id that does not exist', () => {
      describe('When making a POST request to /tasks', () => {
        it('should return a bad request response', async () => {
          await request(app.getHttpServer())
            .post('/tasks')
            .send({
              accountId: 1,
              scheduleId: 'invalid-id',
              startTime: '2019-12-31T22:00:00.000Z',
              duration: 120,
              type: 'break',
            })
            .expect(400);
        });
      });
    });
  });

  describe('Given a task', () => {
    let taskResponse: request.Response;
    beforeEach(async () => {
      taskResponse = await createTask();
    });

    describe('When making a GET request to /tasks/:id', () => {
      it('should return the task', async () => {
        const response = await request(app.getHttpServer())
          .get(`/tasks/${taskResponse.body.id}`)
          .expect(200);

        expect(response.body).toEqual({
          id: taskResponse.body.id,
          accountId: 1,
          scheduleId: taskResponse.body.scheduleId,
          startTime: '2019-12-31T22:00:00.000Z',
          duration: 120,
          type: 'break',
        });
      });
    });

    describe('When making a PUT request to /tasks/:id', () => {
      it('should update the task', async () => {
        await request(app.getHttpServer())
          .put(`/tasks/${taskResponse.body.id}`)
          .send({
            startTime: '2021-12-31T22:00:00.000Z',
            duration: 130,
            type: 'work',
          })
          .expect(200);

        const getResponse = await request(app.getHttpServer())
          .get(`/tasks/${taskResponse.body.id}`)
          .expect(200);

        expect(getResponse.body).toEqual({
          id: taskResponse.body.id,
          accountId: 1,
          scheduleId: taskResponse.body.scheduleId,
          startTime: '2021-12-31T22:00:00.000Z',
          duration: 130,
          type: 'work',
        });
      });
    });

    describe('When making a DELETE request to /tasks/:id', () => {
      it('should delete the task', async () => {
        const createResponse = await createTask();
        await request(app.getHttpServer())
          .delete(`/tasks/${createResponse.body.id}`)
          .expect(200);

        await request(app.getHttpServer())
          .get(`/tasks/${createResponse.body.id}`)
          .expect(404);
      });
    });
  });
});
