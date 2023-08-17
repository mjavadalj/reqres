import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphdmFkQGdtYWlsLmNvbSIsImlkIjoiNjRkY2M4YTQyNGM2NGM2YmE4OTUzYzhhIiwiaWF0IjoxNjkyMjQ1OTg3LCJleHAiOjE2OTIyNDk1ODd9.HkoRKVyFFtRbdrMDowg5dgy1_runoUnVfhZ5CVJ2Isk';
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('get all users', () => {
    return request(app.getHttpServer())
      .get('/user/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
