pragma circom 2.0.0;
/*
  La propiedad que chequea el circuito es: "la foto presentada (Public Input) es un recorte de la
  foto original (Private Input) con los offsets off_x y off_y (private inputs), foto que a su vez está firmada
  tal que puede ser verificada usando la clave publica de la cámara (Public Input).
*/

// include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/sha256/sha256.circom";


template Crop(og_width, og_height, pr_width, pr_height, offset_x, offset_y) {
  log("arranque");
  assert(pr_width + offset_x <= og_width);
  assert(pr_height + offset_y <= og_height);
  var PXL = 24;

  signal input og_photo_field[og_height*og_width];
  signal input og_photo_bits[PXL*og_height*og_width];
  signal input pr_photo[pr_height*pr_width];
  signal input og_photo_hash[256];
  signal output check;

  log("defini todo");
  component hasher = Sha256(PXL*og_height*og_width);
  for (var i = 0; i < og_height; i++) {
    log("loop 1: voy", i, "de", og_height);
    for (var j = 0; j < og_width; j++) {
      for (var k = 0; k < PXL; k++) {
        hasher.in[(i*og_width + j)*PXL + k] <== og_photo_bits[(i*og_width + j)*PXL + k];
      }
    }
  }
  og_photo_hash === hasher.out;

  for (var i = 0; i < pr_height; i++) {
	  log("voy por la iteracion", i, "de", pr_height);
    for (var j = 0; j < pr_width; j++) {
      // log(pr_photo[i*pr_width + j]);
      //log((offset_y + i)*og_width + (offset_x + j), " ", og_photo[(offset_y + i)*og_width + (offset_x + j)]);
	    pr_photo[i*pr_width + j] === og_photo_field[(offset_y + i)*og_width + (offset_x + j)];
	  }
  }
  check <== 1;
}

component main { public [ pr_photo, og_photo_hash ] } = Crop(16, 
        16, 12, 2, 1, 6);
