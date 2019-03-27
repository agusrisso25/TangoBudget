/* Este bloque toma la frecuencia que ingresó el usuario en la plataforma y calcula el despeje de fresnel
que genera el perfil de elevacion sin objetos interferentes. */

function getFreq() {
	Inputfreq=parseNumber(document.getElementById("frecuencia").value);
	var despeje60;
	var despeje40;

	/*if(distanciaFresnel){
		distanciaFresnel=[];
		alturaFresnel=[];
	}*/
	//Se calcula si hay despeje de fresnel a lo largo del camino
	var j=0;
	for (i=1;i<altura.length-1; i++){
		hayDespejeCamino[i]=Fresnel(i*10,altura2[i]);
		//En caso que tenga un objeto interferente entre 60% y 40% necesito guardar la muestra y la altura del camino para pérdidas por Difracción
		if (hayDespejeCamino[i] == 1){
			distanciaFresnel [j]= i;
			alturaFresnel [j]= altura2[i];
			j++;
		}
	}
	var resultadoFresnel=hayDespejeCamino.sort();
	if(!despeje || despeje.length==0){
		//luego debo saber en qué región de decisión está el despeje.
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
			document.getElementById("Fresnel").innerHTML = "No se pudo medir";
		}
	}
	else{
		despeje.sort();
		if(resultadoFresnel[hayDespejeCamino.length-2]==0 && despeje[despeje.length-1]==0){
			document.getElementById("Fresnel").innerHTML = "Se tiene un despeje mayor o igual al 60%";
			fresnelGlobal=0;
		}
		else if(resultadoFresnel[hayDespejeCamino.length-2]==1 && despeje[despeje.length-1]==0){
			document.getElementById("Fresnel").innerHTML = "Se tiene obstrucción entre el 40% y 60%";
			fresnelGlobal=1;
		}
		else if(resultadoFresnel[hayDespejeCamino.length-2]==0 && despeje[despeje.length-1]==1){
			document.getElementById("Fresnel").innerHTML = "Se tiene obstrucción entre el 40% y 60%";
			fresnelGlobal=1;
		}
		else if(resultadoFresnel[hayDespejeCamino.length-2]==1 && despeje[despeje.length-1]==1){
			document.getElementById("Fresnel").innerHTML = "Se tiene obstrucción entre el 40% y 60%";
			fresnelGlobal=1;
		}
		else if(resultadoFresnel[hayDespejeCamino.length-2]==2 || despeje[despeje.length-1]==2){
			document.getElementById("Fresnel").innerHTML = "No hay despeje de fresnel. El 40% se encuentra obstruido.";
			fresnelGlobal=2;
		}
		else{
			document.getElementById("Fresnel").innerHTML = "";
		}
	}
	return;
}
