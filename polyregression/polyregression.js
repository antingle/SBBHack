const plot = require('plotly');
const get_training_data = require('./data/training_data.js');

const training_data = get_training_data('Sargans', 744);
console.log(training_data);