function ModifyHeight(){
  //var alturaobject= document.getElementById("alturaobjeto").value; //en metros
  distanciaobject= document.getElementById("distanciaobjeto").value; //en km
  var distancia = haversine(radius, latitud, longitud); //en km
  var cant_muestras = distancia*100; // 100 muestras por km o distancia en metros
  var cant_redondeo= Math.floor(cant_muestras);
  var elevator = new google.maps.ElevationService();

  //hay que agregar el replace por si el usuario ingresa una coma y va un punto

  if (0<distanciaobject<cant_muestras){
    flag=1; //seteo el flag en 1 para cuando llame la funcion displayPathElevation me modifique la altura
    muestra_mod=Math.floor(distanciaobject/10);
    console.log("muestra_mod: "+ muestra_mod);

    displayPathElevation(camino, elevator, distancia);
    var hayLOS = LOS(elevations, coordenadas);

    console.log("¿Hay LOS2?: ");
    if (hayLOS == 1)
      console.log("Si!");
    else if (hayLOS == 0)
      console.log("No!");
    else
      console.log("Indefinido");

    return;
  }
  else{
    alert ("distancia excede el largo del camino");
    return;
    }
}
