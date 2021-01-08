const supertest = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/utils/database");

const agent = supertest(app);

beforeEach(async () => {
    await sequelize.query("DELETE FROM genres;");
  });
  
  afterAll(async () => {
    await sequelize.query("DELETE FROM genres;");
    await sequelize.close();
  });


describe('POST /genres', () => {
    
    it('should return 422 because there is no name @params', async () => {
        const body = {};
        const result = await agent.post('/genres').send(body);

        expect(result.status).toBe(422);
    })
    it('should return 201 with a genre created', async () => {
        const body = {
            name: "Arrocha"
        };
        const result = await agent.post('/genres').send(body);

        expect(result.body).toEqual(
            expect.objectContaining({
               name: "Arrocha" 
            })
        );
        expect(result.status).toBe(201);
    })
    it('should return 409 because this genre already exists', async () => {
        const body = {
            name: "Arrocha"
        };

        await agent.post('/genres').send(body);
        const result = await agent.post('/genres').send(body);

        expect(result.status).toBe(409);
    })
})

describe('GET /genres', () => {
    
    it('should return 200 with an array containing all genres' , async () => {

        const body = {
            name: "Arrocha"
        };

        await agent.post('/genres').send(body);
        const result = await agent.get('/genres');

        expect(result.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: "Arrocha" 
                 })
            ])           
        );
        expect(result.status).toBe(200);
    })
})