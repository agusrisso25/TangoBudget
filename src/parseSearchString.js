/* Esta función se utiliza parsear todos los elementos de la URL en mainB y guardarlo en un array
*/
function parseSearchString() {
  result = {};
  location.search.substr(1).split('&').forEach(function (par) {
    var kv = par.split('=');
    result[kv[0]] = kv[1];
  });
  return result;
}
