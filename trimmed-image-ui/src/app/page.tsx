"use client"
import styles from '../styles/Home.module.css'

import {handlePublisherForm, handleReaderForm} from "./server"
import ImageCropper from "@/app/ImageCropper";
import {useState} from "react";

export function PublisherForm() {

    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);

    const handleOriginalImage = (image: string) => {
        setOriginalImage(image); // Update state with the original image data URL
    };

    const handleCroppedImage = (image: string) => {
        setCroppedImage(image); // Update state with the cropped image data URL
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Prepare form data
        const formData = new FormData(event.currentTarget);
        if (originalImage) {
            formData.append('originalImage', originalImage); // Add original image data URL to FormData
        }
        if (croppedImage) {
            formData.append('croppedImage', croppedImage); // Add cropped image data URL to FormData
        }
        handlePublisherForm(formData)

    }

    return (
      <div>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">

              <ImageCropper onOriginalImage={handleOriginalImage} onCroppedImage={handleCroppedImage}/>
              <label>
                  <span>Image signature: </span>
                  <input type="text" name="signature"/>
              </label>
              <label>
                  <span>Device key: </span>
                  <input type="text" name="key"/>
              </label>
              <button type="submit" className={styles.proveButton}>
                  Compile
              </button>
          </form>

      </div>
    );
}

export function ReaderForm() {
    return (
        <form action={handleReaderForm} className="flex flex-col gap-4">
            <label>
                <span>Cropped image: </span>
                <input type="file" name="cropped"/>
            </label>
            <label>
                <span>Proof of validity: </span>
                <input type="text" name="proof" />
      </label>
      <label>
        <span>Contract address: </span>
        <input type="text" name="address" />
      </label>
      <label>
        <span>Device key: </span>
        <input type="text" name="key" />
      </label>
      <button type="submit" className={styles.verifyButton}>Verify</button>
    </form>
  );
}

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.column}>
        <h1>Publisher</h1>
        {PublisherForm()}
      </div>  
      <div className={styles.column}>
        <h1>Reader</h1>
        {ReaderForm()}
      </div>
    </main>
  );
}
