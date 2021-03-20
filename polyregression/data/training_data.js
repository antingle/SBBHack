const fs = require('fs');

const raw_data = fs.readFileSync('./data/data.json');
const data = JSON.parse(raw_data);

const get_hours = jsdate => {
    const month = jsdate.getMonth();
    
    let time = 0;
    for (let i = 0; i < month; i++) {
        switch (i) {
            case 0:
            case 3:
            case 5:
            case 7:
            case 9:
            case 11: time += 31; break;
            case 4:
            case 6:
            case 8:
            case 10: time += 30; break;
            default: (jsdate.getFullYear() % 4 == 0) ? time += 29 : time += 28;
        }
    }
    time += jsdate.getDate();
    time *= 24;
    time += jsdate.getHours();

    return time;
}

module.exports.get_training_set = (station_name, time_period) => {
    let training_data = [];
    for (let i = 0; i < data.length; i++) {
        const { fields } = data[i];
        const { created, facility_name } = fields;
        const hours = get_hours(new Date(created));
        
        if (facility_name == station_name && hours < time_period + 1) {
            training_data.push(hours);
        }
    }
    training_data = training_data.sort((a, b) => { return a - b });
    
    let training_set = {};
    let training_values = [];
    training_data.forEach( i => {
        training_set[i] = (training_set[i] || 0) + 1;
        training_values[i] = { hours: training_data[i], total_spots: training_set[i] };
    });
    training_values = training_values.filter( i => i != null );

    return training_values;
}

module.exports.init_weights = (amount) => {
    const w = [];
    for (let i = 0; i < amount; i++) {
        w.push(Math.random());
    }
    
    return w;
}