function ModifyHeight(){
  var alturaobject= document.getElementById("alturaobjeto").value;
  var distanciaobject= document.getElementById("distanciaobjeto").value;
  var distancia = haversine(radius, latitud, longitud);
  var cant_muestras = distancia*100; // 100 muestras por km
  var cant_redondeo= Math.floor(cant_muestras);
  chart = new google.visualization.ColumnChart(chartDiv);
  data = new google.visualization.DataTable();

  if(0<distanciaobject<distancia){
    for (j=0;j<=cant_redondeo;j++){
      for (i=0;i<=distanciaobject<i+10;i=i+10){
        data.setValue(j, 1, altura[j]+alturaobject);//var aumentar= (altura[0]+10)
        chart.draw(data, {
        height: 200,
        legend: 'none',
        titleX: 'Cantidad de muestras',
        titleY: 'Elevation (m)'
      });
      }
    }
    alert ("Altura modificada correctamente.");
  }
  else
    alert ("Distancia seleccionada excede el largo del camino.");
}
