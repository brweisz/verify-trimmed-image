"use client"
import styles from '../styles/Home.module.css'

import {handlePublisherForm, handleReaderForm} from "./server"
import CompileCircuit from "@/app/caller";
import ImageCropper from "@/app/ImageCropper";

export function PublisherForm() {

  return (
      <div>
          <form action={handlePublisherForm} className="flex flex-col gap-4">

              <ImageCropper/>
              <label>
                  <span>Cropped image: </span>
                  <input type="file" name="cropped"/>
              </label>
              <label>
                  <span>Image signature: </span>
                  <input type="text" name="signature"/>
              </label>
              <label>
                  <span>Device key: </span>
                  <input type="text" name="key"/>
              </label>
              <CompileCircuit/>
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
