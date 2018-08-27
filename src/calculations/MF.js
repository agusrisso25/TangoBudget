function MF(distancia,A,B,freq,disp_canal) {
	var margen_fading= 30*(Math.log10(distancia))+10*(Math.log10(6*A*B*freq))-10*(Math.log10(1-disp_canal))-70;
	return margen_fading;
}
