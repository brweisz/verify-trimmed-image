# PhotoLock

**Integrantes**: Bruno Weisz, Lorenzo Ruiz Diaz, Caro Lang y Chino Cribioli

## Sobre el proyecto

### TL;DR

PhotoLock es una herramienta para generar y verificar pruebas de veracidad sobre imagenes editadas. Permite a alguna persona mediante Zero-Knowledge Proofs demostrar y/o verificar que una foto viene de donde dice venir.

### Cuentito

Imagina que un diario tiene una camara especial con una clave privada integrada (a la cual no tenemos acceso) que usa para firmar digitalmente cada foto que toma junto con cierta metadata tales como fecha, hora, lugar geografico, etc. De esta manera, dada la clave publica del dispositivo y la firma de cierto par Foto-Metadata, podriamos verificar si efectivamente la foto que vemos fue sacada en el momento y lugar que el diario afirma.

Ahora, que pasa si decidimos aplicar alguna transformación a esta foto tal como recortarla o aplicarle algún filtro? En ese caso, la firma ya no sería válida para la foto resultante, perdiendo credibilidad.

Para solucionar este problema, creamos una herramienta que al recortar una foto genera una prueba criptografica de que el resultado es producto de una transformación pública y válida sobre una imagen firmada correctamente.

De esta manera, el diario podría recortar las fotos a conveniencia y adjuntar una prueba de que no falsifico ni manipulo malisiosamente la imagen.

### Slides

Preparamos una [presentacion](https://docs.google.com/presentation/d/1d3Velmm8Vooe9WUCosvAns153QIgs9gNYdw6lGkIw-c/edit?usp=sharing) para acompañar la charla introductoria de nuestro proyecto.

## Como usarlo

Para levantar el proyecto localmente, correr el comando `npm run dev` en el directorio `trimmed-image-ui`.


Esto habilita la página en localhost:3000, que tiene dos secciones. La izquierda es para generar la prueba de que el recorte corresponde con la imagen original firmada y la de la derecha es para verificarla. En una version final esta segunda sección no debería existir y la verificación se hace desde una extensión del navegador.

Para generar una prueba, cargar una imagen en el input correspondiente y recortarla desde la pagina. Se deben proveer la firma de la imagen original y la clave publica de la camara que la firmo. El boton "Compile" realiza las siguientes acciones en el servidor:
* Genera un circuito específico para las resoluciones de la imagen original y recortadas
* Genera una nueva prueba de autenticidad para la foto recortada a partir de todos estos datos.
* Deploya un contrato a la blokchain que verifica la autenticidad de la foto recortada a partir de ella, debe recibir como parámetros la prueba de validez, la clave pública de la camara y la foto recortada.

El verificador no está implementado pero debería, a partir de la imagen recortada, la prueba provista por el mecanismo anterior, la direccion del contrato y la clave pública de la camara, generar una transacción al contrato que verifica la prueba.

## Stack

Para el frontend hicimos una Next.js application.
Toda la parte de circuitos está hecha en circom, aprovechando que tiene una integración para generar y deployar smart contracts en Solidity.
