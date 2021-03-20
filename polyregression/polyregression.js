const tf = require('@tensorflow/tfjs');
const data = require('./data/training_data.js');

const training_data = data.get_training_set('Sargans', 744);

let t = []; 
let s = [];
training_data.forEach( data => {
    t.push(data.hours);
    s.push(data.total_spots);
});

// init 2 random weights
const weights = data.init_weights(2);

console.log(weights);