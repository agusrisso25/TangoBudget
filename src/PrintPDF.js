function printPDF(){
  //var doc = new jsPDF();
    google.visualization.events.addListener(elevation_chart, 'ready', function () {
      chartDiv.innerHTML = '<img src="' + elevation_chart.getImageURI() + '">';
      console.log("se hizo");
    });

    chart.draw(data);

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
