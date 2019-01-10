/* Este bloque tiene como funcionalidad desplegar los resultados de los cálculos en forma de tabla dinámica
Se deben pasar los siguientes valores:
hayLOS: Corresponde a saber si existe linea de vista entre la antena Tx y Rx
perdidasFSL: Valor calculado de la pérdidas de espacio libre
MargenFading: Valor calculado del Margen de fading
AnguloTilt: Angulo de inclinación calculado
despeje60: si existe despeje del 60% <true,false>
despeje40: si existe despeje del 40% <true,false>
*/

function Resultados(hayLOS,perdidasFSL,MargenFading,AnguloTilt,despeje60,despeje40){
	google.charts.load('current', {'packages':['table']});
	google.charts.setOnLoadCallback(ResultTable);

	function ResultTable() {
		if(!data_resultados){
			data_resultados = new google.visualization.DataTable();
			data_resultados.addColumn('boolean','Hay linea de vista?');
			data_resultados.addColumn('number', 'Perdidas de espacio libre (dB)');
			data_resultados.addColumn('number', 'Margen de Fading (dB)');
			data_resultados.addColumn('number', 'Angulo de Tilt');
			data_resultados.addColumn('boolean', 'Despeje 60%?');
			data_resultados.addColumn('boolean', 'Despeje 40%?');

			tableRes = new google.visualization.Table(document.getElementById('result_table'));
		}
		data_resultados.addRow([hayLOS,+perdidasFSL,+MargenFading,+AnguloTilt ,despeje60 ,despeje40]); //Acá empieza a recorrer el array
		tableRes.draw(data_resultados, {showRowNumber: false, width: '100%', height: '100%'});
	}
}
