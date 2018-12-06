function ModifyHeight(){
  distanciaobject= document.getElementById("distanciaobjeto").value; //en metros
  distanciatotal=haversine(radius, latitud, longitud);
  var cant_muestras = dist*100; // 100 muestras por km o distancia en metros
  var cant_redondeo= Math.floor(cant_muestras);

  if ((Math.floor(distanciaobject) ==0) || (Math.floor(distanciaobject) == (Math.floor(distanciatotal*100)))){
    alert ("No se pueden colocar objetos interferentes en las antenas");
    //return;
  }
  //hay que agregar el replace por si el usuario ingresa una coma y va un punto
  else if (0<distanciaobject<(distanciatotal*100)){
    flag=1; //seteo el flag en 1 para cuando llame la funcion displayPathElevation me modifique la altura
    contador ++;
    muestra_mod[contador]=Math.floor(distanciaobject/10);
    displayPathElevation(camino, elevator, dist);
  }
  else if(distanciaobject>=distanciatotal)
    alert ("distancia excede el largo del camino");
  return;
}
