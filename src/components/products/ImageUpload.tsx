import React from 'react';
import { Upload, X } from 'lucide-react';
import { postImageUploadApi } from '../../Api-Service/Apis';
import { baseUrl } from '../../Api-Service/ApiUrls';

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface ImageUploadProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  multiple?: boolean;
  label?: string;
}

export default function ImageUpload({
  images = [],
  onChange,
  multiple = true,
  label = "Product Images",
}: ImageUploadProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const uploadedImages: ProductImage[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("image_file", file);
      formData.append("created_by", "your_user_id"); // Replace with real user ID

      try {
        const response = await postImageUploadApi("", formData);
        const imageId = response?.data?.id;
        let imageUrl = response?.data?.image_url;

        // Poll if image_url is not immediately available
        if (!imageUrl && imageId) {
          let retries = 5;
          while (!imageUrl && retries > 0) {
            const getRes = await fetch(`${baseUrl}/image_store/${imageId}`);
            const data = await getRes.json();
            imageUrl = data?.image_url;
            if (!imageUrl) {
              await new Promise((res) => setTimeout(res, 1000));
              retries--;
            }
          }
        }

        uploadedImages.push({
          url: imageUrl || URL.createObjectURL(file),
          alt: file.name,
          isPrimary: (images?.length || 0) + uploadedImages.length === 0,
        });

      } catch (error) {
        console.error("Upload failed for:", file.name, error);
      }
    }

    if (uploadedImages.length) {
      onChange([...(images || []), ...uploadedImages]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = (images || []).filter((_, i) => i !== index);
    if ((images || [])[index]?.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    onChange(newImages);
  };

  const setPrimaryImage = (index: number) => {
    const newImages = (images || []).map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(newImages);
  };
  return (
    <div>
      <label className="block text-sm font-bold  mb-1">
        {label}
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
        {(images || [])?.map((image:any, index) => (
          <div key={index} className="relative group">
            <img
              src={image?.url ? image?.url :image}
              alt={image?.alt}
              className={`h-32 w-full object-cover rounded-lg ${
                image.isPrimary ? 'ring-2 ring-indigo-500' : ''
              }`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
              {!image.isPrimary && (
                <button
                  type="button"
                  onClick={() => setPrimaryImage(index)}
                  className="text-white text-sm hover:text-indigo-200"
                >
                  Set as primary
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="text-white hover:text-red-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {image.isPrimary && (
              <span className="absolute top-2 left-2 text-xs bg-indigo-500 text-white px-2 py-1 rounded">
                Primary
              </span>
            )}
          </div>
        ))}

        <label className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500">
          <Upload className="h-8 w-8 text-gray-400" />
          <span className="mt-2 text-sm text-gray-500">Upload {multiple ? 'images' : 'image'}</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}
