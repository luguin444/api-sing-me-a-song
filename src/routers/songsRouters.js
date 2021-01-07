const router = require('express').Router();

const postSongSchema = require('../schemas/songsSchemas');

const songsController = require('../controllers/songsController');
const GenreNotExists = require('../errors/GenreNotExists');

router.post('/', async (req,res) => {

    const validation = postSongSchema.validate(req.body);
    if(validation.error) {
        return res.send(422);
    }

    const {name, genresIds, youtubeLink} = req.body;
    const songData = {name, genresIds, youtubeLink};

    try {
        const song = await songsController.postSong(songData);
        res.status(201).send(song);
    } catch (error) {
        if(error instanceof GenreNotExists) {
            return res.status(422).send({error: 'Some Id does not exist'});
        } 
        console.log(error)
        res.status(500).send({error: 'Unknown error'});
    }

    //Caso de sucesso, postar o id da song com os generos 
})


module.exports = router;