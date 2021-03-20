const fetch = require('node-fetch');

var request_options = {
    method: 'GET',
    redirect: 'follow'
    };
      
fetch('https://data.sbb.ch/api/records/1.0/search/?dataset=parkrail-sale-app&q=&facet=start&facet=end&facet=facility_name&facet=created&facet=booking_status&refine.created=2020', request_options)
    .then(response => response.json())
    .then(result => { 
        
    })
    .catch(error => { console.log(error) });