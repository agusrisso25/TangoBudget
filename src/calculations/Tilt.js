/* Este bloque calcula el ángulo de inclinación que deben tener las antenas tomando como referencia la horizontal */
function Tilt(distancia) {
	var resultado;
	resultado=Math.atan2((altura[altura.length-1]-altura[0]),(distancia));
	return resultado;
}
