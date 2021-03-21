const express = require('express');
var cors = require('cors')

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
    console.log(hours, name);
    res.send(`${parseInt(hours)}`);
});
