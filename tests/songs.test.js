const supertest = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/utils/database");

const agent = supertest(app);

beforeAll(async () => {
    await sequelize.query("DELETE FROM genres_songs;");
    await sequelize.query("DELETE FROM songs;");
    await sequelize.query("DELETE FROM genres;");
  });
  
  afterAll(async () => {
    await sequelize.query("DELETE FROM genres_songs;");
    await sequelize.query("DELETE FROM songs;");
    await sequelize.query("DELETE FROM genres;");
    await sequelize.close();
  });


describe('POST /recommendations', () => {
    
    it('should return 422 because there is no ID in genresIds @params', async () => {
        const body = {
            "name": "Falamansa - Xote dos Milagres",
            "genresIds": [],
            "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        };
        const result = await agent.post('/recommendations').send(body);

        expect(result.status).toBe(422);
    })
    it('should return 422 because Id does not exists', async () => {
        const body = {
            "name": "Falamansa - Xote dos Milagres",
            "genresIds": [-2],
            "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        };
        const result = await agent.post('/recommendations').send(body);

        expect(result.status).toBe(422);
    })
    it('should return 422 because is not a Youtube link', async () => {

        const genre = await sequelize.query("INSERT INTO genres (name) VALUES ('Arrocha') RETURNING *;");

        const body = {
            "name": "Falamansa - Xote dos Milagres",
            "genresIds": [genre[0][0].id],
            "youtubeLink": "https://www.w3schools.com/sql/sql_insert.asp"
        };
        const result = await agent.post('/recommendations').send(body);

        expect(result.status).toBe(422);
    })
    it('should return 201 all params are correct', async () => {

        const firstGenre = await sequelize.query("INSERT INTO genres (name) VALUES ('Rock') RETURNING *;");
        const secondGenre = await sequelize.query("INSERT INTO genres  (name) VALUES ('Pagode')  RETURNING *;");

        const body = {
            "name": "Falamansa - Xote dos Milagres",
            "genresIds": [ secondGenre[0][0].id, firstGenre[0][0].id ],
            "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        };
        const result = await agent.post('/recommendations').send(body);

        expect(result.status).toBe(201);
        expect(result.body).toEqual(
            expect.objectContaining({
                name: "Falamansa - Xote dos Milagres",
                score: 0,
                youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
            })
        );
    })
})