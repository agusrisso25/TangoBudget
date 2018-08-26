function MF(distancia,A,B,freq,confiabilidad,disp_canal) {
	var margen_fading= 30*Math.log10(distancia)+10*Math.log10(6*A*B*frec)-10*log(1-disp_canal)-70;
	return margen_fading;
}
