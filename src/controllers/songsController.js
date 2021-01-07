const Genre = require('../models/Genre');
const Song = require('../models/Song');
const GenreNotExists = require('../errors/GenreNotExists');
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
    //console.log(genreVectorToInsert);

    await GenreSong.bulkCreate( genreVectorToInsert );

    return song;
}

module.exports = {
    postSong,
    
}