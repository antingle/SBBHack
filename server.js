const express = require('express');
const polyregression = require('./polyregression/polyregression.js');

// starts express app
const app = express();

app.listen(3000);

// declares the statics folder
app.use(express.static('public'));

app.get('/', (req, res) => { res.sendFile('./index.html') });

// recieve frontend api fetch for predicition and get result from model
app.post('/model', (req, res) => {
    let hours = req.query.hours;
    let s_max = req.query.max;

    const { a, b } = polyregression.get_coefficients()
    const s = 2 * a * ((hours) / 8760);

    const s_open = Math.ceil(s_max - s*s_max);

    res.send(s_open.toString());
});