/* Este bloque tiene como funcionalidad calcular el radio de fresnel y luego ver si el objeto interferente
genera una obstrucción del 40% o 60% del Fresnel.
Se procede a hallar el radio para calcular la zona de Fresnel. Para ello el usuario deberá ingresar:
htx: Altura de la antena transmisora
hrx: Altura de la antena receptora
Pmax: Punto o muestra en el que se coloca el objeto inteferente
h_Pmax: Altura del objeto interferente
*/

function Fresnel(htx,hrx,Pmax,h_Pmax){
  var lambda;
  if(!Inputfreq){
    alert("Ingrese una frecuencia");
    return;
  }
	var c= 3*Math.pow(10,8);
	lambda = c/Inputfreq;

  var distancia = haversine(radius, latitud, longitud);
  tan_alpha = (htx-hrx)/distancia;
  alpha = Math.atan(tan_alpha); //Se halla el ángulo de inclinación entre las dos antenas. En caso que estén a la misma altura el ángulo es cero
  var pto_medio=(distancia*100)/2; //Se halla el punto medio entre las antenas Tx y Rx
  var altura_puntomedio = altura[Math.floor(distancia*100/2)];

  var d1=(Math.abs(pto_medio/Math.cos(alpha)))/100; //Se halla d1= distancia desde Tx al punto medio
  var d2=(Math.abs(pto_medio/Math.cos(alpha)))/100; // Se halla d2= distancia desde Rx al punto medio

  R1=Math.sqrt((lambda*d1*d2)/(d1+d2)); //Se halla el radio de la primera zona de fresnel, por definición

  var fresnel60= R1*0.6;
  var fresnel40= R1*0.4;

  var resultado60;
  var resultado40;

  if (Pmax==0){ //Si el objeto interferente está en la antena Tx
    resultado60=((Math.pow((Pmax*100)-pto_medio,2)/(Math.pow(fresnel60,2)+Math.pow(d2,2))) + (Math.pow(htx-altura_puntomedio,2)/Math.pow(fresnel60,2)));
    resultado40=((Math.pow((Pmax*100)-pto_medio),2)/(Math.pow(fresnel40,2)+Math.pow(d2,2))+ Math.pow((htx-altura_puntomedio),2)/Math.pow(fresnel40,2));
  }
  else if (Pmax==distancia){ //Si el objeto interferente está en la antena Rx
    resultado60=((Math.pow((Pmax*100)-pto_medio),2)/(Math.pow(fresnel60,2)+Math.pow(d2,2))+Math.pow((hrx-altura_puntomedio),2)/Math.pow(fresnel60,2));
    resultado40=((Math.pow((Pmax*100)-pto_medio),2)/(Math.pow(fresnel40,2)+Math.pow(d2,2))+Math.pow((hrx-altura_puntomedio),2)/Math.pow(fresnel40,2));
  }
  else{ //Si el objeto interferente está en el largo del camino y no en los extremos
    resultado60=((Math.pow((Pmax*100)-pto_medio),2)/(Math.pow(fresnel60,2)+Math.pow(d2,2)+Math.pow(h_Pmax-altura_puntomedio,2)/Math.pow(fresnel60,2)));
    resultado40=((Math.pow((Pmax*100)-pto_medio),2)/(Math.pow(fresnel40,2)+Math.pow(d2,2)+Math.pow(h_Pmax-altura_puntomedio,2)/Math.pow(fresnel40,2)));
  }

  if(resultado60>1)
    return 0; //Tengo despeje del 60%
  else if(resultado40>1 && resultado60<1)
    return 1; //Tengo despeje del 40% --> Aca se sugiere hacer Bullington
  else
    return 2;
}
