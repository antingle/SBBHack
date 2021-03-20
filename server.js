const express = require('express');

// sarts express server
const server = express();

server.listen(5500);

// declares the statics folder
server.use(express.static('public'));

server.get('/', (req, res) => { server.sendFile('/index.html') });