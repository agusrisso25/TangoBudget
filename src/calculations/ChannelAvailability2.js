function DisponibilidadCanal (distancia, MargenFading, htx, hrx) {

    var dN1 = -400;
    var rugosidad;
    var alturaantena;

    if (htx<hrx){
        alturaantena = htx; // aqui se debe guardar la altura de la antena más baja
    }
    else
        alturaantena = hrx;

    var A = document.getElementById("FactorRugosidad").value;
    var arrayA= [0, 4, 1, 0.25];

	if (A == "0"){
		alert("Favor de completar el factor de rugosidad.");
		return;
	}
	else {
		rugosidad = arrayA [A];
	    }


var k = Math.pow(10, -4.4-0.0027*dN1)*Math.pow(10 + rugosidad, -0.46);
var epsilon = Math.abs(altura[0]-altura[altura.length-1])/distancia;

var Pw = k*Math.pow(1 + epsilon, -1.03)*Math.pow(Inputfreq, 0.8)*Math.pow(10, -0.00076*alturaantena*MargenFading/10);

return dispanual;

}
