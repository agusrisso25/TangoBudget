/* Este bloque es uno de los más importantes. Tiene varias funcionalidades y actúa según el valor del flag
- Si flag=0: Calcula los dos puntos más altos
- Si flag=1: El usuario desea colocar objetos interferentes
- Si flag=2: Se actualiza el perfil de elevación en caso que se hayan movido los marcadores,
o si es la primera vez que se desea solicitar el perfil de elevación y data no está definido
- Si flag=3: El usuario desea deshacer la altura que modificó último
- Si flag=4: El usuario desea agregar altura a las antenas Tx y Rx

Finalmente, luego de todos los casos de uso, se actualiza la tabla y se calcula nuevamente si hay linea de vista
*/

function avoidExecutionOverlap(fun) {
  var lock = false;
  return function () {
    if (!lock) {
      lock = true;
      try {
        fun.apply(this, arguments);
      } finally {
        lock = false;
      }
    }
  };
}

var displayPathElevation = avoidExecutionOverlap(
  function displayPathElevation(camino, elevator, dist) {
    if(dist>5)
      cant_redondeo=500;
    else{
      var cant_muestras = dist * 100; // 100 muestras por km
      cant_redondeo = Math.floor(cant_muestras);
    }

    elevator.getElevationAlongPath({
      'path': camino,
      'samples': cant_redondeo
    }, plotElevation);
  });

var plotElevation = avoidExecutionOverlap(function plotElevation(elevations, status) {
  chartDiv = document.getElementById('elevation_chart');
  if (status !== 'OK') {
    chartDiv.innerHTML = 'No se pudo calcular el perfil de elevación porque: ' + status;
    return;
  }

  var resultadoFresnel;
  if (!data || flag==2) { //Inicializa la variable global data solamente si no está inicializada o si los marcadores se movieron.
    if (flag==2){
      altura=[];
      altura2=[];
      hayDespejeCamino=[];
      getFreq(); //Se recalcula el fresnel del camino
      document.getElementById("alturaantenatx").value = "0"; //Habilita los campos nuevamente
      document.getElementById("alturaantenarx").value = "0";
      despeje=[]; //Se borra array de los despejes de los OI
      muestra_mod=[];

      document.getElementById("Ldevista").innerHTML = "";
      for(i=0;i<contador;i++) //Borro tabla de objetos interferentes
        BorrarFila();
    }

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
      var valoresreales=altura.filter(function(number) {
        return (number!=isNaN);
      });
      var infoPerdida=(valoresreales.length)/(altura.length); //Creo una variable que me declarará el % de pérdida de info
      if(infoPerdida<0.8){
        alert("Vuelva a recargar la página, hay pérdida de información en el perfil de elevación.");
        return;
      }
      altura[i] = data.getValue(i, 1); // guardo en el array altura todas las alturas de elevation en orden
      altura2[i]=altura[i];
      coordenadas[i] = elevations[i].location;
    }
    flag=0;
  }
  if (flag == 0) {
    //por ahora nada
  }
  else if (flag == 1) { //En caso que el flag sea 1, se modifica la altura
    var valuetomodify= (parseFloat(altura[muestra_mod[contador]]) + parseNumber(document.getElementById("alturaobjeto").value));
    var distanciaobject = document.getElementById("distanciaobjeto").value;

    valuetomodify_array[contador]= (parseFloat(altura[muestra_mod[contador]]) + parseFloat(document.getElementById("alturaobjeto").value));
    distanciaobject_array[contador]=parseFloat(document.getElementById("distanciaobjeto").value);
    resFresnel=Fresnel(distanciaobject_array[contador],valuetomodify);
    fresnelOI_array[contador]=resFresnel; //Guardo en el histórico el resultado del despeje de fresnel
    despeje[contador]= Fresnel(distanciaobject_array[contador],valuetomodify);

    if (despeje[contador]==1){
      var largoarray=(distanciaFresnel.length-1);
      distanciaFresnel[largoarray]=muestra_mod[contador];
      alturaFresnel[largoarray]=valuetomodify;
    }

    data.setValue(muestra_mod[contador], 1, valuetomodify); //Se setea en data la información nueva
    altura2[muestra_mod[contador]]=valuetomodify;
    contador++;
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
      else if(objInterferente=="Otro")
        objInterferente='Otro';

    AgregarTabla(objInterferente);
    flag = 0;
    }
  }

  else if (flag==3){  //Cuando se desea deshacer la altura modificada
    data.setValue(muestra_mod[contador-1],1,altura[muestra_mod[contador-1]]); //Se modifica al valor anterior
    altura2[muestra_mod[contador-1]]=altura[muestra_mod[contador-1]];
    BorrarFila(); //Elimina de la tabla el ultimo valor modificado

    var firstocurr=despeje.indexOf(fresnelOI_array[contador-1]);//delete (despeje[(fresnelOI_array[contador-1])]);
    despeje.splice(firstocurr,1);
    fresnelOI_array.pop(); //remueve el ultimo elemento del array
    valuetomodify_array.pop();
    distanciaobject_array.pop();
    contador--; //y se decrementa el contador
    flag=0;
  }
  else if (flag==4){ //Cuando se modifica la altura de las antenas
    if (!AlturaIni){
      AlturaIni=data.getValue(0,1);
      AlturaFin=data.getValue((altura.length-1),1);
    }
    data.setValue(0,1,parseFloat(document.getElementById("alturaantenatx").value)+AlturaIni);
    data.setValue(altura.length-1,1,parseFloat(document.getElementById("alturaantenarx").value)+AlturaFin);
    altura[0]=(AlturaIni+parseFloat(document.getElementById("alturaantenatx").value));
    altura[altura.length-1]= (AlturaFin+parseFloat(document.getElementById("alturaantenarx").value));
    altura2[0]=(AlturaIni+parseFloat(document.getElementById("alturaantenatx").value));
    altura2[altura.length-1]= (AlturaFin+parseFloat(document.getElementById("alturaantenarx").value));
    flag=0;
    if (Inputfreq){
      getFreq();
    }

  }

  chart.draw(data, {
    height: 200,
    legend: 'none',
    titleX: 'Cantidad de muestras',
    titleY: 'Elevación (m)'
  });

  if(!despeje || despeje.length==0){
    //luego debo saber en qué región de decisión está el despeje.
  	resultadoFresnel=hayDespejeCamino.sort();
  	if(resultadoFresnel[hayDespejeCamino.length-2]==0){
  		document.getElementById("Fresnel").innerHTML = "Se tiene un despeje mayor o igual al 60%";
  		fresnelGlobal=0;
  	}
  	else if(resultadoFresnel[hayDespejeCamino.length-2]==1){
  		document.getElementById("Fresnel").innerHTML = "Se tiene obstrucción entre el 40% y 60%";
  		fresnelGlobal=1;
  	}
  	else if(resultadoFresnel[hayDespejeCamino.length-2]==2){
  		document.getElementById("Fresnel").innerHTML = "No hay despeje de fresnel. El 40% se encuentra obstruido.";
  		fresnelGlobal=2;
  	}
  	else{
  		document.getElementById("Fresnel").innerHTML = " ";
      fresnelGlobal=-1;
  	}
  }
  else{
    resultadoFresnel=despeje.sort();
    if(resultadoFresnel[despeje.length-1]==0){
      fresnelGlobal=0;
      document.getElementById("Fresnel").innerHTML = "Se tiene un despeje mayor o igual al 60%";
    }
    else if (resultadoFresnel[despeje.length-1]==1){
      fresnelGlobal=1;
      document.getElementById("Fresnel").innerHTML = "Se tiene obstrucción entre el 40% y 60%";
    }
    else if(resultadoFresnel[despeje.length-1]==2){
      fresnelGlobal=2;
      document.getElementById("Fresnel").innerHTML = "No hay despeje de fresnel. El 40% se encuentra obstruido.";
    }
    else {
      document.getElementById("Fresnel").innerHTML = " ";
      fresnelGlobal=-1;
    }
  }

  hayLOS = LOS(elevations, coordenadas);
  if (hayLOS == 1) {
    document.getElementById("Ldevista").innerHTML = "¡Hay línea de vista!";
  } else if (hayLOS == 0) {
    document.getElementById("Ldevista").innerHTML = "¡Cuidado! No hay línea de vista. Se sugiere aumentar las alturas de las antenas.";
  }

  if (elevations.length !== altura.length) {
    console.log('elevations.length ('+ elevations.length +') !== altura.length ('+ altura.length +')!');//FIXME
  }
});
