/* Esta función convierte la coma a punto y el punto al punto.
*/
function parseNumber(numberString){
  var busqueda=numberString.search(",");
  var res;
  if (busqueda>=0)
    res = parseFloat(numberString.replace(",", "."));
  else {
    res= parseFloat(numberString);
  }
  return (res);
}
