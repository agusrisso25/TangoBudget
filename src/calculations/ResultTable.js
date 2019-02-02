/* Este bloque tiene como funcionalidad desplegar los resultados de los cálculos en forma de tabla dinámica
Se deben pasar los siguientes valores:
hayLOS: Corresponde a saber si existe linea de vista entre la antena Tx y Rx
perdidasFSL: Valor calculado de la pérdidas de espacio libre
disp_canal: La disponibilidad calculada
AnguloTilt: Angulo de inclinación calculado
*/

function Resultados(perdidasFSL,disp_canal,AnguloTilt,Gtx,Grx,Ptx,Prx,MargenFading,sensRX,distancia,perdidasLluvia,perdidasConectores,perdidasOtras){

	var despejefinal;
	var coordtx="(" +latitud[0] + " , " + longitud[0] +")";
	var coordrx="(" + latitud[1] + " , " + longitud[1] +")";
	var htx=altura[0].toFixed(2) +" metros";
	var hrx=altura[cant_redondeo-1].toFixed(2) +" metros";
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

	var totPerdidas=perdidasFSL+perdidasLluvia+perdidasOtras+perdidasConectores;

	var obj = [
		{
			name: "Coordenadas Transmisor (Lat, Lng)",
			value: coordtx
		},
		{
			name: "Coordenadas Receptor (Lat, Lng)",
			value: coordrx
		},
		{
			name: "Altura total del Transmisor (dB) ",
			value: htx
		},
		{
			name: "Altura total del Receptor (dB) ",
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
	    name: "Hay linea de vista?",
	    value: hayLOS
	  },
		{
	    name: "Despeje de Fresnel",
	    value: despejefinal
	  },
	  {
	    name: "Disponibilidad de Canal (%)",
	    value: disp_canal
	  }

	];

	function populateTable(obj) {
	  var report = document.getElementById('result_table');

	  // Limpiar tabla antes de agregar datos
	  report.innerHTML = '';

	  // Por cada elemento agregar una fila con dos columnas. Una para el nombre y otra para el valor
	  for (var i = 0; i < Object.keys(obj).length; i++) {
	    var tr = "<tr><td>" + obj[i].name + "</td><td>" + obj[i].value + "</td></tr>";
	    report.innerHTML += tr;
	  }
	}

	populateTable(obj);
}
