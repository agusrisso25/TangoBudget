function DispCanalITU (distancia, MargenFading) { // ITU 530 - disp anual

    var dN1 = -400;
    var rugosidad;
    var alturaantena;

    if (altura[0]<altura[altura.length-1]){
        alturaantena = altura[0]; // aqui se debe guardar la altura de la antena más baja
    }
    else
        alturaantena = altura[altura.length-1];

//    var A = document.getElementById("FactorRugosidad").value;
//    var arrayA= [0, 4, 1, 0.25];

//	if (A == "0"){
//		alert("Favor de completar el factor de rugosidad.");
//		return;
//	}
//	else {
//		rugosidad = arrayA [A];
//	    }

var rugosidad2 = 5.9; // uso este porque recomienta ITU

var k = Math.pow(10,-4.4-0.0027*dN1)*Math.pow(10+rugosidad2,-0.46);
var epsilon = Math.abs(altura[0]-altura[altura.length-1])/distancia;
var Pw = k*Math.pow(distancia,3.4)*Math.pow(1+epsilon,-1.03)*Math.pow(Inputfreq,0.8)*Math.pow(10,-0.00076*alturaantena-MargenFading/10);
var dispmensual = 100-Pw;
console.log("Indisp MC mes: "+Pw);
console.log("Disp MC mes: "+ dispmensual);

var dispanual = PasajeAnual(distancia, epsilon, Pw);
var indispminanual= indispMin(dispanual);
return [dispmensual,dispanual,indispminanual];

}
