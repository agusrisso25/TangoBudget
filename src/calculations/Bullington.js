/*Se calculan las pérdidas por difracción cuando hay un obstáculo que genera interferencia entre el 40% y 60% de Fresnel
*/
function Bullington(htx2,hrx2,distancia) {
		var X1;
		var Y1;
		var X2;
		var Y2;
		var lambda;
		var c= 3*10^8;
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
		var hq; //variable que surge de la interseccion de la altura del OI ficticio y LOS
		var hp; //variable que surge de la interseccion de la altura del OI ficticio y LOS pero cuando las alturas de las antenas son distintas
		var a1;
		var a2;

		/*calculo las pendientes que generan entre un 40% y 60% de Despeje con la antena Tx
		Para ello es necesario recorrer el array donde guardé toda la información de los objetos que obstruyen
		entre el 40% y 60% de Fresnel
		Luego de recorrer el array, se guarda la mayor pendiente en mayorPendTx y mayorPendRx y las ctes que
		constituyen la ecuación de la recta
		*/
		for(i=0;i<distanciaFresnel.length;i++){
			Y1=((-htx2+alturaFresnel[i])/distanciaFresnel[i])*X1+htx2;
			pend1=((-htx2+alturaFresnel[i])/distanciaFresnel[i]);
			cte1=htx2;
			if (Math.abs(mayorPendTx)<Math.abs(pend1))
				mayorPendTx=pend1;
				ctemayorPendTx=cte1;
		}

		for(j=0;j<distanciaFresnel.length;j++){
			Y2=((alturaFresnel[i]-htx2)/(distanciaFresnel[i]-distancia))*X2+((distanciaFresnel[i]*hrx2-distancia*alturaFresnel[i])/(distanciaFresnel[i]-alturaFresnel[i]));
			pend2=((alturaFresnel[i]-htx2)/(distanciaFresnel[i]-distancia));
			cte2=((distanciaFresnel[i]*hrx2-distancia*alturaFresnel[i])/(distanciaFresnel[i]-alturaFresnel[i]));
			if(Math.abs(mayorPendRx)<Math.abs(pend2))
				mayorPendRx=pend2;
				ctemayorPendRx=cte2;
		}

		/* Luego, se debe intersectar las dos rectas con mayor pendiente para encontrar la distancia y altura del
		objeto interferente ficticio. Se guardan esos valores en OIficticio y h_OIficticio.
		Además, se halla:
		d1: Distancia entre el transmisor y OIficticio
		d2: Distancia entre el OIficticio y el receptor
		hq: Corresponde a la intersección entre la línea de vista el OIficticio
		*/
		OIficticio=Math.floor((ctemayorPendTx-ctemayorPendRx)/(mayorPendTx-mayorPendRx)); //este valor sirve para tener una noción de donde estará el objeto interferente ficticio
		h_OIficticio=mayorPendTx*OIficticio+htx2; //Esta será la altura del objeto ficticio
		d1= OIficticio*100;
		d2=(distancia-d1);
		hq=htx2-OIficticio*(htx2-hrx2)*0.5; //hallo la altura de intersección entre LOS y h_OIficticio

		/* Para aplicar la definición de v, es necesario estudiar dos casos:
			CASO 1: htx2=hrx2 por lo que a1 y a2 (que corresponden a la distancia entre el transmisor y h_OIficticio
			se obtienen de forma inmediata aplicando pitágoras.
			CASO 2: htx2!=hrx2 por lo que es necesario hallar la proyección ortogonal sobre la horizontal y luego
			aplicar pitágoras.
			*/
		if(htx2==hrx2){
		a1= Math.sqrt(Math.pow(d1,2)+Math.pow(h_OIficticio-hq,2));
		a2= Math.sqrt(Math.pow(d2,2)+Math.pow(h_OIficticio-hq,2));
		}
		else{
			if(htx2<hrx2){
				hp=htx2;
		}
		else{
			hp=hrx2;
		}
		a1=Math.sqrt(Math.pow(d1,2)+Math.pow(h_OIficticio-hp,2));
		a2=Math.sqrt(Math.pow(d1,2)+Math.pow(h_OIficticio-hp,2));
		}

		/* Una vez obtenido el valor de a1 y a2, se aplica la definición de v. En caso que sea menor a -0.78
		la atenuación por difracción será cero.
		En el otro caso, se utiliza una aproximación lineal
		 */
		v=(h_OIficticio-hq)*Math.sqrt(2/lambda*(1/a1+1/a2));
		if(v<-0.78)
			return(0);
		else{
			var J_v=6.9+20*Math.log10(Math.sqrt(Math.pow(v-0.1,2)+1)+v-0.1);
			return(J_v);
		}
}
