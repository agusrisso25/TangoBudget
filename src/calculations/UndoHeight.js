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
