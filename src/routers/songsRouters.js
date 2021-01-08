const router = require('express').Router();

const postSongSchema = require('../schemas/songsSchemas');

const songsController = require('../controllers/songsController');
const GenreNotExists = require('../errors/GenreNotExists');
const songDoesNotExists = require('../errors/songDoesNotExists');

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
})

router.post('/:id/upvote', async (req,res) => {

    const id = req.params.id;

    try {
        const updatedsong = await songsController.upVote(id);
        res.status(200).send(updatedsong);
        
    } catch (error) {
        console.log(error);
        if (error instanceof songDoesNotExists) {
            return res.status(400).send({error: 'Song Id does not exists'});
        }
        res.status(500).send({error: 'Unknown error'});
    }
})

router.post('/:id/downvote', async (req,res) => {

    const id = req.params.id;

    try {
        const updatedsong = await songsController.downVote(id);
        res.status(200).send(updatedsong);
        
    } catch (error) {
        console.log(error);
        if (error instanceof songDoesNotExists) {
            return res.status(400).send({error: 'Song Id does not exists'});
        }
        res.status(500).send({error: 'Unknown error'});
    }
})

router.get('/random', async (req,res) => {

    try {
        const song = await songsController.getRecommendation();
        res.status(200).send(song[0]);
    } catch (error) {
        console.log(error);
        if (error instanceof songDoesNotExists) {
            return res.status(404).send({error: 'There is no recommendation'});
        }
        res.status(500).send({error: 'Unknown error'});
    }
})

router.get('/genres/:id/random', async (req,res) => {

    const id = req.params.id

    try {
        const song = await songsController.getRecommendationByGenre(id);
        res.status(200).send(song[0]);
    } catch (error) {
        console.log(error);
        if (error instanceof songDoesNotExists) {
            return res.status(404).send({error: 'There is no recommendation'});
        } else if (error instanceof GenreNotExists) {
            return res.status(400).send({error: 'Id does not exist'});
        }  
        res.status(500).send({error: 'Unknown error'});
    }
})







module.exports = router;