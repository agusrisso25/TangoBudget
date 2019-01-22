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
	for (i=1;i<(altura.length-1); i++){
		hayDespejeCamino[i]=Fresnel(htx2,hrx2,i,altura[i]);
		//En caso que tenga un objeto interferente entre 60% y 40% necesito guardar la muestra y la altura del camino para pérdidas por Difracción
		if (hayDespejeCamino[i] == 1){
			distanciaFresnel [j]= i;
			alturaFresnel [j]= altura[i];
			j++;
		}
	}

	//luego debo saber en qué región de decisión está el despeje.
	var resultadoFresnel=hayDespejeCamino.sort();

	if(resultadoFresnel[hayDespejeCamino.length-1]==0){ 
		console.log("Existe un despeje del 60% de Fresnel.");
		fresnelGlobal=0;
	}
	else if(resultadoFresnel[hayDespejeCamino.length-1]==1){
		console.log("Existe el despeje entre el 40% y 60% del Fresnel.");
		fresnelGlobal=1;
	}
	else{
		console.log("No hay despeje de Fresnel.");
		fresnelGlobal=2;
	}

	return;
}
