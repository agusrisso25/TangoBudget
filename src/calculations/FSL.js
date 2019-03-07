/* Este bloque tiene como funcionalidad calcular las pérdidas de espacio libre por definición
Para ello, se toma la siguiente información:
distancia: Largo del camino
*/
function FSL(distancia) {
	var resultado;
	var lambda;
	var c= 3*Math.pow(10,8);
	lambda = c/Inputfreq;
	var frec=Inputfreq*1000;
	var freespaceloss=32.4+20*Math.log10(frec*distancia);
	resultado=freespaceloss.toFixed(2);
	return (resultado);
}
