const router = require('express').Router();

const genresController = require('../controllers/genresController');
const GenreNotUnique = require('../errors/GenreNotUnique');

router.post('/', async (req,res) => {

    if(req.body.name === undefined) {
        return res.sendStatus(422);
    }

    try {
        const genre = await genresController.postGenre(req.body.name);
        res.status(201).send(genre);

    } catch (error) {

        if (error instanceof GenreNotUnique) {
            return res.status(409).send({error: 'Genre must be unique' })
        }
        return res.status(500).send({error: genre });
    }    
})

router.get('/', async (req,res) => {

    try {
        const genres = await genresController.getGenres();
        res.status(200).send(genres);
        
    } catch (err) {
        return res.status(500).send({error: err.errors[0].message })
    }

    
})


module.exports = router;