const fs = require('fs');

const raw_data = fs.readFileSync('./data/data.json');
const data = JSON.parse(raw_data);

// gets the js date from the json file and returns it in hours
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

// gets a set of data from the json file based on the station's name and the time period in hours.
module.exports.get_training_set = (station_name, time_period) => {
    // gets an array of all the tickets sold at the station in the time period
    let training_data = [];
    for (let i = 0; i < data.length; i++) {
        const { fields } = data[i];
        const { created, facility_name } = fields;
        const hours = get_hours(new Date(created));
        
        if (facility_name == station_name && hours < time_period + 1) {
            training_data.push(hours);
        }
    }

    // organize the array so that common values are grouped together from lowest to highest
    training_data = training_data.sort((a, b) => { return a - b });
    
    // gets the amount of tickets sold at each hour
    let training_set = {};
    let training_values = [];
    training_data.forEach( i => {
        training_set[i] = (training_set[i] || 0) + 1;
        // formats the array into an object of hours and spots
        training_values[i] = { hours: training_data[i], total_spots: training_set[i] };
    });

    // removes null values to make the array continuous
    training_values = training_values.filter( i => i != null );

    return training_values;
}

// initializes an amount weights with random values
module.exports.init_weights = (amount) => {
    const w = [];
    for (let i = 0; i < amount; i++) {
        w.push(Math.random());
    }
    
    return w;
}