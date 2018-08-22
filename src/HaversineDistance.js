        //Funcion para el cálculo de distancia entre dos puntos:
        function haversine(radius, latitud, longitud) {
          
          var lat1 = ToRadians(latitud[0]);
          var long1 = ToRadians(longitud[0]);
          var lat2 = ToRadians(latitud[1]);
          var long2 = ToRadians(longitud[1]);

          var DistanceLat = lat1 - lat2;
          var DistanceLong = long1 - long2;
          var sinLat = Math.sin(DistanceLat/2.0);
          var sinLong = Math.sin(DistanceLong/2.0);
          var a = Math.pow(sinLat, 2.0)+Math.cos(lat1)*Math.cos(lat2)*Math.pow(sinLong,2.0);
          var distance = radius*2*Math.asin(Math.min(1, Math.sqrt(a)));  
          return distance;

        }