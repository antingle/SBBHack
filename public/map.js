//Working with google maps api + all frontend javascript

const apikey = "";
const zipkey = "";
var meters = 20000; //standard search radius

//fetch options
var requestOptions = {
  method: "GET",
  redirect: "follow"
};

// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.


let map, infoWindow;
let markers = []; // appending markers to array allows markers to be cleared

// initializes map and sets center
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 47.5474120551, lng: 7.58956279016 },
    zoom: 10,
  });

  infoWindow = new google.maps.InfoWindow();
  const nearButton = document.querySelector(".location-btn");
  const radiusButtons = document.querySelectorAll(".dropdown-menu li a");

  // radius menu dropdown
  for (let i = 0; i < radiusButtons.length; i++) {
    radiusButtons[i].addEventListener("click", () => {
      let km = radiusButtons[i].textContent.match(/\d+/)[0];
      meters = km * 1000;
      document.querySelector(".radius-btn").textContent = `Radius (${km} km)`;
    });
  }
 

  // search stations by postal code
  let form = document.body.querySelector(".searchBar");
  form.addEventListener("submit", () => {
    let postal = form.elements["search"].value;
    deleteMarkers();

    // error check the postal code
    let fourDigits = /^\d{4}$/;
    if (fourDigits.test(postal) == false) {
      if (document.getElementById("errorDiv") == null) {
        let errorDiv = document.createElement("div");
        errorDiv.id = "errorDiv";
        errorDiv.innerHTML = "Incorrect Postal Code";
        document.body.insertBefore(errorDiv, form.parentNode);
      }
      return;
    } else {
      let errorDiv = document.getElementById("errorDiv");
      if (errorDiv) {
        errorDiv.remove();
      }
    }
    let pos;
    fetch(
      `https://app.zipcodebase.com/api/v1/search?apikey=${zipkey}&codes=${postal}&country=CH`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {

        if (result.results[postal] == undefined) {
          if (document.getElementById("errorDiv") == null) {
            let errorDiv = document.createElement("div");
            errorDiv.id = "errorDiv";
            errorDiv.innerHTML = "Not a valid Switzerland postal code";
            document.body.insertBefore(errorDiv, form.parentNode);
          }
          return;
        } else {
          let errorDiv = document.getElementById("errorDiv");
          if (errorDiv) {
            errorDiv.remove();
          }
            // smoothly redirect to map if valid postal code
            mapDiv = document.querySelector("#map");
            mapDiv.scrollIntoView({ behavior: "smooth" });
        }

        let temp = result.results[postal];
        let latitude = parseFloat(temp[0].latitude);
        let longitude = parseFloat(temp[0].longitude);
        pos = { lat: latitude, lng: longitude };

        let marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: "Your position",
        });
        markers.push(marker);
        map.setCenter(pos);
        map.setZoom(13.7 - meters / 20000);
        findStationsNear(pos);
      });
  });

  //search stations by current location
  nearButton.addEventListener("click", () => {
    mapDiv = document.querySelector("#map");
    mapDiv.scrollIntoView({ behavior: "smooth" });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          let marker = new google.maps.Marker({
            position: pos,
            map: map,
            title: "Your position",
          });
          markers.push(marker);
          map.setCenter(pos);
          map.setZoom(13 - meters / 20000);
          findStationsNear(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

  // these functions allow markers to be removed
  function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
  function clearMarkers() {
    setMapOnAll(null);
  }
  function deleteMarkers() {
    clearMarkers();
    markers = [];
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

//find stations based on geodistance query
function findStationsNear(pos) {
  let lat = pos.lat;
  let lng = pos.lng;
  const origin = [pos.lat, pos.lng];
  const originLatLng = new google.maps.LatLng(pos.lat, pos.lng);

  // fetch nearest station based on location passed in and meters set for radius
  fetch(
    `https://data.sbb.ch/api/records/1.0/search/?dataset=mobilitat&q=&rows=1000&facet=stationsbezeichnung&geofilter.distance=${lat}%2C${lng}%2C${meters}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {

      //loops through results and creates a marker for each entry
      for (let i = 0; i < result.records.length; i++) {
        const coords = result.records[i].geometry.coordinates;
        const latLng = new google.maps.LatLng(coords[1], coords[0]);
        const destination = coords[1] + "," + coords[0];
        var infowindow = new google.maps.InfoWindow({
          content: `
          <h2>${result.records[i].fields.abkuerzung} - ${result.records[i].fields.bezeichnung_offiziell}</h2>
          `,
        });

        //set custom marker
        let marker = new google.maps.Marker({
          position: latLng,
          map: map,
          animation: google.maps.Animation.DROP,
          icon: {
            url: "parking.png",
            scaledSize: new google.maps.Size(32, 32),
          },
          title: result.records[i].fields.abkuerzung,
        });
        markers.push(marker);

        //adds address and ETA to marker window
        marker.addListener("click", () => {
          

          // distance martix api allows for ETA and distance to be acquired
          const matrix = new google.maps.DistanceMatrixService();
          matrix.getDistanceMatrix(
            {
              origins: [originLatLng],
              destinations: [latLng],
              travelMode: google.maps.TravelMode.DRIVING,
            },
            function (result2) {
           
              //get hours from backend
              let maxSpots = 50; //default because some stations dont have max spots (prevents NaN)
              if (result.records[i].fields.parkrail_anzahl > 0) maxSpots = result.records[i].fields.parkrail_anzahl;

              fetch(`/model?hours=${hoursFromDate()}&name=${result.records[i].fields.bezeichnung_offiziell}&max=${maxSpots}`, { method: 'POST' })
              .then((response) => response.text())
              .then((result3) => { 

                // sets innerHTML of info markers
                infowindow = new google.maps.InfoWindow({
                  content: `
                <h2>${result.records[i].fields.abkuerzung} - ${result.records[i].fields.bezeichnung_offiziell}</h2>
                <p><a href = "https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}">${result2.destinationAddresses[0]}</a></p>
                <p>Time to station: <b>${result2.rows[0].elements[0].duration.text}</b></p>
                <p>Distance: <b>${result2.rows[0].elements[0].distance.text}</b></p>
                <p>Estimated parking spots open: <b>${result3}</b></p>
                `,
                });
                infowindow.open(map, marker);
              }
            );
              
            })
            .catch((error) => console.log("error", error));
        });
        google.maps.event.addListener(map, "click", function (event) {
          infowindow.close();
        });
      }
      
      //set 3 nearest stations on cards above map
      let card = document.body.querySelectorAll(".parking-card");
      for (let i = 0, j = 0; i < card.length; i++, j++) {
        while (result.records[j].fields.bezeichnung_offiziell == result.records[j + 1].fields.bezeichnung_offiziell) j++;

        const coords = result.records[j].geometry.coordinates;
        const destination = coords[1] + "," + coords[0];
        const latLng = new google.maps.LatLng(coords[1], coords[0]);
        const matrix = new google.maps.DistanceMatrixService();

          matrix.getDistanceMatrix(
            {
              origins: [originLatLng],
              destinations: [latLng],
              travelMode: google.maps.TravelMode.DRIVING,
            },
            function (result2, status) {
              
            card[i].innerHTML = '';
            let h2 = document.createElement("h2");
            let p = document.createElement("p");
            let p2 = document.createElement("p");
            let p3 = document.createElement("p");
            let h4 = document.createElement("h4");
            h2.innerHTML = `${result.records[j].fields.abkuerzung} - ${result.records[j].fields.bezeichnung_offiziell}`;
            card[i].appendChild(h2);
            p.innerHTML = `Distance: <b>${result2.rows[0].elements[0].distance.text}</b>`;
            p2.innerHTML = `Time to station: <b>${result2.rows[0].elements[0].duration.text}</b>`;
            card[i].appendChild(p2);
            card[i].appendChild(p);
            p3.innerHTML = `<a href = "https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}">${result2.destinationAddresses[0]}</a>`;
            card[i].appendChild(p3);
            let maxSpots = 50; //default because some stations dont have max spots
              if (result.records[j].fields.parkrail_anzahl > 0) maxSpots = result.records[j].fields.parkrail_anzahl;

              // fetch backend model prediction for cards
            fetch(`/model?hours=${hoursFromDate()}&name=${result.records[j].fields.bezeichnung_offiziell}&max=${maxSpots}`, { method: 'POST' })
              .then((response) => response.text())
              .then((result) => { 
                if (result > 30) h4.className = 'green'
                else if (result > 10) h4.className = 'yellow'
                else h4.className = 'red'
              h4.innerHTML = `Estimated parking spots open: ${result}`;
              card[i].appendChild(h4); 
            })
              .catch((error) => console.log("error", error));
          });
      }
      document.querySelector('.parking-card-deck').hidden = false;
    })
   
}

// function for optaining current date to send to backend model
function hoursFromDate() {
  let now = new Date();
  let beginningOfYear = new Date('January 1, 2021, 00:00:00');
  let time = now - beginningOfYear;
  return time / (1000 * 60 * 60);
}

