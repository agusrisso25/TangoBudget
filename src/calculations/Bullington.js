/*Se calculan las pérdidas por difracción cuando hay un obstáculo que genera interferencia entre el 40% y 60% de Fresnel
*/
function Bullington(htx2,hrx2,distancia) {
		var X1;
		var Y1;
		var X2;
		var Y2;
		var pend1;
		var pend2;
		var cte1;
		var cte2;
		var ctemayorPendRx;
		var ctemayorPendTx;
		var mayorPendTx=0;
		var mayorPendRx=0;
		var d1;	//proyección ortogonal de distancia entre TX y OI
		var d2; //proyección ortogonal de distancia entre OI y RX
		var hq; //variable que surge de la interseccion de la altura del OI ficticio y LOS
		var hp; //variable que surge de la interseccion de la altura del OI ficticio y LOS pero cuando las alturas de las antenas son distintas
		var a1; //distancia entre TX y cuspide del OIficticio
		var a2; //distancia entre RX y cuspide del OIficticio
		//calculo las pendientes que generan entre un 40% y 60% de Despeje con la antena Tx
		for(i=0;i<distanciaFresnel.length;i++){
			Y1=((-htx2+alturaFresnel[i])/distanciaFresnel[i])*X1+htx2;
			pend1=((-htx2+alturaFresnel[i])/distanciaFresnel[i]);
			cte1=htx2;
			if (mayorPendTx<pend1)
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
		//Para la intersección de las dos rectas finales,
		OIficticio=Math.floor((ctemayorPendTx-ctemayorPendRx)/(mayorPendTx-mayorPendRx)); //este valor sirve para tener una noción de donde estará el objeto interferente ficticio
		h_OIficticio=mayorPendTx*OIficticio+htx2; //Esta será la altura del objeto ficticio
		d1= OIficticio*100; //Calculo la distancia entre el transmisor y el OI ficticio
		d2=(distancia-d1);
		hq=htx-OIficticio*(htx-hrx)*0.5; //hallo la altura de intersección entre LOS y h_OIficticio

		if(htx==hrx){
		a1= Math.sqrt(Math.pow(d1,2)+Math.pow(h_OIficticio-hq,2));
		a2= Math.sqrt(Math.pow(d2,2)+Math.pow(h_OIficticio-hq,2));
		}
		else{
			if(htx<hrx){
				hp=htx;
		}
		else{
			hp=hrx;
		}
		a1=Math.sqrt(Math.pow(d1,2)+Math.pow(h_OIficticio-hp,2));
		a2=Math.sqrt(Math.pow(d1,2)+Math.pow(h_OIficticio-hp,2));
		}
		v=(h_OIficticio-hq)*Math.sqrt(2/lambda*(1/a1+1/a2));
		if(v<-0.78)
			return(0);
		else{
			var J_v=6.9+20*Math.log10(Math.sqrt(Math.pow(v-0.1,2)+1)+v-0.1);
			return(J_v);
		}
}
