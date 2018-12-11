/* Este bloque tiene como funcionalidad ingresar objetos interferentes a lo largo del camino
NOTA: Se define que no se puede ingresar objetos interferentes sobre las antenas
ni se puede colocar objetos interferentes fuera del camino definido
*/

function ModifyHeight(){
  distanciaobject= document.getElementById("distanciaobjeto").value; //Distancia desde Tx al objeto interferente (En metros)
  distanciatotal=haversine(radius, latitud, longitud); //Largo del camino
  var cant_muestras = dist*100; // 100 muestras por km o distancia en metros
  var cant_redondeo= Math.floor(cant_muestras); //Cantidad de muestras consideradas

  if ((Math.floor(distanciaobject) ==0) || (Math.floor(distanciaobject) == (Math.floor(distanciatotal*100)))){ //Si el objeto interferente que se desea colocar está en las antenas, sale error
    alert ("No se pueden colocar objetos interferentes en las antenas");
  }
  //hay que agregar el replace por si el usuario ingresa una coma y va un punto
  else if (0<distanciaobject<(distanciatotal*100)){
    flag=1; //seteo el flag en 1 para cuando llame la funcion displayPathElevation me modifique la altura
    contador ++; //Incrementa el contador de la cantidad de objetos interferentes ingresados
    muestra_mod[contador]=Math.floor(distanciaobject/10); //muestra_mod es un array que contiene la información de la altura del objeto interferente
    displayPathElevation(camino, elevator, dist); //Se modifica la altura
  }
  else if(distanciaobject>=distanciatotal || distanciaobject<0) //Cuando se desea colocar un objeto interferente por fuera del largo del camino
    alert ("distancia excede el largo del camino");
  return;
}
