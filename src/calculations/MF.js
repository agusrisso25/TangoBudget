function MF(distancia,A,B,freq,disp_canal) {
	var margen_fading;
	var valueA;
	if(A=="1")
		valueA=4;
	else if(A=="2")
		valueA=1;
	else
		valueA=0.25;

	margen_fading= 30*(Math.log10(distancia))+10*(Math.log10(6*valueA*B*freq))-10*(Math.log10(1-disp_canal))-70;
	return margen_fading;
}
