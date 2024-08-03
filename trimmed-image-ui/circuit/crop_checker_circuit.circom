pragma circom 2.0.0;
/*
  La propiedad que chequea el circuito es: "la foto presentada (Public Input) es un recorte de la
  foto original (Private Input) con los offsets off_x y off_y (private inputs), foto que a su vez está firmada
  tal que puede ser verificada usando la clave publica de la cámara (Public Input).
*/

include "circomlib/poseidon.circom";

template Crop(og_width, og_height, pr_width, pr_height, offset_x, offset_y) {
  assert(pr_width + offset_x <= og_width);
  assert(pr_height + offset_y <= og_height);

  signal input og_photo[og_height*og_width];
  signal input pr_photo[pr_height*pr_width];
  signal input og_photo_hash;
  signal output check;

  component hasher = Poseidon(og_height*og_width);
  for (var i = 0; i < og_height; i++) {
    for (var j = 0; j < og_width; j++) {
      hasher.inputs[i*og_width + j] <== og_photo[i*og_width + j];
    }
  }
  og_photo_hash === hasher.out;

  for (var i = 0; i < pr_height; i++) {
	for (var j = 0; j < pr_width; j++) {
      //log(pr_photo[i*pr_width + j]);
      //log((offset_y + i)*og_width + (offset_x + j), " ", og_photo[(offset_y + i)*og_width + (offset_x + j)]);
	  pr_photo[i*pr_width + j] === og_photo[(offset_y + i)*og_width + (offset_x + j)];
	}
  }
  check <== 1;
}

component main { public [ pr_photo, og_photo_hash ] } = Crop(3, 3, 2, 2, 0, 1);
