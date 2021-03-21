const tf = require('@tensorflow/tfjs');
const data = require('./data/data.js');

// Fit a quadratic function by learning the coefficients a, b, c.
const training_data = data.get_training_set('Sargans', 744);

let time = []; 
let total_slots = [];
training_data.forEach( data => {
    time.push(data.hours);
    total_slots.push(data.total_spots);
});

console.log(time, total_slots);

time = tf.tensor1d(time);
total_slots = tf.tensor1d(total_slots);

let weights = [tf.scalar(Math.random()).variable(), tf.scalar(Math.random()).variable(), tf.scalar(Math.random()).variable()];

// y = a * x^2 + b * x + c.
const f = x => weights[0].mul(x.square()).add(weights[1].mul(x)).add(weights[2]);
const loss = (pred, label) => pred.sub(label).square().mean();

const learningRate = 0.01;
const optimizer = tf.train.sgd(learningRate);

// Train the model.
for (let i = 0; i < 10; i++) {
   optimizer.minimize(() => loss(f(time), total_slots));
}

// Make predictions.
console.log(
     `a: ${weights[0].dataSync()}, b: ${weights[1].dataSync()}, c: ${weights[2].dataSync()}`);
const preds = f(time).dataSync();
preds.forEach((pred, i) => {
   console.log(`x: ${i}, pred: ${pred}`);
});