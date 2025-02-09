"use server";
import fs from "node:fs/promises";
import {exec} from "child_process";
import {base64ToRgbArray, convertPhotoToBitsArray, convertPhotoToFieldElement, hexToBits} from "../../circuit/utils";
import {sha256} from "js-sha256";

//@ts-ignore
export async function handlePublisherForm(formData: FormData) {
    let og_photo: unknown = formData.get("originalImage")
    let og_photo_data: string = "";
    if (typeof og_photo === "string") {
        og_photo_data = og_photo?.replace(/^data:image\/png;base64,/, "");
    }
    og_photo = await base64ToRgbArray(og_photo_data)
    const og_photo_field = convertPhotoToFieldElement(og_photo)
    const og_photo_bits = convertPhotoToBitsArray(og_photo)

    let og_photo_hash = hexToBits(sha256(og_photo_data));

    let pr_photo: unknown = formData.get("croppedImage")
    if (typeof pr_photo === "string") {
        pr_photo = pr_photo?.replace(/^data:image\/png;base64,/, "");
    }
    pr_photo = await base64ToRgbArray(pr_photo)
    pr_photo = convertPhotoToFieldElement(pr_photo)

    console.log(formData)

    let original_photo_width = formData.get("originalImageWidth")
    let original_photo_height = formData.get("originalImageHeight")
    let presented_photo_width = formData.get("croppedImageWidth")
    let presented_photo_height = formData.get("croppedImageHeight")
    let offset_x = formData.get("cropOffsetX")
    let offset_y = formData.get("cropOffsetY")


    // Crear el circuito parametrizado con los valores del recorte y tamaños
    const sourceCircuit = './circuit/crop_checker_circuit.circom';
    const customCircuit = './circuit/crop_checker_circuit_custom.circom';
    try {await fs.unlink(customCircuit);} catch (err) {console.log(err)}
    try {await fs.copyFile(sourceCircuit, customCircuit, fs.constants.COPYFILE_EXCL)} catch (err){console.log(err)}
    await fs.appendFile(customCircuit,
        `\n\ncomponent main { public [ pr_photo, og_photo_hash ] } = Crop(${original_photo_width}, 
        ${original_photo_height}, ${presented_photo_width}, ${presented_photo_height}, ${offset_x}, ${offset_y});\n`);

    // Escribir un archivo con los inputs del circuito
    let circuit_inputs = {
        og_photo_field,
        og_photo_bits,
        pr_photo,
        og_photo_hash,
    }
    let inputs_file_path = 'circuit/input.json'
    await fs.writeFile(inputs_file_path, JSON.stringify(circuit_inputs));

    // Ejecutar el script executeGroth16.sh --> tenemos verification_key, circuito.wasm, contractVerifier, abiFile
    const command = `./circuit/executeGroth16.sh`;
    // TODO: esto estaría bueno ejecutarlo del lado del cliente
    exec(command, (error, stdout, stderr) => {
        if (error) console.error(`Error: ${error.message}`);
        if (stderr) console.error(`Stderr: ${stderr}`);
        console.log(`Stdout: ${stdout}`);
    });
}

export async function handleReaderForm(formData: FormData) {
    // ToDo: todo
}