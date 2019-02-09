function print(perdidasFSL,disp_canal,AnguloTilt,Gtx,Grx,Ptx,Prx,MargenFading,sensRX,distancia,perdidasLluvia,perdidasConectores,perdidasOtras){
  var coordtx=coordenadas[0];
  var coordrx=coordenadas[altura.length-1];
  var htx=altura[0].toFixed(2);
  var hrx=altura[altura.length-1].toFixed(2);
  var dimensionestx=document.getElementById("dimensionestx").value;
  var dimensionesrx=document.getElementById("dimensionesrx").value;
  var pol=parseNumber(document.getElementById("polarizacion").value);

  document.getElementById("link").innerHTML = "Haga click aquí para imprimir la página de resultados: file:///Users/claudiaduarte/Desktop/PruebasTango/TangoBudget/PruebaB.html?perdidasFSL="+perdidasFSL.toFixed(2)+"&disp_canal="+disp_canal+"&AnguloTilt="+AnguloTilt+"&Gtx="+Gtx+"&Grx="+Grx+"&Ptx="+Ptx+"&Prx="+Prx+"&MargenFading="+MargenFading+"&distancia="+distancia+"&perdidasLluvia="+perdidasLluvia+"&perdidasConectores="+perdidasConectores+"&perdidasOtras="+perdidasOtras+"&coordtx="+coordtx+"&coordrx="+coordrx+"&Freq="+Inputfreq+"&pol="+pol+"&htx="+htx+"&hrx="+hrx;
return;
//Titulo del Reporte
//  doc.setFontSize(30);
 // doc.text (50, 50, 'Tango Budget'); // se indica la locacion del texto en el formato de coordenadas (x,y)

/*var elementHandler = {
  '#ignorePDF': function (element, renderer){
    return true;
  }
};
//var source = window.document.getElementsByTagName("body")[0];
 var source = window.document.getElementById("panel-total")[0];
doc.fromHTML(
  source,
  15,
  15,
  {
    'width': 180, 'elementHandlers': elementHandler
  });
*/

  //doc.fromHTML($('#panel-total').get(0), 20, 20, {
    //'width': 500});

  //doc.save('Reporte.pdf');
}
