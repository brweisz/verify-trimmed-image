import Image from "next/image";
import styles from '../styles/Home.module.css'
import {handlePublisherForm, handleReaderForm} from "./server"

export function PublisherForm() {
  return (
    <form action={handlePublisherForm} className="flex flex-col gap-4">
      <label>
        <span>Original image: </span>
        <input type="file" name="original" />
      </label>
      <label>
        <span>Cropped image: </span>
        <input type="file" name="cropped" />
      </label>
      <label>
        <span>Image signature: </span>
        <input type="text" name="signature" />
      </label>
      <label>
        <span>Device key: </span>
        <input type="text" name="key" />
      </label>
      <button type="submit" className={styles.proveButton}>Generate Proof</button>
    </form>
  );
}

export function ReaderForm() {
  return (
    <form action={handleReaderForm} className="flex flex-col gap-4">
      <label>
        <span>Cropped image: </span>
        <input type="file" name="cropped" />
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
