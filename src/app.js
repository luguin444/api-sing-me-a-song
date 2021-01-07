require("dotenv").config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const genresRouter = require('./routers/genresRouters');

app.use('/genres', genresRouter);

module.exports = app;