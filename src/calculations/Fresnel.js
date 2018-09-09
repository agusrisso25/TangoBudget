function Fresnel(freq,htx,hrx){
  //Se procede a hallar el radio para hallar la zona de Fresnel
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

  var resultado80=((Pmax1*100)-pto_medio)^2/(fresnel80^2+d2^2) + (h_Pmax1-altura_puntomedio)^2/(fresnel80^2);
  var resultado60=((Pmax2*100)-pto_medio)^2/(fresnel60^2+d2^2) + (h_Pmax2-altura_puntomedio)^2/(fresnel60^2);

  if(resultado80>1)
    return despeje80;
  else if(resultado60>1)
    return despeje60;
  else
    return sindespeje;
}
