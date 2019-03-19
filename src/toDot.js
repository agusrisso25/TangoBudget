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


/*var reMatch = /^[+-]?(\d+)(?:[,.](\d+))?$/.exec(numberString);
if (!reMatch) {
  return NaN;
} else if (!reMatch[2]) {
  return +reMatch[1];
} else {
  return +(reMatch[1] +'.'+ reMatch[2]);
}*/
