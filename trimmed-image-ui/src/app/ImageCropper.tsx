import React, { useRef, useState, useEffect } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';


interface ImageCropperProps {
    onOriginalImage: (image: string) => void;
    onCroppedImage: (image: string) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ onOriginalImage, onCroppedImage }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedImageSrc, setCroppedImageSrc] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [cropper, setCropper] = useState<Cropper | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
                onOriginalImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCrop = () => {
        if (cropper) {
            const canvas = cropper.getCroppedCanvas();
            const croppedImage = canvas.toDataURL('image/jpeg');
            setCroppedImageSrc(croppedImage)
            onCroppedImage(croppedImage);
        }
    };

    useEffect(() => {
        if (imageRef.current && imageSrc) {
            const cropperInstance = new Cropper(imageRef.current, {
                aspectRatio: 0,
                viewMode: 1,
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
            <button type="button" onClick={handleCrop}>Crop</button>
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