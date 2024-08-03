"use server";
import fs from "node:fs/promises";
import { revalidatePath } from "next/cache";

export async function uploadFile(formData: FormData) {
    console.log("esto es el formData:");
    console.log(formData);
    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    console.log("buffer:");
    console.log(buffer.length);

    await fs.writeFile(`./public/uploads/buffer`, buffer);

    revalidatePath("/");
}
