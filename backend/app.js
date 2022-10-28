const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const genreRoutes = require('./route/genre');
const Response = require('./model/response');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.use('/genres', genreRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const response = new Response(message, null);
    res.status(status).json(response);
});

mongoose
    .connect(
      'mongodb+srv://ece9065:ece9065@cluster0.zry6vyf.mongodb.net/?retryWrites=true&w=majority'
    )
    .then(result => {
        app.listen(port, () => {console.log(`listening on port ${port}`)});
    })
    .catch(err => console.log(err));

