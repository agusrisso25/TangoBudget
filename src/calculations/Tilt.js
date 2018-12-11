/* Este bloque calcula el ángulo de inclinación que deben tener las antenas tomando como referencia la horizontal */
function Tilt(distancia,htx,hrx) {
	var resultado;
	resultado=toDegrees(Math.atan((htx-hrx)/(distancia)));
	return resultado;
}
