const express = require('express');
var cors = require('cors')

const get_probability = require('./probability/probability.js');


// starts express app
const app = express();

//some cringe cors error I have to fix
app.use(cors());

app.listen(3000);

// declares the statics folder
app.use(express.static('public'));

app.get('/', (req, res) => { app.sendFile('/index.html') });

app.post('/model', (req, res) => {
    let hours = req.query.hours;
    let name = req.query.name;
    let max = req.query.max;

    const prob = get_probability(hours, name, max_spots);

    res.send(`${parseInt(hours)}`);
});