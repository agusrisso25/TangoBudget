/* Este bloque tiene como funcionalidad deshacer la el último objeto interferente modificado por el usuario
En caso que se hayan desecho todos los cambios, se desplegará una alerta*/

function DeshacerAltura() {
	var resultadoFresnel;
	if(contador>1){
		flag=3;
		displayPathElevation(camino, elevator, dist);
		return;
	}
	else if(contador==1){
		flag=3;
		displayPathElevation(camino, elevator, dist);
		return;
	}
	else{
		alert("Ya se deshicieron todos los cambios.");
		resultadoFresnel=hayDespejeCamino.sort();
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
}
