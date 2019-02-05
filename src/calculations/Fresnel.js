/* Este bloque tiene como funcionalidad calcular el radio de fresnel y luego ver si el objeto interferente
genera una obstrucción del 40% o 60% del Fresnel.
Se procede a hallar el radio para calcular la zona de Fresnel. Para ello el usuario deberá ingresar:
Pmax: Punto o muestra en el que se coloca el objeto inteferente
h_Pmax: Altura del objeto interferente
*/

function Fresnel(Pmax,h_Pmax){
  var lambda;
  if(!Inputfreq){
    alert("Ingrese una frecuencia");
    return;
  }

	lambda = (2.998*Math.pow(10,8))/(Inputfreq*Math.pow(10,9));//c/(Inputfreq*Math.pow(10,9));

  var distancia = (haversine(radius, latitud, longitud))*1000;
  var pmedio=(distancia)/2; //Se halla el punto medio entre las antenas Tx y Rx
  var h_pmedio = ((-altura[0]+altura[altura.length-1])/distancia)*(distancia/2)+altura[0];
  var alpha=Math.atan2((altura[altura.length-1]-altura[0]),distancia); //Resultado en Radianes
  console.log("alpha: "+alpha);

  var d1=pmedio/Math.cos(((-2/distancia)*(altura[0]-h_pmedio))/distancia);
  var d2=pmedio/Math.cos(((-2/distancia)*(altura[altura.length-1]-h_pmedio))/distancia);
  console.log("d1: "+d1);
  console.log("d2: "+d2);
  console.log("lambda: "+lambda);

  R1=Math.sqrt((lambda*d1*d2)/(d1+d2)); //Se halla el radio de la primera zona de fresnel, por definición

  console.log("R1: "+R1);
  console.log("pto_medio: "+pmedio);
  console.log("altura_ptomedio: "+h_pmedio);

  var fresnel60= R1*0.6;
  var fresnel40= R1*0.4;

  console.log("fresnel60: "+fresnel60);
  console.log("fresnel40: "+fresnel40);
  console.log("Pmax: "+Pmax);
  console.log("h_Pmax: "+h_Pmax);

  pendLOS=((-altura[0]+altura[altura.length-1])/distancia)*(distancia/2)+altura[0];
  var resultadofresnelTOT;

  if(h_Pmax>h_pmedio) {
    resultadofresnelTOT=2;
  }
  else{
    var resultado60=Math.pow((Math.cos(alpha)*(Pmax-pmedio)+Math.sin(alpha)*(h_Pmax-h_pmedio)),2)/(Math.pow(fresnel60,2)+Math.pow(d2,2))+Math.pow((Math.sin(alpha)*(Pmax-pmedio)-Math.cos(alpha)*(h_Pmax-h_pmedio)),2)/(Math.pow(fresnel60,2));
    var resultado40=Math.pow((Math.cos(alpha)*(Pmax-pmedio)+Math.sin(alpha)*(h_Pmax-h_pmedio)),2)/(Math.pow(fresnel40,2)+Math.pow(d2,2))+Math.pow((Math.sin(alpha)*(Pmax-pmedio)-Math.cos(alpha)*(h_Pmax-h_pmedio)),2)/(Math.pow(fresnel40,2));
    console.log("resultado60: "+resultado60);
    console.log("resultado40: "+resultado40);

    if(resultado40<1 && resultado40>0)
      resultadofresnelTOT=2; //Tengo despeje menor a 40%
    else if(resultado40>=1 && resultado60<1)
      resultadofresnelTOT=1; //Tengo despeje del 40%
    else if(resultado60>1)
      resultadofresnelTOT=0; //Tengo despeje del 60%
  }
  return resultadofresnelTOT;
}
