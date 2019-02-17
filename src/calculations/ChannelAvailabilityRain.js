function DispCanalLLuvia (perdidasLluvia, MargenFading) {

  var c01= 0.12+0.14*Math.log10(Math.pow((Inputfreq*0.1),0.8)); //Cuando Inputfreq es mayor a 10GHz
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

  var k;
  var ec1= (MargenFading/perdidasLluvia);
  console.log("ec1: "+ec1);
  //var ec2=[];
  var res;
  var p=[];
  var i=0;

  k=Math.pow(10,-7);
  ec2[0]=c1*(Math.pow(k,-(c2+c3*Math.log10(k))));
  p[0]=k;
  while(ec1<ec2 && k<Math.pow(10,-2)){
    k=k+0.00002;
    p[i]=k;
    ec2[i]=c1*(Math.pow(k,-(c2+c3*Math.log10(k))));
    console.log("ec2 clau:" +ec2[i]);
    console.log("p clau:" +p[i]);
    console.log("k clau:" +k);

    i++;
  }

  /*for(k=Math.pow(10,-7);k<;(k=k+0.00002)){
    p[i]=k;
    ec2[i]=c1*(Math.pow(k,-(c2+c3*Math.log10(k))));
    if(ec1>ec2){
      res=p[i];
      break;
    }
    i++;
  }*/
  var displluvia=100-p[i-1];
  console.log("Claudia i: "+(i-1));
  console.log("Claudia p[i]: "+p[i-1]);
  console.log("Claudia displluvia: "+displluvia);
  return(displluvia);
}
