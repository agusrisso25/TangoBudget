/* Este bloque tiene como funcionalidad tomar toda la información que ingresó el usuario en la plataforma y
hacer todos los cálculos necesarios para generar el reporte.
Para ello, es necesario leer toda la información que ingresó el usuario en la plataforma
los pasos de analisis son los siguientes:
1. Se lee toda la información ingresada por el usuario
2. Se calculan las perdidas
3. Se calcula la potencia de recepción y el angulo de tilt entre antenas
4. Se calcula el despeje de fresnel del hayDespejeCamino
5. Se pasa la tabla de Resultados
6. Se analiza el margen de fading
*/
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
    var AnguloTilt=Tilt(distancia,htx2,hrx2); // Se calcula el ángulo del inclinación que deben tener las antenas para que tengan LOS
    var diffBullington;
    console.log("La frecuencia ingresada es: " +freq);
    console.log("perdidasFSL: " +perdidasFSL);
    console.log("Prx es: " +Prx);
    console.log("El angulo del tilt es: " +AnguloTilt);
    console.log("AtenuacionLluvia: " +perdidasLluvia);

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
      diffBullington=0;
    }
    else if(resultadoFresnel40.length==0){
      console.log("Existe el despeje entre el 40% y 60% del Fresnel.");
		  despeje60=false;
		  despeje40=true;
      diffBullington=Bullington(htx2,hrx2,distancia);
    }
    else{
		  console.log("No hay despeje de Fresnel.");
		  despeje60=false;
		  despeje40=false;
      diffBullington=0;
		}

    var Prx=Gtx+Grx+Ptx-perdidasConectores-perdidasFSL-perdidasOtras-perdidasLluvia-diffBullington; //Se calcula la potencia de recepción
    var sensRX=parseFloat(document.getElementById("sensibilidadrx").value); //parametro de la datasheet de la antena

    if(sensRX>=0){
      alert("La sensibilidad debe ser menor a cero");
      return;
    }
    if(Prx>sensRX){
      MargenFading=(Prx-sensRX); //Condicion necesaria para que el receptor pueda recibir la señal
      if(MargenFading>=30){
        disp_canal=DispCanal(distancia,freq,MargenFading);
        if(disp_canal>=0.99998)
          console.log("Enlace aceptable");
          //hay que seguir esta parte
        else
          alert("Se debe mejorar la altura de las antenas o datos del enlace.");
        return;
      }
      else {
        alert("Se debe mejorar la altura de las antenas o datos del enlace.");
        return;
      }
    }
    else{
      alert("Se debe mejorar la altura de las antenas o datos del enlace.");
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
