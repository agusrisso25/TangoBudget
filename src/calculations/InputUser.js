//Funcion para tomar los valores que ingresa el usuario
function InputUser() {
    var Gtx=document.getElementById("gananciatx").value;
    var Grx=document.getElementById("gananciarx").value;
    var Ptx=document.getElementById("potenciatx").value;
    var freq=document.getElementById("frecuencia").value;
    var disp = document.getElementById("disponibilidad").value;
    var disp_canal=disp/100;

    var htx=document.getElementById("alturaantenatx").value;
    var hrx=document.getElementById("alturaantenarx").value;
    var distancia = haversine(radius, latitud, longitud);
    var perdidasConectores=document.getElementById("perdidasconectores").value;
    var perdidasOtras=document.getElementById("otrasperdidas").value;
    var A=document.getElementById("FactorRugosidad").value;
    var B=0.25; //Dado que esto apunta a estudios de Uruguay, este valor no cambia
    var cant_muestras=dist*100;
    var cant_redondeo=Math.floor(cant_muestras);


    var htx2= (parseFloat(htx)+parseFloat(altura[0])); //Se suma la altura inicial a la altura definida por el usuario
    var hrx2= (parseFloat(hrx)+parseFloat(altura[cant_redondeo-1]));

    var perdidasFSL = FSL(distancia,htx2,hrx2,freq);
    var MargenFading = MF(distancia,A,B,freq,disp_canal);
    var Prx=Gtx+Grx+Ptx-perdidasConectores-perdidasFSL-perdidasOtras;
    var AnguloTilt=Tilt(distancia,htx2,hrx2);

    console.log("La frecuencia ingresada es: " +freq);
    console.log("perdidasFSL: " +perdidasFSL);
    console.log("Prx es: " +Prx);
    console.log("El margen de fading es: "+MargenFading);
    console.log("La disponibildad del canal es: " +disp_canal);
    console.log("El valor de A es: "+A);
    console.log("El angulo del tilt es: " +AnguloTilt);

    //var sensRX=Prx-MargenFading;
    //var sensRXdeseada=parseFloat(document.getElementById("sensibilidadrx").value);
    if (hayLOS == 1){
      document.getElementById("Ldevista").innerHTML = "Si!";
      hayLOS=true;
    }
    else if (hayLOS == 0){
      hayLOS=false;
      document.getElementById("Ldevista").innerHTML = "No!";
    }
    else
      document.getElementById("Ldevista").innerHTML = "Indefinido";

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

    Resultados(hayLOS,perdidasFSL,MargenFading,AnguloTilt,despeje80,despeje60);
    return;

}
