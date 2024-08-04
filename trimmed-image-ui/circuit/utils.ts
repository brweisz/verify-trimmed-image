import sharp from "sharp";

const convertToOneElement = (rgb: [number, number, number]): number => rgb[0]*256*256 + rgb[1]*256 + rgb[2];
export const convertPhotoToFieldElement = (photo: any) => photo.map(convertToOneElement);

const convertNumberToBitsArray = (n: number): [number] => (
    [7,6,5,4,3,2,1,0].map((i: number) => ((n >> i) & 1))
);
const convertPixelToBitsArray = (rgb: [number, number, number]): [number] => (
    convertNumberToBitsArray(rgb[0]).concat(convertNumberToBitsArray(rgb[1])).concat(convertNumberToBitsArray(rgb[2]))
);
export const convertPhotoToBitsArray = (photo: any) => photo.map(convertPixelToBitsArray);

//@ts-ignore
export async function base64ToRgbArray(base64String) {
  // Remove the data URL prefix
  const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, "");

  // Convert base64 to binary buffer
  const buffer = Buffer.from(base64Data, 'base64');

  try {
    // Process the image buffer with sharp
    const { data, info } = await sharp(buffer)
        .raw() // Get raw image data
        .ensureAlpha() // Ensure alpha channel is present
        .toBuffer({ resolveWithObject: true });

    // Convert to RGB array
    const { width, height } = info;
    const rgbArray = [];
    for (let i = 0; i < data.length; i += 4) {
      rgbArray.push([data[i], data[i + 1], data[i + 2]]);
    }

    return rgbArray;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

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
    og_photo: convertPhotoToFieldElement(original_photo),
    pr_photo: convertPhotoToFieldElement(presented_photo),
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
