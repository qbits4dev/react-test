// src/views/pages/register/CoreUIProfileCropper.js
import React, { useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { CButton, CSpinner } from '@coreui/react';

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (err) => reject(err));
    image.setAttribute('crossOrigin', 'anonymous'); // avoid CORS issues
    image.src = url;
  });
}

async function getCroppedImg(imageSrc, crop, zoom, aspect = 1) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // calculate crop dimensions
  const cropWidth = image.width * zoom;
  const cropHeight = image.height * zoom;

  canvas.width = cropWidth;
  canvas.height = cropHeight;

  ctx.drawImage(
    image,
    crop.x * image.width,
    crop.y * image.height,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg');
  });
}

export default function CoreUIProfileCropper({ onChange }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);
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

  const handleCropSave = useCallback(async () => {
    try {
      setLoading(true);
      const blob = await getCroppedImg(imageSrc, crop, zoom);
      const croppedFile = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      onChange(croppedFile);
      setImageSrc(null);
    } catch (err) {
      console.error('Crop failed:', err);
    } finally {
      setLoading(false);
    }
  }, [imageSrc, crop, zoom, onChange]);

  return (
    <div>
      {imageSrc ? (
        <>
          <div
            style={{
              position: 'relative',
              width: 250,
              height: 250,
              borderRadius: '50%',
              overflow: 'hidden',
              marginBottom: '10px',
              margin: '0 auto',
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
      ) : (
        <CButton color="info" onClick={() => inputRef.current.click()}>
          Upload Photo
        </CButton>
      )}

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
