function geocodeLatLng(geocoder, map) {
    console.log("test2");
    var input = document.getElementById('transmisor').value;
    var latlngStr = input.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};

    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          var marker = new google.maps.Marker({
            position: latlng,
            map: map
          });
          
          addMarkersAndAll(location, map); 
          //markers.push(marker);
         // latitud.push(marker.getPosition().lat()); //guardo en el array latitud la latitud de cada marcador
          //longitud.push(marker.getPosition().lng()); //guardo en el array longitud la longitud de cada marcador
          //coordenadas(marker, latitud, longitud);
          
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });

  }