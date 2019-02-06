/* Este bloque tiene como funcionalidad modificar la altura de las antenas Tx y Rx
NOTA: Se define que no se puede ingresar alturas negativas ni 0
*/

function ModifyRxTx() {
	var htx= parseNumber(document.getElementById("alturaantenatx").value);
	var hrx= parseNumber(document.getElementById("alturaantenarx").value);
	/*if(htx<=0 || hrx<=0){ //Si el usuario no ingresa un valor correcto, despliega error
		alert("Altura incorrecta, intente de nuevo");
		return;
	}*/
	flag=4;
	displayPathElevation(camino,elevator,dist);
	return;
}
