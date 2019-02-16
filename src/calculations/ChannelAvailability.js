/* Este bloque tiene como funcionalidad analizar el tipo de terreno que ingresó el usuario y a raíz de eso, calcular
el margen de fading.
Para ello, es necesario leer toda la información que ingresó el usuario en la plataforma:
distancia: Largo del camino
A: Factor de Rugosidad del terreno
B: Factor del clima
MargenFading: Margen de Fading
*/

function DispCanalBarnett(distancia,MargenFading) { //Barnet Vigant
	var disp_canal;
	var valueA;
	var valueB;

	var A = parseNumber(document.getElementById("FactorRugosidad").value);
	var B = parseNumber(document.getElementById("FactorClima").value);

	var arrayA= [0, 4, 1, 0.25];
	var arrayB= [0, 1, 0.5, 0.25, 0.125];

	if (A == 0){
		alert("Favor de completar el factor de rugosidad.");
		return;
	}
	else {
		valueA = arrayA [A];
	}

	if (B == 0){
		alert("Favor de completar el Factor Clima.");
		return;
	}
	else {
		valueB = arrayB [B];
	}

	disp_canal = 1-((Math.pow(distancia,3)*6*valueA*valueB*Inputfreq)/(Math.pow(10,7+MargenFading/10)));
	return disp_canal;
}
