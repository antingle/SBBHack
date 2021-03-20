const chart = require('chart.js');
const get_training_data = require('./data/training_data.js');

const training_data = get_training_data('Sargans', 744);
console.log(training_data);

console.log('plots:');
var t = []; 
var s = [];
training_data.forEach( data => {
    t.push(data.hours);
    s.push(data.total_spots);
})

console.log(t, s);