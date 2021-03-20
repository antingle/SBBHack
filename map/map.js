const apikey = 'AIzaSyDzKz9_k_DVMDKCVayOWK2sGuX6QDJ9gOo';
const zipkey = 'f51cb250-8940-11eb-a563-317fa7c2b6b2';
var meters = 20000;

var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 47.5474120551, lng: 7.58956279016 },
    zoom: 12,
  });

  infoWindow = new google.maps.InfoWindow();
  const nearButton = document.querySelector('.nearMe');
  const postalButton = document.querySelector('.postal');

  //search stations by postal code
  postalButton.addEventListener("click", () => {
    let pos, postal=1200;
    fetch(`https://app.zipcodebase.com/api/v1/search?apikey=f51cb250-8940-11eb-a563-317fa7c2b6b2&codes=${postal}&country=CH`, requestOptions)
    .then(response => response.json())
    .then(result => {
      let temp = result.results[postal];
      let latitude = parseFloat(temp[0].latitude);
      let longitude = parseFloat(temp[0].longitude);
      pos = { lat: latitude, lng: longitude };
      map.setCenter(pos);
      console.log(pos);
      findStationsNear(pos);
    });
  });

  //search stations by current location
  nearButton.addEventListener("click", () => {
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
            title: 'Your position'
        });
          // infoWindow.open(map);
          map.setCenter(pos);
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
  console.log(lat);
  let lng = pos.lng;
  fetch(`https://data.sbb.ch/api/records/1.0/search/?dataset=mobilitat&q=&rows=1000&facet=stationsbezeichnung&geofilter.distance=${lat}%2C${lng}%2C${meters}`, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result.records);
      for (let i = 0; i < result.records.length; i++) {
        const coords = result.records[i].geometry.coordinates;
        const latLng = new google.maps.LatLng(coords[1], coords[0]);
        const infowindow = new google.maps.InfoWindow({
          content: result.records[i].fields.bezeichnung_offiziell,
        });
        let marker = new google.maps.Marker({
          position: latLng,
          map: map,
          icon: icons.parking,
          title: result.records[i].fields.bezeichnung_offiziell
        });
        marker.addListener("click", () => {
          infowindow.open(map, marker);
        });
        google.maps.event.addListener(map, "click", function(event) {
          infowindow.close();
      });
      }
    })
    .catch(error => console.log('error', error));
}

const iconBase =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/";
  const icons = {
    parking: iconBase + "parking_lot_maps.png"
  };