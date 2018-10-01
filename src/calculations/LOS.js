var LOS = (function () {
  var chart2DrawCount = 0;

return function LOS(elevations,coordenadas) {
//El data2 se va a borrar mas adelante.
  var data2 = new google.visualization.DataTable();
  data2.addColumn('string', 'Muestras');
  data2.addColumn('number', 'Elevacion');
	for (var j = 0; j < elevations.length; j++) {
    data2.addRow(['',altura[j]]);
		if(data2.getValue(j,1)=='undefined'){
      coordenadas [j]=0;
  		altura[j]=0;
	  }
  }
  var options = {
  	height: 200,
  	legend: 'none',
  	titleY: 'Perfil de elevacion (m)',
  };
  if (chart2DrawCount === 0) {
    var chart2 = new google.visualization.LineChart(document.getElementById('elevation_chart2'));
    chart2.draw(data2, options);
    chart2DrawCount++;
  }


  var pend1;
  var pend2;
  var posic_Pmax2;
  var posic_Pmax= altura.indexOf(data.getDistinctValues(1)[elevations.length-1]); //calculo la posicion del array del punto mas alto

  //CASO A: La posicion máxima es distinta al origen o al destino, calculo altura del punto maximo.
  if(posic_Pmax != 0 && posic_Pmax != elevations.length-1){
  	//caso 1: Pmax mayor a ambas antenas
  	console.log("Prueba: " +data.getDistinctValues(1)[elevations.length-1]);
  	var Pmax= data.getDistinctValues(1)[elevations.length-1].toFixed(3); //calculo altura maxima
    if (Pmax>altura[elevations.length-1].toFixed(3) && Pmax>altura[0].toFixed(3)){
  		return 0; //NO TENGO LOS: return 0
  }
  //caso 2: Pmax mayor a la antena Tx y menor a la Rx
  else if (altura[0].toFixed(3)<Pmax<altura[elevations.length-1].toFixed(3)){ //el punto mas alto es el de la posicion elevations.length
  	pend1= ((altura[elevations.length-1].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
  	pend2= (Pmax-altura[0].toFixed(3))/(posic_Pmax-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
  	if (pend1>=pend2)
  		return 1; //TENGO LOS: return 1
  	else
  		return 0; //NO TENGO LOS: return 0
  	}
  //caso 3: Pmax mayor a la antena Rx y menor a la Tx
  else if (altura[elevations.length-1].toFixed(3)<Pmax<altura[0].toFixed(3)){ //el punto mas bajo es el de la posicion 0
  	pend1= ((altura[elevations.length-1].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
  	pend2= (Pmax-altura[0].toFixed(3))/(posic_Pmax-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
  	if (pend2>=pend1)
  		return 1; //TENGO LOS: return 1
  	else
  		return 0; //NO TENGO LOS: return 0
  }
  //caso 4: Pmax menor a ambas antenas
  else
  	return 1; //tengo LOS: return 1
  }

  //CASO B: La posicion máxima el origen o el destino
  else if(posic_Pmax == 0 || posic_Pmax == elevations.length-1){
		posic_Pmax2= altura.indexOf(data.getDistinctValues(1)[elevations.length-2]);
	  if(posic_Pmax2== 0 || posic_Pmax2 == elevations.length-1){ //Si Pmax2 sigue siendo uno de los extremos...
			var Pmax3= data.getDistinctValues(1)[elevations.length-3].toFixed(1);
			var posic_Pmax3=altura.indexOf(data.getDistinctValues(1)[elevations.length-3]);
	    //caso 1: Pmax3 mayor a ambas antenas
    	if (Pmax3>altura[elevations.length-1].toFixed(3) && Pmax3>altura[0].toFixed(3)){
		      return 0; //NO TENGO LOS: return 0
	    }
	  //caso 2: Pmax3 mayor a la antena Tx y menor a la Rx
	    else if (altura[0].toFixed(3)<Pmax3<altura[elevations.length-1].toFixed(3)){ //el punto mas alto es el de la posicion elevations.length
  		    pend1= ((altura[elevations.length-2].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
  		    pend2= (Pmax3-altura[0].toFixed(3))/(posic_Pmax3-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
  	      if (pend1>=pend2)
  				    return 1; //TENGO LOS: return 1
  			  else
  				    return 0; //NO TENGO LOS: return 0
          }
	  //caso 3: Pmax mayor a la antena Rx y menor a la Tx
	   else if (altura[elevations.length-1].toFixed(3)<Pmax3<altura[0].toFixed(3)){ //el punto mas bajo es el de la posicion 0
		     pend1= ((altura[elevations.length-1].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
		     pend2= (Pmax3-altura[0].toFixed(3))/(posic_Pmax3-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
		     if (pend2>=pend1)
			      return 1; //TENGO LOS: return 1
		     else
			      return 0; //NO TENGO LOS: return 0
	   }
	  //caso 4: Pmax3 menor a ambas antenas
     else
    	 return 1; //tengo LOS: return 1
     }
  else
	 return 1; //tengo LOS: return 1
}

else{ // Si Pmax 2 es la maxima altura en mi path...
	//caso 1: Pmax mayor a ambas antenas
	var Pmax2=data.getDistinctValues(1)[elevations.length-2].toFixed(1); //nos da el valor de altura mas alto
  if (Pmax2>altura[elevations.length-1].toFixed(3) && Pmax2>altura[0].toFixed(3)){
		return 0; //NO TENGO LOS: return 0
	}
  //caso 2: Pmax mayor a la antena Tx y menor a la Rx
	else if (altura[0].toFixed(3)<Pmax2<altura[elevations.length-1].toFixed(3)){ //el punto mas alto es el de la posicion elevations.length
		pend1= ((altura[elevations.length-1].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
		pend2= (Pmax2-altura[0].toFixed(3))/(posic_Pmax2-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
			if (pend1>=pend2)
				return 1; //TENGO LOS: return 1
			else
				return 0; //NO TENGO LOS: return 0
	}

	//caso 3: Pmax mayor a la antena Rx y menor a la Tx
	else if (altura[elevations.length-1].toFixed(1)<Pmax2<altura[0].toFixed(1)){ //el punto mas bajo es el de la posicion 0
		pend1= ((altura[elevations.length-1].toFixed(1)-altura[0].toFixed(1))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
		pend2= (Pmax2-altura[0].toFixed(1))/(posic_Pmax2-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
		if (pend2>=pend1)
			return 1; //TENGO LOS: return 1
		else
			return 0; //NO TENGO LOS: return 0
	}
	//caso 4: Pmax menor a ambas antenas
    else
    	return 1; //tengo LOS: return 1
   	}
};
})();
