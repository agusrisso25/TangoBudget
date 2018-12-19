/*! tangobudget - v0.0.1 - 2018-12-19 */// Add the marker at the clicked location, and add the next-available label from the array of alphabetical characters.
// Y se dibuja una linea entre cada marcador.
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
    if (etiqueta == "B") {
      //Si el marcador que muevo es el B
      path.pop(); //saco el ulimo elemento de path porque es el relacionado con B
      path.push(evt.latLng); // hago un push del nuevo lugar del marcador al array
      path = poly.getPath(); // dibujo la linea con las dos ubicaciones

      latitud[1] = marker.getPosition().lat();
      longitud[1] = marker.getPosition().lng();
    } else {
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
      // Create an ElevationService:
      var elevator = new google.maps.ElevationService();
      // Draw the path, using the Visualization API and the Elevation service:
      camino[0] = path.getAt(0);
      camino[1] = path.getAt(1);

      dist = haversine(radius, latitud, longitud);
      displayPathElevation(camino, elevator, dist); // OJO porque distl lo saco de showCoordenadas() !! no funciona
    }
  });

  marker.addListener("click", toggleBounce);

  if (markers.length == 2) {
    if(!elevator){
      // Create an ElevationService:
      elevator = new google.maps.ElevationService();
    }
    // Draw the path, using the Visualization API and the Elevation service:
    camino[0] = path.getAt(0);
    camino[1] = path.getAt(1);
    // Draw the path, using the Visualization API and the Elevation service:
    dist = haversine(radius, latitud, longitud);
    displayPathElevation(camino, elevator, dist);
  }
}

function Fresnel(freq,htx,hrx,Pmax,h_Pmax){
  var lambda;
	var c= 3*10^8;
	lambda = c/freq;
  var distancia = haversine(radius, latitud, longitud);
  tan_alpha=((htx-hrx)/distancia);
  alpha=Math.atan(tan_alpha); //Se halla el ángulo de inclinación de las antenas. En caso que estén a la misma altura el ángulo es cero
  var pto_medio=distancia/2; //Se halla el punto medio entre las antenas Tx y Rx
  var altura_puntomedio= altura[(cant_redondeo/2)];
  console.log("altura_puntomedio: " +altura_puntomedio);

  var d1=pto_medio/Math.cos(alpha); //Se halla d1= distancia desde Tx al punto medio
  var d2=pto_medio/Math.cos(alpha); // Se halla d2= distancia desde Rx al punto medio

  R1=Math.sqrt((lambda*d1*d2)/(d1+d2)); //Se halla el radio de la primera zona de fresnel, por definición

  var fresnel80= R1*0.8;
  var fresnel60= R1*0.6;
  var resultado80;
  var resultado60;

  if (Pmax==0){ //Si el objeto interferente está en la antena Tx
    resultado80=((Pmax*100)-pto_medio)^2/((fresnel80^2+d2^2) + (htx-altura_puntomedio)^2/(fresnel80^2));
    resultado60=((Pmax*100)-pto_medio)^2/((fresnel60^2+d2^2) + (htx-altura_puntomedio)^2/(fresnel60^2));
  }
  else if (Pmax==distancia){ //Si el objeto interferente está en la antena Rx
    resultado80=((Pmax*100)-pto_medio)^2/((fresnel80^2+d2^2) + (hrx-altura_puntomedio)^2/(fresnel80^2));
    resultado60=((Pmax*100)-pto_medio)^2/((fresnel60^2+d2^2) + (hrx-altura_puntomedio)^2/(fresnel60^2));
  }
  else{ //Si el objeto interferente está en el largo del camino y no en los extremos
    resultado80=((Pmax*100)-pto_medio)^2/((fresnel80^2+d2^2) + (h_Pmax-altura_puntomedio)^2/(fresnel80^2));
    resultado60=((Pmax*100)-pto_medio)^2/((fresnel60^2+d2^2) + (h_Pmax-altura_puntomedio)^2/(fresnel60^2));
  }

  if(resultado80>1)
    return 0; //Tengo despeje del 80%
  else if(resultado60>1 && resultado80<1)
    return 1; //Tengo despeje del 60%
  else
    return 2; //No tengo despeje de fresnel
}

function FSL(distancia,htx,hrx,freq) {
	var resultado;
	var lambda;
	var c= 3*10^8;
	lambda = c/freq;
	var freespaceloss=((4*Math.PI*distancia)/(lambda)); //Definición de pérdidas de espacio libre
	resultado= 20*(Math.log10(freespaceloss)); //El resultado esta en dB
	return (resultado);
}

function InputUser() {
    var Gtx=parseNumber(document.getElementById("gananciatx").value);
    var Grx=parseNumber(document.getElementById("gananciarx").value);
    var Ptx=parseNumber(document.getElementById("potenciatx").value);
    var freq=parseNumber(document.getElementById("frecuencia").value);
    var disp = parseNumber(document.getElementById("disponibilidad").value);
    var disp_canal=disp/100;

    var cant_muestras=dist*100;
    var cant_redondeo=Math.floor(cant_muestras);

    var htx=parseNumber(document.getElementById("alturaantenatx").value);
    var hrx=parseNumber(document.getElementById("alturaantenarx").value);
    var htx2= (parseFloat(htx)+parseFloat(altura[0])); //Se suma la altura inicial a la altura definida por el usuario
    var hrx2= (parseFloat(hrx)+parseFloat(altura[cant_redondeo-1]));

    var distancia = haversine(radius, latitud, longitud);
    var perdidasConectores=parseNumber(document.getElementById("perdidasconectores").value);
    var perdidasOtras=parseNumber(document.getElementById("otrasperdidas").value);
    var A=document.getElementById("FactorRugosidad").value;
    var B=0.25; //Dado que esto apunta a estudios enfocados en Uruguay, este valor no cambia bajo ningún concepto

    //Cálculos de algunas pérdidas
    var perdidasFSL = FSL(distancia,htx2,hrx2,freq); //Se calculan las pérdidas de espacio libre considerando la altura de las antenas con los postes incluidos
    var MargenFading = MF(distancia,A,B,freq,disp_canal); //Se calcula el margen de Fading por definición
    var Prx=Gtx+Grx+Ptx-perdidasConectores-perdidasFSL-perdidasOtras; //Se calcula la potencia de recepción
    var AnguloTilt=Tilt(distancia,htx2,hrx2); // Se calcula el ángulo del inclinación que deben tener las antenas para que tengan LOS

    console.log("La frecuencia ingresada es: " +freq);
    console.log("perdidasFSL: " +perdidasFSL);
    console.log("Prx es: " +Prx);
    console.log("El margen de fading es: "+MargenFading);
    console.log("La disponibildad del canal es: " +disp_canal);
    console.log("El valor de A es: "+A);
    console.log("El angulo del tilt es: " +AnguloTilt);

    //var sensRX=Prx-MargenFading;
    //var sensRXdeseada=parseFloat(document.getElementById("sensibilidadrx").value);

    //Se calcula si hay línea de vista
    if (hayLOS == 1){
      document.getElementById("Ldevista").innerHTML = "¡Hay línea de vista!";
      hayLOS=true;
    }
    else if (hayLOS == 0){
      hayLOS=false;
      document.getElementById("Ldevista").innerHTML = "¡Cuidado! No hay línea de vista. Se sugiere aumentar las alturas de las antenas.";
    }
    else
      return;

    //Se calcula si hay despeje de fresnel
    var hayDespeje1=Fresnel(freq,htx2,hrx2,Pmax1,h_Pmax1);
    var despeje80;
    var despeje60;
    if(hayDespeje1==0){ //Si hay despeje en el punto mas alto, entonces no calculo del segundo pmax
      console.log("Existe el despeje del 80%");
      despeje80=true;
      despeje60=true;
    }
    else if (hayDespeje1==1){ //El punto mas alto tiene un despeje 60%
      console.log("Existe el despeje del 60%");
      despeje80=false;
      despeje60=true;
    }
    else{
      console.log("No hay despeje de Fresnel");
      despeje80=false;
      despeje60=false;
    }
    //Se envían los resultados a la función Resultados, que permite desplegar una tabla
    Resultados(hayLOS,perdidasFSL,MargenFading,AnguloTilt,despeje80,despeje60);
    return;

}

var LOS = (function () {
  var chart2DrawCount = 0;

return function LOS(elevations,coordenadas) {
//El data2 se va a borrar mas adelante.
  var data2 = new google.visualization.DataTable();
  data2.addColumn('string', 'Muestras');
  data2.addColumn('number', 'Elevacion');
  data2.addRow(['TX',altura[0]]);
	for (var j = 1; j <(elevations.length-1); j++) {
    data2.addRow(['',altura[j]]);
		if(data2.getValue(j,1)=='undefined'){
      coordenadas [j]=0;
  		altura[j]=0;
	  }
  }
  data2.addRow(['RX',altura[elevations.length-1]]);
  var options = {
  	height: 200,
  	legend: { position: "none" },
  	titleY: 'Perfil de elevacion (m)',
    titleX: 'Muestras (m)',
    color: 'yellow',
  };
  if (chart2DrawCount === 0) {
    var chart2 = new google.visualization.ColumnChart(document.getElementById('elevation_chart2'));
    var view = new google.visualization.DataView(data2);
    view.setColumns([0, 1,
                     { calc: "stringify",
                       sourceColumn: 1,
                       type: "string",
                       role: "annotation" }]);

    chart2.draw(view, options);
    chart2DrawCount++;
  }

  var pend1;
  var pend2;
  var posic_Pmax2;
  var posic_Pmax= altura.indexOf(data.getDistinctValues(1).filter(function (v) {
      return !isNaN(v);
    })[elevations.length - 1]); //calculo la posicion del array del punto mas alto

  //CASO A: La posicion máxima es distinta al origen o al destino, calculo altura del punto maximo.
  if(posic_Pmax != 0 && posic_Pmax != elevations.length-1){
  	//caso 1: Pmax mayor a ambas antenas
  	console.log("Prueba: " + data.getDistinctValues(1)[elevations.length-1]);
  	var Pmax= data.getDistinctValues(1)[elevations.length-1].toFixed(3); //calculo altura maxima
    if (Pmax>altura[elevations.length-1].toFixed(3) && Pmax>altura[0].toFixed(3)){
  		return 0; //NO TENGO LOS: return 0
  }
  //caso 2: Pmax mayor a la antena Tx y menor a la Rx
  else if (altura[0].toFixed(3)<Pmax<altura[elevations.length-1].toFixed(3)){ //el punto mas alto es el de la posicion elevations.length
  	pend1= ((altura[elevations.length-1].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
  	pend2= (Pmax-altura[0].toFixed(3))/(posic_Pmax-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
  	if (pend1>=pend2){
			console.log("testA2");
  		return 1;} //TENGO LOS: return 1
  	else
  		return 0; //NO TENGO LOS: return 0
  	}
  //caso 3: Pmax mayor a la antena Rx y menor a la Tx
  else if (altura[elevations.length-1].toFixed(3)<Pmax<altura[0].toFixed(3)){ //el punto mas bajo es el de la posicion 0
  	pend1= ((altura[elevations.length-1].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
  	pend2= (Pmax-altura[0].toFixed(3))/(posic_Pmax-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
  	if (pend2<pend1){
			console.log("testA3");
  		return 1; }//TENGO LOS: return 1
  	else
  		return 0; //NO TENGO LOS: return 0
  }
  //caso 4: Pmax menor a ambas antenas
  else{
		console.log("testA4");
  	return 1; }//tengo LOS: return 1
  }

  //CASO B1: La posicion máxima es el origen o el destino
  else if(posic_Pmax == 0 || posic_Pmax == (elevations.length-1)){
		posic_Pmax2= altura.indexOf(data.getDistinctValues(1)[elevations.length-2]);

	  if(posic_Pmax2 == 0 || posic_Pmax2 == (elevations.length-1)){ //Si Pmax2 sigue siendo uno de los extremos...
			var Pmax3= data.getDistinctValues(1)[elevations.length-3].toFixed(1);
			var posic_Pmax3=altura.indexOf(data.getDistinctValues(1)[elevations.length-3]);
	    	//caso 1: Pmax3 mayor a ambas antenas
					if (Pmax3>altura[elevations.length-1].toFixed(3) && Pmax3>altura[0].toFixed(3)){
							return 0; //NO TENGO LOS: return 0
					}
				//caso 2: Pmax3 mayor a la antena Tx y menor a la Rx
					else if (altura[0].toFixed(3)<Pmax3<altura[elevations.length-1].toFixed(3)){ //el punto mas alto es el de la posicion elevations.length
							pend1= ((altura[elevations.length-2].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
							pend2= (Pmax3-altura[0].toFixed(3))/(posic_Pmax3-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
							if (pend1>=pend2){
								console.log("testB2");
									return 1; }//TENGO LOS: return 1
							else
									return 0; //NO TENGO LOS: return 0
							}//cierro caso 2 Pmx3
				//caso 3: Pmax mayor a la antena Rx y menor a la Tx
				else if (altura[elevations.length-1].toFixed(3)<Pmax3<altura[0].toFixed(3)){ //el punto mas bajo es el de la posicion 0
						pend1= ((altura[elevations.length-1].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
						pend2= (Pmax3-altura[0].toFixed(3))/(posic_Pmax3-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
						if (pend2<pend1){
								console.log("testB3");
								return 1;} //TENGO LOS: return 1
						else
								return 0; //NO TENGO LOS: return 0
				}
				//caso 4: Pmax3 menor a ambas antenas
				else{
					console.log("testB4");
					return 1;} //tengo LOS: return 1
     }

 //CASO B2: Si Pmax 2 es la maxima altura en mi path... y no es extremo
else {
			//caso 1: Pmax2 mayor a ambas antenas
			var Pmax2 = data.getDistinctValues(1)[elevations.length-2].toFixed(1); //nos da el valor de altura mas alto
			if (Pmax2 > altura[elevations.length-1].toFixed(3) && Pmax2>altura[0].toFixed(3)){
				return 0; //NO TENGO LOS: return 0
			}
			//caso 2: Pmax2 mayor a la antena Tx y menor a la Rx
			else if (altura[0].toFixed(3)<Pmax2<altura[elevations.length-1].toFixed(3)){ //el punto mas alto es el de la posicion elevations.length
				pend1= ((altura[elevations.length-1].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
				pend2= (Pmax2-altura[0].toFixed(3))/(posic_Pmax2-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
					if (pend1>=pend2){
						console.log("testB22");
						return 1; }//TENGO LOS: return 1
					else
						return 0; //NO TENGO LOS: return 0
			}

			//caso 3: Pmax2 mayor a la antena Rx y menor a la Tx
			else if (altura[elevations.length-1].toFixed(1)<Pmax2<altura[0].toFixed(1)){ //el punto mas bajo es el de la posicion 0
				pend1= ((altura[elevations.length-1].toFixed(1)-altura[0].toFixed(1))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
				pend2= (Pmax2-altura[0].toFixed(1))/(posic_Pmax2-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
				if (pend2<pend1){
					console.log("testB23");
					return 1; }//TENGO LOS: return 1
				else
					return 0; //NO TENGO LOS: return 0
			}
			//caso 4: Pmax2 menor a ambas antenas
				else{
					console.log("testB24");
					return 1; }//tengo LOS: return 1
				}
}};
})();

function MF(distancia,A,B,freq,disp_canal) {
	var margen_fading;
	var valueA;
	if(A=="1") //Se analiza lo ingresado por el usuario y a raiz de eso, se ingresa en la ecuación del margen de fading
		valueA=4;
	else if(A=="2")
		valueA=1;
	else
		valueA=0.25;

	margen_fading= 30*(Math.log10(distancia))+10*(Math.log10(6*valueA*B*freq))-10*(Math.log10(1-disp_canal))-70;
	return margen_fading;
}

function ModifyHeight(){
  distanciaobject= parseNumber(document.getElementById("distanciaobjeto").value); //Distancia desde Tx al objeto interferente (En metros)
  distanciatotal=(haversine(radius, latitud, longitud)*1000); //Largo del camino (en metros)
  var cant_muestras = dist*100; // 100 muestras por km o distancia en metros
  var cant_redondeo= Math.floor(cant_muestras); //Cantidad de muestras consideradas

  if ((Math.floor(distanciaobject) ==0) || (Math.floor(distanciaobject) == (cant_redondeo-1))){ //Si el objeto interferente que se desea colocar está en las antenas, sale error
    alert ("No se pueden colocar objetos interferentes en las antenas");
  }
  //hay que agregar el replace por si el usuario ingresa una coma y va un punto
  else if (0 < distanciaobject && distanciaobject < distanciatotal && parseInt(document.getElementById("objetointerferente").value)!=null){
    flag=1; //seteo el flag en 1 para cuando llame la funcion displayPathElevation me modifique la altura
    contador ++; //Incrementa el contador de la cantidad de objetos interferentes ingresados
    muestra_mod[contador]=Math.floor(distanciaobject/10); //muestra_mod es un array que contiene la información de la altura del objeto interferente
    displayPathElevation(camino, elevator, dist); //Se modifica la altura
  }
  else //if(distanciaobject>distanciatotal || distanciaobject<0) //Cuando se desea colocar un objeto interferente por fuera del largo del camino
    alert ("distancia excede el largo del camino");
  return;
}

function ModifyRxTx() {
	var htx= parseNumber(document.getElementById("alturaantenatx").value);
	var hrx= parseNumber(document.getElementById("alturaantenarx").value);
	if(htx<=0 || hrx<=0){ //Si el usuario no ingresa un valor correcto, despliega error
		alert("Altura incorrecta, intente de nuevo");
		return;
	}
	flag=4;
	displayPathElevation(camino,elevator,dist);
	//deshabilita los campos despues de modificado su valor
	document.getElementById("alturaantenarx").disabled = true;
	document.getElementById("alturaantenatx").disabled = true;
	return;
}

function Resultados(hayLOS,perdidasFSL,MargenFading,AnguloTilt,despeje80,despeje60){
	google.charts.load('current', {'packages':['table']});
	google.charts.setOnLoadCallback(ResultTable);

	function ResultTable() {
		if(!data_resultados){
			data_resultados = new google.visualization.DataTable();
			data_resultados.addColumn('boolean','Hay linea de vista?');
			data_resultados.addColumn('number', 'Perdidas de espacio libre (dB)');
			data_resultados.addColumn('number', 'Margen de Fading (dB)');
			data_resultados.addColumn('number', 'Angulo de Tilt');
			data_resultados.addColumn('boolean', 'Despeje 80%?');
			data_resultados.addColumn('boolean', 'Despeje 60%?');

			tableRes = new google.visualization.Table(document.getElementById('result_table'));
		}
		data_resultados.addRow([hayLOS,+perdidasFSL,+MargenFading,+AnguloTilt ,despeje80 ,despeje60]); //Acá empieza a recorrer el array
		tableRes.draw(data_resultados, {showRowNumber: false, width: '100%', height: '100%'});
	}
}

function AgregarTabla(objInterferente,resFresnel){
	google.charts.load('current', {'packages':['table']});
	google.charts.setOnLoadCallback(drawTable);

	function drawTable() {
		if(!data_detabla){
			data_detabla = new google.visualization.DataTable();
			data_detabla.addColumn('string', 'Tipo');
			data_detabla.addColumn('number', 'Distancia desde el Tx (m)');
			data_detabla.addColumn('number', 'Altura (m)');
			data_detabla.addColumn('boolean', 'Despeje 80%?');
			data_detabla.addColumn('boolean', 'Despeje 60%?');
			data_detabla.addColumn('number', 'Muestra Modificada');

			table = new google.visualization.Table(document.getElementById('table_div'));
		}

		var resultado80;
		var resultado60;

		if(resFresnel==0){
			resultado80=true;
			resultado60=true;
		}
		else if(resFresnel==1){
			resultado80=false;
			resultado60=true;
		}
		else {
			resultado80=false;
			resultado60=false;
		}

		data_detabla.addRow([objInterferente,+parseFloat(document.getElementById("distanciaobjeto").value),+parseFloat(document.getElementById("alturaobjeto").value),resultado80 ,resultado60 ,+muestra_mod[contador]]); //Acá empieza a recorrer el array
		table.draw(data_detabla, {showRowNumber: true, width: '100%', height: '100%'});
		document.getElementById("alturaobjeto").value = "";
    document.getElementById("distanciaobjeto").value = "";
	}
}

function BorrarFila(){
	data_detabla.removeRow(contador-1); //Acá empieza a recorrer el array
	table.draw(data_detabla, {showRowNumber: true, width: '100%', height: '100%'});
	}

function Tilt(distancia,htx,hrx) {
	var resultado;
	resultado=toDegrees(Math.atan((htx-hrx)/(distancia)));
	return resultado;
}

function DeshacerAltura() {
	if(contador>=0){
		flag=3;
		displayPathElevation(camino, elevator, dist);
		return;
	}
	else {
		alert("Ya se deshicieron todos los cambios.");
		return;
	}
}

//Aca debo de calcular las distancias a la posicion 0 y 255 desde el punto más alto != a los extremos:

function DistanceToBorders (coordenadas, posic_Pmax){
    lat[0] = coordenadas[posic_Pmax].lat(); // Coordenadas del punto más alto != a TX o RX
    lng[0] = coordenadas[posic_Pmax].lng();
    lat[1]= coordenadas[255].lat();
    lng[1]=coordenadas[255].lng();

    var distanciaRX = haversine(radius, lat, lng);
    console.log("Distancia a RX" + distanciaRX.toFixed(6) + " km");

    lat[1]= coordenadas[0].lat();
    lng[1]=coordenadas[0].lng();

    var distanciaTX = haversine(radius, lat, lng); // no se si puede llamar asi nomas, capaz se sobre escribe
    console.log("Distancia a TX" + distanciaRX.toFixed(6) + " km");
}
//Make the DIV element draggagle:
dragElement(document.getElementById("Boton"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "Header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
function displayPathElevation(camino, elevator, dist) {
  var cant_muestras = dist * 100; // 100 muestras por km
  cant_redondeo = Math.floor(cant_muestras);
  console.log("Cantidad de muestras por km: " + cant_muestras);
  console.log("Redondeo de muestras: " + cant_redondeo);

  // Create a PathElevationRequest object using this array.
  // Initiate the path request.
  elevator.getElevationAlongPath({
    'path': camino,
    'samples': cant_redondeo
  }, plotElevation);
}

// Takes an array of ElevationResult objects, draws the path on the map
// and plots the elevation profile on a Visualization API ColumnChart.
function plotElevation(elevations, status) {
  var chartDiv = document.getElementById('elevation_chart');
  if (status !== 'OK') {
    // Show the error code inside the chartDiv.
    chartDiv.innerHTML = 'Cannot show elevation: request failed because ' + status;
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
  else if (flag == 1) {//En caso que el flag sea 1, se modifica la altura
    var valuetomodify= (parseFloat(altura[muestra_mod[contador]]) + parseFloat(document.getElementById("alturaobjeto").value));
    var distanciaobject = document.getElementById("distanciaobjeto").value;
    muestra_mod[contador] = Math.floor(distanciaobject/10);

    if (muestra_mod[contador]==0 || muestra_mod[contador]==(cant_redondeo-1)){
      alert("No se pueden colocar objetos interferentes en las antenas, corrija las distancias");
      return;
    }

    valuetomodify_array[contador]= parseFloat(document.getElementById("alturaobjeto").value);
    distanciaobject_array[contador]=parseFloat(document.getElementById("distanciaobjeto").value);
    data.setValue(muestra_mod[contador], 1, valuetomodify);

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

      resFresnel=(document.getElementById("frecuencia").value,parseFloat(document.getElementById("alturaantenatx").value)+altura[0],parseFloat(document.getElementById("alturaantenarx").value)+altura[cant_redondeo-1],distanciaobject_array[contador],valuetomodify_array[contador]);
      AgregarTabla(objInterferente,+resFresnel);
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

function showCoordenadas(latitud, longitud) {
  for (var i = 0; i < markers.length; i++) {
    //document.getElementById('result1').innerHTML= "Latitud: " + latitud[0] + ", "+ "Longitud: " + longitud[0];
    document.getElementById("transmisor").value =
      latitud[0] + ", " + longitud[0];
    //document.getElementById('result2').innerHTML= "Latitud: " + latitud[1] + ", "+ "Longitud: " + longitud[1];
    document.getElementById("receptor").value = latitud[1] + ", " + longitud[1];
  }

  if (latitud[0] !== 0 && latitud[1] !== 0) {
    var distancia_perfil = haversine(radius, latitud, longitud); // guardo en distancia el resultado de la funcion haversine
    document.getElementById("result3").innerHTML = distancia_perfil.toFixed(6) + " km"; // imprimo la distancia entre dos puntos
  }
}

function deleteMarkersAndPath() {
    markers[0].setMap(null); //elimino el marcador A
    markers[1].setMap(null); //elimino el marcador B
    //Vacío todos los arrays:
    markers = [];
    latitud = [];
    longitud = [];
    camino = []; // NO se borra la elevacion
    elevator = [];
    elevations=[];
    altura = [];
    data=0;
    contador=0;

    path = poly.setPath([]);  // ELIMINA la poly
    document.getElementById('transmisor').value = "";
    document.getElementById('receptor').value = "";
    document.getElementById('result3').innerHTML="";
    document.getElementById("Ldevista").innerHTML= "";

    document.getElementById('elevation_chart').innerHTML="";
    document.getElementById('elevation_chart2').innerHTML="";
}

// Los marcadores aparecen cuando el usuario hace click en el mapa:
// Cada marcador se etiqueta con un letra alfabetica.
var labels = "TR";
var labelIndex = 0;
var markers = []; // Los marcadores se almacenan en un array.
var latitud = []; //las latitudes se almacenan en un array
var longitud = []; //las longitudes se almacenan en un array
var radius = 6371; // radio de la tierra
var camino = [];
var altura = []; //Array que tiene toda la información del perfil de elevación y sin errores
var coordenadas = [];
var posic_puntoMax=0;
var valor_puntoMax=0;
var flag=0; //defino este flag para testear caso de uso en displayPathElevation
var muestra_mod=[]; // Nos indica cual es el valor de la muestra que hay que modificar en ModifyHeight
var data; //Información almacenada sobre el perfil de elevación
var chart;
var distanciaobject_array=[]; // Nos indica la distancia desde el TX que queremos modificar
var contador=0; //cuenta la cantidad de objetos interferentes agregados
var elevator;
var dist;
var cant_redondeo; //Cuenta la cantidad de muestras que tiene nuestro perfil de elevación
var Pmax1; //Esta variable corresponde al punto mas alto
var h_Pmax1; //Esta variable corresponde a la altura del punto mas alto
var valuetomodify_array= [];
var elevations;
var data_detabla;
var data_resultados;
var table;
var tableRes;
var hayLOS;
//var objInterferente;
var resFresnel;
var APP = { };
APP.objInterferente = null;
APP.prueba = [];

// Load the Visualization API and the columnchart package:
google.load("visualization", "1", { packages: ["columnchart"] });
// Inicializo el mapa centrado en un lugar de Montevideo y con su zoom correspondiente
function initMap() {
  var uluru = { lat: -34.916467, lng: -56.154272 };
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: uluru
  });

 // var geocoder = new google.maps.Geocoder();// creo que no la usamos para nada
  //var infowindow = new google.maps.InfoWindow;
  // Evento que escucha el click y llama a la funcion addMarkersAndAll() cuando sucede.
  google.maps.event.addListener(map, "click", function(event) {
    if (markers.length <= 1)
      //Limito a 2 marcadores maximo.
      addMarkersAndAll(event.latLng, map);
  });

  poly = new google.maps.Polyline({
    strokeColor: "#000000",
    strokeOpacity: 1.0,
    strokeWeight: 3
  });
}

        //Funcion para el cálculo de distancia entre dos puntos:
        function haversine(radius, latitud, longitud) {
          
          var lat1 = ToRadians(latitud[0]);
          var long1 = ToRadians(longitud[0]);
          var lat2 = ToRadians(latitud[1]);
          var long2 = ToRadians(longitud[1]);

          var DistanceLat = lat1 - lat2;
          var DistanceLong = long1 - long2;
          var sinLat = Math.sin(DistanceLat/2.0);
          var sinLong = Math.sin(DistanceLong/2.0);
          var a = Math.pow(sinLat, 2.0)+Math.cos(lat1)*Math.cos(lat2)*Math.pow(sinLong,2.0);
          var distance = radius*2*Math.asin(Math.min(1, Math.sqrt(a)));  
          return distance;

        }
function toggleBounce(){
          marker.setAnimation(google.maps.Animation.BOUNCE);//rebora marcador la primera vez que se ingresa en el mapa
          // Si da el tiempo, ver como hacer que robote cada vez que se hace click en el marcador (sin arrastrar)
        }
function printPDF(){
  var doc = new jsPDF();

//Titulo del Reporte
//  doc.setFontSize(30);
 // doc.text (50, 50, 'Tango Budget'); // se indica la locacion del texto en el formato de coordenadas (x,y)

/*var elementHandler = {
  '#ignorePDF': function (element, renderer){
    return true;
  }
};
//var source = window.document.getElementsByTagName("body")[0];
 var source = window.document.getElementById("panel-total")[0];
doc.fromHTML(
  source,
  15,
  15,
  {
    'width': 180, 'elementHandlers': elementHandler
  });
*/

  doc.fromHTML($('#panel-total').get(0), 20, 20, {
    'width': 500});

  doc.save('Reporte.pdf');
}
// Convert from radians to degrees.
function toDegrees(radians){
	return ((radians * 180) / Math.PI);
}
function parseNumber(numberString){
  var reMatch = /^[+-]?(\d+)(?:[,.](\d+))?$/.exec(numberString);
  if (!reMatch) {
    return NaN;
  } else if (!reMatch[2]) {
    return +reMatch[1];
  } else {
    return +(reMatch[1] +'.'+ reMatch[2]);
  }
}

//Funcion para grados a radianes (necesaria para el calculo de distancia):
function ToRadians(degree) {
  return (degree * (Math.PI / 180));
}
