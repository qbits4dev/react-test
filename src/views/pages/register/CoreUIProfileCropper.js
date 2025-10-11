// src/views/pages/register/CoreUIProfileCropper.js
import React, { useState, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { CButton } from '@coreui/react';

function getCroppedImg(imageSrc, crop, zoom, aspect = 1) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const size = Math.min(image.width, image.height);
      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(
        image,
        crop.x * image.width,
        crop.y * image.height,
        size,
        size,
        0,
        0,
        size,
        size
      );

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    };
    image.onerror = (err) => reject(err);
  });
}

export default function CoreUIProfileCropper({ onChange }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCropSave = async () => {
    const blob = await getCroppedImg(imageSrc, crop, zoom);
    const croppedFile = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
    onChange(croppedFile);
    setImageSrc(null); // remove cropper after save
  };

  return (
    <div>
      {imageSrc ? (
        <div className="position-relative" style={{ width: 200, height: 200, marginBottom: 10 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            onCropChange={setCrop}
            onZoomChange={setZoom}
          />
          <div className="mt-2 d-flex justify-content-between">
            <CButton color="primary" size="sm" onClick={handleCropSave}>Save</CButton>
            <CButton color="secondary" size="sm" onClick={() => setImageSrc(null)}>Cancel</CButton>
          </div>
        </div>
      ) : (
        <CButton color="info" onClick={() => inputRef.current.click()}>Upload Photo</CButton>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
    </div>
  );
}
