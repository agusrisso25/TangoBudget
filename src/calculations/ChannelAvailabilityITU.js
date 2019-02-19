function DispCanalITU (distancia, MargenFading) { // ITU 530 - disp anual
  var dN1 = -400;
  var rugosidad= 5.9; // uso este porque recomienta ITU
  var alturaantena;
  var k;
  var epsilon;
  var Pw;
  var dispmensual;
  var indispminanual;

  if (altura[0]<altura[altura.length-1]){
      alturaantena = altura[0]; // aqui se debe guardar la altura de la antena más baja
  }
  else
      alturaantena = altura[altura.length-1];

  k = Math.pow(10,-4.4-0.0027*dN1)*Math.pow(10+rugosidad,-0.46);
  epsilon = Math.abs(altura[0]-altura[altura.length-1])/distancia;
  Pw = k*Math.pow(distancia,3.4)*Math.pow(1+epsilon,-1.03)*Math.pow(Inputfreq,0.8)*Math.pow(10,-0.00076*alturaantena-MargenFading/10);
  dispmensual = 100-Pw;
  dispanual = PasajeAnual(distancia, epsilon, Pw);
  indispminanual= indispMin(dispanual);
  return [dispmensual,dispanual,indispminanual];
}
