const router = require('express').Router();

const genresController = require('../controllers/genresController');

router.post('/', async (req,res) => {

    if(req.body.name === undefined) {
        return res.sendStatus(422);
    }

    const genre = await genresController.postGenre(req.body.name);

    if(typeof(genre) === "string") return res.status(500).send({error: genre });

    res.status(201).send(genre);
})

router.get('/', async (req,res) => {

    const genres = await genresController.getGenres();
    
    // if(typeof(genre) === "string") return res.status(500).send({error: genre });

    res.status(200).send(genres);
})


module.exports = router;