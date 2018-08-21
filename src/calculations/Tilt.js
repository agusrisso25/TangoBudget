function Tilt(distancia,htx,hrx) {
	var resultado;	
	resultado=toDegrees(Math.atan((htx-hrx)/(distancia)));
	return resultado;
}