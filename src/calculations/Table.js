/* Este bloque tiene como funcionalidad desplegar los resultados de colocar cada objeto interferente
a lo largo del camino. Cada objeto interferente colocado reflejará el despeje de zona de fresnel
El usuario deberá ingresar
objInterferente: Se generan diferentes atenuaciones de los objetos interferentes. Por ejemplo 'Arbol', 'Edificio'
 */

function AgregarTabla(objInterferente,resFresnel){
	google.charts.load('current', {'packages':['table']});
	google.charts.setOnLoadCallback(drawTable);

	function drawTable() {
		if(!data_detabla){
			data_detabla = new google.visualization.DataTable();
			data_detabla.addColumn('string', 'Tipo');
			data_detabla.addColumn('number', 'Distancia desde el Tx (m)');
			data_detabla.addColumn('number', 'Altura (m)');
			data_detabla.addColumn('boolean', 'Despeje 80%?');
			data_detabla.addColumn('boolean', 'Despeje 60%?');
			data_detabla.addColumn('number', 'Muestra Modificada');

			table = new google.visualization.Table(document.getElementById('table_div'));
		}

		var resultado80;
		var resultado60;

		if(resFresnel==0){
			resultado80=true;
			resultado60=true;
		}
		else if(resFresnel==1){
			resultado80=false;
			resultado60=true;
		}
		else {
			resultado80=false;
			resultado60=false;
		}

		data_detabla.addRow([objInterferente,+parseFloat(document.getElementById("distanciaobjeto").value),+parseFloat(document.getElementById("alturaobjeto").value),resultado80 ,resultado60 ,+muestra_mod[contador]]); //Acá empieza a recorrer el array
		table.draw(data_detabla, {showRowNumber: true, width: '100%', height: '100%'});
		document.getElementById("alturaobjeto").value = "";
    document.getElementById("distanciaobjeto").value = "";
	}
}

function BorrarFila(){
	data_detabla.removeRow(contador-1); //Acá empieza a recorrer el array
	table.draw(data_detabla, {showRowNumber: true, width: '100%', height: '100%'});
	}
