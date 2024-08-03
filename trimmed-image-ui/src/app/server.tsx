"use server";
import fs from "node:fs/promises";
import { revalidatePath } from "next/cache";
import Jimp from "jimp";

export async function uploadFile(formData: FormData) {
    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    await fs.writeFile(`./public/uploads/buffer.bmp`, buffer);

    const path = "./public/uploads/buffer.bmp"
    Jimp.read(path)
        .then((image) => {
            console.log("imagen:");
            console.log(image.bitmap.data.buffer.byteLength);
            console.log(image.bitmap.data[200]);
        })
        .catch((err) => {
            console.log("error");
            console.log(err);
        });

    revalidatePath("/");
}
