/* Esta función permite agregar un marcador en la ubicación clickeada. En caso que se haya hecho dos veces
click en el mapa, se dibuja una linea (Polyline) entre los dos marcadores.
*/

function addMarkersAndAll(location, map) {
  var distancia_perfil = 0;
  path = poly.getPath(); // en path guardo la poly creada (se crea luego de dos clicks)
  path.push(location); // path es un array por definicion, se hace un push al array de cada location de cada punto de la polyline

  var marker = new google.maps.Marker({
    position: location, //localizacion en donde se hizo el click
    label: labels[labelIndex++ % labels.length],
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    title: "#" + path.getLength()
  });

  markers.push(marker);
  poly.setMap(map); // setea la polyline en el mapa

  latitud.push(marker.getPosition().lat()); //guardo en el array latitud la latitud de cada marcador
  longitud.push(marker.getPosition().lng()); //guardo en el array longitud la longitud de cada marcador
  showCoordenadas(latitud, longitud);

  //Cuando arrastro un marcador:
  google.maps.event.addListener(marker, "drag", function(evt) {
    //muevo la linea cuando muevo los marcadores y creo una nueva:
    var etiqueta = marker.getLabel();
    if (etiqueta == "R") {
      //Si el marcador que muevo es el R
      path.pop(); //saco el ulimo elemento de path porque es el relacionado con R
      path.push(evt.latLng); // hago un push del nuevo lugar del marcador al array
      path = poly.getPath(); // dibujo la linea con las dos ubicaciones

      latitud[1] = marker.getPosition().lat();
      longitud[1] = marker.getPosition().lng();
    }
    else {
      // si muevo el marcador A
      var remove2 = path.removeAt(1); // Saco el elemento del lugar 1 y lo guardo
      var remove = path.removeAt(0); // Saco el elemento 0 y lo guardo porque obliga la funcion pero no lo uso -- al pepe

      path.setAt(1, remove2); //seteo en el lugar 1 el mismo valor que estaba
      path.setAt(0, evt.latLng); // seteo en el valor 0 la nueva ubicacion del marcador A

      path = poly.getPath(); //dibujo la poly con ambos valores

      latitud[0] = marker.getPosition().lat();
      longitud[0] = marker.getPosition().lng();

    }
    flag=2; //Seteo el flag en 2 para que desde elevationPath se actualice el data
    showCoordenadas(latitud, longitud);

    if (markers.length == 2) {
      var elevator = new google.maps.ElevationService();
      // Draw the path, using the Visualization API and the Elevation service:
      camino[0] = path.getAt(0);
      camino[1] = path.getAt(1);

      dist = haversine(radius, latitud, longitud);
      displayPathElevation(camino, elevator, dist);
    }
  });

  marker.addListener("click", toggleBounce);

  if (markers.length == 2) {
    elevator = new google.maps.ElevationService();

    // Draw the path, using the Visualization API and the Elevation service:
    camino[0] = path.getAt(0);
    camino[1] = path.getAt(1);
    // Draw the path, using the Visualization API and the Elevation service:
    dist = haversine(radius, latitud, longitud);
    displayPathElevation(camino, elevator, dist);
  }
}
