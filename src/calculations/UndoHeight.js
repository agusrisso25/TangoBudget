/* Este bloque tiene como funcionalidad deshacer la el último objeto interferente modificado por el usuario
En caso que se hayan desecho todos los cambios, se desplegará una alerta*/

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
