function FSL(distancia,htx,hrx) {
	var resultado;
	var lambda;
	var c= 3*10^8;
	var freq= document.getElementById("frequency").value;
	lambda = c/freq;

	var dbreak = (4*htx*hrx)/(lambda);

	var freespaceloss=((4*Math.PI*distancia)/(lambda));
	resultado= 20*(Math.log10(freespaceloss)); //El resultado esta en dB
  	return (resultado);
}
