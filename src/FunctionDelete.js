/* Este bloque elimina todos los marcadores en el array removiendo las referencias a ellos y la polyline */
function deleteMarkersAndPath() {
    markers[0].setMap(null); //elimino el marcador A
    markers[1].setMap(null); //elimino el marcador B
    //Vacío todos los arrays:
    markers = [];
    latitud = [];
    longitud = [];
    camino = []; // NO se borra la elevacion
    elevator = [];
    elevations=[];
    altura = [];
    despeje=[];
    muestra_mod=[];
    data=0;
    contador=0;
    cant_redondeo=0;

    path = poly.setPath([]);  // ELIMINA la poly
    document.getElementById('transmisor').value = "";
    document.getElementById('receptor').value = "";
    document.getElementById('alturaantenarx').value = "";
    document.getElementById('alturaantenatx').value = "";
    document.getElementById('frecuencia').value = "";
    document.getElementById("alturaantenatx").disabled = false; //Habilita los campos nuevamente
    document.getElementById("alturaantenarx").disabled = false;
    document.getElementById("frecuencia").disabled = false;

    document.getElementById('result3').innerHTML="";
    document.getElementById("Ldevista").innerHTML= "";
    document.getElementById("Fresnel").innerHTML="";
    document.getElementById('result_table').innerHTML="";
    document.getElementById('table_div').innerHTML="";


    document.getElementById('elevation_chart').innerHTML="";

}
