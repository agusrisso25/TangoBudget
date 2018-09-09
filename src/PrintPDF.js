function printPDF(){
  /*     var doc = new jsPDF();          
    var elementHandler = {
      '#ignorePDF': function (element, renderer) {
        return true;
      }
    };
    var source = window.document.getElementsByTagName("body")[0];
    doc.fromHTML(
        source,
        15,
        15,
        {
          'width': 180,'elementHandlers': elementHandler
        });
    
    doc.output("dataurlnewwindow");*/

  var pdf = new jsPDF('p', 'pt', 'letter'); //lo genera vacío! Y da errores raros
    pdf.canvas.height = 72 * 11;
    pdf.canvas.width = 72 * 8.5;

    pdf.fromHTML(document.body);

    pdf.save('test.pdf');

 /* var printDoc = new jsPDF();
    printDoc.fromHTML($('#pdf').get(0), 10, 10, {'width': 180});
    printDoc.autoPrint();
    printDoc.output("dataurlnewwindow"); //Este abre una pagina aparte en el browser pero vacía*/

    // this opens a new popup,  after this the PDF opens the print window view but there are browser inconsistencies with how this is handled


}