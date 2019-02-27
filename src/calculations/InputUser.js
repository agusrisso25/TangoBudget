/* Este bloque tiene como funcionalidad tomar toda la información que ingresó el usuario en la plataforma y
hacer todos los cálculos necesarios para generar el reporte.
Para ello, es necesario leer toda la información que ingresó el usuario en la plataforma
los pasos de analisis son los siguientes:
1. Se lee toda la información ingresada por el usuario
2. Se calculan las perdidas
3. Se calcula el ángulo tilt entre las antenas
3. Se calcula la potencia de recepción y en función a eso, se analiza el
5. Se calcula el despeje de fresnel del hayDespejeCamino
6. Se pasa la tabla de Resultados
7. Se analiza el margen de fading
*/
function InputUser() {
  var Gtx=parseNumber(document.getElementById("gananciatx").value);
  var Grx=parseNumber(document.getElementById("gananciarx").value);
  var Ptx=parseNumber(document.getElementById("potenciatx").value);

  if(Gtx==""|| Ptx=="" || Grx==""){
    alert("Ingrese la información obligatoria");
    return;
  }

  var MargenFading;
  var disp_canalTOT;
  var disp_mensualMC;
  var disp_anualMC;
  var disp_canalLL;
  var indisp_anualmin;
  var disp_canalTOT_min;
  var enlace;
  var distancia = haversine(radius, latitud, longitud);

  var pol=(document.getElementById("polarizacion").value);
  if (pol=="0")
    alert("Ingrese una polarización");

  var perdidasConectores= parseNumber(document.getElementById("perdidasconectores").value);
  var perdidasOtras=parseNumber(document.getElementById("otrasperdidas").value);
  var perdidasFSL = FSL(distancia); //Se calculan las pérdidas de espacio libre considerando la altura de las antenas con los postes incluidos
  var perdidasLluvia=AtenuacionLluvia();
  var AnguloTilt=Tilt(distancia); // Se calcula el ángulo del inclinación que deben tener las antenas para que tengan LOS

  var diffBullington=0;
  if(fresnelGlobal==1)
    diffBullington=Bullington(distancia);

  var Prx=parseFloat(Gtx+Grx+Ptx-perdidasConectores-perdidasFSL-perdidasOtras-diffBullington); //Se calcula la potencia de recepción
  var sensRX=parseFloat(document.getElementById("sensibilidadrx").value); //parametro de la datasheet de la antena
  if(sensRX>0 || sensRX==""){
    alert("Debe ingresar una Sensibilidad de Recepción correcta");
    return;
  }
  if(Prx>sensRX){
    MargenFading=(Prx-sensRX); //Condicion necesaria para que el receptor pueda recibir la señal
    //disp_canalMC = DispCanalBarnett(distancia,MargenFading);
    var aux = DispCanalITU(distancia,MargenFading);
    disp_mensualMC=aux[0];
    disp_anualMC=aux[1];
    indisp_anualmin=aux[2];
    disp_canalLL= DispCanalLLuvia(perdidasLluvia,MargenFading);
    disp_canalTOT=100-((100-disp_anualMC)+(100-disp_canalLL));
    disp_canalTOT_min=(100-disp_canalTOT)*525600/100;

    if(disp_canalTOT>=99.998){
      //hay que definir cual es el aceptable.
      console.log("Enlace aceptable");
      enlace=0;
    }
    else
      console.log("Enlace no aceptable");
      enlace=1;
    //return;
  }
  else{
    alert("Se debe mejorar la potencia de transmisión.");
    //return;
  }
  //Se analiza la linea de vista para pasar a la tabla de resultados
  if (hayLOS == 1){
    hayLOS="Sí";
  }
  else if (hayLOS == 0){
    hayLOS="No";
  }
  else
    return;

  Resultados(disp_canalLL,disp_mensualMC,disp_anualMC,indisp_anualmin,disp_canalTOT,disp_canalTOT_min,AnguloTilt,Gtx,Grx,Ptx,Prx,MargenFading,sensRX,distancia,perdidasFSL,perdidasLluvia,perdidasConectores,perdidasOtras,enlace);
  print(disp_canalLL,disp_mensualMC,disp_anualMC,indisp_anualmin,disp_canalTOT,disp_canalTOT_min,AnguloTilt,Gtx,Grx,Ptx,Prx,MargenFading,sensRX,distancia,perdidasFSL,perdidasLluvia,perdidasConectores,perdidasOtras,enlace);//se genera la url del PruebaB

  document.getElementById("gananciatx").value="";
  document.getElementById("gananciarx").value="";
  document.getElementById("potenciatx").value="";
  document.getElementById("polarizacion").value="0";
  document.getElementById("sensibilidadrx").value="";
  document.getElementById("perdidasconectores").value="";
  document.getElementById("otrasperdidas").value="";
  return;
}
