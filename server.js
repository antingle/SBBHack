const express = require('express');
var cors = require('cors')

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

app.get('/', (req, res, next) => { app.sendFile('/index.html') });

app.post('/model', (req, res) => {
    let hours = req.query.hours;
    let name = req.query.name;
    console.log(hours, name);
    res.send(`${parseInt(hours)}`);
});