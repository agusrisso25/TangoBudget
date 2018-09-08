        // Elimina todos los marcadores en el array removiendo las referencias a ellos y la polyline:
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
            data=0;

            path = poly.setPath([]);  // ELIMINA la poly
            document.getElementById('transmisor').value = "";
            document.getElementById('receptor').value = "";
            document.getElementById('result3').innerHTML="";

            document.getElementById('elevation_chart').innerHTML="";
            document.getElementById('elevation_chart2').innerHTML="";
        }
