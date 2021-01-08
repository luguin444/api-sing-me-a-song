const Genre = require('../models/Genre');
const Song = require('../models/Song');
const GenreNotExists = require('../errors/GenreNotExists');
const songDoesNotExists = require('../errors/songDoesNotExists');
const GenreSong = require('../models/GenreSong');
const { Sequelize } = require('sequelize');
const { Op } = require("sequelize");

async function postSong(songData) {

    const {name, genresIds, youtubeLink} = songData;

    const { count, rows } = await Genre.findAndCountAll({ where: { id: genresIds } });
    if (count !== genresIds.length ) {
        throw new GenreNotExists();
    }
    const song = await Song.create({name, youtubeLink});

    const genreVectorToInsert = genresIds.map(id => {
        return {genreId: id, songId: song.id}
    })

    await GenreSong.bulkCreate( genreVectorToInsert );

    return song;
}

async function upVote(id) {

    const song = await Song.findOne({where: {id}});
    if (song === null ) {
        throw new songDoesNotExists();
    }

    const updatedSong = await song.increment('score', {by: 1});
    return updatedSong;
}

async function downVote(id) {

    const song = await Song.findOne({where: {id}});
    if (song === null ) {
        throw new songDoesNotExists();
    }

    const updatedSong = await song.decrement('score', {by: 1});

    if (updatedSong.score < -5) {
        await GenreSong.destroy( { where: {songId: updatedSong.id} } )
        await updatedSong.destroy();
        return {};
    }

    return updatedSong;
}

async function getRecommendation() {

    const allSongs = await Song.findAll();
    if(allSongs.length === 0) {
        throw new songDoesNotExists();
    }
    let song = null;
    const anyOfThemHasScoreGreaterThanTen = allSongs.find(s => s.score > 10);
    const allSongsHasScoreGreaterThanTen = ( allSongs.length === allSongs.filter(s => s.score > 10).length );
    
    if (anyOfThemHasScoreGreaterThanTen === undefined || allSongsHasScoreGreaterThanTen) {
        song = await Song.findAll({
            order: Sequelize.literal('random()'),
            limit: 1,
            include: { 
                model: Genre,
                through: {attributes: []}
             }
        });
        return song;
    }

    const randomNumber = Math.random();

    if (randomNumber >= 0.3) {
        song = await Song.findAll({
            order: Sequelize.literal('random()'),
            limit: 1,
            where: {
                score: { [Op.gt]: 10 }
            },
            include: { 
                model: Genre,
                through: {attributes: []}
             }
        });
    } else {
        song = await Song.findAll({
            order: Sequelize.literal('random()'),
            limit: 1,
            where: {
                score: { [Op.between]: [-5,10] }
            },
            include: { 
                model: Genre,
                through: {attributes: []}
             }
        });
    }
    return song;
}

async function getRecommendationByGenre(id) {

    const allSongsFromGenre = await Song.findAll({
        include: { 
            model: Genre,
            attributes: ['id', 'name'],
            where: { id },
            through: {
                attributes: [],
            }
         }
    });

    if(allSongsFromGenre.length === 0) {
        throw new songDoesNotExists();
    }
    let song = null;

    const anyOfThemHasScoreGreaterThanTen = allSongsFromGenre.find(s => s.score > 10);
    const allSongsHasScoreGreaterThanTen = ( allSongsFromGenre.length === allSongsFromGenre.filter(s => s.score > 10).length );
    
    if (anyOfThemHasScoreGreaterThanTen === undefined || allSongsHasScoreGreaterThanTen ) {
        song = allSongsFromGenre[Math.floor(Math.random() * allSongsFromGenre.length)];
        return song;
    }
    
    const randomNumber = Math.random();

    if (randomNumber >= 0.3) {
        song = await Song.findAll({
            order: Sequelize.literal('random()'),
            limit: 1,
            where: {
                score: { [Op.gt]: 10 }
            },
            include: { 
                model: Genre,
                attributes: ['id', 'name'],
                where: { id },
                through: {
                    attributes: [],
                }
             }
        });
    } else {
        song = await Song.findAll({
            order: Sequelize.literal('random()'),
            limit: 1,
            where: {
                score: { [Op.between]: [-5,10] }
            },
            include: { 
                model: Genre,
                attributes: ['id', 'name'],
                where: { id },
                through: {
                    attributes: [],
                }
             }
        });
    }
    return song;
}

module.exports = {
    postSong,
    upVote,
    downVote,
    getRecommendation,
    getRecommendationByGenre
}