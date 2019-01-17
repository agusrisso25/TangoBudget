/* Este bloque es uno de los más importantes. Tiene varias funcionalidades y actúa según el valor del flag
- Si flag=0: Calcula los dos puntos más altos
- Si flag=1: El usuario desea colocar objetos interferentes
- Si flag=2: Se actualiza el perfil de elevación en caso que se hayan movido los marcadores,
o si es la primera vez que se desea solicitar el perfil de elevación y data no está definido
- Si flag=3: El usuario desea deshacer la altura que modificó último
- Si flag=4: El usuario desea agregar altura a las antenas Tx y Rx

Finalmente, luego de todos los casos de uso, se actualiza la tabla y se calcula nuevamente si hay linea de vista
*/

function displayPathElevation(camino, elevator, dist) {
  var cant_muestras = dist * 100; // 100 muestras por km
  cant_redondeo = Math.floor(cant_muestras);
  console.log("Cantidad de muestras por km: " + cant_muestras);
  console.log("Redondeo de muestras: " + cant_redondeo);

  elevator.getElevationAlongPath({
    'path': camino,
    'samples': cant_redondeo
  }, plotElevation);
}

function plotElevation(elevations, status) {
  var chartDiv = document.getElementById('elevation_chart');
  if (status !== 'OK') {
    chartDiv.innerHTML = 'No se pudo calcular el perfil de elevación porque: ' + status;
    return;
  }

  if (!data || flag==2) { //Inicializa la variable global data solamente si no está inicializada o si los marcadores se movieron.
    data = new google.visualization.DataTable();
    chart = new google.visualization.ColumnChart(chartDiv);
    data.addColumn('string', 'Sample'); //en la primer columna se especifica el tipo de valor a almacenar. En este caso en la columna 0 se almacena una variable "Sample" y es de tipo string
    data.addColumn('number', 'Elevation'); //se almacena en la columna 1 valores del tipo number y corresponde a la elevación
    for (var i = 0; i < elevations.length; i++) {
      data.addRow(['', elevations[i].elevation]); //Acá empieza a recorrer el array
      if (data.getValue(i, 1) == 'undefined') {
        coordenadas[i] = NaN;
        altura[i] = NaN;
      }
      altura[i] = data.getValue(i, 1); // guardo en el array altura todas las alturas de elevation en orden
      coordenadas[i] = elevations[i].location;
    }
    flag=0;
  }
  if (flag == 0) {
    h_Pmax1=data.getDistinctValues(1)[elevations.length-1];
    h_Pmax2=data.getDistinctValues(1)[elevations.length-2];

    Pmax1=altura.indexOf(h_Pmax1);
    Pmax2=altura.indexOf(h_Pmax2);
  }
  else if (flag == 1) { //En caso que el flag sea 1, se modifica la altura
    var valuetomodify= (parseFloat(altura[muestra_mod[contador]]) + parseFloat(document.getElementById("alturaobjeto").value));
    var distanciaobject = document.getElementById("distanciaobjeto").value;
    muestra_mod[contador] = Math.floor(distanciaobject/10);

    //Si la muestra que se desea modificar está en el origen o destino, se alertará
    if (muestra_mod[contador]==0 || muestra_mod[contador]==(cant_redondeo-1)){
      alert("No se pueden colocar objetos interferentes en las antenas, corrija las distancias");
      return;
    }

    valuetomodify_array[contador]= parseFloat(document.getElementById("alturaobjeto").value);
    distanciaobject_array[contador]=parseFloat(document.getElementById("distanciaobjeto").value);
    data.setValue(muestra_mod[contador], 1, valuetomodify); //Se setea en data la información nueva

    objInterferente=document.getElementById("objetointerferente").value;

    if(!objInterferente){
      alert ("Ingrese un tipo de interferencia");
      flag=0;
      return;
    }
    else{
      if (objInterferente=="arbol")
        objInterferente='Arbol';
      else if (objInterferente=="edificio")
        objInterferente='Edificio';

    var despeje=Fresnel(document.getElementById("frecuencia").value,parseFloat(document.getElementById("alturaantenatx").value),parseFloat(document.getElementById("alturaantenarx").value)+altura[cant_redondeo-1],distanciaobject_array[contador],valuetomodify_array[contador]);
    if(despeje==1){
    //tengo que hacer bullington
    }

    resFresnel=(document.getElementById("frecuencia").value,parseFloat(document.getElementById("alturaantenatx").value)+altura[0],parseFloat(document.getElementById("alturaantenarx").value)+altura[cant_redondeo-1],distanciaobject_array[contador],valuetomodify_array[contador]);
    AgregarTabla(objInterferente,+resFresnel,+despeje);
    flag = 0;
    }
  }

  else if (flag==3){  //Cuando se desea deshacer la altura modificada
    data.setValue(muestra_mod[contador],1,altura[muestra_mod[contador]]); //Se modifica al valor anterior
    BorrarFila(); //Elimina de la tabla el ultimo valor modificado
    contador--; //y se decrementa el contador
    flag=0; //se resetea el flag en 0
  }
  else if (flag==4){ //Cuando se modifica la altura de las antenas
    data.setValue(0,1,parseFloat(document.getElementById("alturaantenatx").value)+altura[0]);
    data.setValue(cant_redondeo-1,1,parseFloat(document.getElementById("alturaantenarx").value)+altura[cant_redondeo-1]);
    altura[0]=altura[0]+parseFloat(document.getElementById("alturaantenatx").value);
    altura[cant_redondeo-1]= altura[cant_redondeo-1]+parseFloat(document.getElementById("alturaantenarx").value);
    flag=0;
  }

  chart.draw(data, {
    height: 200,
    legend: 'none',
    titleX: 'Cantidad de muestras',
    titleY: 'Elevation (m)'
  });

  hayLOS = LOS(elevations, coordenadas);
  if (hayLOS == 1) {
    document.getElementById("Ldevista").innerHTML = "¡Hay línea de vista!";
  }
  else if (hayLOS == 0)
    document.getElementById("Ldevista").innerHTML = "¡Cuidado! No hay línea de vista. Se sugiere aumentar las alturas de las antenas.";
}
