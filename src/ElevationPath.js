function displayPathElevation(camino, elevator, dist) {
      var cant_muestras = dist*100; // 100 muestras por km
      var cant_redondeo= Math.floor(cant_muestras);
      console.log("Cantidad de muestras por km: "+cant_muestras);
      console.log("Redondeo de muestras: "+ cant_redondeo);

        // Create a PathElevationRequest object using this array.
        // Initiate the path request.
        elevator.getElevationAlongPath({
          'path': camino,
          'samples': cant_redondeo
        }, plotElevation);
      }
        // Takes an array of ElevationResult objects, draws the path on the map
        // and plots the elevation profile on a Visualization API ColumnChart.
        function plotElevation(elevations, status) {
            var chartDiv = document.getElementById('elevation_chart');
            if (status !== 'OK') {
                // Show the error code inside the chartDiv.
                chartDiv.innerHTML = 'Cannot show elevation: request failed because ' + status;
                return;
              }
        // Create a new chart in the elevation_chart DIV.
        var chart = new google.visualization.ColumnChart(chartDiv);

        // Extract the data from which to populate the chart.
        // Because the samples are equidistant, the 'Sample'
        // column here does double duty as distance along the
        // X axis.

        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Sample'); //en la primer columna se especifica el tipo de valor a almacenar. En este caso en la columna 0 se almacena una variable "Sample" y es de tipo string
        data.addColumn('number', 'Elevation'); //se almacena en la columna 1 valores del tipo number y corresponde a la elevación
        for (var i = 0; i < elevations.length; i++) {
          data.addRow(['', elevations[i].elevation]); //Acá empieza a recorrer el array
          if(data.getValue(i,1)=='undefined'){
            coordenadas [i]=0;
            altura [i]=0;
          }
          altura [i] = data.getValue(i,1); // guardo en el array altura todas las alturas de elevation en orden
          coordenadas [i] = elevations[i].location;
        }

        if (flag==0){
          mitad_cantmuestras=(elevations.length)/2;
          console.log("Altura de cada punto: " + altura[0] + ", " + altura[1] + ", " + altura[2]);
          console.log("Coordenadas de cada punto: (" + coordenadas[0].lat()+ ", " + coordenadas[0].lng() + ")" + " "+ "(" + coordenadas[1].lat()+ ", " + coordenadas[1].lng() + ")");
          console.log("Altura Pmax: " + data.getDistinctValues(1)[elevations.length-1]);
          var a= altura.indexOf(data.getDistinctValues(1)[elevations.length-1]);

          console.log("Posición de Pmax: " + a);
          //console.log("Coordenadas Pmax: " + elevations[a].location);

          var distancia= haversine (radius,latitud,longitud);
          // Draw the chart using the data within its DIV.
        }
        else if(flag==1){
          var valuetomodify= (parseFloat(altura[muestra_mod])+parseFloat(document.getElementById("alturaobjeto").value));
          var distanciaobject=document.getElementById("distanciaobjeto").value;

          muestra_mod=Math.floor(distanciaobject/10);
          data.setValue(muestra_mod, 1, valuetomodify);
          console.log("Muestra moddh: "+muestra_mod);
          console.log("alturaobjetodh: " +document.getElementById("alturaobjeto").value);
          console.log("valuetomodifydh: " + valuetomodify);
          document.getElementById("alturaobjeto").value = "";
          document.getElementById("distanciaobjeto").value = "";
          flag=0;
        }

          // Draw the chart using the data within its DIV.
          chart.draw(data, {
            height: 200,
            legend: 'none',
            titleX: 'Cantidad de muestras',
            titleY: 'Elevation (m)'
          });



        var hayLOS=LOS(altura,elevations,coordenadas);

        console.log("¿Hay LOS?: ");
        if (hayLOS==1){
          console.log("Si!");
          //console.log("Tilt: " +Tilt(distancia,elevations[0].elevation,elevations[elevations.length-1].elevation));
        }
        else if (hayLOS==0){
          console.log("No!");
          /*data.setValue(0, 1, altura[0]+10);
          chart.draw(data, {
          height: 200,
          legend: 'none',
          titleX: 'Cantidad de muestras',
          titleY: 'Elevation (m)'
        });*/

          //data.setValue(elevations.length, 1, altura[elevations.length-1]+10);
          }
        else
          console.log("Indefinido");

      }
