"use server";
import fs from "node:fs/promises";
import { revalidatePath } from "next/cache";
import Jimp from "jimp";
import {exec} from "child_process";
import {convertPhoto, divideInBits} from "../../circuit/utils";

export async function handlePublisherForm(formData: FormData) {
    const key = formData.get("key");
    console.log(formData);

    //original_photo: convertPhoto(original_photo),
    //presented_photo: convertPhoto(presented_photo),
    //camera_public_key: divideInBits(camera_public_key),
    //original_photo_signature: original_photo_signature.map(divideInBits),
    //original_photo_width,
    //original_photo_height,
    //presented_photo_width,
    //presented_photo_height,
    //offset_x,
    //offset_y,

    // Crear el circuito parametrizado con los valores del recorte y tamaños
        // Guardar en /circuit

    // Escribir un archivo de inputs en circuit/compiled/public.json

    // Ejecutar el script executeGroth16.sh --> tenemos verification_key, circuito.wasm, contractVerifier, abiFile


    //const command = `ls`;
    const command = `./scripts/executeGroth16.sh`;

    // Execute the command
    /*exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);

        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);

        }
        console.log(`Stdout: ${stdout}`);

    });*/

    /*const file = formData.get("original") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    await fs.writeFile(`./public/uploads/buffer.bmp`, buffer);

    const path = "./public/uploads/buffer.bmp"
    Jimp.read(path)
        .then((image) => {
            console.log("imagen:");
            console.log(image.bitmap.data.buffer.byteLength);
            // console.log(image.bitmap.data[200]);
        })
        .catch((err) => {
            console.log("error");
            console.log(err);
        });

    revalidatePath("/");*/
}

export async function handleReaderForm(formData: FormData) {
    
}