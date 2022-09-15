import supertest from 'supertest';
import app from '../src/app';
import { prisma } from '../src/database';
import itemFactory from "./factories/itemFactory";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items;`;
});

describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const item = itemFactory();
    const result = await supertest(app).post("/items").send(item);
    const status = result.status;
    
    expect(status).toEqual(201);
  });

  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
    const item = itemFactory();
    await supertest(app).post("/items").send(item);
    const result = await supertest(app).post("/items").send(item);
    const status = result.status;

    expect(status).toEqual(409);
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async () => {
    const result = await supertest(app).get("/items").send();
    const status = result.status;

    expect(status).toEqual(200);
    expect(result.body).toBeInstanceOf(Array);
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
    const item = itemFactory();
    await supertest(app).post("/items").send(item);
    
    const registeredItem = await prisma.items.findFirst({where: {title: item.title}});
    const result = await supertest(app).get(`/items/${registeredItem.id}`).send();
    
    expect(result.status).toEqual(200);
    expect(result.body).toStrictEqual(registeredItem);
  });
  
  it('Deve retornar status 404 caso não exista um item com esse id', async () => {
    const result = await supertest(app).get("/items/1").send();

    expect(result.status).toEqual(404);
  });
});
