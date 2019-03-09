/* Esta función convierte la coma a punto y el punto al punto.
*/
function parseNumber(numberString){
  var busqueda=numberString.search(",");
  var res;
  if (busqueda>=0)
    res = numberString.replace(",", ".");
  else {
    res= parseFloat(numberString);//numberString.toString().replace(/[.]/, ",");
    /*var reMatch = /^[+-]?(\d+)(?:[,.](\d+))?$/.exec(numberString);
    if (!reMatch) {
      return NaN;
    } else if (!reMatch[2]) {
      return +reMatch[1];
    } else {
      return +(reMatch[1] +'.'+ reMatch[2]);
    }*/
  }
  res=parseFloat(res);
  return (res);
}
