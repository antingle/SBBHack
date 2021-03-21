const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const fs = require('fs');

const raw_data = fs.readFileSync('./data/data.json');
const data = JSON.parse(raw_data);

const does_contain = (arr, num) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === num) {
            return true;
        }        
      }
      return false;
}

const find_duplicates = (arr) => {
    let new_arr = [];
    for (let i = 0; i < arr.length; i++) {
        if (!does_contain(new_arr, arr[i])) {
            new_arr.push(arr[i]);
        }
    }
    return new_arr;
}

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
    training_data.sort((a, b) => a - b);

    let set = find_duplicates(training_data);

    let data_set = [];
    for (let i = 0; i < set.length; i++) {
        let count = 0;
        for (let j = i; j < training_data.length; j++) {
            if (training_data[j] == set[i]) {
                count++;  
            }   
        }
        data_set.push({ hours: set[i], spots: count });
    }
    
    return data_set;
}