/*! tangobudget - v0.0.1 - 2019-01-15 */// Add the marker at the clicked location, and add the next-available label from the array of alphabetical characters.
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

function Bullington(htx2,hrx2,distancia) {
		var X1;
		var Y1;
		var X2;
		var Y2;
		var pend1;
		var pend2;
		var cte1;
		var cte2;
		var ctemayorPendRx;
		var ctemayorPendTx;
		var mayorPendTx=0;
		var mayorPendRx=0;
		//calculo las pendientes que generan entre un 40% y 60% de Despeje con la antena Tx
		for(i=0;i<distanciaFresnel.length;i++){
			Y1=((-htx2+alturaFresnel[i])/distanciaFresnel[i])*X1+htx2;
			pend1=((-htx2+alturaFresnel[i])/distanciaFresnel[i]);
			cte1=htx2;
			if (mayorPendTx<pend1)
				mayorPendTx=pend1;
				ctemayorPendTx=cte1;
		}
		for(j=0;j<distanciaFresnel.length;j++){
			Y2=((alturaFresnel[i]-htx2)/(distanciaFresnel[i]-distancia))*X2+((distanciaFresnel[i]*hrx2-distancia*alturaFresnel[i])/(distanciaFresnel[i]-alturaFresnel[i]));
			pend2=((alturaFresnel[i]-htx2)/(distanciaFresnel[i]-distancia));
			cte2=((distanciaFresnel[i]*hrx2-distancia*alturaFresnel[i])/(distanciaFresnel[i]-alturaFresnel[i]));
			if(Math.abs(mayorPendRx)<Math.abs(pend2))
				mayorPendRx=pend2;
				ctemayorPendRx=cte2;
		}
		//Para la intersección de las dos rectas finales,
		OIficticio=((ctemayorPendTx-ctemayorPendRx)/(mayorPendTx-mayorPendRx));
		h_OIficticio=mayorPendTx*OIficticio+htx2;
		return(OIficticio);
}

function DispCanal(distancia,freq,MargenFading) {
	var disp_canal;
	var valueA;
	var valueB;

	var A = document.getElementById("FactorRugosidad").value;
	var B = document.getElementById("FactorClima").value;
	
	var arrayA= [0, 4, 1, 1/4];
	var arrayB= [0, 1, 0.5, 0.25, 0.125];

	if (A == "0"){
		alert("Favor de completar el factor de rugosidad.");
		return;
	}
	else {
		valueA = arrayA [A];
	}
		
	if (B == "0"){
		alert("Favor de completar el Factor Clima.");
		return;
	}
	else {
		valueB = arrayB [B];
	}

	disp_canal = 1-((Math.pow(distancia,3)*6*valueA*valueB*freq)/(Math.pow(10,7+MargenFading/10)));
	return disp_canal;
}

function Fresnel(freq,htx,hrx,Pmax,h_Pmax){
  var lambda;
	var c= 3*10^8;
	lambda = c/freq;
  var distancia = haversine(radius, latitud, longitud);
  tan_alpha = (htx-hrx)/distancia;
  alpha = Math.atan(tan_alpha); //Se halla el ángulo de inclinación entre las dos antenas. En caso que estén a la misma altura el ángulo es cero
  var pto_medio=distancia/2; //Se halla el punto medio entre las antenas Tx y Rx
  var altura_puntomedio = altura[(cant_redondeo/2)];
  console.log("altura_puntomedio: " +altura_puntomedio);

  var d1=Math.abs(pto_medio/Math.cos(alpha)); //Se halla d1= distancia desde Tx al punto medio
  var d2=Math.abs(pto_medio/Math.cos(alpha)); // Se halla d2= distancia desde Rx al punto medio

  R1=Math.sqrt((lambda*d1*d2)/(d1+d2)); //Se halla el radio de la primera zona de fresnel, por definición

  var fresnel60= R1*0.6;
  var fresnel40= R1*0.4;
  var resultado60;
  var resultado40;

  if (Pmax==0){ //Si el objeto interferente está en la antena Tx
    resultado60=((Pmax*100)-pto_medio)^2/((fresnel60^2+d2^2) + (htx-altura_puntomedio)^2/(fresnel60^2));
    resultado40=((Pmax*100)-pto_medio)^2/((fresnel40^2+d2^2) + (htx-altura_puntomedio)^2/(fresnel40^2));
  }
      else if (Pmax==distancia){ //Si el objeto interferente está en la antena Rx
        resultado60=((Pmax*100)-pto_medio)^2/((fresnel60^2+d2^2) + (hrx-altura_puntomedio)^2/(fresnel60^2));
        resultado40=((Pmax*100)-pto_medio)^2/((fresnel40^2+d2^2) + (hrx-altura_puntomedio)^2/(fresnel40^2));
      }
      else{ //Si el objeto interferente está en el largo del camino y no en los extremos
        resultado60=((Pmax*100)-pto_medio)^2/((fresnel60^2+d2^2) + (h_Pmax-altura_puntomedio)^2/(fresnel60^2));
        resultado40=((Pmax*100)-pto_medio)^2/((fresnel40^2+d2^2) + (h_Pmax-altura_puntomedio)^2/(fresnel40^2));
      }

  if(resultado60>1)
    return 0; //Tengo despeje del 60%
      else if(resultado40>1 && resultado60<1)
        return 1; //Tengo despeje del 40% --> Aca tendriamos que hacer Bullington
      else
        return 2; 
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
    //var disp = parseNumber(document.getElementById("disponibilidad").value);
    //var disp_canal=disp/100;
    var MargenFading;
    var disp_canal;

    var cant_muestras=dist*100;
    var cant_redondeo=Math.floor(cant_muestras);

    var htx=parseNumber(document.getElementById("alturaantenatx").value);
    var hrx=parseNumber(document.getElementById("alturaantenarx").value);
    var htx2= (parseFloat(htx)+parseFloat(altura[0])); //Se suma la altura inicial a la altura definida por el usuario
    var hrx2= (parseFloat(hrx)+parseFloat(altura[cant_redondeo-1]));

    var distancia = haversine(radius, latitud, longitud);
    var perdidasConectores= parseNumber(document.getElementById("perdidasconectores").value);
    var perdidasOtras=parseNumber(document.getElementById("otrasperdidas").value);
    
    //Cálculos de algunas pérdidas
    var perdidasFSL = FSL(distancia,htx2,hrx2,freq); //Se calculan las pérdidas de espacio libre considerando la altura de las antenas con los postes incluidos
    var perdidasLluvia=AtenuacionLluvia();
    var Prx=Gtx+Grx+Ptx-perdidasConectores-perdidasFSL-perdidasOtras-perdidasLluvia; //Se calcula la potencia de recepción
    var AnguloTilt=Tilt(distancia,htx2,hrx2); // Se calcula el ángulo del inclinación que deben tener las antenas para que tengan LOS

    console.log("La frecuencia ingresada es: " +freq);
    console.log("perdidasFSL: " +perdidasFSL);
    console.log("Prx es: " +Prx);
    console.log("El angulo del tilt es: " +AnguloTilt);
    console.log("AtenuacionLluvia: " +AttRain);

    var despeje60;
    var despeje40;

    //Se calcula si hay despeje de fresnel a lo largo del camino
  	var j=0;
  	for (i=0;i<altura.length; i++){
  		hayDespejeCamino[i]=Fresnel(freq,htx2,hrx2,i,altura[i]);
      //En caso que tenga un objeto interferente entre 60% y 40% necesito guardar la muestra y la altura del camino para pérdidas por Difracción
      if (hayDespejeCamino[i] == 1){
  			distanciaFresnel [j]= i; 
  			alturaFresnel [j]= altura[i];
  			j++;
  		}
    }
    
    //luego debo saber en qué región de decisión está el despeje.
    var resultadoFresnel60=hayDespejeCamino.filter(function(number) {
      return (number=0);
    }); //filtro todos los valores cero

    var resultadoFresnel40=resultadoFresnel60.filter(function(number) {
      return (number=1);
    }); //filtro todos los valores uno

    if(resultadoFresnel60.length==0){ //Significa que tengo despeje del 60%
      console.log("Existe un despeje del 60% de Fresnel.");
      despeje60=true;
      despeje40=true;
    }
    else if(resultadoFresnel40.length==0){
      console.log("Existe el despeje entre el 40% y 60% del Fresnel.");
		  despeje60=false;
		  despeje40=true;
      //Bullington(htx2,hrx2,distancia);
    }
    else{
		  console.log("No hay despeje de Fresnel.");
		  despeje60=false;
		  despeje40=false;
		}

    var sensRX=parseFloat(document.getElementById("sensibilidadrx").value);
    if(!sensRx){
      alert("El campo de sensibilidad de recepción no puede quedar vacío.");
    }
    if(sensRX>=0){
      alert("La sensibilidad debe ser menor a cero");
      return;
    }
    if(Prx>sensRX){
      MargenFading=(Prx-sensRX);
      if(MargenFading>=30){
        disp_canal=DispCanal(distancia,freq,MargenFading);
        if(disp_canal>=0.99998)
          console.log("Enlace aceptable");
          //hay que seguir esta parte
        else
          alert("Se debe mejorar la altura de las antenas o el perfil.");
        return;
      }
      else {
        alert("Se debe mejorar la altura de las antenas o el perfil.");
        return;
      }
    }
    else{
      alert("Se debe mejorar la altura de las antenas o el perfil.");
      return;
    }

    //Se analiza la linea de vista para pasar a la tabla de resultados
    if (hayLOS == 1){
      hayLOS=true;
    }
    else if (hayLOS == 0){
      hayLOS=false;
    }
    else
      return;
    //Se envían los resultados a la función Resultados, que permite desplegar una tabla
    Resultados(hayLOS,perdidasFSL,disp_canal,AnguloTilt,despeje60,despeje40);
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

function AtenuacionLluvia() {
	var freq=parseNumber(document.getElementById("frecuencia").value); //En caso que el usuario ingrese una coma, se pasa a punto
	var pol=parseNumber(document.getElementById("polarizacion").value);
	var R;
	var frecu;
	var distancia=haversine(radius, latitud, longitud);

	if(!freq){
		alert ("Ingrese una frecuencia");
		return;
	}

	var arrayfrec= [1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,
									30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,
									62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,
									94,95,96,97,98,99,100,120,150,200,300,400,500,600,700,800,900,1000];

	var indice= arrayfrec.indexOf(freq);
	if(indice== -1){
		var i=0;
		while (freq<=arrayfrec[i]){ // redondeo para abajo
			i++;
		}
		frecu = arrayfrec[i];
		alert("Se aproximó dicho valor a" + frecu + "GHz para calcular la atenuación por lluvia.");
		indice=i;
	}

	var R0 = [0, 8, 12, 15, 19, 22, 28, 30, 32, 35, 42, 60, 63, 95, 145, 115];
	var letra = [X, A, B, C, D, E, F, G, H, J, K, L, M, N, P, Q];

	var R2 = document.getElementById("ZonaHidrometeorologica").value;
	var u = letra.indexOf(R2);

	if (u == -1){
		alert("Por favor ingresar el zona hidrometeorológica para el cálculo de lluvia.");}
	else {
		R = R0[u];
	}

	var matrizkH=[0.0000259,	0.0000443,	0.0000847,	0.000132,	0.000139,	0.000116,	0.000107,	0.000134,	0.000216,	0.000391,
								0.000706,	0.001915,	0.004115,	0.007535,	0.01217,	0.01772,	0.02386,	0.03041,	0.03738,	0.04481,
								0.05282,	0.06146,	0.07078,	0.08084,	0.09164,	0.1032,	0.1155,	0.1286,	0.1425,	0.1571,	0.1724,
								0.1884,	0.2051,	0.2224,	0.2403,	0.2588,	0.2778,	0.2972,	0.3171,	0.3374,	0.358,	0.3789,	0.4001,
								0.4215,	0.4431,	0.4647,	0.4865,	0.5084,	0.5302,	0.5521,	0.5738,	0.5956,	0.6172,	0.6386,	0.66,	0.6811,
								0.702,	0.7228,	0.7433,	0.7635,	0.7835,	0.8032,	0.8226,	0.8418,	0.8606,	0.8791,	0.8974,	0.9153,
								0.9328,	0.9501,	0.967,	0.9836,	0.9999,	1.0159,	1.0315,	1.0468,	1.0618,	1.0764,	1.0908,	1.1048,
								1.1185,	1.132,	1.1451,	1.1579,	1.1704,	1.1827,	1.1946,	1.2063,	1.2177,	1.2289,	1.2398,	1.2504,
								1.2607, 1.2708,	1.2807,	1.2903,	1.2997,	1.3089,	1.3179,	1.3266,	1.3351,	1.3434,	1.3515,	1.3594,
								1.3671,	1.4866,	1.5823,	1.6378,	1.6286,	1.586,	1.5418,	1.5013,	1.4654,	1.4335,	1.405,	1.3795];

	var matrizalfaH=[0.9691,	1.0185, 1.0664,	1.1209,	1.2322,	1.4189,	1.6009,	1.6948,	1.6969,	1.6499,	1.59,	1.481,
								1.3905, 1.3155,	1.2571,	1.214,	1.1825,	1.1586,	1.1396,	1.1233,	1.1086,	1.0949,	1.0818,	1.0691,
								1.0568,	1.0447,	1.0329,	1.0214,	1.0101,	0.9991,	0.9884,	0.978,	0.9679,	0.958,	0.9485,	0.9392,
								0.9302,	0.9214,	0.9129,	0.9047,	0.8967,	0.889,	0.8816,	0.8743,	0.8673,	0.8605,	0.8539,	0.8476,
								0.8414,	0.8355,	0.8297,	0.8241, 0.8187,	0.8134,	0.8084,	0.8034,	0.7987,	0.7941,	0.7896,	0.7853,
								0.7811,	0.7771,	0.7731,	0.7693,	0.7656,	0.7621,	0.7586,	0.7552,	0.752,	0.7488,	0.7458,	0.7428,
								0.74,	0.7372,	0.7345,	0.7318,	0.7293,	0.7268,	0.7244,	0.7221,	0.7199,	0.7177,	0.7156,	0.7135,
								0.7115,	0.7096,	0.7077,	0.7058,	0.704,	0.7023,	0.7006,	0.699,	0.6974,	0.6959,	0.6944,	0.6929,
								0.6915,	0.6901,	0.6888,	0.6875,	0.6862,	0.685,	0.6838,	0.6826,	0.6815,	0.664,	0.6494,	0.6382,
								0.6296,	0.6262,	0.6253,	0.6262,	0.6284,	0.6315,	0.6353,	0.6396];

	var matrizkV=[0.0000308,	0.0000574,	0.0000998,	0.000146,	0.000194,	0.000235,	0.000246,	0.000235,	0.000243,	0.000312,
								0.000488,	0.001425,	0.00345,	0.006691,	0.01129,	0.01731,	0.02455,	0.03266,	0.04126,	0.05008,
								0.05899,	0.06797,	0.07708,	0.08642,	0.09611,	0.1063,	0.117,	0.1284,	0.1404,	0.1533,	0.1669,
								0.1813,	0.1964,	0.2124,	0.2291,	0.2465,	0.2646,	0.2833,	0.3026,	0.3224,	0.3427,	0.3633,	0.3844,
								0.4058,	0.4274,	0.4492,	0.4712,	0.4932,	0.5153,	0.5375,	0.5596,	0.5817,	0.6037,	0.6255,	0.6472,
								0.6687,	0.6901,	0.7112,	0.7321,	0.7527,	0.773,	0.7931,	0.8129,	0.8324,	0.8515,	0.8704,	0.8889,
								0.9071,	0.925,	0.9425,	0.9598,	0.9767,	0.9932,	1.0094,	1.0253,	1.0409,	1.0561,	1.0711,	1.0857,
								1.1,	1.1139,	1.1276,	1.141,	1.1541,	1.1668,	1.1793,	1.1915,	1.2034,	1.2151,	1.2265,	1.2376,
								1.2484,	1.259,	1.2694,	1.2795,	1.2893,	1.2989,	1.3083,	1.3175,	1.3265,	1.3352,	1.3437,	1.352,
								1.3601,	1.368,	1.4911,	1.5896,	1.6443,	1.6286,	1.582,	1.5366,	1.4967,	1.4622,	1.4321,	1.4056, 1.3822];

	var matrizalfaV=[0.8592,0.8957,0.949,1.0085,1.0688,1.1387,1.2476,1.3987,1.5317,1.5882,1.5728,1.4745,1.3797,
								1.2895,1.2156,1.1617,1.1216,1.0901,1.0646,1.044,1.0273,1.0137,1.0025,0.993,0.9847,0.9771,0.97,
								0.963,0.9561,0.9491,0.9421,0.9349,0.9277,0.9203,0.9129,0.9055,0.8981,0.8907,0.8834,0.8761,0.869,
								0.8621,0.8552,0.8486,0.8421,0.8357,0.8296,0.8236,0.8179,0.8123,0.8069,0.8017,0.7967,0.7918,0.7871,
								0.7826,0.7783,0.7741,0.77,0.7661,0.7623,0.7587,0.7552,0.7518,0.7486,0.7454,0.7424,0.7395,0.7366,
								0.7339,0.7313,0.7287,0.7262,0.7238,0.7215,0.7193,0.7171,0.715,0.713,0.711,0.7091,0.7073,0.7055,
								0.7038,0.7021,0.7004,0.6988,0.6973,0.6958,0.6943,0.6929,0.6915,0.6902,0.6889,0.6876,0.6864,
								0.6852,0.684,0.6828,0.6817,0.6806,0.6796,0.6785,0.6775,0.6765,0.6609,0.6466,0.6343,0.6262,
								0.6256,0.6272,0.6293,0.6315,0.6334,0.6351,0.6365];

	var k;
	var alfa;
	if(pol==1){ // polarización vertical
		k = matrizkV[indice];
		alfa = matrizalfaV[indice];
	}
	else if(pol==2){ // polarización horizontal
		k = matrizkH[indice];
		alfa = matrizalfaH[indice];
	}
	else{
		alert ("Ingrese un tipo de polarización");
		return;
	}
	console.log("k:" +k);
	console.log("alfa:" +alfa);

	var gamaR= k*Math.pow(R, alfa);
	var d0=35*Math.exp(-0.015*R);
	//var r = 1/(1+distancia/d0);
	var r = 1/(0.477*Math.pow(distancia, 0.633)*Math.pow(R, 0.073*alfa)*Math.pow(frecu, 0.123) - 10.579*(1-Math.exp(-0.024*distancia)));
	var deff= distancia*r;
	var A = gamaR*deff;
	
	console.log("Las pérdidas debido a lluvias son de: " + A + "dB.");

	return(A);
}

function Resultados(hayLOS,perdidasFSL,disp_canal,AnguloTilt,despeje60,despeje40){
	google.charts.load('current', {'packages':['table']});
	google.charts.setOnLoadCallback(ResultTable);

	function ResultTable() {
		if(!data_resultados){
			data_resultados = new google.visualization.DataTable();
			data_resultados.addColumn('boolean','Hay linea de vista?');
			data_resultados.addColumn('number', 'Perdidas de espacio libre (dB)');
			data_resultados.addColumn('number', 'Disponibilidad del canal (%)');
			data_resultados.addColumn('number', 'Angulo de Tilt');
			data_resultados.addColumn('boolean', 'Despeje 60%?');
			data_resultados.addColumn('boolean', 'Despeje 40%?');

			tableRes = new google.visualization.Table(document.getElementById('result_table'));
		}
		data_resultados.addRow([hayLOS,+perdidasFSL,+disp_canal,+AnguloTilt ,despeje60 ,despeje40]); //Acá empieza a recorrer el array
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
			data_detabla.addColumn('boolean', 'Despeje 60%?');
			data_detabla.addColumn('boolean', 'Despeje 40%?');
			data_detabla.addColumn('number', 'Muestra Modificada');

			table = new google.visualization.Table(document.getElementById('table_div'));
		}

		var resultado60;
		var resultado40;

		if(resFresnel==0){
			resultado60=true;
			resultado40=true;
		}
		else if(resFresnel==1){
			resultado60=false;
			resultado40=true;
		}
		else {
			resultado60=false;
			resultado40=false;
		}

		data_detabla.addRow([objInterferente,+parseFloat(document.getElementById("distanciaobjeto").value),+parseFloat(document.getElementById("alturaobjeto").value),resultado60 ,resultado40 ,+muestra_mod[contador]]); //Acá empieza a recorrer el array
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
//Creo estos dos arrays para guardar los valores que tienen un despeje de 40% y 60%
var distanciaFresnel=[];
var alturaFresnel=[];
var resFresnel;
var hayDespejeCamino=[];

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
