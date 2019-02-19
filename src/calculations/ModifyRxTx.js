/* Este bloque tiene como funcionalidad modificar la altura de las antenas Tx y Rx
NOTA: Se define que no se puede ingresar alturas negativas ni 0
*/

function ModifyRxTx() {
	var htx= parseNumber(document.getElementById("alturaantenatx").value);
	var hrx= parseNumber(document.getElementById("alturaantenarx").value);
	if (htx<5 && hrx<5){
		htx=5;
		hrx=5;
		document.getElementById("alturaantenarx").value = "5";
		document.getElementById("alturaantenatx").value = "5";
	}
	flag=4;
	displayPathElevation(camino,elevator,dist);
	return;
}
