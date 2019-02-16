function DispCanalLluvia (perdidasLluvia, MargenFading) {

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
  var p;
  var ec1= (MargenFading/perdidasLluvia);
  var ec2;

  for(k=Math.pow(10,-7);k<Math.pow(10,-2);(k=k+0.00002)){
    ec2=c1*(Math.pow(k,-(c2+c3*Math.log10(k))));
    if(ec1>ec2)
      p=(k-0.00002);
    console.log("k es:"+k);
  }
  var displluvia=100-p;
  return(displluvia);
}
