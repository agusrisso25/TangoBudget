/* Este bloque tiene como funcionalidad calcular las pérdidas de espacio libre
Para ello, el usuario debe ingresar la siguiente información:
distancia: Largo del camino
htx: Altura de la antena Tx
hrx: Altura de la antena Rx
freq: Frecuencia de transmisión del canal
*/
function FSL(distancia,htx,hrx,freq) {
	var resultado;
	var lambda;
	var c= 3*10^8;
	lambda = c/freq;
	var freespaceloss=((4*Math.PI*distancia)/(lambda)); //Definición de pérdidas de espacio libre
	resultado= 20*(Math.log10(freespaceloss)); //El resultado esta en dB
	return (resultado);
}
