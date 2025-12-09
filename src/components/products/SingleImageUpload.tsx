import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { postImageUploadApi } from '../../Api-Service/Apis'; // adjust the path as needed
import { baseUrl } from '../../Api-Service/ApiUrls';

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface ImageUploadProps {
  images: any[]; // single image only
  onChange: (images: ProductImage[]) => void;
  label?: string;
}

export default function SingleImageUpload({ 
  images, 
  onChange, 
  label = "Upload Image"
}: any) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("created_by", "your_user_id"); // replace with actual ID

    setUploading(true);
    try {
      const response = await postImageUploadApi("", formData);
      const imageId = response?.data?.id;
      let imageUrl = response?.data?.image_url;

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

      if (imageUrl) {
        const newImage: ProductImage = {
          url: imageUrl,
          alt: file.name,
          isPrimary: true
        };
        onChange([newImage]); 
      } else {
        alert("Image upload failed. Try again.");
      }

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onChange([]);
  };


  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {images?.length > 0 ? (
        <div className="relative group w-40 h-40">
          <img
                src={images[0]?.url ? images[0]?.url :images}
            // src={images}
            className="object-cover w-full h-full rounded-lg ring-2 ring-indigo-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <button
              type="button"
              onClick={removeImage}
              className="text-white hover:text-red-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      ) : (
        <label className="h-40 w-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 relative">
          {uploading ? (
            <span className="text-sm text-gray-500">Uploading...</span>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">Upload image</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </>
          )}
        </label>
      )}
    </div>
  );
}
