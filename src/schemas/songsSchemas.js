const joi = require('joi');

//array de inteiros com pelo menos 1
//check se o link é do Youtbe

const postSongSchema = joi.object({
    name: joi.string().required(),
    genresIds: joi.array().items(joi.number()).min(1).required(),
    youtubeLink: joi.string().regex(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/).required() 
})

module.exports = postSongSchema;

