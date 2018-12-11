/* Este bloque tiene como funcionalidad analizar el tipo de terreno que ingresó el usuario y a raíz de eso, calcular
el margen de fading.
Para ello, es necesario leer toda la información que ingresó el usuario en la plataforma:
distancia: Largo del camino
A: Factor de Rugosidad del terreno
B:
freq: Frecuencia de transmisión del canal
disp_canal: Disponibilidad del canal (Se debe ingresar con . y no con ,)
*/

function MF(distancia,A,B,freq,disp_canal) {
	var margen_fading;
	var valueA;
	if(A=="1") //Se analiza lo ingresado por el usuario y a raiz de eso, se ingresa en la ecuación del margen de fading
		valueA=4;
	else if(A=="2")
		valueA=1;
	else
		valueA=0.25;

	margen_fading= 30*(Math.log10(distancia))+10*(Math.log10(6*valueA*B*freq))-10*(Math.log10(1-disp_canal))-70;
	return margen_fading;
}
