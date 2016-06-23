#Iniciar el proyecto

Lo primero que tenemos que tener instalado es node.js, npm, gulp y mysql.

**1. Instalar node.js y npm (versión 4.4.5)**

Para instalar node.js solo necesitamos ir a la página oficial y descargar el ejecutable.
Actualmente Artemanifiesto corre sobre node.js 4.4.5

[descargar node.js](https://nodejs.org/en/)


**2. Instalar gulp (opcional)**

Gulp nos servirá para ejectuar las tareas del proyecto tales como minificar, concatenar, optimizar archivos estáticos.
una ves instalado node.js podemos instalar gulp.js ejecutando el siguiente comando

`npm install -g gulp`

sino se instala gulp globalmente dentro de las dependencias del proyecto ya se encuentra el módulo por lo que podemos
ejecutar las tareas de la siguiente manera.

` node_modules/gulp/bin/gulp.js `

**3. Instalar mysql (versión > 5.7 sql_mode='')**

Artemanifiesto usa mysql 5.7 para el uso de fulltext search, ir a la siguiente dirección para comenzar a descargar

[descargar mysql](https://dev.mysql.com/downloads/mysql/)

**3. Clonar el proyecto**

Unas ves que tengamos instalado todas estas herramientas se necsita clonar el repositorio ejecutando el siguiente comando.

`git clone https://github.com/Hackerdudes/arte-manifiesto.git`

**4. Configurar el proyecto**

Cuando clonen el proyecto hay un archivo llamado .env-example hay que renombarlo a .env solamente, y cambiar los datos de
configuración de la base de datos, nombre de dominio local, etc.

**5. Configurar archivo hosts**

el archivo hosts se encuentra ubicado en:

Windows: \System32\Drivers\Etc 

Mac y  Linux: /etc/hosts/

necesitamos ejecutarlo como administrador para poder editarlo y agregar lo siguiente:

`127.0.0.1 am.local`

**6. Crear base de datos**

Ingresar a la base de datos através de algún manejador mysql como(phpmyadmin, sequelpro, mysql workbench, etc) y crearla usando la siguiente configuración

![mysql config](http://image.prntscr.com/image/89edf97316e74da3b922dda05096da52.png)

**7. Ejecutar el servidor**

corriendo el siguiente comando instalamos las dependencias:

`npm install`

esperamos a que se instale todos las dependencias y ejecutamos:

`node app`

**8. Ejecutar tareas con gulp**

si no tienen instalado gulp globalmente ejecutar el siguiente comando :

`node_modules/gulp/bin/gulp.js `

de lo contrario solo:

`gulp`







