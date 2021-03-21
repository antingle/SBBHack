const tf = require('@tensorflow/tfjs');
const data = require('./data/data.js');

const training_data = data.get_training_set('Sargans', 168);
console.log(training_data);
/*
// Fit a quadratic function by learning the coefficients a, b, c.
const xs = tf.tensor1d(total_slots);
const ys = tf.tensor1d(time);

const a = tf.scalar(Math.random()).variable();
const b = tf.scalar(Math.random()).variable();
const c = tf.scalar(Math.random()).variable();

// y = a * x^2 + b * x + c.
const f = x => a.mul(x.square()).add(b.mul(x)).add(c);
const loss = (pred, label) => pred.sub(label).square().mean();

const learningRate = 0.00001;
const optimizer = tf.train.sgd(learningRate);

// Train the model.
for (let i = 0; i < 10; i++) {
   optimizer.minimize(() => loss(f(xs), ys));
}

// Make predictions.
console.log(
     `a: ${a.dataSync()}, b: ${b.dataSync()}, c: ${c.dataSync()}`);
const preds = f(xs).dataSync();
preds.forEach((pred, i) => {
   console.log(`x: ${i}, pred: ${pred}`);
});*/