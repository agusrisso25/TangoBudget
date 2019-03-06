/* Este bloque toma toda la información calculada y arma el link para que el usuario pueda ingresar al reporte final
*/
function print(disp_canalLL,disp_mensualMC,disp_anualMC,indisp_anualmin,disp_canalTOT,disp_canalTOT_min,TiltTx,TiltRx,Gtx,Grx,Ptx,Prx,MargenFading,sensRX,distancia,perdidasFSL,perdidasLluvia,perdidasConectores,perdidasOtras){
  var lat0=latitud[0].toFixed(3);
  var lng0=longitud[0].toFixed(3);
  var lat1=latitud[1].toFixed(3);
  var lng1=longitud[1].toFixed(3);
  var coordtx=lat0+","+lng0;
  var coordrx=lat1+","+lng1;
  var htx=altura[0].toFixed(2);
  var hrx=altura[altura.length-1].toFixed(2);
  var dimensionestx=document.getElementById("dimensionestx").value;
  var dimensionesrx=document.getElementById("dimensionesrx").value;
  var pol=parseNumber(document.getElementById("polarizacion").value);
  var freq=Inputfreq;
  var fresnel=fresnelGlobal;

  document.getElementById("link").innerHTML = '<a href="PruebaB.html?perdidasFSL='+ perdidasFSL.toFixed(2) +
     '&disp_canalTOT='+ disp_canalTOT.toFixed(6) +
     '&disp_canalLL='+disp_canalLL.toFixed(6)+
     '&disp_mensualMC='+disp_mensualMC.toFixed(6)+
     '&disp_anualMC='+disp_anualMC.toFixed(6)+
     '&indisp_anualmin='+indisp_anualmin.toFixed(6)+
     '&disp_canalTOT_min='+disp_canalTOT_min.toFixed(6)+
     '&TiltTx='+TiltTx.toFixed(2)+
     '&TiltRx='+TiltRx.toFixed(2)+
     '&Gtx='+Gtx+
     '&Grx='+Grx+
     '&Ptx='+Ptx+
     '&Prx='+Prx.toFixed(3)+
     '&MargenFading='+MargenFading+
     '&distancia='+distancia.toFixed(3)+
     '&perdidasLluvia='+perdidasLluvia+
     '&perdidasConectores='+perdidasConectores+
     '&perdidasOtras='+perdidasOtras+
     '&coordtx='+coordtx+
     '&coordrx='+coordrx+
     '&Freq='+freq+
     '&pol='+pol+
     '&htx='+htx+
     '&hrx='+hrx+
     '&sensRX='+sensRX+
     '&cant_redondeo='+cant_redondeo+
     '&altura='+altura+
     '&muestra_mod='+muestra_mod+
     '&contador='+contador+
     '&valuetomodify_array='+valuetomodify_array+
     '&fresnelGlobal='+fresnel+
     '" target="_blank">Haga click aquí para imprimir la página de resultados</a>';
  return;
}
