/* Este bloque tiene como funcionalidad analizar el tipo de terreno que ingresó el usuario y a raíz de eso, calcular
el margen de fading.
Para ello, es necesario leer toda la información que ingresó el usuario en la plataforma:
distancia: Largo del camino
A: Factor de Rugosidad del terreno
B:
freq: Frecuencia de transmisión del canal
MargenFading: Margen de Fading
*/

function DispCanal(distancia,A,B,freq,MargenFading) {
	var disp_canal;
	var valueA;
	if(A=="1") //Se analiza lo ingresado por el usuario y a raiz de eso, se ingresa en la ecuación del margen de fading
		valueA=4;
	else if(A=="2")
		valueA=1;
	else
		valueA=0.25;

	disp_canal=1-((Math.pow(distancia,3)*6*valueA*B*freq)/(Math.pow(10,7+MargenFading/10)));
	return disp_canal;
}
