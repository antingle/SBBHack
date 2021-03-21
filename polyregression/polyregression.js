const tf = require('@tensorflow/tfjs');
//const data = require('./data/data.js');

//const training_data = data.get_training_set('Sargans', 336);

const a = tf.scalar(0.8360432386398315).variable();
const b = tf.scalar(1.112913966178894).variable();
const c = tf.scalar(3.2782235145568848).variable();

var accuracy = 0.9895888750082274;

const get_training_data = () => {
    let t = [];
    let s = [];
    let t_check = [];
    let s_check = [];
    
    for (let z = 0; z < training_data.length; z++) {
        const { hours, spots } = training_data[z];
    
        if (z <  3 * training_data.length / 4) {
            t.push(hours / 8760);
            s.push(spots);
        }
        else {
            t_check.push(hours / 8760);
            s_check.push(hours);
        }  
    }

    return { t, s, t_check, s_check };
}

const predict = x => a.mul(x.square()).add(b.mul(x)).add(c);

const loss = (pred, label) => pred.sub(label).square().mean();

module.exports.get_coefficients = () => {
    return { a: a.dataSync(), b: b.dataSync(), c: c.dataSync() };
}

module.exports.accuracy = () => accuracy;

module.exports.run = () => {
    const { t, s, t_check, s_check } = get_training_data();

    // Fit a quadratic function by learning the coefficients a, b, c.
    const xs = tf.tensor1d(t);
    const ys = tf.tensor1d(s);

    const learningRate = 0.05;
    const optimizer = tf.train.sgd(learningRate);

    // Train the model.
    for (let z = 0; z < t.length; z++) {
        optimizer.minimize(() => loss(predict(xs), ys));
    }

    console.log(`equation: ${a.dataSync()}*t^2 + ${b.dataSync()}*t + ${c.dataSync()}`);

    // check data
    const t_tensor = tf.tensor1d(t_check);
    const s_tensor = tf.tensor1d(s_check);

    const predictions = predict(t_tensor).dataSync();

    const preds = [];
    predictions.forEach(pred => {
        preds.push(pred);
    });

    let pred_sum = 0;
    for (let z = 0; z < preds.length; z++) {
        pred_sum += preds[z];
    }
    const pred_avg = pred_sum / preds.length;

    let sum = 0;
    for (let z = 0; z < s_check.length; z++) {
        sum += s_check[z];
    }
    const s_avg = sum / s_check.length;

    for (let z = 0; z < t_check.length; z++) {
        console.log(`(${t_check[z]}, ${s_check[z]}) :: (${t_check[z]}, ${preds[z]}) :: ${((s_check[z]-preds[z]) / s_check[z]) * 100} %`);
    }

    accuracy = (s_avg - pred_avg) / s_avg;

    console.log('--------------------')
    console.log(`${s_avg} :: ${pred_avg} :: ${accuracy * 100} %`)
}