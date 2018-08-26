/*! tangobudget - v0.0.1 - 2018-08-26 */// Add the marker at the clicked location, and add the next-available label from the array of alphabetical characters.
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

    showCoordenadas(latitud, longitud);

    if (markers.length == 2) {
      // Create an ElevationService:
      var elevator = new google.maps.ElevationService();
      // Draw the path, using the Visualization API and the Elevation service:
      camino[0] = path.getAt(0);
      camino[1] = path.getAt(1);

      var dist = haversine(radius, latitud, longitud);
      displayPathElevation(camino, elevator, dist); // OJO porque distl lo saco de showCoordenadas() !! no funciona
    }
  });

  marker.addListener("click", toggleBounce);

  if (markers.length == 2) {
    // Create an ElevationService:
    var elevator = new google.maps.ElevationService();
    // Draw the path, using the Visualization API and the Elevation service:
    camino[0] = path.getAt(0);
    camino[1] = path.getAt(1);
    // Draw the path, using the Visualization API and the Elevation service:
    var dist = haversine(radius, latitud, longitud);
    displayPathElevation(camino, elevator, dist);
  }
}

function FSL(distancia,htx,hrx) {
	var resultado;
	var lambda;
	var c= 3*10^8;
	var freq= 12;
	lambda = c/freq;

	var dbreak = (4*htx*hrx)/(lambda);

	var freespaceloss=((4*Math.PI*distancia)/(lambda));
	resultado= 20*(Math.log10(freespaceloss)); //El resultado esta en dB
  	return (resultado);
}

//Funcion para tomar los valores que ingresa el usuario
function InputUser(distancia,freq,htx,hrx) {
    var Gtx=2;
    var Grx=2;
    var Ptx=13.5;
    var frec=2.4;
    var disp_canal=0.9999;
    var perdidasFSL = FSL(distancia,htx,hrx);
    var MF = MF(distancia,A,B,freq,disp_canal);
    var perdidasConectores=0;
    var otrasperdidas;

    var Prx=Gtx+Grx+Ptx-FSL-perdidasConectores-perdidasFSL-otrasperdidas;
    var sensRX=Prx-MF;

    if(Prx-MF>sensRX){
      //se debe dibujar la zona de fresnel
      return 0;
    }
    else {
      alert ("No hay sensibilidad del RX suficiente");
      return 2;
    }
}

        //Funcion para grados a radianes (necesaria para el calculo de distancia):
        function LOS(altura,elevations,coordenadas) {
          	var data2 = new google.visualization.DataTable();
			var aux=0;
        	data2.addColumn('string', 'Muestras');
        	data2.addColumn('number', 'Elevacion');

			for (var j = 0; j < elevations.length; j++) {
            	data2.addRow(['',altura[j]]);
				if(data2.getValue(j,1)=='undefined'){
            		coordenadas [j]=0;
            		altura[j]=0;
				  }
        	}
        	//data2.setValue(0, 1, altura[0]+10);
          	//data2.setValue(elevations.length, 1, altura[elevations.length]+10);
          	var options = {
            	height: 200,
            	legend: 'none',
            	titleY: 'Perfil de elevacion (m)',
          	};


          var chart2 = new google.visualization.LineChart(document.getElementById('elevation_chart2'));
		  chart2.draw(data2, options);

		  var pend1;
		  var pend2;
		  var posic_Pmax2;
        	
        	var posic_Pmax= altura.indexOf(data2.getDistinctValues(1)[elevations.length-1]); //calculo la posicion del array del punto mas alto

        	//CASO A: La posicion máxima es distinta al origen o al destino, calculo altura del punto maximo.
        	if(posic_Pmax != 0 && posic_Pmax != elevations.length-1){  
				//caso 1: Pmax mayor a ambas antenas
				console.log("Prueba: " +data2.getDistinctValues(1)[elevations.length-1]);
				var Pmax= data2.getDistinctValues(1)[elevations.length-1].toFixed(3); //calculo altura maxima
				
	        	if (Pmax>altura[elevations.length-1].toFixed(3) && Pmax>altura[0].toFixed(3)){ 
					//alert (Pmax);
					return 0; //NO TENGO LOS: return 0
				}

				//caso 2: Pmax mayor a la antena Tx y menor a la Rx
				else if (altura[0].toFixed(3)<Pmax<altura[elevations.length-1].toFixed(3)){ //el punto mas alto es el de la posicion elevations.length
					pend1= ((altura[elevations.length-1].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
					pend2= (Pmax-altura[0].toFixed(3))/(posic_Pmax-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
						if (pend1>=pend2)
							return 1; //TENGO LOS: return 1
						else
							return 0; //NO TENGO LOS: return 0
				}

				//caso 3: Pmax mayor a la antena Rx y menor a la Tx
				else if (altura[elevations.length-1].toFixed(3)<Pmax<altura[0].toFixed(3)){ //el punto mas bajo es el de la posicion 0
					pend1= ((altura[elevations.length-1].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
					pend2= (Pmax-altura[0].toFixed(3))/(posic_Pmax-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
					
					if (pend2>=pend1)
						return 1; //TENGO LOS: return 1
					else
						return 0; //NO TENGO LOS: return 0
				}
				//caso 4: Pmax menor a ambas antenas 
	        	else 
	        		return 1; //tengo LOS: return 1
       		}



       		//CASO B: La posicion máxima el origen o el destino
       		else if(posic_Pmax == 0 || posic_Pmax == elevations.length-1){
       			posic_Pmax2= altura.indexOf(data2.getDistinctValues(1)[elevations.length-2]);
       			
       			if(posic_Pmax2== 0 || posic_Pmax2 == elevations.length-1){ //Si Pmax2 sigue siendo uno de los extremos...
       				var Pmax3= data2.getDistinctValues(1)[elevations.length-3].toFixed(1); 
     	  			var posic_Pmax3=altura.indexOf(data2.getDistinctValues(1)[elevations.length-3]);
					//caso 1: Pmax3 mayor a ambas antenas
		        	if (Pmax3>altura[elevations.length-1].toFixed(3) && Pmax3>altura[0].toFixed(3)){ 
						//alert (Pmax3);
						return 0; //NO TENGO LOS: return 0
					}
					//caso 2: Pmax3 mayor a la antena Tx y menor a la Rx
					else if (altura[0].toFixed(3)<Pmax3<altura[elevations.length-1].toFixed(3)){ //el punto mas alto es el de la posicion elevations.length
						pend1= ((altura[elevations.length-2].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
						pend2= (Pmax3-altura[0].toFixed(3))/(posic_Pmax3-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
							if (pend1>=pend2)
								return 1; //TENGO LOS: return 1
							else
								return 0; //NO TENGO LOS: return 0
					}
					//caso 3: Pmax mayor a la antena Rx y menor a la Tx
					else if (altura[elevations.length-1].toFixed(3)<Pmax3<altura[0].toFixed(3)){ //el punto mas bajo es el de la posicion 0
						pend1= ((altura[elevations.length-1].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
						pend2= (Pmax3-altura[0].toFixed(3))/(posic_Pmax3-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
						
						if (pend2>=pend1)
							return 1; //TENGO LOS: return 1
						else
							return 0; //NO TENGO LOS: return 0
					}
					//caso 4: Pmax3 menor a ambas antenas 
		        	else 
		        		return 1; //tengo LOS: return 1
				}
				else 
					return 1; //tengo LOS: return 1
       			}
				else{ // Si Pmax 2 es la maxima altura en mi path...
					//caso 1: Pmax mayor a ambas antenas
					var Pmax2=data2.getDistinctValues(1)[elevations.length-2].toFixed(1); //nos da el valor de altura mas alto
		        	if (Pmax2>altura[elevations.length-1].toFixed(3) && Pmax2>altura[0].toFixed(3)){ 
						return 0; //NO TENGO LOS: return 0
					}

					//caso 2: Pmax mayor a la antena Tx y menor a la Rx
					else if (altura[0].toFixed(3)<Pmax2<altura[elevations.length-1].toFixed(3)){ //el punto mas alto es el de la posicion elevations.length
						pend1= ((altura[elevations.length-1].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
						pend2= (Pmax2-altura[0].toFixed(3))/(posic_Pmax2-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
							if (pend1>=pend2)
								return 1; //TENGO LOS: return 1
							else
								return 0; //NO TENGO LOS: return 0 
					}

					//caso 3: Pmax mayor a la antena Rx y menor a la Tx
					else if (altura[elevations.length-1].toFixed(1)<Pmax2<altura[0].toFixed(1)){ //el punto mas bajo es el de la posicion 0
						pend1= ((altura[elevations.length-1].toFixed(1)-altura[0].toFixed(1))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
						pend2= (Pmax2-altura[0].toFixed(1))/(posic_Pmax2-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
						
						if (pend2>=pend1)
							return 1; //TENGO LOS: return 1
						else
							return 0; //NO TENGO LOS: return 0
					}
					//caso 4: Pmax menor a ambas antenas 
		        	else 
		        		return 1; //tengo LOS: return 1
		       	}
}
          
function MF(distancia,A,B,freq,confiabilidad,disp_canal) {
	var margen_fading= 30*Math.log10(distancia)+10*Math.log10(6*A*B*frec)-10*log(1-disp_canal)-70;
	return margen_fading;
}

function Tilt(distancia,htx,hrx) {
	var resultado;	
	resultado=toDegrees(Math.atan((htx-hrx)/(distancia)));
	return resultado;
}
function ClickInput(){
    var geocoder = new google.maps.Geocoder();
    geocodeLatLng(geocoder, map);
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
      var cant_muestras = dist*100; // 100 muestras por km
      var cant_redondeo= Math.floor(cant_muestras);
      console.log("Cantidad de muestras por km: "+cant_muestras);
      console.log("Redondeo de muestras: "+ cant_redondeo);

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
        // Create a new chart in the elevation_chart DIV.
        var chart = new google.visualization.ColumnChart(chartDiv);

        // Extract the data from which to populate the chart.
        // Because the samples are equidistant, the 'Sample'
        // column here does double duty as distance along the
        // X axis.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Sample'); //en la primer columna se especifica el tipo de valor a almacenar. En este caso en la columna 0 se almacena una variable "Sample" y es de tipo string
        data.addColumn('number', 'Elevation'); //se almacena en la columna 1 valores del tipo number y corresponde a la elevación
        for (var i = 0; i < elevations.length; i++) {
          data.addRow(['', elevations[i].elevation]); //Acá empieza a recorrer el array 
          if(data.getValue(i,1)=='undefined'){
            coordenadas [i]=0;
            altura [i]=0;
          }
          altura [i] = data.getValue(i,1); // guardo en el array altura todas las alturas de elevation en orden
          coordenadas [i] = elevations[i].location;
            //var posicionarray = i;
        } 
  
        console.log("Altura de cada punto: " + altura[0] + ", " + altura[1] + ", " + altura[2]);
        console.log("Coordenadas de cada punto: (" + coordenadas[0].lat()+ ", " + coordenadas[0].lng() + ")" + " "+ "(" + coordenadas[1].lat()+ ", " + coordenadas[1].lng() + ")");
        console.log("Altura Pmax: " + data.getDistinctValues(1)[elevations.length-1]);
        var a= altura.indexOf(data.getDistinctValues(1)[elevations.length-1]);

        console.log("Posición de Pmax: " + a);
        //console.log("Coordenadas Pmax: " + elevations[a].location);



        var distancia= haversine (radius,latitud,longitud);
        var freespaceloss= FSL(distancia);
        console.log("FSL: " +freespaceloss);
        //console.log("Downtiltprueba: " +Tilt(40,100,30)); YA SABEMOS QUE EL ANGULO DA 60 GRADOS


        // Draw the chart using the data within its DIV.
        chart.draw(data, {
          height: 200,
          legend: 'none',
          titleX: 'Cantidad de muestras',
          titleY: 'Elevation (m)'
        }); 

        var hayLOS=LOS(altura,elevations,coordenadas);

        console.log("¿Hay LOS?: ");
        if (hayLOS==1){
          console.log("Si!");
          console.log("Tilt: " +Tilt(distancia,elevations[0].elevation,elevations[elevations.length-1].elevation));
        }
        else if (hayLOS==0){
          console.log("No!");
          //console.log("altura[0]: " +aumentar);
          data.setValue(0, 1, altura[0]+10);//var aumentar= (altura[0]+10)
          chart.draw(data, {
          height: 200,
          legend: 'none',
          titleX: 'Cantidad de muestras',
          titleY: 'Elevation (m)'
          }); 
          
          //data.setValue(elevations.length, 1, altura[elevations.length-1]+10);
          }
        else
          console.log("Indefinido");


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
    document.getElementById("result3").innerHTML =
      distancia_perfil.toFixed(6) + " km"; // imprimo la distancia entre dos puntos
  }
}

        // Elimina todos los marcadores en el array removiendo las referencias a ellos y la polyline:
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
              
            path = poly.setPath([]);  // ELIMINA la poly
            document.getElementById('transmisor').value = "";
            document.getElementById('receptor').value = "";
            document.getElementById('result3').innerHTML="";

            document.getElementById('elevation_chart').innerHTML="";
            document.getElementById('elevation_chart2').innerHTML="";
        }
// Los marcadores aparecen cuando el usuario hace click en el mapa:
// Cada marcador se etiqueta con un letra alfabetica.
var labels = "AB";
var labelIndex = 0;
var markers = []; // Los marcadores se almacenan en un array.
var latitud = [];
var longitud = [];
var radius = 6371; // radio de la tierra
var camino = [];
var altura = [];
var coordenadas = [];

// Load the Visualization API and the columnchart package:
google.load("visualization", "1", { packages: ["columnchart"] });
// Inicializo el mapa centrado en un lugar de Montevideo y con su zoom correspondiente
function initMap() {
  var uluru = { lat: -34.916467, lng: -56.154272 };
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: uluru
  });

  var geocoder = new google.maps.Geocoder();// creo que no la usamos para nada
  //var infowindow = new google.maps.InfoWindow;
  // Evento que escucha el click y llama a la funcion addMarkersAndAll() cuando sucede.
  google.maps.event.addListener(map, "click", function(event) {
    if (markers.length <= 1)
      //Limito a 2 marcadores maximo.
      addMarkersAndAll(event.latLng, map);
  });

  document.getElementById("Submit").addEventListener("click", function() {
    geocodeLatLng(geocoder, map);
  });
  document.getElementById("Submit2").addEventListener("click", function() {
    geocodeLatLng(geocoder, map);
  });

  poly = new google.maps.Polyline({
    strokeColor: "#000000",
    strokeOpacity: 1.0,
    strokeWeight: 3
  });
}

function geocodeLatLng(geocoder, map) {
    console.log("test2");
    var input = document.getElementById('transmisor').value;
    var latlngStr = input.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};

    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          var marker = new google.maps.Marker({
            position: latlng,
            map: map
          });
          
          addMarkersAndAll(location, map); 
          //markers.push(marker);
         // latitud.push(marker.getPosition().lat()); //guardo en el array latitud la latitud de cada marcador
          //longitud.push(marker.getPosition().lng()); //guardo en el array longitud la longitud de cada marcador
          //coordenadas(marker, latitud, longitud);
          
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
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
// Convert from radians to degrees.
function toDegrees(radians){
	return ((radians * 180) / Math.PI);
}
        //Funcion para grados a radianes (necesaria para el calculo de distancia):
        function ToRadians(degree) {
          return (degree * (Math.PI / 180));
        }