function ModifyHeight(){
  //var alturaobject= document.getElementById("alturaobjeto").value; //en metros
  distanciaobject= document.getElementById("distanciaobjeto").value; //en km
  var cant_muestras = dist*100; // 100 muestras por km o distancia en metros
  var cant_redondeo= Math.floor(cant_muestras);

  if (Math.floor(distanciaobject/10) ==0 || Math.floor(distanciaobject/10) == cant_redondeo){
    alert ("No se pueden colocar objetos interferentes en las antenas");
    return;
  }
  //hay que agregar el replace por si el usuario ingresa una coma y va un punto

  if (0<distanciaobject<cant_muestras){
    flag=1; //seteo el flag en 1 para cuando llame la funcion displayPathElevation me modifique la altura
    contador ++;

    muestra_mod[contador]=Math.floor(distanciaobject/10);
    displayPathElevation(camino, elevator, dist);
  }
  else{
    alert ("distancia excede el largo del camino");
    return;
    }
}
