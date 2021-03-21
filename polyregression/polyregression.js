const tf = require('@tensorflow/tfjs');
const data = require('./data/data.js');

// returns an aray with an amount of random values
const init_weights = amount => {
    const w = [];
    for (let i = 0; i < amount; i++) {
        w.push(tf.variable(tf.scalar(Math.random())));
    }
    return w;
}

// turns an array into a tensor
const make_tensor = (matrix = []) => {
    return tf.tensor1d(matrix);
}

// prediction function to approximate new values of y
const predict_value = (x = [], w = []) => {
    const x_tensor = make_tensor(x);
    const y_tensor = x_tensor.mul(w[0]).add(w[1]);
    console.log(y_tensor);
    return y_tensor;
}

// returns the mean squared
const loss = (predictions, values) => {
    console.log('p: ' + predictions);
    console.log('v:' + values);
    const loss_tensor = predictions.squaredDifference(values).mean([], true);
    return loss_tensor;
}

const minimize = (loss, weights) => {
    weights[0] = weights[0] + loss;   
}

/* 
 * gets a set amount of training data based on location and hours in the year
 * and then stores an array of time and total sold tickets
 */
const training_data = data.get_training_set('Sargans', 168);

let time = []; 
let total_slots = [];
training_data.forEach( data => {
    time.push(data.hours);
    total_slots.push(data.total_spots);
});

// initializes an amount of specified weights and sets them as variable for tensorflow
let weights = init_weights(2);

// declares a learning rate and sets the optimize function to a stochastic gradient decent function
const learning_rate = 0.2;
const optimize_func = tf.train.adagrad(learning_rate);

let t = [];
let s = [];
for (let i = 0; i < time.length; i++) {
    t.push(time[i]);
    s.push(total_slots[i]);
    
    const slots_prediction = predict_value(t, weights);

    console.log('Real: (' + t[i] + ', ' + total_slots[i] + ')');
    
    if (t.length > 0) {
        const s_tensor = make_tensor(s);      
        optimize_func.minimize(() => { loss(slots_prediction, s_tensor) }, weights);
    }       
}

console.log('final equation:');
console.log('s = ' + weights[0] + 't + ' + weights[1]);