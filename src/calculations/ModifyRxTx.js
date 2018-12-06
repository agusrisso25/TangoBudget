function ModifyRxTx() {
	var htx= document.getElementById("alturaantenatx").value;
	var hrx= document.getElementById("alturaantenarx").value;
	if(htx<=0 || hrx<=0){ //Si el usuario no ingresa un valor correcto, despliega error
		alert("Altura incorrecta, intente de nuevo");
		return;
	}
	flag=4;
	displayPathElevation(camino,elevator,dist);
	//deshabilita los campos despues de modificado
	document.getElementById("alturaantenarx").disabled = true;
	document.getElementById("alturaantenatx").disabled = true;
	return;
}
