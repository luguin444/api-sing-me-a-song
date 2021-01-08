const supertest = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/utils/database");
const songsController = require('../src/controllers/songsController');

const agent = supertest(app);

beforeEach(async () => {
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

describe('GET /recommendations/random', () => {

    //testar se volta 200, uma musica do genero proposto

    it('should return 404 because there is no songs in database', async () => {

        const result = await agent.get(`/recommendations/random`);

        expect(result.status).toBe(404);
    })
    it('should return 200 and a recommendation', async () => {

        const genre = await sequelize.query("INSERT INTO genres (name) VALUES ('teste') RETURNING *;");

        const body = {
            "name": "Falamansa - Xote dos Milagres",
            "genresIds": [ genre[0][0].id ],
            "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        };

        const result = await agent.post('/recommendations').send(body);

        const getSongResult = await agent.get(`/recommendations/random`);

        expect(getSongResult.status).toBe(200);
        expect(getSongResult.body).toEqual(
                expect.objectContaining({
                    name: "Falamansa - Xote dos Milagres",
                    score: 0,
                    youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
                    genres: [
                        expect.objectContaining({
                            name: "teste"
                        })
                    ] 
                })
        );

    })
})

describe('GET /genres/:id/random', () => {


    it('should return 200 and a recommendation', async () => {

        const genre = await sequelize.query("INSERT INTO genres (name) VALUES ('teste') RETURNING *;");
        const genreId = genre[0][0].id

        const body = {
            "name": "Falamansa - Xote dos Milagres",
            "genresIds": [ genreId ],
            "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        };

        const result = await agent.post('/recommendations').send(body);

        const getSongResult = await agent.get(`/recommendations//genres/${genreId}/random`);

        expect(getSongResult.status).toBe(200);
        expect(getSongResult.body).toEqual(
                expect.objectContaining({
                    name: "Falamansa - Xote dos Milagres",
                    score: 0,
                    youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
                    genres: [
                        expect.objectContaining({
                            id: genreId,
                            name: "teste"
                        })
                    ] 
                })
        );

    })
})

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

describe('POST /recommendations/:id/upvote', () => {
    
    it('should return 200 and the score should be 1 ', async () => {

        const genre = await sequelize.query("INSERT INTO genres (name) VALUES ('Metal') RETURNING *;");
        const id = genre[0][0].id;

        const body = {
            "name": "Nirvana - Smell Like Tenn Spirit",
            "genresIds": [ id ],
            "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        };

        const songResult = await agent.post('/recommendations').send(body);

        const songId = songResult.body.id;

        await agent.post(`/recommendations/${songId}/upvote`);
        const result = await agent.post(`/recommendations/${songId}/upvote`);

        expect(result.status).toBe(200);
        expect(result.body).toEqual(
            expect.objectContaining({
                name: "Nirvana - Smell Like Tenn Spirit",
                youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
                score: 2
            })
        );
    })
})

describe('POST /recommendations/:id/downvote', () => {

    it('should return 400 because the songId does not exist ', async () => {

        const result = await agent.post(`/recommendations/-1/downvote`);

        expect(result.status).toBe(400);
    })
    
    it('should return 200 and the score should be -3 ', async () => {

        const genre = await sequelize.query("INSERT INTO genres (name) VALUES ('Reggae') RETURNING *;");
        const id = genre[0][0].id;

        const body = {
            "name": "SOJA - True Love",
            "genresIds": [ id ],
            "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        };

        const songResult = await agent.post('/recommendations').send(body);

        const songId = songResult.body.id;

        await agent.post(`/recommendations/${songId}/downvote`);
        await agent.post(`/recommendations/${songId}/downvote`);
        const result = await agent.post(`/recommendations/${songId}/downvote`);

        expect(result.status).toBe(200);
        expect(result.body).toEqual(
            expect.objectContaining({
                name: "SOJA - True Love",
                youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
                score: -3
            })
        );
    })

    it('should return 200 and {} because the song was destroyed ', async () => {

        const genre = await sequelize.query("INSERT INTO genres (name) VALUES ('Axé') RETURNING *;");
        const id = genre[0][0].id;

        const body = {
            "name": "SOJA - True Love",
            "genresIds": [ id ],
            "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        };

        const songResult = await agent.post('/recommendations').send(body);

        const songId = songResult.body.id;

        await agent.post(`/recommendations/${songId}/downvote`);
        await agent.post(`/recommendations/${songId}/downvote`);
        await agent.post(`/recommendations/${songId}/downvote`);
        await agent.post(`/recommendations/${songId}/downvote`);
        await agent.post(`/recommendations/${songId}/downvote`);
        const result = await agent.post(`/recommendations/${songId}/downvote`);

        expect(result.status).toBe(200);
        expect(result.body).toEqual(
            expect.objectContaining({})
        );
    })
})