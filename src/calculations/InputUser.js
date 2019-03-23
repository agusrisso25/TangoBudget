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
  if(fresnelGlobal==2){
    alert("El 40% del Fresnel está obstruido. Por favor mejorar las alturas de las antenas para avanzar");
    if(table_div && link){
      document.getElementById('result_table').innerHTML="";
      document.getElementById('link').innerHTML="";
    }
    return;
  }
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
  perdidasFSL=parseFloat(perdidasFSL);
  var perdidasLluvia=AtenuacionLluvia();
  var aux2=Tilt(distancia); // Se calcula el ángulo del inclinación que deben tener las antenas para que tengan LOS
  var TiltTx = aux2[0];
  var TiltRx = aux2[1];

  var diffBullington=0;
  if(fresnelGlobal==1)
    diffBullington=Bullington(distancia).toFixed(8);

  var Prx=parseFloat(Gtx)+parseFloat(Grx)+parseFloat(Ptx)-parseFloat(perdidasConectores)-parseFloat(perdidasFSL)-parseFloat(perdidasOtras)-parseFloat(diffBullington); //Se calcula la potencia de recepción
  Prx=Prx.toFixed(2);
  var sensRX=parseFloat(document.getElementById("sensibilidadrx").value); //parametro de la datasheet de la antena
  if(sensRX>0 || sensRX==""){
    alert("Debe ingresar una Sensibilidad de Recepción correcta");
    return;
  }
  if(Prx>sensRX){
    MargenFading=(Prx-sensRX); //Condicion necesaria para que el receptor pueda recibir la señal
    if (MargenFading<30){
      alert("Se recomienda tener un Margen de Fading mayor a 30 dB");
    }
    //disp_canalMC = DispCanalBarnett(distancia,MargenFading);
    var aux = DispCanalITU(distancia,MargenFading,perdidasLluvia);
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
    else{
      alert("Cuidado! Se recomienda verificar la disponibilidad del canal total.\n Se recomienda verificar: \n 1. Altura de las antenas \n 2.Acortar la distancia entre las antenas  \n 3. Frecuencia de transmisión \n 4. Mejorar el Margen de Fading ");
      enlace=1;
    }
  }
  else{
    alert("Ten cuidado! La potencia de recepción es menor a la sensibilidad. \n Con estos valores el enlace no es aceptable.\n Se sugiere tomar cualquiera de las siguientes opciones: \n 1. Aumentar la potencia de Transmisión \n 2. Aumentar la ganancia de las antenas \n 3. Acortar la distancia entre las antenas \n 4. Disminuir la frecuencia de transmisión");
    document.getElementById('result_table').innerHTML="";
    document.getElementById('link').innerHTML="";
    enlace=1;
  }
  //Se analiza la linea de vista para pasar a la tabla de resultados
  if (hayLOS == 1 || hayLOS=="Si"){
    hayLOS="Si";
  }
  else if (hayLOS == 0 || hayLOS=="No"){
    hayLOS="No";
  }
  else
    return;

  Resultados(disp_canalLL,disp_mensualMC,disp_anualMC,indisp_anualmin,disp_canalTOT,disp_canalTOT_min,TiltTx,TiltRx,Gtx,Grx,Ptx,Prx,MargenFading,sensRX,distancia,perdidasFSL,perdidasLluvia,perdidasConectores,perdidasOtras,diffBullington,enlace);
  print(disp_canalLL,disp_mensualMC,disp_anualMC,indisp_anualmin,disp_canalTOT,disp_canalTOT_min,TiltTx,TiltRx,Gtx,Grx,Ptx,Prx,MargenFading,sensRX,distancia,perdidasFSL,perdidasLluvia,perdidasConectores,perdidasOtras,diffBullington,enlace);//se genera la url del mainB
  return;
}
