/* Este bloque toma la frecuencia que ingresó el usuario en la plataforma y deshabilita el campo de modificación
*/
function getFreq() {
	Inputfreq=parseNumber(document.getElementById("frecuencia").value);
	document.getElementById("frecuencia").disabled = true;

	var despeje60;
	var despeje40;
	var htx=parseNumber(document.getElementById("alturaantenatx").value);
	var hrx=parseNumber(document.getElementById("alturaantenarx").value);
	var htx2= (parseFloat(htx)+parseFloat(altura[0])); //Se suma la altura inicial a la altura definida por el usuario
	var hrx2= (parseFloat(hrx)+parseFloat(altura[cant_redondeo-1]));

	//Se calcula si hay despeje de fresnel a lo largo del camino
	var j=0;
	for (i=0;i<altura.length; i++){
		hayDespejeCamino[i]=Fresnel(htx2,hrx2,i,altura[i]);
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

	return;
}
