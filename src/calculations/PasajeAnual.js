function PasajeAnual(distancia, epsilon, Pw){

    var DeltaG = 10.5 - 5.6*Math.log(1.1 - Math.pow(Math.abs(Math.cos(2)), 0.7)) - 2.7*Math.log(distancia) + 1.7*Math.log(1 + Math.abs(epsilon));

    var dispanual =  Math.pow(10, -DeltaG/10)*Pw;

    indispMin(dispanual);
    
    return dispanual;

}