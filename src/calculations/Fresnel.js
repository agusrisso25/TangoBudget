function Fresnel(freq,htx,hrx,Pmax,h_Pmax){
  //Se procede a hallar el radio para calcular la zona de Fresnel
  var lambda;
	var c= 3*10^8;
	lambda = c/freq;
  var distancia = haversine(radius, latitud, longitud);
  tan_alpha=((htx-hrx)/distancia);
  alpha=Math.atan(tan_alpha);
  var pto_medio=distancia/2;
  var d1=pto_medio/Math.cos(alpha);
  var d2=pto_medio/Math.cos(alpha);
  var altura_puntomedio= altura[(cant_redondeo/2)];
  console.log("altura_puntomedio: " +altura_puntomedio);

  R1=Math.sqrt((lambda*d1*d2)/(d1+d2));

  var fresnel80= R1*0.8;
  var fresnel60= R1*0.6;
  var resultado80;
  var resultado60;

  if (Pmax==0){
    resultado80=((Pmax*100)-pto_medio)^2/((fresnel80^2+d2^2) + (htx-altura_puntomedio)^2/(fresnel80^2));
    resultado60=((Pmax*100)-pto_medio)^2/((fresnel60^2+d2^2) + (htx-altura_puntomedio)^2/(fresnel60^2));
  }
  else if (Pmax==(cant_redondeo-1)*100){
    resultado80=((Pmax*100)-pto_medio)^2/((fresnel80^2+d2^2) + (hrx-altura_puntomedio)^2/(fresnel80^2));
    resultado60=((Pmax*100)-pto_medio)^2/((fresnel60^2+d2^2) + (hrx-altura_puntomedio)^2/(fresnel60^2));
  }
  else{
    resultado80=((Pmax*100)-pto_medio)^2/((fresnel80^2+d2^2) + (h_Pmax-altura_puntomedio)^2/(fresnel80^2));
    resultado60=((Pmax*100)-pto_medio)^2/((fresnel60^2+d2^2) + (h_Pmax-altura_puntomedio)^2/(fresnel60^2));
  }

  if(resultado80>1)
    return 0; //Tengo despeje del 80%
  else if(resultado60>1 && resultado80<1)
    return 1; //Tengo despeje del 60%
  else
    return 2; //No tengo despeje de fresnel
}
