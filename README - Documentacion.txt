Bloques de funcionamiento del programa Tango Budget

**mainA.html
En el archivo principal del tipo html, se tiene la estructura principal del programa, es decir, la descripción gráfica de nuestra aplicación web. En él se define el ``cuerpo'' de la página, se hace referencia a las hojas de estilos CSS y a los archivos javascript que se utilizan para la aplicación.

Las hojas de estilo u archivos de formato .CSS se utilizan para para dar formato y diseño en la presentación de la web.

Por otro lado, los archivos JavaScript se utilizan para controlar el comportamiento de los diferentes elementos, es decir que aportan funcionalidad dinámica. En ellos se definen las funciones que hacen que nuestra aplicación funcione acorde a lo diseñado. A continuación, se detalla la funcionalidad de cada archivo .js utilizado para el desarrollo del programa.

*Archivos JavaScript para el funcionamiento de la página principal - mainA.html
El programa se compone de varios bloques y diferentes funciones javascript que se detallan a continuación.

-AddMarkersAndAll.js
El objetivo principal de esta función, es permitir al usuario la inserción de dos marcadores del mapa que representan a la antena transmisora y receptora. Una vez ingresadas ambas antenas, el programa detecta las coordenadas de cada marcador y traza una línea recta entre ellas, calculando así la distancia que hay entre ellos.

La forma en que el usuario puede insertar los marcadores en el mapa es haciendo ``click'' en la ubicación deseada de este, acción que automáticamente deriva en la inclusión del marcador sobre el mapa.

Mientras el usuario realiza esta acción, la función AddMarkersAndAll.js se encarga de rellenar un array \footnote{Array: Se le denomina a una zona de almacenamiento que contiene una serie de elementos del mismo tipo, los elementos de la matriz.\cite{Array}} llamado ``path'' que se utiliza para almacenar los valores de latitud y longitud de cada marcador para su posterior uso en el programa.

Los marcadores, denominados ``marker'' en el código, cuentan con una animación de salto que el usuario visualiza en el momento de su inserción en el mapa. Una particularidad que tienen es que se pueden arrastrar, a través del mapa, hacia otra posición. Esta acción hace que el array ``path'' se actualice almacenando, solamente, la última posición de estos.

Esta función se encarga también de obtener los valores de latitud y longitud de cada marcador (guardándose en el array llamado ``coordenadas'') y la distancia entre ellos, para luego desplegarlos en pantalla para el usuario. Una vez que los dos marcadores hayan sido colocados sobre el mapa, la función ``AddMarkersAndAll'' llama a la función ``displayPathElevation()'' que está encargada de mostrar en pantalla el perfil de elevación del terreno, de modo que, tanto el usuario como el programa, puedan tomar las decisiones correspondientes para calcular un correcto enlace de microonda.

Con el fin de que el enlace sea punto a punto, el cliente tiene la capacidad de colocar solamente dos marcadores en el mapa.

-ElevationPath.js
Este bloque, es uno de los más importantes dado que contiene una función denominada ``displayPathElevation()'' que, como se mencionó anteriormente, se encarga de obtener el perfil de elevación del camino, una vez definidos en el mapa los marcadores.

Se define:
	- La cantidad de muestras que se toma para la creación y despliegue del camino en función de su largo: 100 muestras por km.
    - A partir del punto mencionado anteriormente, se utiliza el servicio de elevación brindado por Google Maps, que proporciona información de locación y elevación sobre el nivel del mar de cada muestra determinada en el camino. En otras palabras, el objeto de elevación definido en el código --``getElevationAlongPath()''--  se comunica con el servicio de elevación de la API de google Maps que, recibe solicitudes, y devuelve los datos de elevación.

Tomando los valores devueltos por el servicio, se dibuja el camino punto a punto entre los dos marcadores y se grafica el perfil de elevación sobre una visualización de ``gráfico de columnas'' de la API de Google Maps.

Otra forma de acceder a la función, es comprobando el valor de un flag que es seteado desde otras funciones que se mencionan a continuación:

    -Si flag=1: El usuario desea colocar objetos interferentes visto desde la antena transmisora.
    Cuando surge esta acción, la información:
        Sobre la muestra modificada: Se guarda en un array llamado "muestra_mod"
        Sobre la distancia modificada: Se guarda en un array llamado "distanciaobject_array"
        Sobre la altura agregada:Sobre la cantidad de OI que se agregaron: Se guarda en una variable global llamada "contador"

    No es posible colocar un objeto interferente encima de otro. No tendría sentido agregar un árbol que está a 50 metros desde la antena transmisora y luego colocar otro objeto interferente del tipo edificio a 50 metros desde la antena transmisora. En este caso el programa desplegará una alerta.

    Por otra parte se actualiza gráficamente el perfil de elevación.

    Luego de realizar esto, se llama a la función -"AgregarTabla()"- para que se cree o actualice la tabla que contiene los objetos interferentes agregados. Se agrega una fila por objeto agregado.
    En caso que el usuario no haya ingresado información en algún campo obligatorio, se despliega una alerta.

    No se podrán colocar objetos interferentes en las antenas, dado que en la práctica, si una de las antenas tiene un objeto interferente que la obstruye, se levanta la altura de las antenas o se coloca por delante del OI}
    Si flag=2 o es la primera vez que se solicita el perfil de elevación:
    En caso que sea la primera vez que se solicita el perfil de elevación, se crea una visualización del tipo "DataTable" para poder alojar la información que devuelve el servicio de Google Maps. Luego de obtener la información, se transfiere a un array  llamado "altura"	el muestreo de información quitando los valores que no pudieron ser enviados desde el servidor de Google Maps y se guardaron como ``undefined''. Por otro lado, las coordenadas -(Latitud,Longitud)- de cada una de las muestras del perfil de elevación también se guardan, en un array llamado "coordenadas".

	Previo a proceder con la manipulación de la información, se realiza un análisis en caso que haya una pérdida de información mayor a un 20%. Puede pasar que la conexión a internet no sea suficiente o que exista un problema en el servidor y devuelva una menor cantidad de información.
    En caso que la pérdida sea mayor al 20%, entonces el programa desplegará una alerta al usuario para que recargue la página, y comience de cero.}
    En caso que se hayan movido los marcadores, es necesario que:
        -Se recalcule el perfil de elevación
        -Se ingresen las alturas de las antenas nuevamente
        -Se ingrese la frecuencia de transmisión
        -Se eliminen los objetos interferentes que se modificaron
        -Se elimine la información ingresada sobre los datos del enlace
    Si flag=3: El usuario desea deshacer la altura que modificó la última vez. Esto surge desde la función llamada "DeshacerAltura()"

    Se decrementa el contador global de objetos interferentes agregados y se borra la información de la posición de los arrays mencionados anteriormente.
    Por último, se actualiza la tabla que contiene los OI que el usuario colocó, quitando el último valor agregado.}
    Si flag=4: El usuario desea agregar altura a las antenas Tx y Rx. Este paso es similar al de agregar OI, sólo que aumenta la altura de las antenas y modifica el primer y último valor del array "altura"

Finalmente, luego de todos los casos de uso con respecto al flag, se actualiza el perfil de elevación, se recalcula el despeje de Fresnel y se calcula nuevamente si hay linea de vista.

A continuación se mencionan todos los bloques que se utilizaron para llevar a cabo las funciones anteriores.

FunctionCoordinates.js
Este archivo contiene dentro una función denominada "coordenadas(latitud, longitud)" que se encarga de realizar dos procedimientos:
    -Obtiene las coordenadas de cada marcador y las despliega en la página web para que el usuario las pueda visualizar
    -Llama a una función denominada "haversine" para calcular e imprimir en pantalla también la distancia entre los marcadores, es decir, el largo del camino en km.

HaversineDistance.js
En él se encuentra la función para el cálculo de distancia entre dos puntos sobre la tierra. Tiene en cuenta la latitud y longitud de cada posición, así como el radio de la tierra para realizar el cálculo.

FunctionDelete.js
Este bloque se utiliza para borrar toda la información que pertenece al mapa:
	- Las coordenadas del transmisor y receptor
    - El largo del camino
    - Objetos interferentes agregados
    - Frecuencia de transmisión
    - Marcadores que se ingresaron en el mapa

FunctionInit.js
Este bloque se utiliza para inicializar tanto el mapa, como variables que se utilizan a lo largo del funcionamiento de la página web. Los eventos ``listener'' se definen en esta función. Estos, registran un evento a un objeto en específico, por ejemplo, un "click" en el mapa, o en un campo definido en la página web.

Dentro de esta función, dependiendo de qué mapa es inicializado, las funciones que se utilizarán (Se puede inicializar mainA o mainB).

MarkersToggleBounce.js
Este bloque añade una animación a los marcadores que se colocan sobre el mapa; hace que estos reboten en el momento en que se hace "click" en el mapa para ser añadidos.

ToRadians.js
Esta función simplemente realiza una conversión de grados a radianes. Se utiliza desde otras funciones.

ToDegrees.js
Esta función simplemente realiza una conversión de radianes a grados. Se utiliza desde otras funciones.

ParseNumber.js
Este bloque convierte los números que sean ingresados con coma y los convierte a punto, para que a nivel de código no haya problema de interpretación de la información.

LOS.js
Este bloque tiene como funcionalidad calcular si hay línea de vista entre la antena Tx y Rx
Se estudian los siguientes casos:

    CASO A: La posición máxima es distinta al origen o al destino, calculo altura del punto máximo}
        -caso 1: Pmax mayor a ambas antenas
        -caso 2: Pmax mayor a la antena Tx y menor a la Rx
        -caso 3: Pmax mayor a la antena Rx y menor a la Tx
        -caso 4: Pmax menor a ambas antenas
    CASO B1: La posición máxima es el origen o el destino
        -caso 1: Pmax3 mayor a ambas antenas
		-caso 2: Pmax mayor a la antena Tx y menor a la Rx
        -caso 3: Pmax mayor a la antena Rx y menor a la Tx
        -caso 4: Pmax menor a ambas antenas
    CASO B2: Si Pmax2 es la máxima altura en el camino, y no es extremo
        -caso 1: Pmax2 mayor a ambas antenas
        -caso 2: Pmax2 mayor a la antena Tx y menor a la Rx
        -caso 3: Pmax2 mayor a la antena Rx y menor a la Tx
        caso 4: Pmax2 menor a ambas antenas

Sea cual sea el caso de uso, la función devolverá 1 si tiene linea de vista y 0 si no la tiene.

DistanceToBorders.js
Este bloque se utiliza para calcular la distancia a los bordes, una vez obtenidas las coordenadas de los marcadores.

DraggableButton.js
Esta función permite al usuario arrastrar los marcadores colocados en el mapa y recalcular las coordenadas.

FSL.js
Este bloque tiene como funcionalidad calcular las pérdidas de espacio libre por definición

Fresnel.js
Este bloque tiene como funcionalidad calcular el radio de Fresnel utilizando su definición y luego detecta si el objeto interferente tiene un 40% o 60% de despeje.

InputUser.js
Este módulo tiene como funcionalidad tomar toda la información que ingresó el usuario en la plataforma y hacer todos los cálculos necesarios para generar la tabla de resultados.
En caso que falte información obligatoria, el programa desplegará un error.
El usuario debe ingresar, observando el datasheet
    -Ganancia de antena transmisora y receptora
    -Potencia de transmisión
    -Pérdidas de conectores y otras
    -Sensibilidad de recepción de las antenas (En caso que el usuario ingrese un número mayor o igual a cero, el programa desplegará error), dado que por su definición, debe ser un valor menor a cero

Luego de realizar los cálculos, el programa devuelve como resultado la viabilidad del enlace.
Este bloque sigue la lógica de la imagen que pertenece a la sección

ModifyHeight.js
Este bloque tiene como funcionalidad ingresar objetos interferentes a lo largo del camino.

No se poedrá ingresar objetos interferentes sobre las antenas ni se puede colocar objetos interferentes a distancias que exceden el largo del camino definido

ModifyRxTx.js
Este bloque tiene como funcionalidad modificar la altura de las antenas Tx y Rx.
No se podrá ingresar alturas negativas ni nulas.

ResultTable.js
Este bloque tiene como funcionalidad desplegar los resultados de los cálculos. En ella se desplegarán los cálculos correspondientes a:

    -Altura del transmisor y receptor (m)
    -Ganancia del transmisor y receptor (dBi)
    -Potencia del transmisor y receptor (dBm)
    -Ángulo de inclinación entre las antenas (grados)
    -Sensibilidad de recepción (dBm)
    -Frecuencia de transmisión (GHz)
    -Largo del camino (Km)
    -Tipo de Polarización
    -Pérdidas de Espacio Libre (dB)
    -Pérdidas por Fading (dB)
    -Pérdidas por Lluvia (dB)
    -Pérdidas de los conectores (dB)
    -Otras pérdidas (dB)
    -Total de pérdidas (dB)
    -Hay Línea de vista?
    -Despeje de Fresnel
    -Disponibilidad del canal del peor mes por Multi Camino (\%)
    -Disponibilidad del canal anual por Multi Camino (\%)
    -Indisponibilidad anual (min)
    -Disponibilidad de Canal Anual por lluvia (\%)
    -Disponibilidad Total del Canal (Multi Camino + Lluvia) (\%)
    -Disponibilidad Total del Canal (min)

Table.js
Este bloque tiene como funcionalidad desplegar los resultados de colocar cada objeto interferente a lo largo del camino. Cada objeto interferente colocado desplegará la siguiente información:
    -Distancia desde el Tx(m)
    -Altura (m)
    -Despeje del 60\% ?
    -Despeje del 40\% ?
    -Muestra modificada


Tilt.js
Esta función permite calcular la inclinación que deberán tener las antenas cuando las mismas tengan una altura diferente.

UndoHeight.js
Este bloque tiene como funcionalidad deshacer el último objeto interferente modificado por el usuario. En caso que se hayan deshecho todos los cambios, se desplegará una alerta.

BorrarFila.js
Para finalizar con esta acción, se llama a la función BorrarFila.js que remueve la última muestra agregada en la tabla de los OI agregados y borra la información agregada a los array.

Print.js
Esta función se utiliza para generar la URL que se utilizará para desplegar los resultados finales en el mainB.html

getFreq.js
Esta función se ejecuta cuando el usuario ingresa la frecuencia de transmisión. Una vez que se toma esta información, se guarda la frecuencia en una variable global y se ejecuta la función Fresnel.js para calcular el despeje de Fresnel correspondiente al perfil de elevación sin objetos interferentes.

IndispMin.js
Esta función se utiliza para calcular la cantidad de minutos que puede llegar a tener el enlace en caso de indisponibilidad, utilizando la definición \cite{ITU530}

PasajeAnual.js
Este bloque se utiliza para pasar la disponibilidad mensual por Multi Camino a una disponibilidad Anual por Multi Camino.

RainAtt.js
Este bloque se utiliza para calcular la atenuación por lluvia del enlace (En dB), tomando como información la frecuencia de transmisión, el tipo de polarización y la intensidad de lluvia dependiendo de la zona.

Bullington.js
Este bloque calcula las pérdidas por difracción tomando a los objetos interferentes por filo de cuchillo, utilizando el método de Bullington.

ChannelAvailability.js
Esta función calcula la disponibilidad del enlace anual por Multi Camino, por el método de Barnett Vigant.

ChannelAvailability2.js
Este bloque utiliza el método de la ITU \cite{ITU530} para calcular la disponibilidad del enlace mensual por Multi Camino. Además devuelve la disponibilidad anual y los minutos de indisponibilidad en el año.

**mainB.html
Una vez que el usuario ya ingresó toda la información y desea imprimir el reporte, junto con el despliegue de resultados, se genera un nuevo link donde, haciendo ``click'', se despliegan todos los resultados relevantes.

A diferencia del html mainA.html, este contiene el resumen con los resultados de cálculos finales.

Archivos JavaScript para el funcionamiento de la página principal - mainB.html
parseSearchString.js
Se utiliza el concepto de Query String Search \cite{Querystring} para pasar los parámetros calculados en mainA mediante la URL y se puedan visualizar desde mainB.html.

Una vez que está modificada la URL de mainB, se toma la información y se guarda en un array llamado "result".

mainBresulttable.js
Una vez que se tiene toda la información en el array ``result'', se despliega en la tabla y en el mapa los resultados.
