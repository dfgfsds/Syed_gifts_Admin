import React from 'react';
import { Plus, X } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import { Variety } from '../../types/product';
import ImageUpload from './ImageUpload';

interface VarietySectionProps {
  varieties: Variety[];
  onChange: (varieties: Variety[]) => void;
}

export default function VarietySection({ varieties, onChange }: VarietySectionProps) {
  const addVariety = () => {
    onChange([...varieties, { color: '', sizes: [{ size: '', stock: 0 }] }]);
  };

  const removeVariety = (varietyIndex: number) => {
    onChange(varieties.filter((_, index) => index !== varietyIndex));
  };

  const addSize = (varietyIndex: number) => {
    const newVarieties = varieties.map((variety, index) => {
      if (index === varietyIndex) {
        return {
          ...variety,
          sizes: [...variety.sizes, { size: '', stock: 0 }],
        };
      }
      return variety;
    });
    onChange(newVarieties);
  };

  const removeSize = (varietyIndex: number, sizeIndex: number) => {
    const newVarieties = varieties.map((variety, index) => {
      if (index === varietyIndex) {
        return {
          ...variety,
          sizes: variety.sizes.filter((_, idx) => idx !== sizeIndex),
        };
      }
      return variety;
    });
    onChange(newVarieties);
  };

  const updateVarietyImage = (varietyIndex: number, images: any[]) => {
    const newVarieties = [...varieties];
    newVarieties[varietyIndex].image = images[0];
    onChange(newVarieties);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-gray-700">Varieties</label>
        <Button type="button" onClick={addVariety} variant="outline" className="text-sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Color Variety
        </Button>
      </div>
      
      <div className="space-y-4">
        {varieties.map((variety, varietyIndex) => (
          <div key={varietyIndex} className="border rounded-lg p-4 relative">
            <button
              type="button"
              onClick={() => removeVariety(varietyIndex)}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-4">
              <Input
                label="Color"
                value={variety.color}
                onChange={(e) => {
                  const newVarieties = [...varieties];
                  newVarieties[varietyIndex].color = e.target.value;
                  onChange(newVarieties);
                }}
                required
              />
            </div>

            <div className="mb-4">
              <ImageUpload
                images={variety.image ? [variety.image] : []}
                onChange={(images) => updateVarietyImage(varietyIndex, images)}
                multiple={false}
                label="Variety Image"
              />
            </div>

            <div className="space-y-3">
              {variety.sizes.map((sizeItem, sizeIndex) => (
                <div key={sizeIndex} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Input
                      label={sizeIndex === 0 ? "Size" : undefined}
                      value={sizeItem.size}
                      onChange={(e) => {
                        const newVarieties = [...varieties];
                        newVarieties[varietyIndex].sizes[sizeIndex].size = e.target.value;
                        onChange(newVarieties);
                      }}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      label={sizeIndex === 0 ? "Stock" : undefined}
                      type="number"
                      min="0"
                      value={sizeItem.stock || ''}
                      onChange={(e) => {
                        const newVarieties = [...varieties];
                        newVarieties[varietyIndex].sizes[sizeIndex].stock = 
                          e.target.value ? parseInt(e.target.value) : 0;
                        onChange(newVarieties);
                      }}
                      required
                    />
                  </div>
                  {variety.sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSize(varietyIndex, sizeIndex)}
                      className="mb-2 text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={() => addSize(varietyIndex)}
              variant="outline"
              className="mt-3 text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Size
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}