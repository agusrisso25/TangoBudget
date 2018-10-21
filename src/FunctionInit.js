// Los marcadores aparecen cuando el usuario hace click en el mapa:
// Cada marcador se etiqueta con un letra alfabetica.
var labels = "AB";
var labelIndex = 0;
var markers = []; // Los marcadores se almacenan en un array.
var latitud = [];
var longitud = [];
var radius = 6371; // radio de la tierra
var camino = [];
var altura = [];
var coordenadas = [];
var posic_puntoMax=0;
var valor_puntoMax=0;
var flag=0; //defino este flag para testear si anteriormente se hizo el displayPathElevation
var muestra_mod=[]; // Nos indica cual es el valor del array altura hay que modificar en ModifyHeight
var data;
var chart;
var distanciaobject_array=[]; // Nos indica la distancia desde el TX que queremos modificar
var contador=0;
var elevator;
var dist;
var cant_redondeo;
var Pmax1; //Esta variable corresponde al punto mas alto
var h_Pmax1; //Esta variable corresponde a la altura del punto mas alto
var valuetomodify_array= [];
var elevations;
var data_detabla;
var data_resultados;
var table;
var tableRes;
var hayLOS;
var APP = {

};

// Load the Visualization API and the columnchart package:
google.load("visualization", "1", { packages: ["columnchart"] });
// Inicializo el mapa centrado en un lugar de Montevideo y con su zoom correspondiente
function initMap() {
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
  });

  poly = new google.maps.Polyline({
    strokeColor: "#000000",
    strokeOpacity: 1.0,
    strokeWeight: 3
  });
}
