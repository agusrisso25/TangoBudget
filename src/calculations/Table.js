/* Este bloque tiene como funcionalidad desplegar los resultados de colocar cada objeto interferente
a lo largo del camino. Cada objeto interferente colocado reflejará el despeje de zona de fresnel
El usuario deberá ingresar
objInterferente: Se generan diferentes atenuaciones de los objetos interferentes. Por ejemplo 'Arbol', 'Edificio'
resFresnel: Se debe pasar el valor del resultado calculado por Fresnel
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
			data_detabla.addColumn('boolean', 'Despeje 60%?');
			data_detabla.addColumn('boolean', 'Despeje 40%?');
			data_detabla.addColumn('number', 'Muestra Modificada');

			table = new google.visualization.Table(document.getElementById('table_div'));
		}

		var resultado60;
		var resultado40;

		if(despeje[contador]==0){ //Significa que tengo despeje del 60%
			console.log("Existe un despeje del 60% de Fresnel.");
			resultado60=true;
			resultado40=true;
		}
		else if(despeje[contador]==1){
			console.log("Existe el despeje entre el 40% y 60% del Fresnel.");
			resultado60=false;
			resultado40=true;
		}
		else{
			console.log("No hay despeje de Fresnel.");
			resultado60=false;
			resultado40=false;
		}

		//luego debo saber en qué región de decisión está el despeje.
		var resultadoFresnel60=despeje.filter(function(number) {
			return (number=0);
		}); //filtro todos los valores cero

		var resultadoFresnel40=despeje.filter(function(number) {
			return (number=1);
		}); //filtro todos los valores uno
		if(resultadoFresnel60.length==0)
			fresnelGlobal=0;
		else if (resultadoFresnel40.length==0)
			fresnelGlobal=1;
		else
			fresnelGlobal=2;

		data_detabla.addRow([objInterferente,+parseFloat(document.getElementById("distanciaobjeto").value),+parseFloat(document.getElementById("alturaobjeto").value),resultado60 ,resultado40 ,+muestra_mod[contador]]); //Acá empieza a recorrer el array
		table.draw(data_detabla, {showRowNumber: true, width: '100%', height: '100%'});
		document.getElementById("alturaobjeto").value = "";
    document.getElementById("distanciaobjeto").value = "";
	}
}

function BorrarFila(){
	data_detabla.removeRow(contador-1); //Acá empieza a recorrer el array
	table.draw(data_detabla, {showRowNumber: true, width: '100%', height: '100%'});
	}
