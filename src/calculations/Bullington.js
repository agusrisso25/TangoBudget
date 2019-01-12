/*
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
		OIficticio=((ctemayorPendTx-ctemayorPendRx)/(mayorPendTx-mayorPendRx));
		h_OIficticio=mayorPendTx*OIficticio+htx2;
		return(OIficticio);
}
