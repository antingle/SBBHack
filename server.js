const express = require('express');
var cors = require('cors')

const polyregression = require('./polyregression/polyregression.js');

// starts express app
const app = express();

//some cringe cors error I have to fix
app.use(cors());
app.listen(3000);

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
   });

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });



// declares the statics folder
app.use(express.static('public'));

app.get('/', (req, res, next) => { res.sendFile('./index.html') });

app.post('/model', (req, res) => {
    let hours = req.query.hours;
    // let name = req.query.name;
    let s_max = req.query.max;
    console.log(`hours: ${hours}, s_max: ${s_max}`);

    const { a, b } = polyregression.get_coefficients()
    console.log(`a: ${a}, b: ${b}`);
    const s = 2 * a * ((hours) / 8760);

    const s_open = Math.ceil(s_max - s*s_max);
    console.log(s);

    res.send(s_open.toString());
});