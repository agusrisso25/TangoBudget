/*! tangobudget - v0.0.1 - 2019-03-09 */function addMarkersAndAll(location, map) {
  var distancia_perfil = 0;
  path = poly.getPath(); // en path guardo la poly creada (se crea luego de dos clicks)
  path.push(location); // path es un array por definicion, se hace un push al array de cada location de cada punto de la polyline

  var marker = new google.maps.Marker({
    position: location, //localizacion en donde se hizo el click
    label: labels[labelIndex++ % labels.length],
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    title: "#" + path.getLength()
  });

  markers.push(marker);
  poly.setMap(map); // setea la polyline en el mapa

  latitud.push(marker.getPosition().lat()); //guardo en el array latitud la latitud de cada marcador
  longitud.push(marker.getPosition().lng()); //guardo en el array longitud la longitud de cada marcador
  showCoordenadas(latitud, longitud);

  //Cuando arrastro un marcador:
  google.maps.event.addListener(marker, "drag", function(evt) {
    //muevo la linea cuando muevo los marcadores y creo una nueva:
    var etiqueta = marker.getLabel();
    if (etiqueta == "R") {
      //Si el marcador que muevo es el R
      path.pop(); //saco el ulimo elemento de path porque es el relacionado con R
      path.push(evt.latLng); // hago un push del nuevo lugar del marcador al array
      path = poly.getPath(); // dibujo la linea con las dos ubicaciones

      latitud[1] = marker.getPosition().lat();
      longitud[1] = marker.getPosition().lng();
    }
    else {
      // si muevo el marcador A
      var remove2 = path.removeAt(1); // Saco el elemento del lugar 1 y lo guardo
      var remove = path.removeAt(0); // Saco el elemento 0 y lo guardo porque obliga la funcion pero no lo uso -- al pepe

      path.setAt(1, remove2); //seteo en el lugar 1 el mismo valor que estaba
      path.setAt(0, evt.latLng); // seteo en el valor 0 la nueva ubicacion del marcador A

      path = poly.getPath(); //dibujo la poly con ambos valores

      latitud[0] = marker.getPosition().lat();
      longitud[0] = marker.getPosition().lng();

    }
    flag=2; //Seteo el flag en 2 para que desde elevationPath se actualice el data
    showCoordenadas(latitud, longitud);

    if (markers.length == 2) {
      var elevator = new google.maps.ElevationService();
      // Draw the path, using the Visualization API and the Elevation service:
      camino[0] = path.getAt(0);
      camino[1] = path.getAt(1);

      dist = haversine(radius, latitud, longitud);
      displayPathElevation(camino, elevator, dist);
    }
  });

  marker.addListener("click", toggleBounce);

  if (markers.length == 2) {
    elevator = new google.maps.ElevationService();

    // Draw the path, using the Visualization API and the Elevation service:
    camino[0] = path.getAt(0);
    camino[1] = path.getAt(1);
    // Draw the path, using the Visualization API and the Elevation service:
    dist = haversine(radius, latitud, longitud);
    displayPathElevation(camino, elevator, dist);
  }
}

function Bullington(distancia) {
		var lambda;
		var c= 3*Math.pow(10,8);
		lambda = c/Inputfreq;
		var pend1;
		var pend2;
		var cte1;
		var cte2;
		var ctemayorPendRx;
		var ctemayorPendTx;
		var mayorPendTx=0;
		var mayorPendRx=0;
		var d1;
		var d2;
		var a1;
		var a2;
		var J_v;

		/*calculo las pendientes que generan entre un 40% y 60% de Despeje con la antena Tx
		Para ello es necesario recorrer el array donde guardé toda la información de los objetos que obstruyen
		entre el 40% y 60% de Fresnel
		Luego de recorrer el array, se guarda la mayor pendiente en mayorPendTx y mayorPendRx y las ctes que
		constituyen la ecuación de la recta
		*/
		for(i=0;i<distanciaFresnel.length;i++){
			pend1=((alturaFresnel[i]-altura[0])/distanciaFresnel[i]);
			cte1=altura[0];
			if (mayorPendTx<pend1)
				mayorPendTx=pend1;
			ctemayorPendTx=cte1;
		}

		for(j=0;j<distanciaFresnel.length;j++){
			pend2=((altura[altura.length-1]-alturaFresnel[i])/(distancia-distanciaFresnel[i]));
			cte2=altura[altura.length-1]-distancia*((altura[altura.length-1]-alturaFresnel[j])/(distancia-distanciaFresnel[j]));
			if(mayorPendRx>pend2){
				mayorPendRx=pend2;
				ctemayorPendRx=cte2;
				}
		}

		/* Luego, se debe intersectar las dos rectas con mayor pendiente para encontrar la distancia y altura del
		objeto interferente ficticio. Se guardan esos valores en OIficticio y h_OIficticio.
		Además, se halla:
		a1: Distancia entre el transmisor y OIficticio
		a2: Distancia entre el OIficticio y el receptor
		d1:
		d2:
		*/
		OIficticio=Math.floor((ctemayorPendRx-ctemayorPendTx)/(mayorPendTx-mayorPendRx)); //este valor sirve para tener una noción de donde estará el objeto interferente ficticio
		h_OIficticio=mayorPendTx*OIficticio+ctemayorPendTx; //Esta será la altura del objeto ficticio
		a1= OIficticio*100;
		a2=(distancia-a1);

		d1=Math.abs(a1/Math.cos(mayorPendTx));
		d2=Math.abs(a2/Math.cos(mayorPendRx));

		/* Una vez obtenido el valor de a1 y a2, se aplica la definición de v. En caso que sea menor a -0.78
		la atenuación por difracción será cero.
		En el otro caso, se utiliza una aproximación lineal
		 */
		v=h_OIficticio*Math.sqrt(2/lambda*(1/d1+1/d2));
		if(v<-0.78)
			return 0;
		else{
			J_v=6.9+20*Math.log10(Math.sqrt(Math.pow(v-0.1,2)+1)+v-0.1);
			return(J_v);
		}
}

function DispCanalBarnett(distancia,MargenFading) { //Barnet Vigant
	var disp_canal;
	var valueA;
	var valueB;

	var A = parseNumber(document.getElementById("FactorRugosidad").value);
	var B = parseNumber(document.getElementById("FactorClima").value);

	var arrayA= [0, 4, 1, 0.25];
	var arrayB= [0, 1, 0.5, 0.25, 0.125];

	if (A == 0){
		alert("Favor de completar el factor de rugosidad.");
		return;
	}
	else {
		valueA = arrayA [A];
	}

	if (B == 0){
		alert("Favor de completar el Factor Clima.");
		return;
	}
	else {
		valueB = arrayB [B];
	}

	disp_canal = 1-((Math.pow(distancia,3)*6*valueA*valueB*Inputfreq)/(Math.pow(10,7+MargenFading/10)));
	return disp_canal;
}

function DispCanalITU (distancia, MargenFading) {
  var dN1 = -400;
  var rugosidad= 5.9; // uso este porque recomienta ITU
  var alturaantena;
  var k;
  var epsilon;
  var Pw;
  var dispmensual;
  var indispminanual;

  if (altura[0]<altura[altura.length-1]){
      alturaantena = altura[0]; // aqui se debe guardar la altura de la antena más baja
  }
  else
      alturaantena = altura[altura.length-1];

  k = Math.pow(10,-4.4-0.0027*dN1)*Math.pow(10+rugosidad,-0.46);
  epsilon = Math.abs((altura[0]-altura[altura.length-1])/distancia);
  Pw = k*Math.pow(distancia,3.4)*Math.pow(1+epsilon,-1.03)*Math.pow(Inputfreq,0.8)*Math.pow(10,-0.00076*alturaantena-MargenFading/10);
  dispmensual = (1-Pw)*100;
  dispanual = PasajeAnual(distancia, epsilon, Pw);
  indispminanual= indispMin(dispanual);
  return [dispmensual,dispanual,indispminanual];
}

function DispCanalLLuvia (perdidasLluvia, MargenFading) {

  var c01= 0.12+0.4*Math.log10(Math.pow((Inputfreq/10),0.8)); //Cuando Inputfreq es mayor a 10GHz
  var c02= 0.12; //Cuando Inputfreq es menor a 10 GHz
  var c0;
  var k;
  var ec1=(MargenFading/perdidasLluvia);
  var result_p;
  var result_ec2;
  var p=[];
  var i=0;
  var j=0;
  var aux=[];
  var index_p;
  var displluvia;

  if(Inputfreq<10){
    c0=c02;
  }
  else {
    c0=c01;
  }

  var c1=Math.pow(0.07,c0)*(Math.pow(0.12,(1-c0)));
  var c2=0.855*c0+0.546*(1-c0);
  var c3=0.139*c0+0.043*(1-c0);

  i=0;
  for(k=0.01;k>Math.pow(10,-7);k=k-0.000001){
    p[i]=k;
    ec2[i]=c1*(Math.pow(k,-(c2+c3*Math.log10(k))));
    aux[i]=ec2[i];
    i++;
  }

  var valor_mascercano;
  var A=aux.sort();
  for(m=0;aux[m]<ec1;m++)
  {
    valor_mascercano=aux[m];
  }


  //result_ec2=A[A.length-1];
  index_p=ec2.indexOf(valor_mascercano);
  result_p=p[index_p];

  console.log("result_p: "+result_p);

  displluvia=100-result_p;
  return(displluvia);
}

function Fresnel(Pmax,h_Pmax){
  var lambda;
  if(!Inputfreq){
    alert("Ingrese una frecuencia");
    return;
  }

	lambda = (2.998*Math.pow(10,8))/(Inputfreq*Math.pow(10,9));//c/(Inputfreq*Math.pow(10,9));

  var distancia = (haversine(radius, latitud, longitud))*1000;
  var pmedio=(distancia)/2; //Se halla el punto medio entre las antenas Tx y Rx
  var h_pmedio = ((-altura[0]+altura[altura.length-1])/distancia)*(distancia/2)+altura[0];
  var alpha=Math.atan2((altura[altura.length-1]-altura[0]),distancia); //Resultado en Radianes

  var d1=pmedio/Math.cos(((-2/distancia)*(altura[0]-h_pmedio))/distancia);
  var d2=pmedio/Math.cos(((-2/distancia)*(altura[altura.length-1]-h_pmedio))/distancia);

  R1=Math.sqrt((lambda*d1*d2)/(d1+d2)); //Se halla el radio de la primera zona de fresnel, por definición

  var fresnel60= R1*0.6;
  var fresnel40= R1*0.4;

  pendLOS=((-altura[0]+altura[altura.length-1])/distancia)*(distancia/2)+altura[0];
  var resultadofresnelTOT;

  if(h_Pmax>h_pmedio) {
    resultadofresnelTOT=2;
  }
  else{
    var resultado60=Math.pow((Math.cos(alpha)*(Pmax-pmedio)+Math.sin(alpha)*(h_Pmax-h_pmedio)),2)/(Math.pow(fresnel60,2)+Math.pow(d2,2))+Math.pow((Math.sin(alpha)*(Pmax-pmedio)-Math.cos(alpha)*(h_Pmax-h_pmedio)),2)/(Math.pow(fresnel60,2));
    var resultado40=Math.pow((Math.cos(alpha)*(Pmax-pmedio)+Math.sin(alpha)*(h_Pmax-h_pmedio)),2)/(Math.pow(fresnel40,2)+Math.pow(d2,2))+Math.pow((Math.sin(alpha)*(Pmax-pmedio)-Math.cos(alpha)*(h_Pmax-h_pmedio)),2)/(Math.pow(fresnel40,2));

    if(resultado40<1 && resultado40>0)
      resultadofresnelTOT=2; //Tengo despeje menor a 40%
    else if(resultado40>=1 && resultado60<1)
      resultadofresnelTOT=1; //Tengo despeje del 40%
    else if(resultado60>1)
      resultadofresnelTOT=0; //Tengo despeje del 60%
  }
  return resultadofresnelTOT;
}

function FSL(distancia) {
	var resultado;
	var lambda;
	var c= 3*Math.pow(10,8);
	lambda = c/Inputfreq;
	var frec=Inputfreq*1000;
	var freespaceloss=32.4+20*Math.log10(frec*distancia);
	resultado=freespaceloss.toFixed(2);
	return (resultado);
}

function getFreq() {
	Inputfreq=parseNumber(document.getElementById("frecuencia").value);
	var despeje60;
	var despeje40;

	//Se calcula si hay despeje de fresnel a lo largo del camino
	var j=0;
	for (i=1;i<(altura.length-1); i++){
		hayDespejeCamino[i]=Fresnel(i,altura[i]);
		//En caso que tenga un objeto interferente entre 60% y 40% necesito guardar la muestra y la altura del camino para pérdidas por Difracción
		if (hayDespejeCamino[i] == 1){
			distanciaFresnel [j]= i;
			alturaFresnel [j]= altura[i];
			j++;
		}
	}

	//luego debo saber en qué región de decisión está el despeje.
	var resultadoFresnel=hayDespejeCamino.sort();

	if(resultadoFresnel[hayDespejeCamino.length-2]==0){
		document.getElementById("Fresnel").innerHTML = "Se tiene un despeje del 60%";
		fresnelGlobal=0;
	}
	else if(resultadoFresnel[hayDespejeCamino.length-2]==1){
		document.getElementById("Fresnel").innerHTML = "Se tiene un despeje entre el 40% y 60%";
		fresnelGlobal=1;
	}
	else if(resultadoFresnel[hayDespejeCamino.length-2]==2){
		document.getElementById("Fresnel").innerHTML = "No hay despeje de fresnel";
		fresnelGlobal=2;
	}
	else{
		document.getElementById("Fresnel").innerHTML = "No se pudo medir";
	}

	return;
}

function indispMin(disponibilidad){
  var anomin = 525600;
  var IndisMin = (100 - disponibilidad)*anomin/100;
  return IndisMin;
}

function InputUser() {
  var Gtx=parseNumber(document.getElementById("gananciatx").value);
  var Grx=parseNumber(document.getElementById("gananciarx").value);
  var Ptx=parseNumber(document.getElementById("potenciatx").value);

  if(Gtx==""|| Ptx=="" || Grx==""){
    alert("Ingrese la información obligatoria");
    return;
  }

  var MargenFading;
  var disp_canalTOT;
  var disp_mensualMC;
  var disp_anualMC;
  var disp_canalLL;
  var indisp_anualmin;
  var disp_canalTOT_min;
  var enlace;
  var distancia = haversine(radius, latitud, longitud);

  var pol=(document.getElementById("polarizacion").value);
  if (pol=="0")
    alert("Ingrese una polarización");

  var perdidasConectores= parseNumber(document.getElementById("perdidasconectores").value);
  var perdidasOtras=parseNumber(document.getElementById("otrasperdidas").value);
  var perdidasFSL = FSL(distancia); //Se calculan las pérdidas de espacio libre considerando la altura de las antenas con los postes incluidos
  var perdidasLluvia=AtenuacionLluvia();
  var aux2=Tilt(distancia); // Se calcula el ángulo del inclinación que deben tener las antenas para que tengan LOS
  var TiltTx = aux2[0];
  var TiltRx = aux2[1];

  var diffBullington=0;
  if(fresnelGlobal==1)
    diffBullington=Bullington(distancia);

  var Prx=parseFloat(Gtx+Grx+Ptx-perdidasConectores-perdidasFSL-perdidasOtras-diffBullington); //Se calcula la potencia de recepción
  Prx=Prx.toFixed(2);
  var sensRX=parseFloat(document.getElementById("sensibilidadrx").value); //parametro de la datasheet de la antena
  console.log("Prx: " +Prx);
  if(sensRX>0 || sensRX==""){
    alert("Debe ingresar una Sensibilidad de Recepción correcta");
    return;
  }
  if(Prx>sensRX){
    MargenFading=(Prx-sensRX); //Condicion necesaria para que el receptor pueda recibir la señal
    //disp_canalMC = DispCanalBarnett(distancia,MargenFading);
    var aux = DispCanalITU(distancia,MargenFading);
    disp_mensualMC=aux[0];
    disp_anualMC=aux[1];
    indisp_anualmin=aux[2];
    disp_canalLL= DispCanalLLuvia(perdidasLluvia,MargenFading);
    disp_canalTOT=100-((100-disp_anualMC)+(100-disp_canalLL));
    disp_canalTOT_min=(100-disp_canalTOT)*525600/100;

    if(disp_canalTOT>=99.998){
      //hay que definir cual es el aceptable.
      console.log("Enlace aceptable");
      enlace=0;
    }
    else{
      console.log("Enlace no aceptable");
      enlace=1;
      return;
    }
  }
  else{
    alert("La potencia de recepción es menor a la sensibilidad");
    document.getElementById('table_div').innerHTML="";
    document.getElementById('link').innerHTML="";
    return;
  }
  //Se analiza la linea de vista para pasar a la tabla de resultados
  if (hayLOS == 1 || hayLOS=="Sí"){
    hayLOS="Sí";
  }
  else if (hayLOS == 0 || hayLOS=="No"){
    hayLOS="No";
  }
  else
    return;

  console.log("Enlace en inputuser: " +enlace);
  Resultados(disp_canalLL,disp_mensualMC,disp_anualMC,indisp_anualmin,disp_canalTOT,disp_canalTOT_min,TiltTx,TiltRx,Gtx,Grx,Ptx,Prx,MargenFading,sensRX,distancia,perdidasFSL,perdidasLluvia,perdidasConectores,perdidasOtras,enlace);
  print(disp_canalLL,disp_mensualMC,disp_anualMC,indisp_anualmin,disp_canalTOT,disp_canalTOT_min,TiltTx,TiltRx,Gtx,Grx,Ptx,Prx,MargenFading,sensRX,distancia,perdidasFSL,perdidasLluvia,perdidasConectores,perdidasOtras,enlace);//se genera la url del PruebaB
  return;
}

function LOS(elevations,coordenadas) {
  var pend1;
  var pend2;
  var posic_Pmax2;
  var posic_Pmax= altura.indexOf(data.getDistinctValues(1).filter(function (v) {
      return !isNaN(v);
    })[elevations.length - 1]); //calculo la posicion del array del punto mas alto

  //CASO A: La posicion máxima es distinta al origen o al destino, calculo altura del punto maximo.
  if(posic_Pmax != 0 && posic_Pmax != elevations.length-1){
  	//caso 1: Pmax mayor a ambas antenas
  	var Pmax= data.getDistinctValues(1)[elevations.length-1].toFixed(3); //calculo altura maxima
    if (Pmax>altura[elevations.length-1].toFixed(3) && Pmax>altura[0].toFixed(3)){
  		return 0; //NO TENGO LOS: return 0
  }
  //caso 2: Pmax mayor a la antena Tx y menor a la Rx
  else if ((parseFloat(altura[0].toFixed(3))<Pmax) && (Pmax<parseFloat(altura[elevations.length-1].toFixed(3)))){ //el punto mas alto es el de la posicion elevations.length
  	pend1= ((altura[elevations.length-1].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
  	pend2= (Pmax-altura[0].toFixed(3))/(posic_Pmax-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
  	if (pend1>=pend2){
  		return 1;} //TENGO LOS: return 1
  	else
      return 0; //NO TENGO LOS: return 0
  	}
  //caso 3: Pmax mayor a la antena Rx y menor a la Tx
  else if ((parseFloat(altura[elevations.length-1].toFixed(3))<Pmax)&&(Pmax<parseFloat(altura[0].toFixed(3)))){ //el punto mas bajo es el de la posicion 0
  	pend1= ((altura[elevations.length-1].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
  	pend2= (Pmax-altura[0].toFixed(3))/(posic_Pmax-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
  	if (pend2<pend1)
  		return 1; //TENGO LOS: return 1
  	else
  		return 0; //NO TENGO LOS: return 0
  }
  //caso 4: Pmax menor a ambas antenas
  else
  	return 1; //tengo LOS: return 1
  }

  //CASO B1: La posicion máxima es el origen o el destino
  else if(posic_Pmax == 0 || posic_Pmax == (elevations.length-1)){
		posic_Pmax2= altura.indexOf(data.getDistinctValues(1)[elevations.length-2]);

	  if(posic_Pmax2 == 0 || posic_Pmax2 == (elevations.length-1)){ //Si Pmax2 sigue siendo uno de los extremos...
			var Pmax3= parseFloat(data.getDistinctValues(1)[elevations.length-3].toFixed(1));
			var posic_Pmax3=altura.indexOf(data.getDistinctValues(1)[elevations.length-3]);
	    	//caso 1: Pmax3 mayor a ambas antenas
					if (Pmax3>parseFloat(altura[elevations.length-1].toFixed(3)) && Pmax3>parseFloat(altura[0].toFixed(3)))
              return 0; //NO TENGO LOS: return 0

				//caso 2: Pmax3 mayor a la antena Tx y menor a la Rx
					else if ((parseFloat(altura[0].toFixed(3))<Pmax3)&& (Pmax3<parseFloat(altura[elevations.length-1].toFixed(3)))){ //el punto mas alto es el de la posicion elevations.length
							pend1= ((altura[elevations.length-2].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
							pend2= (Pmax3-altura[0].toFixed(3))/(posic_Pmax3-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
							if (pend1>=pend2)
									return 1; //TENGO LOS: return 1
							else
                return 0; //NO TENGO LOS: return 0
							}//cierro caso 2 Pmx3
				//caso 3: Pmax mayor a la antena Rx y menor a la Tx
				else if ((parseFloat(altura[elevations.length-1].toFixed(3))<Pmax3) && (Pmax3<parseFloat(altura[0].toFixed(3)))){ //el punto mas bajo es el de la posicion 0
						pend1= ((altura[elevations.length-1].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
						pend2= (Pmax3-altura[0].toFixed(3))/(posic_Pmax3-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
						if (pend2<pend1)
								return 1; //TENGO LOS: return 1
						else
              return 0; //NO TENGO LOS: return 0
				}
				//caso 4: Pmax3 menor a ambas antenas
				else
					return 1; //tengo LOS: return 1
     }

 //CASO B2: Si Pmax 2 es la maxima altura en mi path... y no es extremo
else {
			//caso 1: Pmax2 mayor a ambas antenas
			var Pmax2 = parseFloat(data.getDistinctValues(1)[elevations.length-2].toFixed(1)); //nos da el valor de altura mas alto
			if (Pmax2 > parseFloat(altura[elevations.length-1].toFixed(3) && Pmax2>altura[0].toFixed(3))){
				return 0; //NO TENGO LOS: return 0
			}
			//caso 2: Pmax2 mayor a la antena Tx y menor a la Rx
			else if ((parseFloat(altura[0].toFixed(3))<Pmax2) && (Pmax2<parseFloat(altura[elevations.length-1].toFixed(3)))){ //el punto mas alto es el de la posicion elevations.length
				pend1= ((altura[elevations.length-1].toFixed(3)-altura[0].toFixed(3))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
				pend2= (Pmax2-altura[0].toFixed(3))/(posic_Pmax2-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
					if (pend1>=pend2)
						return 1; //TENGO LOS: return 1
					else
						return 0; //NO TENGO LOS: return 0
			}

			//caso 3: Pmax2 mayor a la antena Rx y menor a la Tx
			else if ((parseFloat(altura[elevations.length-1].toFixed(1))<Pmax2) && (Pmax2<parseFloat(altura[0].toFixed(1)))){ //el punto mas bajo es el de la posicion 0
				pend1= ((altura[elevations.length-1].toFixed(1)-altura[0].toFixed(1))/((elevations.length-1)-0)); //hallo el valor de la pendiente de la recta que pasa por las antenas.
				pend2= (Pmax2-altura[0].toFixed(1))/(posic_Pmax2-0); //hallo el valor de la pendiente de la recta que pasa por el punto maximo y la antena Tx
				if (pend2<pend1)
					return 1; //TENGO LOS: return 1
				else
					return 0; //NO TENGO LOS: return 0
			}
			//caso 4: Pmax2 menor a ambas antenas
				else
					return 1; //tengo LOS: return 1
				}
}
}

function ModifyHeight(){
  distanciaobject= parseNumber(document.getElementById("distanciaobjeto").value); //Distancia desde Tx al objeto interferente (En metros)
  distanciatotal=(haversine(radius, latitud, longitud)*1000); //Largo del camino (en metros)

  muestra_mod[contador]=Math.floor(distanciaobject/10); //muestra_mod es un array que contiene la información de la altura del objeto interferente

  if ((muestra_mod[contador] ==0) || (muestra_mod[contador] == (cant_redondeo-1))){ //Si el objeto interferente que se desea colocar está en las antenas, sale error
    alert ("No se pueden colocar objetos interferentes en las antenas");
  }
  //hay que agregar el replace por si el usuario ingresa una coma y va un punto
  else if (0 < distanciaobject && distanciaobject < distanciatotal && parseInt(document.getElementById("objetointerferente").value)!=null){
    flag=1; //seteo el flag en 1 para cuando llame la funcion displayPathElevation me modifique la altura
    for(i=0;i<contador;i++){
      if(muestra_mod[contador]==muestra_mod[i]){
        alert("No se puede agregar otro OI en esta ubicación, intente de nuevo");
        return;
        }
    }
    displayPathElevation(camino, elevator, dist); //Se modifica la altura
  }
  else //if(distanciaobject>distanciatotal || distanciaobject<0) //Cuando se desea colocar un objeto interferente por fuera del largo del camino
    alert ("distancia excede el largo del camino");
  return;
}

function ModifyRxTx() {
	var htx= parseNumber(document.getElementById("alturaantenatx").value);
	var hrx= parseNumber(document.getElementById("alturaantenarx").value);
	if (htx<5 && hrx<5){
		htx=5;
		hrx=5;
		document.getElementById("alturaantenarx").value = "5";
		document.getElementById("alturaantenatx").value = "5";
	}
	else if(htx>5 && hrx<5)
	{
		hrx=5;
		document.getElementById("alturaantenarx").value = "5";
	}
	else if (htx<5 && hrx>5){
		htx=5;
		document.getElementById("alturaantenatx").value = "5";
	}
	flag=4;
	displayPathElevation(camino,elevator,dist);
	return;
}

function PasajeAnual(distancia, epsilon, Pw){
  var DeltaG=10.5-(5.6*Math.log10(1.1-Math.pow(Math.abs(Math.cos(2)),0.7)))-2.7*Math.log10(distancia)+1.7*Math.log10(1+Math.abs(epsilon));
  console.log("deltaG: "+DeltaG);
  var dispanual = (1-Math.pow(10,-DeltaG/10)*Pw)*100;

  return dispanual;
}

function AtenuacionLluvia() {
	var pol=parseNumber(document.getElementById("polarizacion").value);
	var R;
	var frecu;
	var distancia=haversine(radius, latitud, longitud);

	if(!Inputfreq){
		alert ("Ingrese una frecuencia");
		return;
	}

	var arrayfrec= [1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,
									30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,
									62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,
									94,95,96,97,98,99,100,120,150,200,300,400,500,600,700,800,900,1000];

	var indice= arrayfrec.indexOf(Inputfreq);
	if(indice== -1){
		var i=0;
		while (Inputfreq<=arrayfrec[i]){ // redondeo para abajo
			i++;
		}
		frecu = arrayfrec[i];
		console.log("Se aproximó dicho valor a" + frecu + "GHz para calcular la atenuación por lluvia.");
		indice=i;
	}

	var R0 = [8, 12, 15, 19, 22, 28, 30, 32, 35, 42, 60, 63, 95, 145, 115];
	var letra = ["A","B","C","D","E","F","G","H","J","K","L","M","N","P","Q"];

	var R2 = document.getElementById("ZonaHidrometeorologica").value;
	var u = letra.indexOf(R2);

	if (R2=="0"){
		alert("Por favor ingresar el zona hidrometeorológica para el cálculo de lluvia.");}
	else {
		R = R0[u];
	}

	var matrizkH=[0.0000259,	0.0000443,	0.0000847,	0.000132,	0.000139,	0.000116,	0.000107,	0.000134,	0.000216,	0.000391,
								0.000706,	0.001915,	0.004115,	0.007535,	0.01217,	0.01772,	0.02386,	0.03041,	0.03738,	0.04481,
								0.05282,	0.06146,	0.07078,	0.08084,	0.09164,	0.1032,	0.1155,	0.1286,	0.1425,	0.1571,	0.1724,
								0.1884,	0.2051,	0.2224,	0.2403,	0.2588,	0.2778,	0.2972,	0.3171,	0.3374,	0.358,	0.3789,	0.4001,
								0.4215,	0.4431,	0.4647,	0.4865,	0.5084,	0.5302,	0.5521,	0.5738,	0.5956,	0.6172,	0.6386,	0.66,	0.6811,
								0.702,	0.7228,	0.7433,	0.7635,	0.7835,	0.8032,	0.8226,	0.8418,	0.8606,	0.8791,	0.8974,	0.9153,
								0.9328,	0.9501,	0.967,	0.9836,	0.9999,	1.0159,	1.0315,	1.0468,	1.0618,	1.0764,	1.0908,	1.1048,
								1.1185,	1.132,	1.1451,	1.1579,	1.1704,	1.1827,	1.1946,	1.2063,	1.2177,	1.2289,	1.2398,	1.2504,
								1.2607, 1.2708,	1.2807,	1.2903,	1.2997,	1.3089,	1.3179,	1.3266,	1.3351,	1.3434,	1.3515,	1.3594,
								1.3671,	1.4866,	1.5823,	1.6378,	1.6286,	1.586,	1.5418,	1.5013,	1.4654,	1.4335,	1.405,	1.3795];

	var matrizalfaH=[0.9691,	1.0185, 1.0664,	1.1209,	1.2322,	1.4189,	1.6009,	1.6948,	1.6969,	1.6499,	1.59,	1.481,
								1.3905, 1.3155,	1.2571,	1.214,	1.1825,	1.1586,	1.1396,	1.1233,	1.1086,	1.0949,	1.0818,	1.0691,
								1.0568,	1.0447,	1.0329,	1.0214,	1.0101,	0.9991,	0.9884,	0.978,	0.9679,	0.958,	0.9485,	0.9392,
								0.9302,	0.9214,	0.9129,	0.9047,	0.8967,	0.889,	0.8816,	0.8743,	0.8673,	0.8605,	0.8539,	0.8476,
								0.8414,	0.8355,	0.8297,	0.8241, 0.8187,	0.8134,	0.8084,	0.8034,	0.7987,	0.7941,	0.7896,	0.7853,
								0.7811,	0.7771,	0.7731,	0.7693,	0.7656,	0.7621,	0.7586,	0.7552,	0.752,	0.7488,	0.7458,	0.7428,
								0.74,	0.7372,	0.7345,	0.7318,	0.7293,	0.7268,	0.7244,	0.7221,	0.7199,	0.7177,	0.7156,	0.7135,
								0.7115,	0.7096,	0.7077,	0.7058,	0.704,	0.7023,	0.7006,	0.699,	0.6974,	0.6959,	0.6944,	0.6929,
								0.6915,	0.6901,	0.6888,	0.6875,	0.6862,	0.685,	0.6838,	0.6826,	0.6815,	0.664,	0.6494,	0.6382,
								0.6296,	0.6262,	0.6253,	0.6262,	0.6284,	0.6315,	0.6353,	0.6396];

	var matrizkV=[0.0000308,	0.0000574,	0.0000998,	0.000146,	0.000194,	0.000235,	0.000246,	0.000235,	0.000243,	0.000312,
								0.000488,	0.001425,	0.00345,	0.006691,	0.01129,	0.01731,	0.02455,	0.03266,	0.04126,	0.05008,
								0.05899,	0.06797,	0.07708,	0.08642,	0.09611,	0.1063,	0.117,	0.1284,	0.1404,	0.1533,	0.1669,
								0.1813,	0.1964,	0.2124,	0.2291,	0.2465,	0.2646,	0.2833,	0.3026,	0.3224,	0.3427,	0.3633,	0.3844,
								0.4058,	0.4274,	0.4492,	0.4712,	0.4932,	0.5153,	0.5375,	0.5596,	0.5817,	0.6037,	0.6255,	0.6472,
								0.6687,	0.6901,	0.7112,	0.7321,	0.7527,	0.773,	0.7931,	0.8129,	0.8324,	0.8515,	0.8704,	0.8889,
								0.9071,	0.925,	0.9425,	0.9598,	0.9767,	0.9932,	1.0094,	1.0253,	1.0409,	1.0561,	1.0711,	1.0857,
								1.1,	1.1139,	1.1276,	1.141,	1.1541,	1.1668,	1.1793,	1.1915,	1.2034,	1.2151,	1.2265,	1.2376,
								1.2484,	1.259,	1.2694,	1.2795,	1.2893,	1.2989,	1.3083,	1.3175,	1.3265,	1.3352,	1.3437,	1.352,
								1.3601,	1.368,	1.4911,	1.5896,	1.6443,	1.6286,	1.582,	1.5366,	1.4967,	1.4622,	1.4321,	1.4056, 1.3822];

	var matrizalfaV=[0.8592,0.8957,0.949,1.0085,1.0688,1.1387,1.2476,1.3987,1.5317,1.5882,1.5728,1.4745,1.3797,
								1.2895,1.2156,1.1617,1.1216,1.0901,1.0646,1.044,1.0273,1.0137,1.0025,0.993,0.9847,0.9771,0.97,
								0.963,0.9561,0.9491,0.9421,0.9349,0.9277,0.9203,0.9129,0.9055,0.8981,0.8907,0.8834,0.8761,0.869,
								0.8621,0.8552,0.8486,0.8421,0.8357,0.8296,0.8236,0.8179,0.8123,0.8069,0.8017,0.7967,0.7918,0.7871,
								0.7826,0.7783,0.7741,0.77,0.7661,0.7623,0.7587,0.7552,0.7518,0.7486,0.7454,0.7424,0.7395,0.7366,
								0.7339,0.7313,0.7287,0.7262,0.7238,0.7215,0.7193,0.7171,0.715,0.713,0.711,0.7091,0.7073,0.7055,
								0.7038,0.7021,0.7004,0.6988,0.6973,0.6958,0.6943,0.6929,0.6915,0.6902,0.6889,0.6876,0.6864,
								0.6852,0.684,0.6828,0.6817,0.6806,0.6796,0.6785,0.6775,0.6765,0.6609,0.6466,0.6343,0.6262,
								0.6256,0.6272,0.6293,0.6315,0.6334,0.6351,0.6365];

	var k;
	var alfa;
	if(pol==1){ // polarización vertical
		k = matrizkV[indice];
		alfa = matrizalfaV[indice];
	}
	else if(pol==2){ // polarización horizontal
		k = matrizkH[indice];
		alfa = matrizalfaH[indice];
	}
	else{
		alert ("Ingrese un tipo de polarización");
		return;
	}

	var gamaR= k*Math.pow(R, alfa);
	var d0=35*Math.exp(-0.015*R);
	var r = 1/((0.477*Math.pow(distancia,0.633)*Math.pow(R,(0.073*alfa))*Math.pow(Inputfreq,0.123))-10.579*(1-Math.exp(-0.024*distancia)));
	var deff= distancia*r;
	var A = gamaR*deff;
	A=A.toFixed(2);

	return(A);
}

function populateTable(obj) {
	var report = document.getElementById('result_table');
	// Limpiar tabla antes de agregar datos
	report.innerHTML = '';
	var tabla = "";
	// Por cada elemento agregar una fila con dos columnas. Una para el nombre y otra para el valor
	for (var i = 0; i < Object.keys(obj).length; i++) {
		var tr = "<tr><td>" + obj[i].name + "</td><td>" + obj[i].value + "</td></tr>";
		tabla += tr;
	}
	report.innerHTML = tabla;
}

function Resultados(disp_canalLL,disp_mensualMC,disp_anualMC,indisp_anualmin,disp_canalTOT,disp_canalTOT_min,TiltTx,TiltRx,Gtx,Grx,Ptx,Prx,MargenFading,sensRX,distancia,perdidasFSL,perdidasLluvia,perdidasConectores,perdidasOtras,enlace){
	var despejefinal;
	var htx=altura[0].toFixed(2) +" metros";
	var hrx=altura[altura.length-1].toFixed(2) +" metros";
	var dimensionestx=document.getElementById("dimensionestx").value;
	var dimensionesrx=document.getElementById("dimensionesrx").value;
	var pol=parseNumber(document.getElementById("polarizacion").value);

	distancia=distancia.toFixed(3);
	if(pol==1)
		pol="Vertical";
	else
		pol="Horizontal";

	if(fresnelGlobal==0)
	{
		despejefinal="Mayor o igual a 60%";
	}
	else if(fresnelGlobal==1){
		despejefinal="Entre el 40% y 60%";
	}
	else {
		despejefinal="No hay despeje de Fresnel";
	}

	if(enlace==0)
		enlace="Enlace Aceptable";
	else if(enlace==1)
		enlace="Enlace NO Aceptable";

	var totPerdidas=perdidasFSL+perdidasOtras+perdidasConectores;

	var obj = [
		{
			name: "Altura total del Transmisor (m) ",
			value: htx
		},
		{
			name: "Altura total del Receptor (m) ",
			value: hrx
		},
		{
			name: "Ganancia del Transmisor (dBi)",
			value: Gtx
		},
		{
			name: "Ganancia del Receptor (dBi) ",
			value: Grx
		},
		{
			name: "Potencia del Transmisor (dBm) ",
			value: Ptx
		},
		{
			name: "Sensibilidad de Recepción (dBm) ",
			value: sensRX
		},
		{
			name: "Frecuencia (GHz) ",
			value: Inputfreq
		},
		{
			name: "Largo del camino (Km) ",
			value: distancia
		},
		{
			name: "Polarizacion ",
			value: pol
		},
		{
			name: "",
			value: ""
		},
		{
			name: "Angulo Tilt Antena Transmisora (grados)",
			value: TiltTx
		},
		{
			name: "Angulo Tilt Antena Receptora (grados)",
			value: TiltRx
		},
		{
			name: "Potencia del Receptor (dBm)",
			value: Prx
		},
		{
	    name: "Perdidas de Espacio Libre (dB)",
	    value: perdidasFSL
	  },
		{
	    name: "Margen de Fading (dB)",
	    value: MargenFading
	  },
		{
	    name: "Perdidas por Lluvia (dB)",
	    value: perdidasLluvia
	  },
		{
	    name: "Perdidas de Conectores (dB)",
	    value: perdidasConectores
	  },
		{
	    name: "Otras Perdidas (dB)",
	    value: perdidasOtras
	  },
		{
	    name: "TOTAL DE PERDIDAS (dB)",
	    value: totPerdidas
	  },
		{
			name: "",
			value: ""
		},
		{
	    name: "Hay linea de vista?",
	    value: hayLOS
	  },
		{
	    name: "Despeje de Fresnel",
	    value: despejefinal
	  },
		{
			name: "",
			value: ""
		},
		{
	    name: "Disponibilidad de Canal del peor mes por Multi Camino(%)",
	    value: disp_mensualMC.toFixed(8)
	  },
		{
	    name: "Disponibilidad de Canal anual por Multi Camino(%)",
	    value: disp_anualMC.toFixed(8)
	  },
		{
	    name: "Indisponibilidad anual (min)",
	    value: indisp_anualmin.toFixed(8)
	  },
		{
	    name: "Disponibilidad de Canal anual por lluvia (%)",
	    value: disp_canalLL.toFixed(8)
	  },
	  {
	    name: "Disponibilidad Total del Canal (Multi Camino + Lluvia) (%)",
	    value: disp_canalTOT.toFixed(8)
	  },
		{
	    name: "Disponibilidad Total de Canal (min)",
	    value: disp_canalTOT_min.toFixed(8)
	  },
		{
			name: "",
			value: ""
		},
		{
			name: "Disponibilidad del enlace",
			value: enlace
		}];

		populateTable(obj);
}

function AgregarTabla(objInterferente){
	google.charts.load('current', {'packages':['table']});
	google.charts.setOnLoadCallback(drawTable);

	function drawTable() {
		if(!data_detabla){
			data_detabla = new google.visualization.DataTable();
			data_detabla.addColumn('string', 'Tipo');
			data_detabla.addColumn('number', 'Distancia desde el Tx (m)');
			data_detabla.addColumn('number', 'Altura (m)');
			data_detabla.addColumn('boolean', 'Despeje 60%?');
			data_detabla.addColumn('boolean', 'Despeje 40%?');
			data_detabla.addColumn('number', 'Muestra Modificada');

			table = new google.visualization.Table(document.getElementById('table_div'));
		}

		var resultado60;
		var resultado40;

		if(resFresnel==0){ //Significa que tengo despeje del 60%
			console.log("Existe un despeje del 60% de Fresnel.");
			resultado60=true;
			resultado40=true;
		}
		else if(resFresnel==1){
			console.log("Existe el despeje entre el 40% y 60% del Fresnel.");
			resultado60=false;
			resultado40=true;
		}
		else{
			console.log("No hay despeje de Fresnel.");
			resultado60=false;
			resultado40=false;
		}

		data_detabla.addRow([objInterferente,+parseFloat(document.getElementById("distanciaobjeto").value),+parseFloat(document.getElementById("alturaobjeto").value),resultado60 ,resultado40 ,+muestra_mod[contador-1]]); //Acá empieza a recorrer el array
		table.draw(data_detabla, {showRowNumber: true, width: '100%', height: '100%'});
		document.getElementById("alturaobjeto").value = "";
    document.getElementById("distanciaobjeto").value = "";
	}
	return;
}

function BorrarFila(){
	data_detabla.removeRow(contador-1); //Acá empieza a recorrer el array
	table.draw(data_detabla, {showRowNumber: true, width: '100%', height: '100%'});
	}

function Tilt(distancia) {
	var resultadohtx;
	var resultadohrx;
	resultadohtx=Math.atan2((altura[altura.length-1]-altura[0]),(distancia));
	resultadohrx=Math.atan2((altura[0]-altura[altura.length-1]),(-distancia));
	var htx=resultadohtx.toFixed(2);
	var hrx=resultadohrx.toFixed(2);
	return [htx,hrx];
}

function DeshacerAltura() {
	var resultadoFresnel;
	if(contador>=1){
		flag=3;
		displayPathElevation(camino, elevator, dist);
		return;
	}
	else{
		alert("Ya se deshicieron todos los cambios.");
		resultadoFresnel=hayDespejeCamino.sort();
		if(resultadoFresnel[hayDespejeCamino.length-2]==0){
			document.getElementById("Fresnel").innerHTML = "Se tiene un despeje del 60%";
			fresnelGlobal=0;
		}
		else if(resultadoFresnel[hayDespejeCamino.length-2]==1){
			document.getElementById("Fresnel").innerHTML = "Se tiene un despeje entre el 40% y 60%";
			fresnelGlobal=1;
		}
		else if(resultadoFresnel[hayDespejeCamino.length-2]==2){
			document.getElementById("Fresnel").innerHTML = "No hay despeje de fresnel";
			fresnelGlobal=2;
		}
		else{
			document.getElementById("Fresnel").innerHTML = "No se pudo medir";
		}
		return;
	}
}

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
(function () {
  var boton = document.getElementById("Boton");
  if (boton) {
    dragElement(boton);
  }
})();

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "Header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function displayPathElevation(camino, elevator, dist) {
  if(dist>5)
    cant_redondeo=500;
  else{
    var cant_muestras = dist * 100; // 100 muestras por km
    cant_redondeo = Math.floor(cant_muestras);
  }

  elevator.getElevationAlongPath({
    'path': camino,
    'samples': cant_redondeo
  }, plotElevation);
}

function plotElevation(elevations, status) {
  chartDiv = document.getElementById('elevation_chart');
  if (status !== 'OK') {
    chartDiv.innerHTML = 'No se pudo calcular el perfil de elevación porque: ' + status;
    return;
  }

  var resultadoFresnel;
  if (!data || flag==2) { //Inicializa la variable global data solamente si no está inicializada o si los marcadores se movieron.
    if (flag==2){
      getFreq(); //Se recalcula el fresnel del camino
      document.getElementById("alturaantenatx").value = "0"; //Habilita los campos nuevamente
      document.getElementById("alturaantenarx").value = "0";
      document.getElementById("frecuencia").value = "0";
      despeje=[]; //Se borra array de los despejes de los OI
      muestra_mod=[];
      for(i=0;i<contador;i++) //Borro tabla de objetos interferentes
        BorrarFila();
    }

    data = new google.visualization.DataTable();
    chart = new google.visualization.ColumnChart(chartDiv);
    data.addColumn('string', 'Sample'); //en la primer columna se especifica el tipo de valor a almacenar. En este caso en la columna 0 se almacena una variable "Sample" y es de tipo string
    data.addColumn('number', 'Elevation'); //se almacena en la columna 1 valores del tipo number y corresponde a la elevación
    for (var i = 0; i < elevations.length; i++) {
      data.addRow(['', elevations[i].elevation]); //Acá empieza a recorrer el array
      if (data.getValue(i, 1) == 'undefined') {
        coordenadas[i] = NaN;
        altura[i] = NaN;
      }
      var valoresreales=altura.filter(function(number) {
        return (number!=isNaN);
      });
      var infoPerdida=(valoresreales.length)/(altura.length); //Creo una variable que me declarará el % de pérdida de info
      if(infoPerdida<0.8){
        alert("Vuelva a recargar la página, hay pérdida de información en el perfil de elevación.");
        return;
      }
      altura[i] = data.getValue(i, 1); // guardo en el array altura todas las alturas de elevation en orden
      coordenadas[i] = elevations[i].location;
    }
    flag=0;
  }
  if (flag == 0) {
    //por ahora nada
  }
  else if (flag == 1) { //En caso que el flag sea 1, se modifica la altura
    var valuetomodify= (parseFloat(altura[muestra_mod[contador]]) + parseFloat(document.getElementById("alturaobjeto").value));
    var distanciaobject = document.getElementById("distanciaobjeto").value;

    valuetomodify_array[contador]= (parseFloat(altura[muestra_mod[contador]]) + parseFloat(document.getElementById("alturaobjeto").value));
    distanciaobject_array[contador]=parseFloat(document.getElementById("distanciaobjeto").value);
    resFresnel=Fresnel(distanciaobject_array[contador],valuetomodify);
    fresnelOI_array[contador]=resFresnel; //Guardo en el histórico el resultado del despeje de fresnel
    despeje[contador]= Fresnel(distanciaobject_array[contador],valuetomodify);

    if (despeje[contador]==1){
      var largoarray=(distanciaFresnel.length-1);
      distanciaFresnel[largoarray]=muestra_mod[contador];
      alturaFresnel[largoarray]=valuetomodify;
    }

    data.setValue(muestra_mod[contador], 1, valuetomodify); //Se setea en data la información nueva
    contador++;
    objInterferente=document.getElementById("objetointerferente").value;

    if(!objInterferente){
      alert ("Ingrese un tipo de interferencia");
      flag=0;
      return;
    }
    else{
      if (objInterferente=="arbol")
        objInterferente='Arbol';
      else if (objInterferente=="edificio")
        objInterferente='Edificio';

    AgregarTabla(objInterferente);
    flag = 0;
    }
  }

  else if (flag==3){  //Cuando se desea deshacer la altura modificada
    data.setValue(muestra_mod[contador-1],1,altura[muestra_mod[contador-1]]); //Se modifica al valor anterior
    BorrarFila(); //Elimina de la tabla el ultimo valor modificado

    delete (despeje[(fresnelOI_array[contador-1])]);
    fresnelOI_array.pop(); //remueve el ultimo elemento del array
    contador--; //y se decrementa el contador
    flag=0;
  }
  else if (flag==4){ //Cuando se modifica la altura de las antenas
    if (!AlturaIni){
      AlturaIni=data.getValue(0,1);
      AlturaFin=data.getValue((altura.length-1),1);
    }
    data.setValue(0,1,parseFloat(document.getElementById("alturaantenatx").value)+AlturaIni);
    data.setValue(altura.length-1,1,parseFloat(document.getElementById("alturaantenarx").value)+AlturaFin);
    altura[0]=(AlturaIni+parseFloat(document.getElementById("alturaantenatx").value));
    altura[altura.length-1]= (AlturaFin+parseFloat(document.getElementById("alturaantenarx").value));
    flag=0;
  }

  chart.draw(data, {
    height: 200,
    legend: 'none',
    titleX: 'Cantidad de muestras',
    titleY: 'Elevación (m)'
  });

  if(!despeje || despeje.length==0){
    //luego debo saber en qué región de decisión está el despeje.
  	resultadoFresnel=hayDespejeCamino.sort();
  	if(resultadoFresnel[hayDespejeCamino.length-2]==0){
  		document.getElementById("Fresnel").innerHTML = "Se tiene un despeje del 60%";
  		fresnelGlobal=0;
  	}
  	else if(resultadoFresnel[hayDespejeCamino.length-2]==1){
  		document.getElementById("Fresnel").innerHTML = "Se tiene un despeje entre el 40% y 60%";
  		fresnelGlobal=1;
  	}
  	else if(resultadoFresnel[hayDespejeCamino.length-2]==2){
  		document.getElementById("Fresnel").innerHTML = "No hay despeje de fresnel";
  		fresnelGlobal=2;
  	}
  	else{
  		document.getElementById("Fresnel").innerHTML = " ";
      fresnelGlobal=-1;
  	}
  }
  else{
    resultadoFresnel=despeje.sort();
    if(resultadoFresnel[despeje.length-1]==0){
      fresnelGlobal=0;
      document.getElementById("Fresnel").innerHTML = "Se tiene un despeje del 60%";
    }
    else if (resultadoFresnel[despeje.length-1]==1){
      fresnelGlobal=1;
      document.getElementById("Fresnel").innerHTML = "Se tiene un despeje entre el 40% y 60%";
    }
    else if(resultadoFresnel[despeje.length-1]==2){
      fresnelGlobal=2;
      document.getElementById("Fresnel").innerHTML = "No hay despeje de fresnel";
    }
    else {
      document.getElementById("Fresnel").innerHTML = " ";
      fresnelGlobal=-1;
    }
  }

  hayLOS = LOS(elevations, coordenadas);
  if (hayLOS == 1) {
    document.getElementById("Ldevista").innerHTML = "¡Hay línea de vista!";
  }
  else if (hayLOS == 0)
    document.getElementById("Ldevista").innerHTML = "¡Cuidado! No hay línea de vista. Se sugiere aumentar las alturas de las antenas.";
}

function showCoordenadas(latitud, longitud) {
  for (var i = 0; i < markers.length; i++) {
    //document.getElementById('result1').innerHTML= "Latitud: " + latitud[0] + ", "+ "Longitud: " + longitud[0];
    document.getElementById("transmisor").value =
      latitud[0] + ", " + longitud[0];
    //document.getElementById('result2').innerHTML= "Latitud: " + latitud[1] + ", "+ "Longitud: " + longitud[1];
    document.getElementById("receptor").value = latitud[1] + ", " + longitud[1];
  }

  if (latitud[0] !== 0 && latitud[1] !== 0) {
    var distancia_perfil = haversine(radius, latitud, longitud); // guardo en distancia el resultado de la funcion haversine
    document.getElementById("result3").innerHTML = distancia_perfil.toFixed(6) + " km"; // imprimo la distancia entre dos puntos
  }
}

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
    document.getElementById('transmisor').value = "0";
    document.getElementById('receptor').value = "0";
    document.getElementById('alturaantenarx').value = "0";
    document.getElementById('alturaantenatx').value = "0";
    document.getElementById('frecuencia').value = "0";

    document.getElementById('result3').innerHTML="";
    document.getElementById("Ldevista").innerHTML= "";
    document.getElementById("Fresnel").innerHTML="";
    document.getElementById('result_table').innerHTML="";
    document.getElementById('table_div').innerHTML="";

    document.getElementById('elevation_chart').innerHTML="";
    document.getElementById('link').innerHTML="";
}

// Cada marcador se etiqueta con un letra alfabetica.
var labels = "TR";
var labelIndex = 0;
var markers = []; // Los marcadores se almacenan en un array.
var latitud = []; //las latitudes se almacenan en un array
var longitud = []; //las longitudes se almacenan en un array
var radius = 6371; // radio de la tierra
var camino = [];
var altura = []; //Array que tiene toda la información del perfil de elevación y sin errores
var coordenadas = [];
var flag=0; //defino este flag para testear caso de uso en displayPathElevation
var muestra_mod=[]; // Nos indica cual es el valor de la muestra que hay que modificar en ModifyHeight
var data; //Información almacenada sobre el perfil de elevación
var chart;
var chartDiv;
var distanciaobject_array=[]; // Nos indica la distancia desde el TX que queremos modificar
var contador=0; //cuenta la cantidad de objetos interferentes agregados
var elevator;
var dist;
var cant_redondeo; //Cuenta la cantidad de muestras que tiene nuestro perfil de elevación
var valuetomodify_array= [];
var elevations;
var data_detabla;
var data_resultados;
var table;
var tableRes;
var hayLOS;
var AlturaIni;
var AlturaFin;
//Creo estos dos arrays para guardar los valores que tienen un despeje de 40% y 60%
var distanciaFresnel=[];
var alturaFresnel=[];
var resFresnel;
var fresnelOI_array=[];
var hayDespejeCamino=[];
var Inputfreq; //Frecuencia que ingresó el usuario en la plataforma
var fresnelGlobal;
var despeje=[];
var result;
var ec2=[];

var APP = { };
APP.objInterferente = null;

// Load the Visualization API and the columnchart package:
google.load("visualization", "1", { packages: ["columnchart"] });
// Inicializo el mapa centrado en un lugar de Montevideo y con su zoom correspondiente
function initMapInteractive() {
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
  //printablevalues=parseSearchString();
  });

  poly = new google.maps.Polyline({
    strokeColor: "#000000",
    strokeOpacity: 1.0,
    strokeWeight: 3
  });
}

function initMapPrintable() {
  result=parseSearchString();
  ResultadosPruebaB();

  var arr1=result.coordtx.split(",");
  var arr2=result.coordrx.split(",");
  var lat0=parseFloat(arr1[0]);
  var lng0=parseFloat(arr1[1]);
  var lat1=parseFloat(arr2[0]);
  var lng1=parseFloat(arr2[1]);
  var uluru = { lat: lat0, lng: lng0};
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: uluru
  });

  var marker1 = new google.maps.Marker({
    position: {lat: lat0, lng: lng0},
    map: map
  });
  var marker2 = new google.maps.Marker({
    position: {lat: lat1, lng: lng1},
    map: map
  });
  marker1.setMap(map);
  marker2.setMap(map);

  var pathfinal = [{lat: lat0, lng: lng0},
            {lat: lat1, lng: lng1}];
  var flightPath = new google.maps.Polyline({
    path: pathfinal,
    geodesic: true,
    strokeColor: 'black',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  flightPath.setMap(map);

  var elevator = new google.maps.ElevationService();
  // Draw the path, using the Visualization API and the Elevation service.
  displayPathElevationB(pathfinal, elevator, map);

  function displayPathElevationB(path, elevator, map) {
    elevator.getElevationAlongPath({
      'path': path,
      'samples': parseNumber(result.cant_redondeo)
    }, plotElevation);
  }

  function plotElevation(elevations, status) {
    var chartDiv = document.getElementById('elevation_chart');
    var chart = new google.visualization.ColumnChart(chartDiv);
    var info = result.altura.split(",");
    var valuetomodify=result.valuetomodify_array.split(",");
    var muestra_mod=result.muestra_mod.split(",");
    var k=parseNumber(result.contador);

    var dataB = new google.visualization.DataTable();
    dataB.addColumn('string', 'Sample');
    dataB.addColumn('number', 'Elevation');
    for (var i = 0; i < info.length; i++) {
      dataB.addRow(['', parseFloat(info[i])]);
    }

    var j;
    for(j=0;j<k;j++){
      valuetomodify[j]=parseFloat(valuetomodify[j]);
      muestra_mod[j]=parseNumber(muestra_mod[j]);
      dataB.setValue(muestra_mod[j], 1, valuetomodify[j]);
    }

    chart.draw(dataB, {
      height: 200,
      legend: 'none',
      titleX: 'Cantidad de muestras',
      titleY: 'Elevación (m)'
    });
  }

}

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

function toggleBounce(){
          marker.setAnimation(google.maps.Animation.BOUNCE);
}

function parseSearchString() {
  result = {};
  location.search.substr(1).split('&').forEach(function (par) {
    var kv = par.split('=');
    result[kv[0]] = kv[1];
  });
  return result;
}

function print(disp_canalLL,disp_mensualMC,disp_anualMC,indisp_anualmin,disp_canalTOT,disp_canalTOT_min,TiltTx,TiltRx,Gtx,Grx,Ptx,Prx,MargenFading,sensRX,distancia,perdidasFSL,perdidasLluvia,perdidasConectores,perdidasOtras,enlace){
  var lat0=latitud[0].toFixed(3);
  var lng0=longitud[0].toFixed(3);
  var lat1=latitud[1].toFixed(3);
  var lng1=longitud[1].toFixed(3);
  var coordtx=lat0+","+lng0;
  var coordrx=lat1+","+lng1;
  var htx=altura[0].toFixed(2);
  var hrx=altura[altura.length-1].toFixed(2);
  var dimensionestx=document.getElementById("dimensionestx").value;
  var dimensionesrx=document.getElementById("dimensionesrx").value;
  var pol=parseNumber(document.getElementById("polarizacion").value);
  var freq=Inputfreq;
  var fresnel=fresnelGlobal;
  distancia=distancia.toFixed(3);
  disp_canalTOT=disp_canalTOT.toFixed(6);
  disp_canalLL=disp_canalLL.toFixed(6);
  disp_mensualMC=disp_mensualMC.toFixed(6);
  disp_anualMC=disp_anualMC.toFixed(6);
  indisp_anualmin=indisp_anualmin.toFixed(6);
  disp_canalTOT_min=disp_canalTOT_min.toFixed(6);

  document.getElementById("link").innerHTML = '<a href="PruebaB.html?perdidasFSL='+ perdidasFSL +
     '&disp_canalTOT='+ disp_canalTOT +
     '&disp_canalLL='+disp_canalLL+
     '&disp_mensualMC='+disp_mensualMC+
     '&disp_anualMC='+disp_anualMC+
     '&indisp_anualmin='+indisp_anualmin+
     '&disp_canalTOT_min='+disp_canalTOT_min+
     '&TiltTx='+TiltTx+
     '&TiltRx='+TiltRx+
     '&Gtx='+Gtx+
     '&Grx='+Grx+
     '&Ptx='+Ptx+
     '&Prx='+Prx+
     '&MargenFading='+MargenFading+
     '&distancia='+distancia+
     '&perdidasLluvia='+perdidasLluvia+
     '&perdidasConectores='+perdidasConectores+
     '&perdidasOtras='+perdidasOtras+
     '&coordtx='+coordtx+
     '&coordrx='+coordrx+
     '&Freq='+freq+
     '&pol='+pol+
     '&htx='+htx+
     '&hrx='+hrx+
     '&sensRX='+sensRX+
     '&cant_redondeo='+cant_redondeo+
     '&altura='+altura+
     '&muestra_mod='+muestra_mod+
     '&contador='+contador+
     '&valuetomodify_array='+valuetomodify_array+
     '&fresnelGlobal='+fresnel+
     '&enlace='+enlace+
     '" target="_blank">Haga click aquí para imprimir la página de resultados</a>';
  return;
}

function ResultadosPruebaB(){
  var despejefinal;

  var pol=result.pol;
  if(pol==1)
    pol="Vertical";
  else
    pol="Horizontal";

  document.getElementById("transmisorpruebaB").value = "("+result.coordtx+")";
  document.getElementById("receptorpruebaB").value = "("+result.coordrx+")";
  document.getElementById("distpruebaB").innerHTML = result.distancia+" km";

  if(result.fresnelGlobal=="0"){
    despejefinal="Mayor o igual a 60%";
  }
  else if(result.fresnelGlobal=="1"){
    despejefinal="Entre el 40% y 60%";
  }
  else {
    despejefinal="No hay despeje de Fresnel";
  }

  var enlace;
  console.log("enlace:" +parseFloat(result.enlace));
  if (result.enlace=="0")
		enlace="Enlace Aceptable";
	else if (result.enlace=="1")
		enlace="Enlace no Aceptable";

  var totPerdidas=parseFloat(result.perdidasFSL)+parseFloat(result.perdidasLluvia)+parseFloat(result.perdidasOtras)+parseFloat(result.perdidasConectores);
  var obj = [
		{
			name: "Altura total del Transmisor (m) ",
			value: result.htx
		},
		{
			name: "Altura total del Receptor (m) ",
			value: result.hrx
		},
		{
			name: "Ganancia del Transmisor (dBi)",
			value: result.Gtx
		},
		{
			name: "Ganancia del Receptor (dBi) ",
			value: result.Grx
		},
		{
			name: "Potencia del Transmisor (dBm) ",
			value: result.Ptx
		},
		{
			name: "Potencia del Receptor (dBm)",
			value: result.Prx
		},
		{
			name: "Angulo Tilt Antena Transmisora (grados)",
			value: result.TiltTx
		},
    {
			name: "Angulo Tilt Antena Receptora (grados)",
			value: result.TiltRx
		},
		{
			name: "Sensibilidad de Recepción (dBm) ",
			value: result.sensRX
		},
		{
			name: "Frecuencia (GHz) ",
			value: result.Freq
		},
		{
			name: "Polarizacion ",
			value: pol
		},
		{
			name: "",
			value: ""
		},
		{
	    name: "Perdidas de Espacio Libre (dB)",
	    value: result.perdidasFSL
	  },
		{
	    name: "Perdidas por Fading (dB)",
	    value: result.MargenFading
	  },
		{
	    name: "Perdidas por Lluvia (dB)",
	    value: result.perdidasLluvia
	  },
		{
	    name: "Perdidas de Conectores (dB)",
	    value: result.perdidasConectores
	  },
		{
	    name: "Otras Perdidas (dB)",
	    value: result.perdidasOtras
	  },
		{
	    name: "TOTAL DE PERDIDAS (dB)",
	    value: totPerdidas
	  },
		{
			name: "",
			value: ""
		},
		{
	    name: "Despeje de Fresnel",
	    value: despejefinal
	  },
		{
			name: "",
			value: ""
		},
		{
	    name: "Disponibilidad de Canal del peor mes por Multi Camino(%)",
	    value: result.disp_mensualMC
	  },
		{
	    name: "Disponibilidad de Canal anual por Multi Camino(%)",
	    value: result.disp_anualMC
	  },
		{
	    name: "Indisponibilidad anual (min)",
	    value: result.indisp_anualmin
	  },
		{
	    name: "Disponibilidad de Canal anual por lluvia (%)",
	    value: result.disp_canalLL
	  },
	  {
	    name: "Disponibilidad Total del Canal (Multi Camino + Lluvia) (%)",
	    value: result.disp_canalTOT
	  },
		{
	    name: "Disponibilidad Total de Canal (min)",
	    value: result.disp_canalTOT_min
	  },
    {
      name: "",
      value: ""
    },
    {
      name: "Viabilidad del enlace",
      value: enlace
    }];

  function populateTable(obj) {
    var report = document.getElementById('result_table_pruebaB');

    // Limpiar tabla antes de agregar datos
    report.innerHTML = '';

    // Por cada elemento agregar una fila con dos columnas. Una para el nombre y otra para el valor
    for (var i = 0; i < Object.keys(obj).length; i++) {
      var tr = "<tr><td>" + obj[i].name + "</td><td>" + obj[i].value + "</td></tr>";
      report.innerHTML += tr;
    }
  }

  populateTable(obj);
  }

function toDegrees(radians){
	return ((radians * 180) / Math.PI);
}

function parseNumber(numberString){
  /*var reMatch = /^[+-]?(\d+)(?:[,.](\d+))?$/.exec(numberString);
  if (!reMatch) {
    return NaN;
  } else if (!reMatch[2]) {
    return +reMatch[1];
  } else {
    return +(reMatch[1] +'.'+ reMatch[2]);
  }*/
  var res = numberString.replace(",", ".");
  return (res);
}

function ToRadians(degree) {
  return (degree * (Math.PI / 180));
}
