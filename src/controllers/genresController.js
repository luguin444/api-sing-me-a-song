
const Genre = require('../models/Genre')

async function postGenre(name) {

    try {
        const genre = await Genre.create({name});
        return genre;
    } catch(e) {
        return e.errors[0].message;
    }
}

async function getGenres(name) {

    try {
        const genres = await Genre.findAll({
            order: [
                ['name', 'ASC']
            ]
        });
        return genres;
    } catch(e) {
        return e.errors[0].message;
    }
}

module.exports = {
    postGenre,
    getGenres,
}