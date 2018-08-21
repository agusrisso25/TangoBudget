function FSL(distancia) {
	var resultado;
	var lambda;
	var c= 3*10^8;
	var freq= document.getElementById("frequency").value;
	lambda = c/freq;

	var freespaceloss=((4*Math.PI*distancia)/(lambda));
	resultado= 20*(Math.log10(freespaceloss)); //El resultado esta en dB
  	return (resultado);
}