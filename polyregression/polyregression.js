const tf = require('@tensorflow/tfjs');
const data = require('./data/training_data.js');

// makes the specified array an array of variables for tensorflow
// is solely used for the weight array
const make_variable = (num = []) => {
    for (let i = 0; i < num.length; i++) {
        num[i] = tf.variable(tf.scalar(num[i]));
    }
    return num;
}

// turns an array into a tensor
const make_tensor = (matrix = []) => {
    return tf.tensor1d(matrix);
}

// prediction function to approximate new values of y
const predict_value = (x = [], w = []) => {
    const x_tensor = make_tensor(x);
    const y_tensor = x_tensor.mul(w[1]).add(w[0]);
    
    return y_tensor;
}

/* 
 * gets a set amount of training data based on location and hours in the year
 * and then stores an array of time and total sold tickets
 */
const training_data = data.get_training_set('Sargans', 744);

let time = []; 
let sold_tickets = [];
training_data.forEach( data => {
    time.push(data.hours);
    sold_tickets.push(data.total_spots);
});

// initializes an amount of specified weights and sets them as variable for tensorflow
let weights = data.init_weights(2);
weights = make_variable(weights);