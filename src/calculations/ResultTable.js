/* Este bloque tiene como funcionalidad desplegar los resultados de los cálculos en forma de tabla dinámica
Se deben pasar los siguientes valores:
hayLOS: Corresponde a saber si existe linea de vista entre la antena Tx y Rx
perdidasFSL: Valor calculado de la pérdidas de espacio libre
disp_canal: La disponibilidad calculada
AnguloTilt: Angulo de inclinación calculado
*/
function populateTable(obj) {
	var report = document.getElementById('result_table');
	// Limpiar tabla antes de agregar datos
	report.innerHTML = '';
	var tabla = "";
	// Por cada elemento agregar una fila con dos columnas. Una para el nombre y otra para el valor
	for (var i = 0; i < Object.keys(obj).length; i++) {
		var tr = "<tr><td>" + obj[i].name + "</td><td>" + obj[i].value + "</td></tr>";
		tabla += tr;
	}
	report.innerHTML = tabla;
}

function Resultados(disp_canalLL,disp_mensualMC,disp_anualMC,indisp_anualmin,disp_canalTOT,disp_canalTOT_min,AnguloTilt,Gtx,Grx,Ptx,Prx,MargenFading,sensRX,distancia,perdidasFSL,perdidasLluvia,perdidasConectores,perdidasOtras,enlace){
	var despejefinal;
	var htx=altura[0].toFixed(2) +" metros";
	var hrx=altura[altura.length-1].toFixed(2) +" metros";
	var dimensionestx=document.getElementById("dimensionestx").value;
	var dimensionesrx=document.getElementById("dimensionesrx").value;
	var pol=parseNumber(document.getElementById("polarizacion").value);

	if(pol==1)
		pol="Vertical";
	else
		pol="Horizontal";

	if(fresnelGlobal==0)
	{
		despejefinal="Mayor o igual a 60%";
	}
	else if(fresnelGlobal==1){
		despejefinal="Entre el 40% y 60%";
	}
	else {
		despejefinal="No hay despeje de Fresnel";
	}

	if (enlace==1)
		enlace="Enlace Aceptable";
	else if (enlace==0)
		enlace="Enlace no Aceptable";

	var totPerdidas=perdidasFSL+perdidasOtras+perdidasConectores;

	var obj = [
		{
			name: "Altura total del Transmisor (m) ",
			value: htx
		},
		{
			name: "Altura total del Receptor (m) ",
			value: hrx
		},
		{
			name: "Ganancia del Transmisor (dBi)",
			value: Gtx
		},
		{
			name: "Ganancia del Receptor (dBi) ",
			value: Grx
		},
		{
			name: "Potencia del Transmisor (dBm) ",
			value: Ptx
		},
		{
			name: "Potencia del Receptor (dBm)",
			value: Prx
		},
		{
			name: "Angulo Tilt (grados)",
			value: AnguloTilt
		},
		{
			name: "Sensibilidad de Recepción (dBm) ",
			value: sensRX
		},
		{
			name: "Frecuencia (GHz) ",
			value: Inputfreq
		},
		{
			name: "Largo del camino (Km) ",
			value: distancia
		},
		{
			name: "Polarizacion ",
			value: pol
		},
		{
			name: "",
			value: ""
		},
		{
	    name: "Perdidas de Espacio Libre (dB)",
	    value: perdidasFSL
	  },
		{
	    name: "Perdidas por Fading (dB)",
	    value: MargenFading
	  },
		{
	    name: "Perdidas por Lluvia (dB)",
	    value: perdidasLluvia
	  },
		{
	    name: "Perdidas de Conectores (dB)",
	    value: perdidasConectores
	  },
		{
	    name: "Otras Perdidas (dB)",
	    value: perdidasOtras
	  },
		{
	    name: "TOTAL DE PERDIDAS (dB)",
	    value: totPerdidas
	  },
		{
			name: "",
			value: ""
		},
		{
	    name: "Hay linea de vista?",
	    value: hayLOS
	  },
		{
	    name: "Despeje de Fresnel",
	    value: despejefinal
	  },
		{
			name: "",
			value: ""
		},
		{
	    name: "Disponibilidad de Canal del peor mes por Multi Camino(%)",
	    value: disp_mensualMC.toFixed(6)
	  },
		{
	    name: "Disponibilidad de Canal anual por Multi Camino(%)",
	    value: disp_anualMC.toFixed(6)
	  },
		{
	    name: "Indisponibilidad anual (min)",
	    value: indisp_anualmin.toFixed(6)
	  },
		{
	    name: "Disponibilidad de Canal anual por lluvia (%)",
	    value: disp_canalLL.toFixed(6)
	  },
	  {
	    name: "Disponibilidad Total del Canal (Multi Camino + Lluvia) (%)",
	    value: disp_canalTOT.toFixed(6)
	  },
		{
	    name: "Disponibilidad Total de Canal (min)",
	    value: disp_canalTOT_min.toFixed(6)
	  },
		{
			name: "",
			value: ""
		},
		{
			name: "Viabilidad del enlace",
			value: enlace
		}];

		populateTable(obj);
}
