//Aca debo de calcular las distancias a la posicion 0 y 255 desde el punto más alto != a los extremos:

function DistanceToBorders (coordenadas, posic_Pmax){
    lat[0] = coordenadas[posic_Pmax].lat(); // Coordenadas del punto más alto != a TX o RX
    lng[0] = coordenadas[posic_Pmax].lng();
    lat[1]= coordenadas[255].lat();
    lng[1]=coordenadas[255].lng();

    var distanciaRX = haversine(radius, lat, lng);
    console.log("Distancia a RX" + distanciaRX.toFixed(6) + " km");

    lat[1]= coordenadas[0].lat();
    lng[1]=coordenadas[0].lng();

    var distanciaTX = haversine(radius, lat, lng); // no se si puede llamar asi nomas, capaz se sobre escribe
    console.log("Distancia a TX" + distanciaRX.toFixed(6) + " km");
}