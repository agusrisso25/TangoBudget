//Funcion para tomar los valores que ingresa el usuario
function InputUser(distancia,freq,htx,hrx) {
    var Gtx=2;
    var Grx=2;
    var Ptx=13.5;
    var frec=2.4;
    var disp_canal=0.9999;
    var perdidasFSL = FSL(distancia,htx,hrx);
    var MF = MF(distancia,A,B,freq,disp_canal);
    var perdidasConectores=0;
    var otrasperdidas;

    var Prx=Gtx+Grx+Ptx-FSL-perdidasConectores-perdidasFSL-otrasperdidas;
    var sensRX=Prx-MF;

    if(Prx-MF>sensRX){
      //se debe dibujar la zona de fresnel
      return 0;
    }
    else {
      alert ("No hay sensibilidad del RX suficiente");
      return 2;
    }
}
