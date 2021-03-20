const apikey = 'AIzaSyDzKz9_k_DVMDKCVayOWK2sGuX6QDJ9gOo';
const zipkey = 'f51cb250-8940-11eb-a563-317fa7c2b6b2';
var meters = 20000;

var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  mode: 'cors'
};

// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 47.5474120551, lng: 7.58956279016 },
    zoom: 10,
  });

  infoWindow = new google.maps.InfoWindow();
  const nearButton = document.querySelector('.location-btn');

  //search stations by postal code
  let form = document.body.querySelector('.searchBar');
  form.addEventListener('submit', () => {
    let postal = form.elements['search'].value;

    let fourDigits = /^\d{4}$/;
    if (fourDigits.test(postal) == false) {
      if (document.getElementById('errorDiv') == null) {
        let errorDiv = document.createElement('div');
        errorDiv.id = ('errorDiv');
        errorDiv.innerHTML = "Incorrect Postal Code";
        document.body.insertBefore(errorDiv, form.parentNode);
      }
      return;
    } else {
      let errorDiv = document.getElementById('errorDiv');
      if (errorDiv) {
      errorDiv.remove();
      }
    }
    mapDiv = document.querySelector('#map');
    mapDiv.scrollIntoView( { behavior: "smooth" } );
    let pos;
    fetch(`https://app.zipcodebase.com/api/v1/search?apikey=f51cb250-8940-11eb-a563-317fa7c2b6b2&codes=${postal}&country=CH`, requestOptions)
    .then(response => response.json())
    .then(result => {
      let temp = result.results[postal];
      let latitude = parseFloat(temp[0].latitude);
      let longitude = parseFloat(temp[0].longitude);
      pos = { lat: latitude, lng: longitude };
      map.setCenter(pos);
      map.setZoom(12);
      findStationsNear(pos);
    });
  });

  //search stations by current location
  nearButton.addEventListener("click", () => {
    mapDiv = document.querySelector('#map');
    mapDiv.scrollIntoView( { behavior: 'smooth' } )

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          new google.maps.Marker({
            position: pos,
            map: map,
            title: 'Your position'
        });
          // infoWindow.open(map);
          map.setCenter(pos);
          map.setZoom(12);
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
  fetch(`https://data.sbb.ch/api/records/1.0/search/?dataset=mobilitat&q=&rows=1000&facet=stationsbezeichnung&geofilter.distance=${lat}%2C${lng}%2C${meters}`, requestOptions)
    .then(response => response.json())
    .then(result => {

      //loops through results and creates a marker for each entry
      for (let i = 0; i < result.records.length; i++) {
        const coords = result.records[i].geometry.coordinates;
        const latLng = new google.maps.LatLng(coords[1], coords[0]);
        let origin = [pos.lat, pos.lng];
        let destination = coords[1] + ',' + coords[0];
        var infowindow = new google.maps.InfoWindow({
          content:  `
          <h2>${result.records[i].fields.abkuerzung} &nbsp; ${result.records[i].fields.bezeichnung_offiziell}</h2>
          `
        });;

        //set custom marker 
        let marker = new google.maps.Marker({
          position: latLng,
          map: map,
          animation: google.maps.Animation.DROP,
          icon: {
            url: 'parking.png',
            scaledSize: new google.maps.Size(32,32)
          },
          title: result.records[i].fields.abkuerzung
        });

        //adds address and eta to marker window
        marker.addListener("click", () => {

          fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=AIzaSyDzKz9_k_DVMDKCVayOWK2sGuX6QDJ9gOo`, requestOptions)
          .then(response => response.json())
          .then(result2 => {
            console.log(result2.rows[0].elements[0]);
            infowindow = new google.maps.InfoWindow({
              content:  `
              <h2>${result.records[i].fields.abkuerzung} &nbsp; ${result.records[i].fields.bezeichnung_offiziell}</h2>
              <p>${result2.destination_addresses[0]}</p>
              `
            });
              infowindow.open(map, marker);
          })
          .catch(error => console.log('error', error));

        });
        google.maps.event.addListener(map, "click", function(event) {
          infowindow.close();
      });
      }
      //set card texts
      let card = document.body.querySelectorAll('.parking-card-deck .parking-card h2');
      for (let i = 0, j = 0; i < card.length; i++, j++) {
        console.log(result.records[j].fields.bezeichnung_offiziell);
        while (result.records[j].fields.bezeichnung_offiziell == result.records[j+1].fields.bezeichnung_offiziell) j++;
        card[i].innerHTML = `${result.records[j].fields.abkuerzung} &nbsp; ${result.records[j].fields.bezeichnung_offiziell}`;
      }
    })
    .catch(error => console.log('error', error));
}
