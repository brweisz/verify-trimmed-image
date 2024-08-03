// IDEA: Basta comparar un numero, no tener tres colores... se puede construir inyeccion a Fp desde F256 x F256 x F256.
// Usar esta funcion antes de pasar la foto como parámetro para generar el circuito
const convertToOneElement = (rgb: [number, number, number]): number => rgb[0]*256*256 + rgb[1]*256 + rgb[2];
const convertPhoto = (photo: Array<[number, number, number]>): Array<number> => photo.map(convertToOneElement);



