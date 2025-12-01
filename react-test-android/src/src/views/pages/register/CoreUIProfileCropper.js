// src/views/pages/register/CoreUIProfileCropper.js
import React, { useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { CButton, CSpinner } from '@coreui/react';

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (err) => reject(err));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}

async function getCroppedImg(imageSrc, croppedAreaPixels) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Canvas is empty'));
      resolve(blob);
    }, 'image/jpeg');
  });
}

export default function CoreUIProfileCropper({ onChange }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
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

    // Reset capture attribute after selecting
    inputRef.current.removeAttribute('capture');
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = useCallback(async () => {
    try {
      if (!croppedAreaPixels || !imageSrc) return;
      setLoading(true);
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedFile = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
      const previewUrl = URL.createObjectURL(croppedFile);

      setPreview(previewUrl);
      setImageSrc(null);
      onChange({ file: croppedFile, previewUrl });
    } catch (err) {
      console.error('Crop failed:', err);
      alert('Failed to crop the image');
    } finally {
      setLoading(false);
    }
  }, [imageSrc, croppedAreaPixels, onChange]);

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Preview */}
      {preview && (
        <div style={{ marginBottom: '10px' }}>
          <img
            src={preview}
            alt="Cropped Preview"
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #ccc',
            }}
          />
          <div className="mt-2 d-flex justify-content-center gap-2">
            <CButton color="info" size="sm" onClick={() => inputRef.current.click()}>
              Change Photo
            </CButton>
            <CButton
              color="success"
              size="sm"
              onClick={() => {
                inputRef.current.setAttribute('capture', 'user'); // front camera
                inputRef.current.click();
              }}
            >
              Take Photo
            </CButton>
          </div>
        </div>
      )}

      {/* Cropper */}
      {imageSrc ? (
        <>
          <div
            style={{
              position: 'relative',
              width: 250,
              height: 250,
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 10px auto',
              backgroundColor: '#f0f0f0',
            }}
          >
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="d-flex justify-content-center gap-2">
            <CButton color="primary" size="sm" onClick={handleCropSave} disabled={loading}>
              {loading ? <CSpinner size="sm" /> : 'Save'}
            </CButton>
            <CButton color="secondary" size="sm" onClick={() => setImageSrc(null)} disabled={loading}>
              Cancel
            </CButton>
          </div>
        </>
      ) : !preview ? (
        <div className="d-flex justify-content-center gap-2">
          <CButton color="info" onClick={() => inputRef.current.click()}>
            Upload Photo
          </CButton>
          <CButton
            color="success"
            onClick={() => {
              inputRef.current.setAttribute('capture', 'user'); // front camera
              inputRef.current.click();
            }}
          >
            Take Photo
          </CButton>
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
