pragma circom 2.0.0;
/*
  La propiedad que chequea el circuito es: "la foto presentada (Public Input) es un recorte de la
  foto original (Private Input) con los offsets off_x y off_y (private inputs), foto que a su vez está firmada
  tal que puede ser verificada usando la clave publica de la cámara (Public Input).

  IDEA: Basta comparar un numero, no tener tres colores...
  se puede construir inyeccion a Fp desde F256 x F256 x F256.
*/

template Crop(og_width, og_height, pr_width, pr_height, offset_x, offset_y) {
  assert(pr_width + offset_x <= og_width);
  assert(pr_height + offset_y <= og_height);

  signal input og_photo[og_height][og_width];
  signal input pr_photo[pr_height][pr_width];
  signal input og_signature;
  signal input camera_pk;
  signal output check;

  // TODO: CHECKEAR QUE verify(og_photo, og_signature, public_key) === 1


  for (var i = 0; i < pr_width; i++) {
		for (var j = 0; j < pr_height; j++) {
			pr_photo[i][j] === og_photo[offset_y + i][offset_x + j];
		}
	}

	check <== 1;
}

// component main { public [ pr_photo, camera_pk ] } = Crop(1920, 1080);
component main { public [ pr_photo ] } = Crop(3, 3, 2, 2, 0, 1);