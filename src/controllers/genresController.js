const GenreNotUnique = require('../errors/GenreNotUnique');
const Genre = require('../models/Genre')

async function postGenre(name) {

        const genreAlreadyExists = await Genre.findOne({where: {name}})
        if (genreAlreadyExists) {
            throw new GenreNotUnique();
        }

        const genre = await Genre.create({name});
        return genre;
}

async function getGenres(name) {

    const genres = await Genre.findAll({
        order: [
            ['name', 'ASC']
        ]
    });
    
    return genres;
}

module.exports = {
    postGenre,
    getGenres,
}