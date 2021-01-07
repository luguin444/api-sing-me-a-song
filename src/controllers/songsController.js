const Genre = require('../models/Genre');
const Song = require('../models/Song');
const GenreNotExists = require('../errors/GenreNotExists');
const songDoesNotExists = require('../errors/songDoesNotExists');
const GenreSong = require('../models/GenreSong');

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

module.exports = {
    postSong,
    upVote,
    downVote
}