/* Este bloque realiza el pasaje de la disponibilidad anual a la indisponibilidad en minutos
por definición de la ITU
 */

function indispMin(disponibilidad){
  var anomin = 525600;
  var IndisMin = (100 - disponibilidad)*anomin/100;
  return IndisMin;
}
