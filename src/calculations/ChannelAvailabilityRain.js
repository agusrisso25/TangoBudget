function DispCanalLLuvia (perdidasLluvia, MargenFading) {

  var c01= 0.12+0.4*Math.log10(Math.pow((Inputfreq/10),0.8)); //Cuando Inputfreq es mayor a 10GHz
  var c02= 0.12; //Cuando Inputfreq es menor a 10 GHz
  var c0;
  if(Inputfreq<10){
    c0=c02;
  }
  else {
    c0=c01;
  }

  var c1=Math.pow(0.07,c0)*(Math.pow(0.12,(1-c0)));
  var c2=0.855*c0+0.546*(1-c0);
  var c3=0.139*c0+0.043*(1-c0);

  console.log("c0: "+c0);
  console.log("c1: "+c1);
  console.log("c2: "+c2);
  console.log("c3: "+c3);

  var k;
  var ec1= (MargenFading/perdidasLluvia);
  console.log("ec1: "+ec1);
  //var ec2=[];
  var res;
  var p=[];
  var i=0;
  var aux=[];

  i=0;
  //ec2[0]=c1*(Math.pow(k,-(c2+c3*Math.log10(k))));
  for(k=0.01;k>Math.pow(10,-7);k=k-0.000001){
    //k=k-0.000001;
    p[i]=k;
    ec2[i]=c1*(Math.pow(k,-(c2+c3*Math.log10(k))));
    aux[i]=ec2[i];
    i++;
  }

  var A=aux.sort();

  var j=0;
  /*while(A[A.length-j]==isNaN && j<10){
    j++;
  }*/
  var result_ec2=A[A.length-1];
  var index_p=ec2.indexOf(result_ec2);
  var result_p=p[index_p];

  var displluvia=100-result_p;

  console.log("Claudia result_ec2: "+result_ec2);
  console.log("Claudia p %: "+index_p);
  console.log("Claudia displluvia: "+displluvia);
  return(displluvia);
}
