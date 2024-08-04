# PhotoLock

**Integrantes**: Bruno Weisz, Lorenzo Ruiz Diaz, Caro Lang y Chino Cribioli

# Warning
El proyecto está incompleto y requiere mucho más trabajo, sobre todo en la parte de dónde se ejecutan las cosas. Actualmente se corre en localhost y requiere tener circom instalado. Por otro lado, decidimos deshabilitar el botón de compilación dado que puede generar problemas de performance. Más allá de esto, creemos que la idea es buena y tiene futuro como servicio

## TL;DR

PhotoLock es una herramienta para generar y verificar pruebas de veracidad sobre imágenes editadas. Permite a alguna persona mediante Zero-Knowledge Proofs demostrar y/o verificar que una foto viene de donde dice venir.

### Caso de uso

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
* El verificador a partir de la imagen recortada, la prueba provista por el mecanismo anterior, la direccion del contrato y la clave pública de la camara, genera una transacción al contrato que verifica la prueba.

## Descripción del protocolo
Partamos de una cámara fotográfica especial que tiene una clave privada integrada. Esta cámara al sacar una foto genera 3 cosas:
* La foto original (P)
* Un hash de la foto original (H(P))
* La firma del hash de la foto original (F(H(P)))

El proceso para publicar esta foto y que alguien la verifique sería el siguiente:
1) Un diario publica P, H(P) y F(H(P))
2) La camara que usa ese diario tiene una public key (PubK) conocida por todos
3) El usuario hashea P y verifica que H(P) coincide con el hash generado por él mismo
4) El usuario verifica F(H(P)) usando PubK y chequea que coincida con H(P)

Ahora supongamos que esta foto tiene que ser recortada por algún motivo. La nueva foto es P'. Ni el hash de P' coincidirá con H(P) ni la firma tendría ningún sentido al ser verificada. La idea del protocolo es usar zkSnarks para demostrar que P' proviene de P sin necesidad de revelar P.

Para esto, dados P, P' y H(P) vamos a generar un circuito que por un lado va a estar parametrizado con las dimensiones de P y P' y el offset de P' respecto a P y por otro va a recibir como inputs a P (privado), H(P) (público) y P' (público). El circuito va a demostrar las siguientes 2 propiedades:
* P' es un recorte de P
* El hash de P coincide con H(P) (esto sirve para relacionar el H(P) con P pero sin revelar P)
El verifier de este circuito va a estar deployado en la blockchain y va a ser específico para P y las dimensiones y ubicación del recorte (es un contrato personalizado para una modificación de una foto).

Por otro lado, off chain va a ocurrir la verificación de que F(H(P)) es una firma valida de H(P) bajo la clave PubK. Esto no es necesario que ocurra en un circuito zk ya que no es necesario revelar la imagen original para hacer este chequeo. El motivo por el que firmamos el hash y no la foto misma es para poder hacer este chequeo off-chain.

Combinando los chequeos on-chain y off-chain podemos convencernos de que P' es un recorte de P sin necesidad de conocer P, y que P proviene de una camara certificada con clave publica PubK.

## Stack

Para el frontend hicimos una Next.js application.
Toda la parte de circuitos está hecha en circom, aprovechando que tiene una integración para generar y deployar smart contracts en Solidity.
Si se corre en un entorno local debe estar circom instalado.
