/* Este bloque tiene como funcionalidad calcular las pérdidas de espacio libre
Para ello, el usuario debe ingresar la siguiente información:
distancia: Largo del camino
htx: Altura de la antena Tx
hrx: Altura de la antena Rx
*/
function FSL(distancia) {
	var resultado;
	var lambda;
	var c= 3*Math.pow(10,8);
	lambda = c/Inputfreq;
	var frec=Inputfreq*1000;
	var freespaceloss=32.4+20*Math.log10(frec*distancia);
	return (freespaceloss);
}
