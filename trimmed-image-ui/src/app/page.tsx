"use client"
import styles from '../styles/Home.module.css'

import {handlePublisherForm, handleReaderForm} from "./server"
import ImageCropper from "@/app/ImageCropper";
import {useState} from "react";


export function PublisherForm() {

    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [originalImageSize, setOriginalImageSize] = useState<{ width: number; height: number } | null>(null);

    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [croppedImageSize, setCroppedImageSize] = useState<{ width: number; height: number } | null>(null);
    const [cropOffset, setCropOffset] = useState<{ x: number; y: number } | null>(null);

    const handleOriginalImage = (image: string, size: { width: number; height: number }) => {
        setOriginalImage(image);
        setOriginalImageSize(size);
    };

    const handleCroppedImage = (image: string, size: { width: number; height: number }, offset: { x: number; y: number }) => {
        setCroppedImage(image);
        setCroppedImageSize(size);
        setCropOffset(offset);
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
        }if (originalImageSize) {
            formData.append('originalImageWidth', originalImageSize.width.toString());
            formData.append('originalImageHeight', originalImageSize.height.toString());
        }
        if (croppedImageSize) {
            formData.append('croppedImageWidth', croppedImageSize.width.toString());
            formData.append('croppedImageHeight', croppedImageSize.height.toString());
        }
        if (cropOffset) {
            formData.append('cropOffsetX', cropOffset.x.toString());
            formData.append('cropOffsetY', cropOffset.y.toString());
        }
        handlePublisherForm(formData)
    }

    return (
      <div className={styles.formContent}>
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
        <h1 className={styles.title}>Publisher</h1>
        {PublisherForm()}
      </div>  
      <div className={styles.column}>
        <h1 className={styles.title}>Reader</h1>
        {ReaderForm()}
      </div>
    </main>
  );
}
