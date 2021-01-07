require("dotenv").config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const genresRouter = require('./routers/genresRouters');
const songsRouter = require('./routers/songsRouters');

app.use('/genres', genresRouter);
app.use('/recommendations', songsRouter);

module.exports = app;