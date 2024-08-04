# PhotoLock

**Integrantes**: Bruno Weisz, Lorenzo Ruiz Diaz, Caro Lang y Chino Cribioli

## Sobre el proyecto

### TL;DR

PhotoLock es una herramienta para generar y verificar pruebas de veracidad sobre imagenes editadas. Permite, mediante Zero-Knowledge Proofs, a algun agente demostrar y/o verificar que una foto viene de donde dice venir.

### Cuentito

Imagina que un diario tiene una camara con una clave privada integrada (a la cual no tenemos acceso) que usa para firmar digitalmente cada foto que toma junto con cierta metadata tales como fecha, hora, lugar geografico, etc. De esta manera, dada la clave publica del dispositivo y la firma de cierto par Foto-Metadata, podriamos verificar si efectivamente la foto que vemos fue sacada en el momento y lugar que el diario afirma.

Ahora, que pasa si decidimos aplicar alguna transformacion a esta foto tales como recortarla o aplicarle algun filtro? En ese caso, la firma ya no seria valida para la foto resultante, perdiendo credibilidad.

Para solucionar este problema, creamos una herramienta que al recortar una foto genera una prueba criptografica de que el resultado es producto de una transformacion valida sobre una imagen firmada correctamente.

De esta manera, el diario podria recortar las fotos a conveniencia y adjuntar una prueba de que no falsifico ni manipulo malisiosamente la imagen.

## Como usarlo

Para levantar el proyecto localmente, correr el comando `yarn run dev` en el directorio `trimmed-image-ui`.


Esto habilita la pagina en localhost:3000, que tiene dos secciones. La izquierda es para generar la prueba de que el recorte corresponde con la imagen original firmada y la de la derecha es para verificarla. En una version final esta segunda seccion no deberia existir y la verificacion se hace desde una extension del navegador.

Para generar una prueba, cargar una imagen en el input correspondiente y recortarla desde la pagina. Se deben proveer la firma de la imagen original y la clave publica de la camara que la firmo. El boton "Compile" genera una nueva prueba para la foto recortada a partir de todos estos datos.

Se deberia subir un contrato a la blokchain que verifique la autenticidad de la foto recortada a partir de ella, que tambien debe recibir la prueba de validez y la clave publica de la camara.

El verificador no esta programado pero deberia, a partir de la imagen recortada, la prueba provista por el mecanismo anterior, la direccion del contrato y la clave publica de la camara, pegarle al contrato y verificar la firma del recorte.