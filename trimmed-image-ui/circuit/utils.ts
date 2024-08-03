
const convertToOneElement = (rgb: [number, number, number]): number => rgb[0]*256*256 + rgb[1]*256 + rgb[2];
export const convertPhoto = (photo: Array<[number, number, number]>): Array<number> => photo.map(convertToOneElement);

export const divideInBits = (num: bigint): Array<number> => {
  const binary_string = num.toString(2);
  const bit_length = 256;
  let padded_binary_string = binary_string.padStart(bit_length, '0');

  if (padded_binary_string.length > bit_length) {
    padded_binary_string = padded_binary_string.slice(-bit_length);
  }

  const bit_array = [];
  for (let char of padded_binary_string)
    bit_array.push(Number(char));
  return bit_array;
}

const generateInputJson = (
  json_file: string,
  original_photo: Array<[number, number, number]>,
  presented_photo: Array<[number, number, number]>,
  camera_public_key: bigint,
  original_photo_signature: [bigint, bigint]
) => {
  const object = {
    og_photo: convertPhoto(original_photo),
    pr_photo: convertPhoto(presented_photo),
    camera_pk: divideInBits(camera_public_key),
    og_signature: original_photo_signature.map(divideInBits)
  };
  //fs.writeFile(json_file, JSON.stringify(object), err => console.log(err));
}

const changeCircuitParameters = (
  circom_file: string,
  original_photo_width: number,
  original_photo_height: number,
  presented_photo_width: number,
  presented_photo_height: number,
  offset_x: number,
  offset_y: number
) => {
  /*fs.appendFile(circom_file,
    `\n\ncomponent main { public [ pr_photo, camera_pk ] } = Crop(${original_photo_width}, ${original_photo_height}, ${presented_photo_width}, ${presented_photo_height}, ${offset_x}, ${offset_y});\n`,
    (err) => console.log(err));*/
}

const schnorrSignature = () => {
  
}
