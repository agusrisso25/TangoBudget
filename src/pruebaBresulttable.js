/* Esta función se utiliza para desplegar los resultados en mainB
*/
function ResultadosmainB(){
  var despejefinal;

  var pol=result.pol;
  if(pol==1)
    pol="Vertical";
  else
    pol="Horizontal";

  document.getElementById("transmisormainB").value = "("+result.coordtx+")";
  document.getElementById("receptormainB").value = "("+result.coordrx+")";
  document.getElementById("distmainB").innerHTML = result.distancia+" km";

  if(result.fresnelGlobal=="0"){
    despejefinal="Mayor o igual a 60%";
  }
  else if(result.fresnelGlobal=="1"){
    despejefinal="Entre el 40% y 60%";
  }
  else {
    despejefinal="No hay despeje de Fresnel";
  }

  var enlace;
  if (result.enlace=="0")
		enlace="Enlace Aceptable";
	else if (result.enlace=="1")
		enlace="Enlace no Aceptable";

  var totPerdidas=parseFloat(result.perdidasFSL)+parseFloat(result.perdidasOtras)+parseFloat(result.perdidasConectores)+parseFloat(result.diffBullington);
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
			name: "Angulo Tilt Antena Transmisora (grados)",
			value: result.TiltTx
		},
    {
			name: "Angulo Tilt Antena Receptora (grados)",
			value: result.TiltRx
		},
		{
			name: "Potencia del Receptor (dBm)",
			value: result.Prx
		},
		{
	    name: "Pérdidas de Espacio Libre (dB)",
	    value: result.perdidasFSL
	  },
		{
	    name: "Pérdidas por Fading (dB)",
	    value: result.MargenFading
	  },
		{
	    name: "Pérdidas por Lluvia (dB)",
	    value: result.perdidasLluvia
	  },
		{
	    name: "Pérdidas de Conectores (dB)",
	    value: result.perdidasConectores
	  },
		{
	    name: "Otras Perdidas (dB)",
	    value: result.perdidasOtras
	  },
    {
	    name: "Pérdidas por Bullington (dB)",
	    value: result.diffBullington
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
	  },
    {
      name: "",
      value: ""
    },
    {
	    name: "Hay linea de vista?",
	    value: result.hayLOS
	  },
    {
      name: "Viabilidad del enlace",
      value: enlace
    }];

  function populateTable(obj) {
    var report = document.getElementById('result_table_mainB');

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
