/* Este bloque tiene como funcionalidad tomar toda la información que ingresó el usuario en la plataforma y
hacer todos los cálculos necesarios para generar el reporte.
Para ello, es necesario leer toda la información que ingresó el usuario en la plataforma
*/
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
    var perdidasConectores= parseNumber(document.getElementById("perdidasconectores").value);
    var perdidasOtras=parseNumber(document.getElementById("otrasperdidas").value);
    var A=document.getElementById("FactorRugosidad").value;
    var B=0.25; //Dado que esto apunta a estudios enfocados en Uruguay, este valor no cambia bajo ningún concepto

    //Cálculos de algunas pérdidas
    var perdidasFSL = FSL(distancia,htx2,hrx2,freq); //Se calculan las pérdidas de espacio libre considerando la altura de las antenas con los postes incluidos
    var MargenFading = MF(distancia,A,B,freq,disp_canal); //Se calcula el margen de Fading por definición
    var Prx=Gtx+Grx+Ptx-perdidasConectores-perdidasFSL-perdidasOtras; //Se calcula la potencia de recepción
    var AnguloTilt=Tilt(distancia,htx2,hrx2); // Se calcula el ángulo del inclinación que deben tener las antenas para que tengan LOS
    var AttRain=AtenuacionLluvia();

    console.log("La frecuencia ingresada es: " +freq);
    console.log("perdidasFSL: " +perdidasFSL);
    console.log("Prx es: " +Prx);
    console.log("El margen de fading es: "+MargenFading);
    console.log("La disponibildad del canal es: " +disp_canal);
    console.log("El valor de A es: "+A);
    console.log("El angulo del tilt es: " +AnguloTilt);
    console.log("AtenuacionLluvia: " +AttRain);

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

	var despeje60;
  var despeje40;

  //Se calcula si hay despeje de fresnel a lo largo del camino
	var j=0;

	for (i=0;i<altura.length; i++){
		hayDespejeCamino[i]=Fresnel(freq,htx2,hrx2,i,altura[i]);
//En caso que tenga un objeto interferente con despeje entre 60% y 40% necesito guardar la muestra y la altura del camino
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
      console.log("Existe un despeje mayor al 60%");
      despeje60=true;
      despeje40=true;
    }
    else if(resultadoFresnel40.length==0){
      console.log("Existe el despeje entre el 40% y 60%");
		  despeje60=false;
		  despeje40=true;
    }
    else{
		  console.log("No hay despeje de Fresnel");
		  despeje60=false;
		  despeje40=false;
		}

    //Se envían los resultados a la función Resultados, que permite desplegar una tabla
    Resultados(hayLOS,perdidasFSL,MargenFading,AnguloTilt,despeje60,despeje40);
    return;
}
