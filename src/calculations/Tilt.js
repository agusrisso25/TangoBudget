/* Este bloque calcula el ángulo de inclinación que deben tener las antenas tomando como referencia la horizontal */
function Tilt(distancia) {
	var resultado;
	resultado=toDegrees(Math.atan2((altura[0]-altura[altura.length-1])/(distancia)));
	return resultado;
}
