/* Se calcula la disponibilidad anual por lluvia por definición de la ITU
Es necesario pasar los parámetros de pérdidas por lluvia y el Margen de Fading calculado para poder aplicar
la definición en el marco teórico */

function DispCanalLLuvia (perdidasLluvia, MargenFading) {

  var c01= 0.12+0.4*Math.log10(Math.pow((Inputfreq/10),0.8)); //Cuando Inputfreq es mayor a 10GHz
  var c02= 0.12; //Cuando Inputfreq es menor a 10 GHz
  var c0;
  var k;
  var ec1=(MargenFading/perdidasLluvia);
  var result_p;
  var result_ec2;
  var p=[];
  var i=0;
  var j=0;
  var aux=[];
  var index_p;
  var displluvia;

  if(Inputfreq<10){
    c0=c02;
  }
  else {
    c0=c01;
  }

  var c1=Math.pow(0.07,c0)*(Math.pow(0.12,(1-c0)));
  var c2=0.855*c0+0.546*(1-c0);
  var c3=0.139*c0+0.043*(1-c0);

  i=0;
  for(k=0.01;k>Math.pow(10,-7);k=k-0.000001){
    p[i]=k;
    ec2[i]=c1*(Math.pow(k,-(c2+c3*Math.log10(k))));
    aux[i]=ec2[i];
    i++;
  }

  var A=aux.sort();

  result_ec2=A[A.length-1];
  index_p=ec2.indexOf(result_ec2);
  result_p=p[index_p];

  displluvia=100-result_p;
  return(displluvia);
}
