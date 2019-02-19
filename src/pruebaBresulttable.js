function ResultadosPruebaB(){
  var despejefinal;

  var pol=result.pol;
  if(pol==1)
    pol="Vertical";
  else
    pol="Horizontal";

  document.getElementById("transmisorpruebaB").value = "("+result.coordtx+")";
  document.getElementById("receptorpruebaB").value = "("+result.coordrx+")";
  document.getElementById("distpruebaB").innerHTML = result.distancia+" km";

  if(result.fresnelGlobal=="0"){
    despejefinal="Mayor o igual a 60%";
  }
  else if(result.fresnelGlobal=="1"){
    despejefinal="Entre el 40% y 60%";
  }
  else {
    despejefinal="No hay despeje de Fresnel";
  }

  var totPerdidas=result.perdidasFSL+result.perdidasLluvia+result.perdidasOtras+result.perdidasConectores;
  var obj = [
		{
			name: "Altura total del Transmisor (m) ",
			value: result.htx
		},
		{
			name: "Altura total del Receptor (m) ",
			value: result.hrx
		},
		{
			name: "Ganancia del Transmisor (dBi)",
			value: result.Gtx
		},
		{
			name: "Ganancia del Receptor (dBi) ",
			value: result.Grx
		},
		{
			name: "Potencia del Transmisor (dBm) ",
			value: result.Ptx
		},
		{
			name: "Potencia del Receptor (dBm)",
			value: result.Prx
		},
		{
			name: "Angulo Tilt (grados)",
			value: result.AnguloTilt
		},
		{
			name: "Sensibilidad de Recepción (dBm) ",
			value: result.sensRX
		},
		{
			name: "Frecuencia (GHz) ",
			value: result.Freq
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
	    value: result.perdidasFSL
	  },
		{
	    name: "Perdidas por Fading (dB)",
	    value: result.MargenFading
	  },
		{
	    name: "Perdidas por Lluvia (dB)",
	    value: result.perdidasLluvia
	  },
		{
	    name: "Perdidas de Conectores (dB)",
	    value: result.perdidasConectores
	  },
		{
	    name: "Otras Perdidas (dB)",
	    value: result.perdidasOtras
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
	    name: "Despeje de Fresnel",
	    value: despejefinal
	  },
		{
			name: "",
			value: ""
		},
		{
	    name: "Disponibilidad de Canal del peor mes por Multi Camino(%)",
	    value: result.disp_mensualMC
	  },
		{
	    name: "Disponibilidad de Canal anual por Multi Camino(%)",
	    value: result.disp_anualMC
	  },
		{
	    name: "Indisponibilidad anual (min)",
	    value: result.indisp_anualmin
	  },
		{
	    name: "Disponibilidad de Canal anual por lluvia (%)",
	    value: result.disp_canalLL
	  },
	  {
	    name: "Disponibilidad Total del Canal (Multi Camino + Lluvia) (%)",
	    value: result.disp_canalTOT
	  },
		{
	    name: "Disponibilidad Total de Canal (min)",
	    value: result.disp_canalTOT_min
	  }];

  function populateTable(obj) {
    var report = document.getElementById('result_table_pruebaB');

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
