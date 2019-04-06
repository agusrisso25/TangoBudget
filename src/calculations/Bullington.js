/*Se calculan las pérdidas por difracción cuando hay un obstáculo que genera interferencia entre el
40% y 60% de Fresnel
*/
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
			pend2=((altura[altura.length-1]-alturaFresnel[j])/(distancia*1000-distanciaFresnel[j]));
			cte2=altura[altura.length-1]-distancia*1000*((altura[altura.length-1]-alturaFresnel[j])/(distancia*1000-distanciaFresnel[j]));
			if(mayorPendRx<pend2){
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

		a1= OIficticio*10;
		a2=(distancia*1000-a1);

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
