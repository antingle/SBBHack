const apikey = 'AIzaSyDzKz9_k_DVMDKCVayOWK2sGuX6QDJ9gOo';
var meters = 20000;

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
  const locationButton = document.createElement("button");
  const nearButton = document.querySelector('.nearMe');
  locationButton.textContent = "My Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  nearButton.addEventListener("click", () => {
    let pos = { lat: 47.5474120551, lng: 7.58956279016 };
    map.setCenter(pos);
    findStationsNear(pos);
  });
  locationButton.addEventListener("click", () => {
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

function findStationsNear(pos) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch(`https://data.sbb.ch/api/records/1.0/search/?dataset=mobilitat&q=&rows=1000&facet=stationsbezeichnung&geofilter.distance=47.5474120551%2C7.58956279016%2C${meters}`, requestOptions)
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
          infoWindow.close(map);
          infowindow.open(map, marker);
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