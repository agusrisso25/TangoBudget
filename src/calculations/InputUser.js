/* Este bloque tiene como funcionalidad tomar toda la información que ingresó el usuario en la plataforma y
hacer todos los cálculos necesarios para generar el reporte.
Para ello, es necesario leer toda la información que ingresó el usuario en la plataforma
*/
function InputUser() {
    var Gtx=document.getElementById("gananciatx").value;
    var Grx=document.getElementById("gananciarx").value;
    var Ptx=document.getElementById("potenciatx").value;
    var freq=document.getElementById("frecuencia").value;
    var disp = document.getElementById("disponibilidad").value;
    var disp_canal=disp/100;

    var cant_muestras=dist*100;
    var cant_redondeo=Math.floor(cant_muestras);

    var htx=document.getElementById("alturaantenatx").value;
    var hrx=document.getElementById("alturaantenarx").value;
    var htx2= (parseFloat(htx)+parseFloat(altura[0])); //Se suma la altura inicial a la altura definida por el usuario
    var hrx2= (parseFloat(hrx)+parseFloat(altura[cant_redondeo-1]));

    var distancia = haversine(radius, latitud, longitud);
    var perdidasConectores=document.getElementById("perdidasconectores").value;
    var perdidasOtras=document.getElementById("otrasperdidas").value;
    var A=document.getElementById("FactorRugosidad").value;
    var B=0.25; //Dado que esto apunta a estudios enfocados en Uruguay, este valor no cambia bajo ningún concepto

    //Cálculos de algunas pérdidas
    var perdidasFSL = FSL(distancia,htx2,hrx2,freq); //Se calculan las pérdidas de espacio libre considerando la altura de las antenas con los postes incluidos
    var MargenFading = MF(distancia,A,B,freq,disp_canal); //Se calcula el margen de Fading por definición
    var Prx=Gtx+Grx+Ptx-perdidasConectores-perdidasFSL-perdidasOtras; //Se calcula la potencia de recepción
    var AnguloTilt=Tilt(distancia,htx2,hrx2); // Se calcula el ángulo del inclinación que deben tener las antenas para que tengan LOS

    console.log("La frecuencia ingresada es: " +freq);
    console.log("perdidasFSL: " +perdidasFSL);
    console.log("Prx es: " +Prx);
    console.log("El margen de fading es: "+MargenFading);
    console.log("La disponibildad del canal es: " +disp_canal);
    console.log("El valor de A es: "+A);
    console.log("El angulo del tilt es: " +AnguloTilt);

    //var sensRX=Prx-MargenFading;
    //var sensRXdeseada=parseFloat(document.getElementById("sensibilidadrx").value);

    //Se calcula si hay línea de vista
    if (hayLOS == 1){
      document.getElementById("Ldevista").innerHTML = "¡Hay línea de vista!";
      hayLOS=true;
    }
    else if (hayLOS == 0){
      hayLOS=false;
      document.getElementById("Ldevista").innerHTML = "¡Cuidado! No hay línea de vista. Se sugiere aumentar las alturas de las antenas.";
    }
    else
      return;

    //Se calcula si hay despeje de fresnel
    var hayDespeje1=Fresnel(freq,htx2,hrx2,Pmax1,h_Pmax1);
    var despeje80;
    var despeje60;
    if(hayDespeje1==0){ //Si hay despeje en el punto mas alto, entonces no calculo del segundo pmax
      console.log("Existe el despeje del 80%");
      despeje80=true;
      despeje60=true;
    }
    else if (hayDespeje1==1){ //El punto mas alto tiene un despeje 60%
      console.log("Existe el despeje del 60%");
      despeje80=false;
      despeje60=true;
    }
    else{
      console.log("No hay despeje de Fresnel");
      despeje80=false;
      despeje60=false;
    }
    //Se envían los resultados a la función Resultados, que permite desplegar una tabla
    Resultados(hayLOS,perdidasFSL,MargenFading,AnguloTilt,despeje80,despeje60);
    return;

}
