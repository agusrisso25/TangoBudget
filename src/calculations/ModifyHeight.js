function ModifyHeight(){
  //var alturaobject= document.getElementById("alturaobjeto").value; //en metros
  distanciaobject= document.getElementById("distanciaobjeto").value; //en km
  var cant_muestras = dist*100; // 100 muestras por km o distancia en metros
  var cant_redondeo= Math.floor(cant_muestras);
  //var elevator = new google.maps.ElevationService();

  //hay que agregar el replace por si el usuario ingresa una coma y va un punto

  if (0<distanciaobject<cant_muestras){
    flag=1; //seteo el flag en 1 para cuando llame la funcion displayPathElevation me modifique la altura
    contador ++;
    muestra_mod[contador]=Math.floor(distanciaobject/10);
    console.log("muestra_mod: "+ muestra_mod[contador]);
    displayPathElevation(camino, elevator, dist);

    var hayLOS = LOS(elevations, coordenadas);
    if (hayLOS == 1)
      document.getElementById("Ldevista").innerHTML = "Si!";
    else if (hayLOS == 0)
      document.getElementById("Ldevista").innerHTML = "No!";
    else
      document.getElementById("Ldevista").innerHTML = "Indefinido";

    return;
  }
  else{
    alert ("distancia excede el largo del camino");
    return;
    }
}

function drawTable(){
  var data_detabla = new google.visualization.DataTable();
        data_detabla.addColumn('string', 'Tipo');
        data_detabla.addColumn('string', 'Distancia desde el Tx (m)');
        data_detabla.addColumn('string', 'Altura (m)');
        data_detabla.addColumn('boolean', 'Despeje 80%?');
        data_detabla.addColumn('boolean', 'Despeje 60%?');
        data_detabla.addColumn('string', 'Muestra Modificada');
        for (var i = 1; i < (contador+1); i++) {
          data_detabla.addRow(['Arbol', distanciaobject[contador].value,valuetomodify_array[contador].value,true ,true ,'muestra_mod[contador]']); //Acá empieza a recorrer el array
        }
  var table = new google.visualization.Table(document.getElementById('table_div'));
  table.draw(data_detabla, {showRowNumber: true, width: '100%', height: '100%'});

}
