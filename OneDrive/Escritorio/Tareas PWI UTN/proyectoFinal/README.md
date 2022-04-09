Nombre: Gustavo
Apellido: Chaparro
DNI: 35.707.917

Idea: la web se usaria para que una emprendedora muestre sus trabajos, para poder recibir consultas o encargues. 
Ademas le app web le permite subir sus propios productos desde un usuario administrador. 
La web le permite los usuarios puedan registrarse, loguearse y recorrer la web intuitivamente.

Temas aplicados:

1) Node js: con handelbars hice las paginas y views para formar el cuerpo del proyecto,
   ademas de las bibliotecas necesarias para que el usuario pueda utilizar la pagina para el fin que se la creo.
2) Javascript: use arrows function, etiquetas, funciones, condicionales, etc. Para que la web capture y mande datos a la DB, 
   los 2 roles de usuarios pueden logearse y navegar por las paginas. El administrador puede realizar tareas especificas 
   y ver una pagina extra para leer consultas y subir sus productos(/administracion.).
3) Bootstrap: use todo lo que se me ocurrio para enbellecer la web, botoneras, inputs, clases predeterminadas, breakpoints, etc.
4) CSS: para terminar de perzonalizar lo realizado con bootstrap y/o dar retoques especificos.
5) HTML: como use hbs como base y estructuracion. Solo en cada views le di el cuerpo que faltaba.

La web permite/sirve para:

Al loguearse por defecto la web toma cada nuevo registro como cliente, solo permite un solo usuario adm que ya esta definido. 
El admin tiene acceso a un view extra /administracion donde puede editar los productos subidos en la web y leer consultas.
Los usuarios (clientes) pueden con 1 click ir al IG y facebook de la persona del emprendimiento, 
ver los ejemplos de trabajos a solicitar, etc.
La base de datos recopila informacion de los registros, las consultas hechas y los productos subidos por el adm.

Cuestiones varias: media query para dispositivos de 400px a 992px; password "hasheadas" en DB y Front; imagenes cargadas como Base64(*) en DB pero visibles 
		   como imagenes en Front; al loguearse un usuario tiene acceso a un campo nuevo en el navbar (admin para realizar tareas en /administracion
		   y cliente para modificar sus datos del registro, realizar, etc en /clientes); en /productos hay "remeras" subidas desde /administracion (que impacta
		   en la DB,etc) y colocadas por mi con html, css, bootstrap, etc.; enlaces con destino en pestañas nuevas: instagram, facebook.

Envia datos a la DB: los formularios hechos en /registro, los de /contacto (consultas), y las tareas que se pueden realizar en /administracion. 


*Probe muchas formas de modificar la base de datos hasta que me tomo el alojamiento de las imagenes, puede crashear. Por el momento la columna imagen
 tiene el atributo "longblob".