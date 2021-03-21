const express = require('express');

const polyregression = require('./polyregression/polyregression.js');

// starts express app
const app = express();

app.listen(3000);

// declares the statics folder
app.use(express.static('public'));

app.get('/', (req, res, next) => { res.sendFile('./index.html') });

app.post('/model', (req, res) => {
    let hours = req.query.hours;
    // let name = req.query.name;
    let s_max = req.query.max;

    const { a, b } = polyregression.get_coefficients()
    const s = 2 * a * ((hours) / 8760);

    const s_open = Math.ceil(s_max - s*s_max);

    res.send(s_open.toString());
});