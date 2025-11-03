// Handle image upload
export const handleImageUpload = (
  event: React.ChangeEvent<HTMLInputElement>,
  setImageSrc: (src: string) => void,
): void => {
  const file = event.target.files?.[0];
  if (file) {
    // Verify the file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const img = new Image();
        const result = e.target.result as string;
        img.onload = () => {
          console.log(
            'Image loaded, setting imageSrc:',
            result.substring(0, 50),
          ); // Debug
          setImageSrc(result);
        };
        img.onerror = () => {
          console.error('Image load error');
          alert('Failed to load image');
        };
        img.src = result;
      }
    };
    reader.onerror = () => {
      console.error('FileReader error');
      alert('Error reading file');
    };
    reader.readAsDataURL(file);
  }
};

// Load image and return the HTMLImageElement
export const loadImage = (imageSrc: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      console.error('Image load error');
      reject(new Error('Failed to load image'));
    };
    img.src = imageSrc;
  });
};
