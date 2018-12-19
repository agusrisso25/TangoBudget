/* This function parses the URL search section and returns an array of pairs
`[key, value]`.

For example:

```
  parseURLParams('?tx=-34.91347579194923,-56.16088096301269'+
    '&rx=-34.91629104960254,-56.16186801593017'
    '&obs0=Arbol,50,10'+
    '&obs1=Edificio,60,1')
```

*/
function parseURLParams(urlSearchString) {
  urlSearchString = urlSearchString || location.search;
  var urlSearchParams = new URLSearchParams(urlSearchString);
  return new Array(...urlSearchParams.entries());
}
