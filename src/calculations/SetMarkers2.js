function addMarkers2(location, map){

    // https://developers.google.com/maps/documentation/javascript/examples/marker-simple
    
    function initMapInteractive() {
        var uluru = { lat: -34.916467, lng: -56.154272 };
        var map = new google.maps.Map(document.getElementById("map"), {
          zoom: 15,
          center: uluru
        });

        var marker = new google.maps.Marker({
            position: { lat: coordenadas [0] , lng: coordenadas[altura.length-1]},
            map: map,
          });
    }

    path = poly.getPath(); // en path guardo la poly creada (se crea luego de dos clicks)
    path.push(location); // path es un array por definicion, se hace un push al array de cada location de cada punto de la polyline

    poly.setMap(map); // setea la polyline en el mapa


    poly = new google.maps.Polyline({
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 3
      });

    elevator = new google.maps.ElevationService();

        // Draw the path, using the Visualization API and the Elevation service:
        camino[0] = path.getAt(0);
        camino[1] = path.getAt(1);
        // Draw the path, using the Visualization API and the Elevation service:
        dist = haversine(radius, latitud, longitud);
        displayPathElevation(camino, elevator, dist);
}

