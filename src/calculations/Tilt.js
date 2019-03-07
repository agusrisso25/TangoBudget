/* Este bloque calcula el ángulo de inclinación que deben tener las antenas tomando como referencia la horizontal */
function Tilt(distancia) {
	var resultadohtx;
	var resultadohrx;
	resultadohtx=Math.atan2((altura[altura.length-1]-altura[0]),(distancia));
	resultadohrx=Math.atan2((altura[0]-altura[altura.length-1]),(-distancia));
	var htx=resultadohtx.toFixed(2);
	var hrx=resultadohrx.toFixed(2);
	return [htx,hrx];
}
