const express = require('express');

// starts express app
const app = express();

app.listen(5500);

// declares the statics folder
app.use(express.static('public'));

app.get('/', (req, res) => { app.sendFile('/index.html') });

app.post('/model', (req, res) => {
    let hours = req.query.hours;
    let name = req.query.name;
    console.log(hours, name);
    res.send(`${parseInt(hours)}`);
});

