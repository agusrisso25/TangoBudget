/* Este bloque tiene como funcionalidad tomar toda la información que ingresó el usuario en la plataforma y
hacer todos los cálculos necesarios para generar el reporte.
Para ello, es necesario leer toda la información que ingresó el usuario en la plataforma
los pasos de analisis son los siguientes:
1. Se lee toda la información ingresada por el usuario
2. Se calculan las perdidas
3. Se calcula la potencia de recepción y el angulo de tilt entre antenas
4. Se calcula el despeje de fresnel del hayDespejeCamino
5. Se pasa la tabla de Resultados
6. Se analiza el margen de fading
*/
function InputUser() {
    var Gtx=parseNumber(document.getElementById("gananciatx").value);
    var Grx=parseNumber(document.getElementById("gananciarx").value);
    var Ptx=parseNumber(document.getElementById("potenciatx").value);
    var MargenFading;
    var disp_canal;

    var distancia = haversine(radius, latitud, longitud);

    var perdidasConectores= parseNumber(document.getElementById("perdidasconectores").value);
    var perdidasOtras=parseNumber(document.getElementById("otrasperdidas").value);
    var perdidasFSL = FSL(distancia); //Se calculan las pérdidas de espacio libre considerando la altura de las antenas con los postes incluidos
    var perdidasLluvia=AtenuacionLluvia();
    var AnguloTilt=Tilt(distancia); // Se calcula el ángulo del inclinación que deben tener las antenas para que tengan LOS

    var diffBullington=0;
    if(fresnelGlobal==1)
      diffBullington=Bullington(distancia);

    var Prx=parseFloat(Gtx+Grx+Ptx-perdidasConectores-perdidasFSL-perdidasOtras-diffBullington); //Se calcula la potencia de recepción
    console.log("Prx es: "+Prx);
    var sensRX=parseFloat(document.getElementById("sensibilidadrx").value); //parametro de la datasheet de la antena
    if(sensRX>0){
      alert("La sensibilidad debe ser menor a cero");
      return;
    }
    if(Prx>sensRX){
      MargenFading=(Prx-sensRX); //Condicion necesaria para que el receptor pueda recibir la señal
      console.log("MF es: "+MargenFading);
      if(MargenFading>=30){
        disp_canal = DispCanal(distancia,MargenFading);
        // disp_canal = DisponibilidadCanal (distancia, MargenFading, htx2, hrx2);

        if(disp_canal>=0.99998)
          console.log("Enlace aceptable");
          //hay que seguir esta parte
        else
          console.log("Se debe mejorar la altura de las antenas o datos del enlace.");
        //return;
      }
      else {
        console.log("Se debe mejorar la altura de las antenas o los datos del enlace.");
        //return;
      }
    }
    else{
      alert("Se debe mejorar la potencia de transmisión.");
      //return;
    }
    //Se envían los resultados a la función Resultados, que permite desplegar una tabla


    //Se analiza la linea de vista para pasar a la tabla de resultados
    if (hayLOS == 1){
      hayLOS="Sí";
    }
    else if (hayLOS == 0){
      hayLOS="No";
    }
    else
      return;
    Resultados(perdidasFSL,disp_canal,AnguloTilt,Gtx,Grx,Ptx,Prx,MargenFading,sensRX,distancia,perdidasLluvia,perdidasConectores,perdidasOtras);
    //se genera la url del PruebaB
    return;
}
