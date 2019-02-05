// Los marcadores aparecen cuando el usuario hace click en el mapa:
// Cada marcador se etiqueta con un letra alfabetica.
var labels = "TR";
var labelIndex = 0;
var markers = []; // Los marcadores se almacenan en un array.
var latitud = []; //las latitudes se almacenan en un array
var longitud = []; //las longitudes se almacenan en un array
var radius = 6371; // radio de la tierra
var camino = [];
var altura = []; //Array que tiene toda la información del perfil de elevación y sin errores
var coordenadas = [];
var flag=0; //defino este flag para testear caso de uso en displayPathElevation
var muestra_mod=[]; // Nos indica cual es el valor de la muestra que hay que modificar en ModifyHeight
var data; //Información almacenada sobre el perfil de elevación
var chart;
var chartDiv;
var distanciaobject_array=[]; // Nos indica la distancia desde el TX que queremos modificar
var contador=0; //cuenta la cantidad de objetos interferentes agregados
var elevator;
var dist;
var cant_redondeo; //Cuenta la cantidad de muestras que tiene nuestro perfil de elevación
var valuetomodify_array= [];
var elevations;
var data_detabla;
var data_resultados;
var table;
var tableRes;
var hayLOS;
//Creo estos dos arrays para guardar los valores que tienen un despeje de 40% y 60%
var distanciaFresnel=[];
var alturaFresnel=[];
var resFresnel;
var fresnelOI_array=[];
var hayDespejeCamino=[];
var Inputfreq; //Frecuencia que ingresó el usuario en la plataforma
var fresnelGlobal;
var despeje=[];

var APP = { };
APP.objInterferente = null;

// Load the Visualization API and the columnchart package:
google.load("visualization", "1", { packages: ["columnchart"] });
// Inicializo el mapa centrado en un lugar de Montevideo y con su zoom correspondiente
function initMapInteractive() {
  var uluru = { lat: -34.916467, lng: -56.154272 };
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: uluru
  });

 // var geocoder = new google.maps.Geocoder();// creo que no la usamos para nada
  //var infowindow = new google.maps.InfoWindow;
  // Evento que escucha el click y llama a la funcion addMarkersAndAll() cuando sucede.
  google.maps.event.addListener(map, "click", function(event) {
    if (markers.length <= 1)
      //Limito a 2 marcadores maximo.
      addMarkersAndAll(event.latLng, map);
  parseSearchString();
  });

  poly = new google.maps.Polyline({
    strokeColor: "#000000",
    strokeOpacity: 1.0,
    strokeWeight: 3
  });
}

function initMapPrintable() {
  var uluru = { lat: -34.916467, lng: -56.154272 };
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: uluru
  });

 // var geocoder = new google.maps.Geocoder();// creo que no la usamos para nada
  //var infowindow = new google.maps.InfoWindow;
  // Evento que escucha el click y llama a la funcion addMarkersAndAll() cuando sucede.
  google.maps.event.addListener(map, "click", function(event) {
    if (markers.length <= 1)
      //Limito a 2 marcadores maximo.
      addMarkersAndAll(event.latLng, map);
  parseSearchString();
  });

  poly = new google.maps.Polyline({
    strokeColor: "#000000",
    strokeOpacity: 1.0,
    strokeWeight: 3
  });
}
