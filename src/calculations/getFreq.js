/* Este bloque toma la frecuencia que ingresó el usuario en la plataforma y deshabilita el campo de modificación
*/
function getFreq() {
	Inputfreq=parseNumber(document.getElementById("frecuencia").value);
	document.getElementById("frecuencia").disabled = true;

	var despeje60;
	var despeje40;

	//Se calcula si hay despeje de fresnel a lo largo del camino
	var j=0;
	for (i=1;i<(altura.length-1); i++){
		hayDespejeCamino[i]=Fresnel(i,altura[i]);
		//En caso que tenga un objeto interferente entre 60% y 40% necesito guardar la muestra y la altura del camino para pérdidas por Difracción
		if (hayDespejeCamino[i] == 1){
			distanciaFresnel [j]= i;
			alturaFresnel [j]= altura[i];
			j++;
		}
	}

	//luego debo saber en qué región de decisión está el despeje.
	var resultadoFresnel=hayDespejeCamino.sort();

	if(resultadoFresnel[hayDespejeCamino.length-2]==0){
		document.getElementById("Fresnel").innerHTML = "Se tiene un despeje del 60%";
		fresnelGlobal=0;
	}
	else if(resultadoFresnel[hayDespejeCamino.length-2]==1){
		document.getElementById("Fresnel").innerHTML = "Se tiene un despeje entre el 40% y 60%";
		fresnelGlobal=1;
	}
	else if(resultadoFresnel[hayDespejeCamino.length-2]==2){
		document.getElementById("Fresnel").innerHTML = "No hay despeje de fresnel";
		fresnelGlobal=2;
	}
	else{
		document.getElementById("Fresnel").innerHTML = "No se pudo medir";
	}

	return;
}
