/* Esta función convierte la coma a punto y el punto al punto.
*/
function parseNumber(numberString){
  /*var reMatch = /^[+-]?(\d+)(?:[,.](\d+))?$/.exec(numberString);
  if (!reMatch) {
    return NaN;
  } else if (!reMatch[2]) {
    return +reMatch[1];
  } else {
    return +(reMatch[1] +'.'+ reMatch[2]);
  }*/
  var res = numberString.replace(",", ".");
  res=parseFloat(res);
  return (res);
}
