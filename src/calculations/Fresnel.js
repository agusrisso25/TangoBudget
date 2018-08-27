function Fresnel(freq,htx,hrx){
  //Se procede a hallar el radio para hallar la zona de Fresnel
  var lambda;
	var c= 3*10^8;
	lambda = c/freq;
  var distancia = haversine(radius, latitud, longitud);
  tan_alpha=(htx-hrx)/distancia;
  alpha=Math.atan(tan_alpha);
  var pto_medio=distancia/2;
  var d1=pto_medio/Math.cos(alpha);
  var d2=pto_medio/Math.cos(alpha);
  R1=Math.sqrt((lambda*d1*d2)/(d1+d2));

  var fresnel80= R1*0.8;
  var fresnel60= R1*0.6;
  var altura_puntomedio= altura[mitad_cantmuestras];
  var resultado80=(x-pto_medio)^2/(fresnel80^2+d2^2) + (h-altura_puntomedio)^2/(fresnel80^2);
  var resultado60=(x-pto_medio)^2/(fresnel60^2+d2^2) + (h-altura_puntomedio)^2/(fresnel60^2);

  return 0;
}
