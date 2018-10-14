# Moller-Administrador

## Configurando el proyecto

1. Verifica que tengas instalada la version correcta de noe que se encuentra en `.node-version`
2. Instala los modulos necesarios con `npm install`
3. Verifica que tengas `bower` instalado como paquete global, sino ejecuta `npm install -g bower`
4. Corre `bower install` en la carpeta raiz del proyecto para instalar los componentes
5. Copia las carpetas creadas por bower y npm dentro de la carpeta `app`
```bash
mv node_modules bower_components app/
```
6. Arranca el servidor de assets `http-server ./app` y listo! Ve a `localhost:8080`. En caso de no
tener instalado el servidor simplemente ejecuta `npm install -g http-server` para instalarlo globalmente.

## Configurar el backend local

1. En el archivo `app.js:95`descomenta la linea de login local y comenta la de produccion
2. En el archivo `network.js` haz lo mismo
3. No olvides regresarlo como estaba antes de realizar un commit.
