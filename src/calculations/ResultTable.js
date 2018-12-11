/* Este bloque tiene como funcionalidad desplegar los resultados de los cálculos en forma de tabla dinámica */

function Resultados(hayLOS,perdidasFSL,MargenFading,AnguloTilt,despeje80,despeje60){
	google.charts.load('current', {'packages':['table']});
	google.charts.setOnLoadCallback(ResultTable);

	function ResultTable() {
		if(!data_resultados){
			data_resultados = new google.visualization.DataTable();
			data_resultados.addColumn('boolean','Hay linea de vista?');
			data_resultados.addColumn('number', 'Perdidas de espacio libre (dB)');
			data_resultados.addColumn('number', 'Margen de Fading (dB)');
			data_resultados.addColumn('number', 'Angulo de Tilt');
			data_resultados.addColumn('boolean', 'Despeje 80%?');
			data_resultados.addColumn('boolean', 'Despeje 60%?');

			tableRes = new google.visualization.Table(document.getElementById('result_table'));
		}
		data_resultados.addRow([hayLOS,+perdidasFSL,+MargenFading,+AnguloTilt ,despeje80 ,despeje60]); //Acá empieza a recorrer el array
		tableRes.draw(data_resultados, {showRowNumber: false, width: '100%', height: '100%'});
	}
}
