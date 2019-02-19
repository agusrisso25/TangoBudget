function indispMin(disponibilidad){ // pasaje de la disponibilidad anual a la indisponibilidad en minutos
  var anomin = 525600;
  var IndisMin = (100 - disponibilidad)*anomin/100;
  return IndisMin;
}
