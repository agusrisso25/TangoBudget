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
    var perdidasOtras=0;
    var A=document.getElementById("FactorRugosidad").value;
    var B=0.25;

    var perdidasFSL = FSL(distancia,htx,hrx,freq);
    var MargenFading = MF(distancia,A,B,freq,disp_canal);
    var Prx=Gtx+Grx+Ptx-perdidasConectores-perdidasFSL-perdidasOtras;
    var AnguloTilt=Tilt(dist,htx+altura[0],hrx+altura[altura.length]);

    console.log("La frecuencia ingresada es: " +freq);
    console.log("perdidasFSL: " +perdidasFSL);
    console.log("Prx es: " +Prx);
    console.log("El margen de fading es: "+MargenFading);
    console.log("La disponibildad del canal es: " +disp_canal);
    console.log("El valor de A es: "+A);
    console.log("El angulo del tilt es: " +AnguloTilt);
    //var sensRX=Prx-MF;

    /*if(Prx-MF>sensRX){
      //se debe dibujar la zona de fresnel
      return 0;
    }
    else {
      alert ("No hay sensibilidad del RX suficiente");
      return 2;
    }*/
}
