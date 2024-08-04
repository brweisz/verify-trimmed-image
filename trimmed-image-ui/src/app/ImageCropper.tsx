import React, { useRef, useState, useEffect } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import styles from '../styles/Home.module.css'

interface ImageCropperProps {
    onOriginalImage: (image: string, size: { width: number; height: number }) => void;
    onCroppedImage: (image: string, size: { width: number; height: number }, offset: { x: number; y: number }) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ onOriginalImage, onCroppedImage }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedImageSrc, setCroppedImageSrc] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [cropper, setCropper] = useState<Cropper | null>(null);
    const [originalImageSize, setOriginalImageSize] = useState<{ width: number; height: number } | null>(null);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    setOriginalImageSize({ width: img.width, height: img.height });
                    onOriginalImage(reader.result as string, { width: img.width, height: img.height }); // Pass original image data and size to parent
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCrop = () => {
        if (cropper) {
            const canvas = cropper.getCroppedCanvas();
            const croppedImage = canvas.toDataURL('image/jpeg');
            setCroppedImageSrc(croppedImage)
            const cropBoxData = cropper.getData();
            const originalImageSize = cropper.getImageData();

            // Pass cropped image data, size, and offsets to parent
            onCroppedImage(
                croppedImage,
                { width: cropBoxData.width | 0, height: cropBoxData.height | 0 },
                { x: cropBoxData.x | 0, y: cropBoxData.y | 0}
            );
        }
    };

    useEffect(() => {
        if (imageRef.current && imageSrc) {
            const cropperInstance = new Cropper(imageRef.current, {
                aspectRatio: 0,
                viewMode: 3,
                zoomable: true,
                scalable: true,
            });
            setCropper(cropperInstance);
        }
        return () => {
            cropper?.destroy();
        };
    }, [imageSrc]);

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {imageSrc && <img ref={imageRef} src={imageSrc} alt="Source" />}
            {imageSrc && <button className={styles.cropButton} type="button" onClick={handleCrop}>Crop</button>}
            {croppedImageSrc && (
                <div>
                    <h2>Cropped Image</h2>
                    <img src={croppedImageSrc} alt="Cropped" />
                </div>
            )}
        </div>
    );
};

export default ImageCropper;